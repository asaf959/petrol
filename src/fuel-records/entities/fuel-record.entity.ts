import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Vehicle } from '../../vehicles/entities/vehicle.entity';
import { Station } from '../../stations/entities/station.entity';
import { FuelRecordLog } from './fuel-record-log.entity';

@Entity('fuel_records')
export class FuelRecord {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: '2024-01-15' })
  @Column({ type: 'date', nullable: false })
  date: Date;

  @ApiProperty({ example: 'Ali Hassan' })
  @Column({ nullable: false })
  driver_name: string;

  @ApiProperty({ example: 'Petrol' })
  @Column({ nullable: false })
  fuel_type: string;

  @ApiProperty({ example: 1500.0 })
  @Column({ type: 'float', nullable: false })
  total_amount: number;

  @ApiProperty({ example: 500.0 })
  @Column({ type: 'float', nullable: false })
  amount_paid: number;

  @ApiProperty({ example: 1000.0 })
  @Column({ type: 'float', nullable: false })
  amount_remaining: number;

  @ApiProperty({
    example: [{ date: '2024-02-01' }],
    description: 'Expected return dates for remaining amount',
  })
  @Column({ type: 'jsonb', nullable: false, default: '[]' })
  amount_return_date: object;

  @ApiProperty({ example: 'Cash', description: 'Payment type: Cash, Bank, Credit' })
  @Column({ nullable: false })
  payment_type: string;

  @ApiProperty({ example: 'HBL', description: 'Bank name (if bank payment)' })
  @Column({ nullable: true })
  bank_name: string;

  @ApiProperty({ example: 'Pending', description: 'Status: Pending, Paid, Partial' })
  @Column({ nullable: false, default: 'Pending' })
  status: string;

  @Column({ nullable: true })
  vehicle_id: number;

  @Column({ nullable: true })
  station_id: number;

  @ManyToOne(() => Vehicle, { eager: false })
  @JoinColumn({ name: 'vehicle_id' })
  vehicle: Vehicle;

  @ManyToOne(() => Station, { eager: false })
  @JoinColumn({ name: 'station_id' })
  station: Station;

  @OneToMany(() => FuelRecordLog, (log) => log.fuelRecord, { cascade: true })
  logs: FuelRecordLog[];

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;
}
