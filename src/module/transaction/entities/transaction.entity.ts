import { BaseEntity, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity()
export class Transaction  extends BaseEntity{
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  amount: number;

  @Column()
  type:string

  @Column()
  status: string;

  @Column()
  payment_url: string;

  @ManyToOne(
    () => User,
    (user) => user.transactions
  )
  user: User


}
