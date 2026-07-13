import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PartnerExpense } from './entities/partner-expense.entity';
import { CreatePartnerExpenseDto } from './dto/create-partner-expense.dto';
import { UpdatePartnerExpenseDto } from './dto/update-partner-expense.dto';

@Injectable()
export class PartnerExpensesService {
  constructor(
    @InjectRepository(PartnerExpense)
    private partnerExpenseRepository: Repository<PartnerExpense>,
  ) {}

  async create(createDto: CreatePartnerExpenseDto) {
    const expense = this.partnerExpenseRepository.create(createDto);
    return this.partnerExpenseRepository.save(expense);
  }

  async findAll() {
    return this.partnerExpenseRepository.find({ order: { date: 'DESC' } });
  }

  async findOne(id: number) {
    const expense = await this.partnerExpenseRepository.findOne({ where: { id } });
    if (!expense) throw new NotFoundException(`Partner expense with id ${id} not found`);
    return expense;
  }

  async update(id: number, updateDto: UpdatePartnerExpenseDto) {
    const expense = await this.findOne(id);
    Object.assign(expense, updateDto);
    return this.partnerExpenseRepository.save(expense);
  }

  async remove(id: number) {
    const expense = await this.findOne(id);
    await this.partnerExpenseRepository.remove(expense);
    return { message: `Partner expense ${id} deleted successfully` };
  }
}
