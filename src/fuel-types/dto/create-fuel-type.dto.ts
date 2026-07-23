import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CreateFuelTypeDto {
  @ApiProperty({ example: 'Petrol 91' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 2.18, description: 'Price per litre in SAR' })
  @IsNumber()
  @Min(0)
  liter_price: number;
}
