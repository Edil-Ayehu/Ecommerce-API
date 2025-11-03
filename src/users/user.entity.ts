import { Order } from "src/order/order.entity";
import { ShippingAddress } from "src/shipping-address/shipping-address.entity";
import { Column, Entity, PrimaryGeneratedColumn, OneToMany, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from "typeorm";
import { UUID } from "typeorm/driver/mongodb/bson.typings";

export enum UserRole {
    USER = 'user',
    ADMIN = 'admin',
    SUPERADMIN = 'superadmin',
}

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    email: string

    @Column()
    password: string

    @Column({nullable: true})
    fullName?:string

     @Column({nullable: true})
    phone?:string

     @Column({nullable: true})
    address?:string

    @OneToMany(()=> ShippingAddress, (address)=> address.user)
    shippingAddress: ShippingAddress

     @Column({nullable: true})
    avatar?:string  // URL or base64 string

    @Column({
        type: 'enum',
        enum: UserRole,
        default: UserRole.USER,
    })
    role: UserRole;

    @OneToMany(()=> Order, (order) => order.user)
    orders: Order[]

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedDate:Date

    @DeleteDateColumn()
    deletedAt:Date
}