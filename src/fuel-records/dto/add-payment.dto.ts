import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsNumber, IsOptional, Min } from 'class-validator';

export class AddPaymentDto {
  @ApiProperty({
    example: 100.0,
    description: 'Amount being paid now (partial or full remaining balance)',
  })
  @IsNumber()
  @Min(0.01)
  amount: number;

  @ApiPropertyOptional({
    example: '2026-07-13',
    description: 'Date this payment was made (defaults to today)',
  })
  @IsDateString()
  @IsOptional()
  payment_date?: string;
}
