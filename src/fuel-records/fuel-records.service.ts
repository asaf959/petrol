import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FuelRecord } from './entities/fuel-record.entity';
import { FuelRecordLog } from './entities/fuel-record-log.entity';
import { CreateFuelRecordDto } from './dto/create-fuel-record.dto';
import { UpdateFuelRecordDto } from './dto/update-fuel-record.dto';
import { AddPaymentDto } from './dto/add-payment.dto';
import { UpdatePaymentLogDto } from './dto/update-payment-log.dto';
import { getPdfPath, removePdf, savePdf } from '../common/upload/pdf-upload';

@Injectable()
export class FuelRecordsService {
  constructor(
    @InjectRepository(FuelRecord)
    private fuelRecordRepository: Repository<FuelRecord>,
    @InjectRepository(FuelRecordLog)
    private fuelRecordLogRepository: Repository<FuelRecordLog>,
  ) {}

  private todayDateString(): string {
    return new Date().toISOString().slice(0, 10);
  }

  /** When both litres and unit price are present, bill total = litres × price. */
  private calcAmountFromLiters(
    petrolLiter?: number | null,
    literPrice?: number | null,
  ): number | null {
    if (
      petrolLiter === undefined ||
      petrolLiter === null ||
      literPrice === undefined ||
      literPrice === null
    ) {
      return null;
    }
    const liters = Number(petrolLiter);
    const price = Number(literPrice);
    if (!Number.isFinite(liters) || !Number.isFinite(price)) return null;
    return Math.round(liters * price * 100) / 100;
  }

  private applyStatus(record: FuelRecord) {
    if (record.amount_remaining <= 0) {
      record.status = 'Paid';
      record.amount_remaining = 0;
    } else if (record.amount_paid > 0) {
      record.status = 'Partial';
    } else {
      record.status = record.status || 'Pending';
    }
  }

  private sortLogs(record: FuelRecord): FuelRecord {
    if (Array.isArray(record.logs)) {
      record.logs.sort((a, b) => {
        const da = a.payment_date
          ? new Date(a.payment_date).getTime()
          : new Date(a.createdAt).getTime();
        const db = b.payment_date
          ? new Date(b.payment_date).getTime()
          : new Date(b.createdAt).getTime();
        if (da !== db) return da - db;
        return a.id - b.id;
      });
    }
    return record;
  }

  private async syncRecordTotalsFromLogs(record: FuelRecord): Promise<void> {
    this.sortLogs(record);
    const logs = record.logs ?? [];
    let paidSoFar = 0;
    const total = Number(record.total_amount);

    for (const log of logs) {
      paidSoFar += Number(log.amount_paid);
      if (paidSoFar > total) {
        throw new BadRequestException(
          `Total payments (${paidSoFar}) cannot exceed total amount (${total})`,
        );
      }
      log.amount_remaining = Math.max(total - paidSoFar, 0);
      await this.fuelRecordLogRepository.save(log);
    }

    record.amount_paid = paidSoFar;
    record.amount_remaining = Math.max(total - paidSoFar, 0);
    this.applyStatus(record);
    await this.fuelRecordRepository.save(record);
  }

  async create(createFuelRecordDto: CreateFuelRecordDto, document?: Buffer) {
    let documentName: string | undefined;
    try {
      documentName = document ? savePdf(document) : undefined;
      const calculated = this.calcAmountFromLiters(
        createFuelRecordDto.petrol_liter,
        createFuelRecordDto.liter_price,
      );
      const totalAmount =
        calculated !== null ? calculated : Number(createFuelRecordDto.total_amount);
      const amountPaid = Number(createFuelRecordDto.amount_paid) || 0;

      const record = this.fuelRecordRepository.create({
        ...createFuelRecordDto,
        total_amount: totalAmount,
        amount_paid: amountPaid,
        amount_remaining: Math.max(totalAmount - amountPaid, 0),
        amount_return_date: createFuelRecordDto.amount_return_date || [],
        status: createFuelRecordDto.status || 'Pending',
        document_name: documentName || null,
      });

      this.applyStatus(record);
      const saved = await this.fuelRecordRepository.save(record);

      if (saved.amount_paid > 0) {
        const log = this.fuelRecordLogRepository.create({
          amount_paid: saved.amount_paid,
          amount_remaining: saved.amount_remaining,
          payment_date: saved.date ?? this.todayDateString(),
          document_name: documentName || null,
          fuelRecordId: saved.id,
        });
        await this.fuelRecordLogRepository.save(log);
      }

      return this.findOne(saved.id);
    } catch (error) {
      removePdf(documentName);
      throw error;
    }
  }

  async findAll() {
    const records = await this.fuelRecordRepository.find({
      relations: ['vehicle', 'station', 'logs'],
      order: { createdAt: 'DESC' },
    });
    return records.map((r) => this.sortLogs(r));
  }

  async findOne(id: number) {
    const record = await this.fuelRecordRepository.findOne({
      where: { id },
      relations: ['vehicle', 'station', 'logs'],
    });
    if (!record) throw new NotFoundException(`Fuel record with id ${id} not found`);
    return this.sortLogs(record);
  }

  /**
   * Record a new partial/full payment against remaining balance.
   * Creates a dated history log and updates paid/remaining/status.
   */
  async addPayment(id: number, dto: AddPaymentDto, document?: Buffer) {
    let documentName: string | undefined;
    try {
      documentName = document ? savePdf(document) : undefined;
      const record = await this.findOne(id);

      if (record.amount_remaining <= 0) {
        throw new BadRequestException('This record is already fully paid');
      }

      if (dto.amount > record.amount_remaining) {
        throw new BadRequestException(
          `Payment amount (${dto.amount}) exceeds remaining balance (${record.amount_remaining})`,
        );
      }

      record.amount_paid = Number(record.amount_paid) + Number(dto.amount);
      record.amount_remaining = Math.max(
        Number(record.amount_remaining) - Number(dto.amount),
        0,
      );
      this.applyStatus(record);

      await this.fuelRecordRepository.save(record);

      const log = this.fuelRecordLogRepository.create({
        amount_paid: Number(dto.amount),
        amount_remaining: record.amount_remaining,
        payment_date: dto.payment_date || this.todayDateString(),
        document_name: documentName || null,
        fuelRecordId: id,
      });
      await this.fuelRecordLogRepository.save(log);

      return this.findOne(id);
    } catch (error) {
      removePdf(documentName);
      throw error;
    }
  }

  async updatePaymentLog(
    recordId: number,
    logId: number,
    dto: UpdatePaymentLogDto,
    document?: Buffer,
  ) {
    let documentName: string | undefined;
    try {
      const record = await this.findOne(recordId);
      const log = record.logs?.find((entry) => entry.id === logId);
      if (!log) {
        throw new NotFoundException(`Payment log with id ${logId} not found`);
      }

      const oldDocument = log.document_name;

      if (dto.amount !== undefined) {
        if (Number(dto.amount) <= 0) {
          throw new BadRequestException('Payment amount must be greater than zero');
        }
        log.amount_paid = Number(dto.amount);
      }

      if (dto.payment_date !== undefined) {
        log.payment_date = dto.payment_date as unknown as Date;
      }

      if (document) {
        documentName = savePdf(document);
        log.document_name = documentName;
      }

      await this.fuelRecordLogRepository.save(log);
      await this.syncRecordTotalsFromLogs(record);

      if (document && oldDocument && oldDocument !== documentName) {
        removePdf(oldDocument);
      }

      return this.findOne(recordId);
    } catch (error) {
      if (documentName) removePdf(documentName);
      throw error;
    }
  }

  async update(id: number, updateFuelRecordDto: UpdateFuelRecordDto) {
    const record = await this.findOne(id);

    const { amount_paid: newTotalPaid, ...rest } = updateFuelRecordDto;

    if (newTotalPaid !== undefined && newTotalPaid !== record.amount_paid) {
      const delta = Number(newTotalPaid) - Number(record.amount_paid);

      if (delta < 0) {
        throw new BadRequestException(
          'Cannot decrease amount paid via update. Use payment history as source of truth.',
        );
      }

      if (delta > record.amount_remaining) {
        throw new BadRequestException(
          `Payment amount (${delta}) exceeds remaining balance (${record.amount_remaining})`,
        );
      }

      if (delta > 0) {
        record.amount_paid = Number(newTotalPaid);
        record.amount_remaining = Math.max(Number(record.amount_remaining) - delta, 0);
        this.applyStatus(record);

        const log = this.fuelRecordLogRepository.create({
          amount_paid: delta,
          amount_remaining: record.amount_remaining,
          payment_date: this.todayDateString(),
          fuelRecordId: id,
        });
        await this.fuelRecordLogRepository.save(log);
      }
    }

    Object.assign(record, rest);

    const calculated = this.calcAmountFromLiters(
      record.petrol_liter,
      record.liter_price,
    );
    if (calculated !== null) {
      rest.total_amount = calculated;
      record.total_amount = calculated;
    }

    if (rest.total_amount !== undefined) {
      const total = Number(rest.total_amount);
      const paid = Number(record.amount_paid);
      if (total < paid) {
        throw new BadRequestException(
          `Total amount (${total}) cannot be less than amount already paid (${paid})`,
        );
      }
      record.amount_remaining = Math.max(total - paid, 0);
      this.applyStatus(record);
    }

    await this.fuelRecordRepository.save(record);

    return this.findOne(id);
  }

  async remove(id: number) {
    const record = await this.findOne(id);
    const documents = new Set<string>();
    if (record.document_name) documents.add(record.document_name);
    record.logs?.forEach((log) => {
      if (log.document_name) documents.add(log.document_name);
    });

    await this.fuelRecordRepository.remove(record);
    documents.forEach((filename) => removePdf(filename));
    return { message: `Fuel record ${id} deleted successfully` };
  }

  getDocumentPath(filename: string): string {
    return getPdfPath(filename);
  }
}
