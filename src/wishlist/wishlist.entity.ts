import { Product } from "src/product/product.entity";
import { User } from "src/users/user.entity";
import { Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Wishlist {
    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne(()=> User)
    user:User

    @ManyToOne(()=> Product)
    product: Product
}