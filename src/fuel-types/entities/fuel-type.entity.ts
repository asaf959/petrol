import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('fuel_types')
export class FuelType {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'Petrol 91' })
  @Column({ unique: true, nullable: false })
  name: string;

  @ApiProperty({ example: 2.18, description: 'Global price per litre (SAR)' })
  @Column({ type: 'float', nullable: false, default: 0 })
  liter_price: number;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;
}
