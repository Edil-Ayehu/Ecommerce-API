import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Order } from "./order.entity";
import { Product } from "src/product/product.entity";

@Entity()
export class OrderItem {
    @PrimaryGeneratedColumn()
    id:number;

    @ManyToOne(() => Order, (order)=> order.items, {onDelete: 'CASCADE'})
    order:Order

    @ManyToOne(()=> Product, {eager: true})
    product: Product

    @Column()
    quantity:number
}