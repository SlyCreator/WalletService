import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

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

  @OneToMany(() => BillEntity, (bill: BillEntity) => bill.user, {
    nullable: false,
  })
  bills: BillEntity[];
}
