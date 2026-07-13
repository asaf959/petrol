import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class UpdateVehicleDto {
  @ApiPropertyOptional({ example: 'Toyota Hilux' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ example: 'ABC-1234' })
  @IsString()
  @IsOptional()
  plate_number?: string;

  @ApiPropertyOptional({ example: 2022 })
  @IsNumber()
  @IsOptional()
  model?: number;

  @ApiPropertyOptional({ example: 150.5 })
  @IsNumber()
  @IsOptional()
  @Min(0)
  total_fuel?: number;
}
