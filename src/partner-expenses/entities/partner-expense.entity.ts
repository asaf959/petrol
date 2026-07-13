import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('partner_expenses')
export class PartnerExpense {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: '2024-01-15' })
  @Column({ type: 'date', nullable: false })
  date: Date;

  @ApiProperty({ example: 'Fuel Supplier Payment' })
  @Column({ nullable: false })
  name: string;

  @ApiProperty({ example: 15000.0 })
  @Column({ type: 'float', nullable: false })
  amount: number;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;
}
