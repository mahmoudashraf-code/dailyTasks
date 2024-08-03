import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  BeforeUpdate,
  ManyToOne,
} from 'typeorm';
import { IsDate, IsDefined, IsNotEmpty, validateOrReject } from 'class-validator';
import { differenceInHours } from 'date-fns';
import { User } from './user';

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsNotEmpty()
  @IsDefined()
  description: string;

  @Column()
  @IsNotEmpty()
  @IsDefined()
  @IsDate()
  startTime: Date;

  @IsNotEmpty()
  @IsDefined()
  @IsDate()
  @Column()
  endTime: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.tasks, {
    onDelete: 'CASCADE',
  })
  user: User;

  @BeforeInsert()
  @BeforeUpdate()
  async validateTask() {
    await validateOrReject(this, { validationError: { target: false } });
    const duration = differenceInHours(new Date(this.endTime), new Date(this.startTime));
    if (duration > 8) {
      throw new Error('Task duration cannot exceed 8 hours.');
    }
  }
}
