import { OrderItem } from "src/order/order-item.entity";
import { Column, Entity, PrimaryGeneratedColumn, OneToMany, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from "typeorm";

@Entity()
export class Product {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column('decimal')
    price: number

    @Column('decimal', { nullable: true })
    discountPercentage?: number;

    @Column()
    thumbnailImage: string

    @Column('text',{
        array: true,
        nullable: true,
    })
    images?: string[]

    
    @Column()
    stock?: number = 1;

    @Column()
    category: string;

    @Column('decimal', { default: 0.0 })
    averageRating?: number;

    @Column({ default: 0 })
    numRatings: number;

    @Column({ default: false })
    isFeatured: boolean;

    @Column({ default: 0 })
    salesCount: number;

    @Column({
        type: 'text',
        nullable: true,
    })
    description?: string;

    @OneToMany(()=> OrderItem, (orderItem) => orderItem.product)
    orderItems: OrderItem[]

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

    @DeleteDateColumn()
    deletedAt: Date
}