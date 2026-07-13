import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDateString, IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CreatePersonalExpenseDto {
  @ApiProperty({ example: '2024-01-15' })
  @IsDateString()
  @IsNotEmpty()
  date: string;

  @ApiProperty({ example: 'Office Supplies' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 2500.0 })
  @IsNumber()
  @Min(0)
  amount: number;

  @ApiProperty({
    example: true,
    description: 'true = Debit (money spent), false = Credit (refund/income)',
  })
  @IsBoolean()
  type: boolean;
}
