import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateStationDto {
  @ApiPropertyOptional({ example: 'Main Station' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ example: 'ST-001' })
  @IsString()
  @IsOptional()
  number?: string;

  @ApiPropertyOptional({ example: '123 Main Street, City' })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiPropertyOptional({ example: '+1234567890' })
  @IsString()
  @IsOptional()
  contact?: string;
}
