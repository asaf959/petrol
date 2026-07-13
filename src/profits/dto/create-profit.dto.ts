import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsNumber, IsOptional, Min } from 'class-validator';

export class CreateProfitDto {
  @ApiProperty({ example: '2024-01-15' })
  @IsDateString()
  @IsNotEmpty()
  date: string;

  @ApiProperty({ example: 'Ali Hassan' })
  @IsNotEmpty()
  driver_name: string;

  @ApiProperty({ example: 5000.0, description: 'Rent earned' })
  @IsNumber()
  @Min(0)
  rent: number;

  @ApiProperty({ example: 1500.0, description: 'Fuel expense' })
  @IsNumber()
  @Min(0)
  fuel_expense: number;

  @ApiProperty({ example: 800.0, description: 'Driver expense/salary' })
  @IsNumber()
  @Min(0)
  driver_expense: number;

  @ApiPropertyOptional({ example: 300.0, description: 'Vehicle maintenance expense' })
  @IsNumber()
  @IsOptional()
  @Min(0)
  vehicle_expense?: number;

  @ApiPropertyOptional({ example: 200.0, description: 'Other miscellaneous expense' })
  @IsNumber()
  @IsOptional()
  @Min(0)
  expense?: number;

  @ApiProperty({ example: 1, description: 'Vehicle ID' })
  @IsNumber()
  vehicle_id: number;

  @ApiProperty({ example: 1, description: 'Station ID' })
  @IsNumber()
  station_id: number;
}
