import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CreateVehicleDto {
  @ApiProperty({ example: 'Toyota Hilux' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'ABC-1234' })
  @IsString()
  @IsNotEmpty()
  plate_number: string;

  @ApiProperty({ example: 2022, description: 'Model year' })
  @IsNumber()
  model: number;

  @ApiProperty({ example: 0, description: 'Total fuel consumed (litres)' })
  @IsNumber()
  @Min(0)
  total_fuel: number;
}
