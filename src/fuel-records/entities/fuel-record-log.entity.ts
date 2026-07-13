import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { FuelRecord } from './fuel-record.entity';

@Entity('fuel_record_logs')
export class FuelRecordLog {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 500.0, description: 'Amount paid in this log entry' })
  @Column({ type: 'float', nullable: false })
  amount_paid: number;

  @ApiProperty({ example: 1000.0, description: 'Amount remaining after this payment' })
  @Column({ type: 'float', nullable: false })
  amount_remaining: number;

  @Column({ nullable: true })
  fuelRecordId: number;

  @ManyToOne(() => FuelRecord, (fuelRecord) => fuelRecord.logs, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'fuelRecordId' })
  fuelRecord: FuelRecord;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;
}
