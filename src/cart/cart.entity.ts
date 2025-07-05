import { Product } from "src/product/product.entity";
import { User } from "src/users/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Cart {
    @PrimaryGeneratedColumn()
    id: number

    @Column({
        type: 'int',
        nullable: false,
    })
    quantity: number

    @ManyToOne(()=> User)
    user:User

    @ManyToOne(()=> Product)
    product: Product
}