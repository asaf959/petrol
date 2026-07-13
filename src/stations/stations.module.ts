import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StationsService } from './stations.service';
import { StationsController } from './stations.controller';
import { Station } from './entities/station.entity';
import { FuelRecord } from '../fuel-records/entities/fuel-record.entity';
import { Profit } from '../profits/entities/profit.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Station, FuelRecord, Profit])],
  controllers: [StationsController],
  providers: [StationsService],
  exports: [StationsService, TypeOrmModule],
})
export class StationsModule {}
