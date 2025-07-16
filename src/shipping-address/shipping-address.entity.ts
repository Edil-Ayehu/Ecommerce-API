import { User } from "src/users/user.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class ShippingAddress {
    @PrimaryGeneratedColumn()
    id:number

    @Column()
    fullName:string

    @Column()
    streetAddress:string

    @Column()
    city:String

    @Column()
    state:string

    @Column()
    postalCode:string

    @Column({nullable: true})
    phone?:string

    @ManyToOne(()=> User, (user)=> user.shippingAddress, {eager: true})
    user:User

    @CreateDateColumn()
    createdAt:Date

    @UpdateDateColumn()
    updatedAt:Date

    @DeleteDateColumn()
    deletedAt:Date
}