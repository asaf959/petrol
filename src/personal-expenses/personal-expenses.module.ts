import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PersonalExpensesService } from './personal-expenses.service';
import { PersonalExpensesController } from './personal-expenses.controller';
import { PersonalExpense } from './entities/personal-expense.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PersonalExpense])],
  controllers: [PersonalExpensesController],
  providers: [PersonalExpensesService],
  exports: [PersonalExpensesService],
})
export class PersonalExpensesModule {}
