import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class UpdateFuelRecordDto {
  @ApiPropertyOptional({ example: '2024-01-15' })
  @IsDateString()
  @IsOptional()
  date?: string;

  @ApiPropertyOptional({ example: 'Ali Hassan' })
  @IsString()
  @IsOptional()
  driver_name?: string;

  @ApiPropertyOptional({ example: 'Petrol' })
  @IsString()
  @IsOptional()
  fuel_type?: string;

  @ApiPropertyOptional({ example: 50, description: 'Petrol quantity in litres' })
  @IsNumber()
  @IsOptional()
  @Min(0)
  petrol_liter?: number;

  @ApiPropertyOptional({ example: 2.18, description: 'Price per single litre (SAR)' })
  @IsNumber()
  @IsOptional()
  @Min(0)
  liter_price?: number;

  @ApiPropertyOptional({ example: 1500.0 })
  @IsNumber()
  @IsOptional()
  @Min(0)
  total_amount?: number;

  @ApiPropertyOptional({
    example: 500.0,
    description: 'New payment amount — creates a new log entry if changed',
  })
  @IsNumber()
  @IsOptional()
  @Min(0)
  amount_paid?: number;

  @ApiPropertyOptional({ example: [{ date: '2024-02-01' }] })
  @IsOptional()
  amount_return_date?: object;

  @ApiPropertyOptional({ example: 'Cash' })
  @IsString()
  @IsOptional()
  payment_type?: string;

  @ApiPropertyOptional({ example: 'HBL' })
  @IsString()
  @IsOptional()
  bank_name?: string;

  @ApiPropertyOptional({ example: 'Paid' })
  @IsString()
  @IsOptional()
  status?: string;

  @ApiPropertyOptional({ example: 1 })
  @IsNumber()
  @IsOptional()
  vehicle_id?: number;

  @ApiPropertyOptional({ example: 1 })
  @IsNumber()
  @IsOptional()
  station_id?: number;
}
