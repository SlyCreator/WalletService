import {
  AfterInsert,
  AfterLoad,
  BaseEntity,
  BeforeInsert, BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity, OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { Transaction } from '../../transaction/entities/transaction.entity';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fullname: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({default:0})
  wallet_amount:string

  @Column({default:null})
  wallet_pin:string

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Transaction, (transaction) => transaction.user)
  transactions: Transaction[]

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 8);
  }
  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }

  @AfterInsert()
  async removePassword(){
    delete this.password
  }
  @BeforeUpdate()
  async hashPin(){
    this.wallet_pin = await bcrypt.hash(this.wallet_pin,8)
  }
  async validatePin(wallet_pin: string): Promise<boolean> {
    return bcrypt.compare(wallet_pin, this.wallet_pin);
  }
}
