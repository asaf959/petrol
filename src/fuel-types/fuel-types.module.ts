import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FuelTypesService } from './fuel-types.service';
import { FuelTypesController } from './fuel-types.controller';
import { FuelType } from './entities/fuel-type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FuelType])],
  controllers: [FuelTypesController],
  providers: [FuelTypesService],
  exports: [FuelTypesService, TypeOrmModule],
})
export class FuelTypesModule {}
