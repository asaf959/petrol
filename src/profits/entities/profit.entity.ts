import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Vehicle } from '../../vehicles/entities/vehicle.entity';
import { Station } from '../../stations/entities/station.entity';

@Entity('profits')
export class Profit {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: '2024-01-15' })
  @Column({ type: 'date', nullable: false })
  date: Date;

  @ApiProperty({ example: 'Ali Hassan' })
  @Column({ nullable: false })
  driver_name: string;

  @ApiProperty({ example: 5000.0, description: 'Rent earned' })
  @Column({ type: 'float', nullable: false, default: 0 })
  rent: number;

  @ApiProperty({ example: 1500.0, description: 'Fuel expense' })
  @Column({ type: 'float', nullable: false, default: 0 })
  fuel_expense: number;

  @ApiProperty({ example: 800.0, description: 'Driver expense/salary' })
  @Column({ type: 'float', nullable: false, default: 0 })
  driver_expense: number;

  @ApiProperty({ example: 300.0, description: 'Vehicle maintenance/repair expense' })
  @Column({ type: 'float', nullable: false, default: 0 })
  vehicle_expense: number;

  @ApiProperty({ example: 200.0, description: 'Other miscellaneous expense' })
  @Column({ type: 'float', nullable: false, default: 0 })
  expense: number;

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

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;
}
