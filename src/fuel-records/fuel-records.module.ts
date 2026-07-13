import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FuelRecordsService } from './fuel-records.service';
import { FuelRecordsController } from './fuel-records.controller';
import { FuelRecord } from './entities/fuel-record.entity';
import { FuelRecordLog } from './entities/fuel-record-log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FuelRecord, FuelRecordLog])],
  controllers: [FuelRecordsController],
  providers: [FuelRecordsService],
  exports: [FuelRecordsService, TypeOrmModule],
})
export class FuelRecordsModule {}
