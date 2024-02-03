import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
//import { Product } from '../../products/entities';


@Entity('user_blogger')
export class User {
    
    @PrimaryGeneratedColumn('increment')
    id_user_blogger: number;

    @Column('text', {
        unique: true
    })
    email: string;

    @Column('text', {
        nullable: true,
    })
    password: string;

    @Column('text', {
        default: 'NORMAL'
    })
    role: string;

    // Un user_blogger tiene un blogger 
    // @OneToOne()

    @BeforeInsert()
    checkFieldsBeforeInsert() {
        this.email = this.email.toLowerCase().trim();
    }

    @BeforeUpdate()
    checkFieldsBeforeUpdate() {
        this.checkFieldsBeforeInsert();   
    }

}