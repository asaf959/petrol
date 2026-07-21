import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsNumber, IsOptional, Min } from 'class-validator';

export class UpdatePaymentLogDto {
  @ApiPropertyOptional({
    example: 200.0,
    description: 'Updated amount for this payment entry',
  })
  @IsNumber()
  @IsOptional()
  @Min(0.01)
  amount?: number;

  @ApiPropertyOptional({
    example: '2026-07-16',
    description: 'Updated date this payment was made',
  })
  @IsDateString()
  @IsOptional()
  payment_date?: string;
}
