import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('vehicles')
export class Vehicle {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'Toyota Hilux' })
  @Column({ nullable: false })
  name: string;

  @ApiProperty({ example: 'ABC-1234' })
  @Column({ unique: true, nullable: false })
  plate_number: string;

  @ApiProperty({ example: 2022, description: 'Model year' })
  @Column({ type: 'int', nullable: false })
  model: number;

  @ApiProperty({ example: 150.5, description: 'Total fuel consumed (litres)' })
  @Column({ type: 'float', nullable: false, default: 0 })
  total_fuel: number;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;
}
