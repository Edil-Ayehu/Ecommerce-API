import { Product } from 'src/product/product.entity';
import { User } from 'src/users/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user)=> user.orders)
  user: User;

  @ManyToOne(() => Product, (product)=> product.orders)
  product:Product;

  @Column()
  quantity: number;
}
