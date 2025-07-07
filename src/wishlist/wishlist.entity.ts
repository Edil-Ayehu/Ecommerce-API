import { Product } from "src/product/product.entity";
import { User } from "src/users/user.entity";
import { CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Wishlist {
    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne(()=> User)
    user:User

    @ManyToOne(()=> Product, { onDelete: 'CASCADE'})
    product: Product
}