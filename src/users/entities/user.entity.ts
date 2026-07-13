import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  BeforeUpdate,
  AfterLoad,
} from 'typeorm';
import { ApiProperty, ApiHideProperty } from '@nestjs/swagger';
import * as bcrypt from 'bcrypt';

export enum UserRole {
  ADMIN = 'ADMIN',
  MODERATOR = 'MODERATOR',
}

@Entity('users')
export class User {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'john_doe' })
  @Column({ nullable: true })
  username: string;

  @ApiProperty({ example: 'john@example.com' })
  @Column({ unique: true, nullable: false })
  email: string;

  @ApiHideProperty()
  @Column({ nullable: false, select: false })
  password: string;

  @ApiProperty({ enum: UserRole, example: UserRole.MODERATOR })
  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.MODERATOR,
    nullable: false,
  })
  role: UserRole;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;

  private previousPassword?: string;

  @AfterLoad()
  private snapshotPassword() {
    this.previousPassword = this.password;
  }

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    // Hash only when the password is new or has actually changed.
    if (this.password && this.password !== this.previousPassword) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }

  async validatePassword(plainText: string): Promise<boolean> {
    return bcrypt.compare(plainText, this.password);
  }
}
