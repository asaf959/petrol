import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PartnerExpensesService } from './partner-expenses.service';
import { PartnerExpensesController } from './partner-expenses.controller';
import { PartnerExpense } from './entities/partner-expense.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PartnerExpense])],
  controllers: [PartnerExpensesController],
  providers: [PartnerExpensesService],
  exports: [PartnerExpensesService],
})
export class PartnerExpensesModule {}
