import { Order } from "src/order/order.entity";
import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from "typeorm";

export enum UserRole {
    USER = 'user',
    ADMIN = 'admin',
    SUPERADMIN = 'superadmin',
}

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number

    @Column({unique: true})
    email: string

    @Column()
    password: string

    @Column({
        type: 'enum',
        enum: UserRole,
        default: UserRole.USER,
    })
    role: UserRole;

    @OneToMany(()=> Order, (order) => order.user)
    orders: Order[]
}