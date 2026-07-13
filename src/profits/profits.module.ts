import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfitsService } from './profits.service';
import { ProfitsController } from './profits.controller';
import { Profit } from './entities/profit.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Profit])],
  controllers: [ProfitsController],
  providers: [ProfitsService],
  exports: [ProfitsService, TypeOrmModule],
})
export class ProfitsModule {}
