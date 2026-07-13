import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PersonalExpense } from './entities/personal-expense.entity';
import { CreatePersonalExpenseDto } from './dto/create-personal-expense.dto';
import { UpdatePersonalExpenseDto } from './dto/update-personal-expense.dto';

@Injectable()
export class PersonalExpensesService {
  constructor(
    @InjectRepository(PersonalExpense)
    private personalExpenseRepository: Repository<PersonalExpense>,
  ) {}

  async create(createDto: CreatePersonalExpenseDto) {
    const expense = this.personalExpenseRepository.create(createDto);
    return this.personalExpenseRepository.save(expense);
  }

  async findAll() {
    return this.personalExpenseRepository.find({ order: { date: 'DESC' } });
  }

  async findOne(id: number) {
    const expense = await this.personalExpenseRepository.findOne({ where: { id } });
    if (!expense) throw new NotFoundException(`Personal expense with id ${id} not found`);
    return expense;
  }

  async update(id: number, updateDto: UpdatePersonalExpenseDto) {
    const expense = await this.findOne(id);
    Object.assign(expense, updateDto);
    return this.personalExpenseRepository.save(expense);
  }

  async remove(id: number) {
    const expense = await this.findOne(id);
    await this.personalExpenseRepository.remove(expense);
    return { message: `Personal expense ${id} deleted successfully` };
  }
}
