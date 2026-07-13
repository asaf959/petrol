import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class UpdateProfitDto {
  @ApiPropertyOptional({ example: '2024-01-15' })
  @IsDateString()
  @IsOptional()
  date?: string;

  @ApiPropertyOptional({ example: 'Ali Hassan' })
  @IsString()
  @IsOptional()
  driver_name?: string;

  @ApiPropertyOptional({ example: 5000.0 })
  @IsNumber()
  @IsOptional()
  @Min(0)
  rent?: number;

  @ApiPropertyOptional({ example: 1500.0 })
  @IsNumber()
  @IsOptional()
  @Min(0)
  fuel_expense?: number;

  @ApiPropertyOptional({ example: 800.0 })
  @IsNumber()
  @IsOptional()
  @Min(0)
  driver_expense?: number;

  @ApiPropertyOptional({ example: 300.0 })
  @IsNumber()
  @IsOptional()
  @Min(0)
  vehicle_expense?: number;

  @ApiPropertyOptional({ example: 200.0 })
  @IsNumber()
  @IsOptional()
  @Min(0)
  expense?: number;

  @ApiPropertyOptional({ example: 1 })
  @IsNumber()
  @IsOptional()
  vehicle_id?: number;

  @ApiPropertyOptional({ example: 1 })
  @IsNumber()
  @IsOptional()
  station_id?: number;
}
