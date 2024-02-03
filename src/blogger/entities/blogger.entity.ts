import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity('blogger')
export class Blogger{
    @PrimaryGeneratedColumn('increment')
    id_blogger : number;

    @Column({
        type: 'varchar',
    })
    name : string;
    
    @Column({
        type: 'varchar',
    })
    first_username : string;

    @Column({
        type: 'varchar',
    })
    second_username : string;

    @Column({
        type : 'numeric',
    })
    id_career : number
}
