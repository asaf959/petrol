import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class UpdatePartnerExpenseDto {
  @ApiPropertyOptional({ example: '2024-01-15' })
  @IsDateString()
  @IsOptional()
  date?: string;

  @ApiPropertyOptional({ example: 'Fuel Supplier Payment' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ example: 15000.0 })
  @IsNumber()
  @IsOptional()
  @Min(0)
  amount?: number;
}
