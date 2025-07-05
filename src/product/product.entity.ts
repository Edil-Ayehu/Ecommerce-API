import { Order } from "src/order/order.entity";
import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from "typeorm";

@Entity()
export class Product {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column('decimal')
    price: number

    @Column({
        type: 'text',
        nullable: true,
    })
    description?: string;

    @OneToMany(()=> Order, (order) => order.user)
    orders: Order[]
}