import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateStationDto {
  @ApiProperty({ example: 'Main Station' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'ST-001', description: 'Unique station number/code' })
  @IsString()
  @IsNotEmpty()
  number: string;

  @ApiProperty({ example: '123 Main Street, City' })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({ example: '+1234567890' })
  @IsString()
  @IsNotEmpty()
  contact: string;
}
