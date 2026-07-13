import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FuelRecord } from './entities/fuel-record.entity';
import { FuelRecordLog } from './entities/fuel-record-log.entity';
import { CreateFuelRecordDto } from './dto/create-fuel-record.dto';
import { UpdateFuelRecordDto } from './dto/update-fuel-record.dto';

@Injectable()
export class FuelRecordsService {
  constructor(
    @InjectRepository(FuelRecord)
    private fuelRecordRepository: Repository<FuelRecord>,
    @InjectRepository(FuelRecordLog)
    private fuelRecordLogRepository: Repository<FuelRecordLog>,
  ) {}

  async create(createFuelRecordDto: CreateFuelRecordDto) {
    const record = this.fuelRecordRepository.create({
      ...createFuelRecordDto,
      amount_return_date: createFuelRecordDto.amount_return_date || [],
      status: createFuelRecordDto.status || 'Pending',
    });

    const saved = await this.fuelRecordRepository.save(record);

    const log = this.fuelRecordLogRepository.create({
      amount_paid: saved.amount_paid,
      amount_remaining: saved.amount_remaining,
      fuelRecordId: saved.id,
    });
    await this.fuelRecordLogRepository.save(log);

    return this.findOne(saved.id);
  }

  async findAll() {
    return this.fuelRecordRepository.find({
      relations: ['vehicle', 'station', 'logs'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number) {
    const record = await this.fuelRecordRepository.findOne({
      where: { id },
      relations: ['vehicle', 'station', 'logs'],
    });
    if (!record) throw new NotFoundException(`Fuel record with id ${id} not found`);
    return record;
  }

  async update(id: number, updateFuelRecordDto: UpdateFuelRecordDto) {
    const record = await this.findOne(id);

    const { amount_paid: newPayment, ...rest } = updateFuelRecordDto;

    if (newPayment !== undefined && newPayment !== record.amount_paid) {
      const delta = newPayment - record.amount_paid;

      if (delta > record.amount_remaining) {
        throw new BadRequestException(
          `Payment amount (${newPayment}) exceeds remaining balance (${record.amount_remaining})`,
        );
      }

      record.amount_paid = newPayment;
      record.amount_remaining = Math.max(record.amount_remaining - delta, 0);

      if (record.amount_remaining === 0) {
        record.status = 'Paid';
      } else if (record.amount_paid > 0) {
        record.status = 'Partial';
      }

      if (delta > 0) {
        const log = this.fuelRecordLogRepository.create({
          amount_paid: delta,
          amount_remaining: record.amount_remaining,
          fuelRecordId: id,
        });
        await this.fuelRecordLogRepository.save(log);
      }
    }

    Object.assign(record, rest);
    await this.fuelRecordRepository.save(record);

    return this.findOne(id);
  }

  async remove(id: number) {
    const record = await this.findOne(id);
    await this.fuelRecordRepository.remove(record);
    return { message: `Fuel record ${id} deleted successfully` };
  }
}
