import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('career')
export class Career {

    @PrimaryGeneratedColumn('increment')
    id_career : number;

    @Column('text', {'unique': true})
    name : string;

    @Column('text', {'unique': true})
    key : string;
}
