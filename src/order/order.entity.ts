import { User } from 'src/users/user.entity';
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { OrderItem } from './order-item.entity';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({unique: true})
  orderNumber:string

  @ManyToOne(() => User, (user)=> user.orders)
  user: User;

  @Column()
  paymentMethod:string

  @Column({nullable: true})
  shippingAddress?:string;

  @OneToMany(()=> OrderItem, (item) => item.order, {cascade: true})
  items: OrderItem[]

  @CreateDateColumn()
  createdAt: Date;
}
