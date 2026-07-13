import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Profit } from './entities/profit.entity';
import { CreateProfitDto } from './dto/create-profit.dto';
import { UpdateProfitDto } from './dto/update-profit.dto';

@Injectable()
export class ProfitsService {
  constructor(
    @InjectRepository(Profit)
    private profitRepository: Repository<Profit>,
  ) {}

  async create(createProfitDto: CreateProfitDto) {
    const profit = this.profitRepository.create({
      ...createProfitDto,
      vehicle_expense: createProfitDto.vehicle_expense || 0,
      expense: createProfitDto.expense || 0,
    });
    return this.profitRepository.save(profit);
  }

  async findAll() {
    return this.profitRepository.find({
      relations: ['vehicle', 'station'],
      order: { date: 'DESC' },
    });
  }

  async findOne(id: number) {
    const profit = await this.profitRepository.findOne({
      where: { id },
      relations: ['vehicle', 'station'],
    });
    if (!profit) throw new NotFoundException(`Profit record with id ${id} not found`);
    return profit;
  }

  async getByDate(date: string) {
    const records = await this.profitRepository.find({
      where: { date: new Date(date) as any },
      relations: ['vehicle', 'station'],
    });

    const totals = this.calculateProfit(records);
    return {
      success: true as const,
      data: {
        records,
        summary: totals,
      },
    };
  }

  async update(id: number, updateProfitDto: UpdateProfitDto) {
    const profit = await this.findOne(id);
    Object.assign(profit, updateProfitDto);
    return this.profitRepository.save(profit);
  }

  async remove(id: number) {
    const profit = await this.findOne(id);
    await this.profitRepository.remove(profit);
    return { message: `Profit record ${id} deleted successfully` };
  }

  private calculateProfit(records: Profit[]) {
    const totalRent = records.reduce((sum, r) => sum + (r.rent || 0), 0);
    const totalExpense = records.reduce(
      (sum, r) =>
        sum +
        (r.expense || 0) +
        (r.driver_expense || 0) +
        (r.fuel_expense || 0) +
        (r.vehicle_expense || 0),
      0,
    );

    return {
      totalRent,
      totalExpense,
      profit: totalRent - totalExpense,
    };
  }
}
