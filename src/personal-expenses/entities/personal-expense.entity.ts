import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('personal_expenses')
export class PersonalExpense {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: '2024-01-15' })
  @Column({ type: 'date', nullable: false })
  date: Date;

  @ApiProperty({ example: 'Office Supplies' })
  @Column({ nullable: false })
  name: string;

  @ApiProperty({ example: 2500.0 })
  @Column({ type: 'float', nullable: false })
  amount: number;

  @ApiProperty({
    example: true,
    description: 'Expense type: true = Debit (expense paid), false = Credit (refund/income)',
  })
  @Column({ type: 'boolean', nullable: false, default: true })
  type: boolean;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;
}
