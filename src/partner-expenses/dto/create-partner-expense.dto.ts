import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CreatePartnerExpenseDto {
  @ApiProperty({ example: '2024-01-15' })
  @IsDateString()
  @IsNotEmpty()
  date: string;

  @ApiProperty({ example: 'Fuel Supplier Payment' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 15000.0 })
  @IsNumber()
  @Min(0)
  amount: number;
}
