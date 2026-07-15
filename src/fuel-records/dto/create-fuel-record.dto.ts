import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateFuelRecordDto {
  @ApiProperty({ example: '2024-01-15', description: 'Date of the fuel record' })
  @IsDateString()
  @IsNotEmpty()
  date: string;

  @ApiProperty({ example: 'Ali Hassan' })
  @IsString()
  @IsNotEmpty()
  driver_name: string;

  @ApiProperty({ example: 'Petrol', description: 'Type of fuel (Petrol, Diesel, CNG, etc.)' })
  @IsString()
  @IsNotEmpty()
  fuel_type: string;

  @ApiProperty({ example: 1500.0, description: 'Total amount of the transaction' })
  @IsNumber()
  @Min(0)
  total_amount: number;

  @ApiProperty({ example: 500.0, description: 'Amount already paid' })
  @IsNumber()
  @Min(0)
  amount_paid: number;

  @ApiProperty({ example: 1000.0, description: 'Amount remaining to be paid' })
  @IsNumber()
  @Min(0)
  amount_remaining: number;

  @ApiPropertyOptional({
    example: [{ date: '2024-02-01' }],
    description: 'Expected return dates for remaining amount',
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value !== 'string') return value;
    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  })
  amount_return_date?: object;

  @ApiProperty({ example: 'Cash', description: 'Payment type: Cash, Bank, Credit' })
  @IsString()
  @IsNotEmpty()
  payment_type: string;

  @ApiPropertyOptional({ example: 'HBL', description: 'Bank name (required if payment_type is Bank)' })
  @IsString()
  @IsOptional()
  bank_name?: string;

  @ApiPropertyOptional({ example: 'Pending', description: 'Status: Pending, Paid, Partial' })
  @IsString()
  @IsOptional()
  status?: string;

  @ApiProperty({ example: 1, description: 'Vehicle ID' })
  @IsNumber()
  vehicle_id: number;

  @ApiProperty({ example: 1, description: 'Station ID' })
  @IsNumber()
  station_id: number;
}
