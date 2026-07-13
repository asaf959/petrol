import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('stations')
export class Station {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'Main Station' })
  @Column({ nullable: false })
  name: string;

  @ApiProperty({ example: 'ST-001' })
  @Column({ unique: true, nullable: false })
  number: string;

  @ApiProperty({ example: '123 Main Street, City' })
  @Column({ nullable: false })
  address: string;

  @ApiProperty({ example: '+1234567890' })
  @Column({ nullable: false })
  contact: string;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;
}
