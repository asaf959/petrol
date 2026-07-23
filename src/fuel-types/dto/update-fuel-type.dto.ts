import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class UpdateFuelTypeDto {
  @ApiPropertyOptional({ example: 'Petrol 91' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ example: 2.18, description: 'Price per litre in SAR' })
  @IsNumber()
  @IsOptional()
  @Min(0)
  liter_price?: number;
}
