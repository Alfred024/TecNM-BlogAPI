import { BeforeInsert, BeforeUpdate, Column, Entity,PrimaryGeneratedColumn } from 'typeorm';


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

    @BeforeInsert()
    checkFieldsBeforeInsert() {
        this.email = this.email.toLowerCase().trim();
    }

    @BeforeUpdate()
    checkFieldsBeforeUpdate() {
        this.checkFieldsBeforeInsert();   
    }

}