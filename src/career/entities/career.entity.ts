import { Blogger } from "src/blogger/entities/blogger.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('career')
export class Career {

    @PrimaryGeneratedColumn('increment')
    id_career : number;
 
    @Column('text', {'unique': true})
    name : string;

    @Column('text', {'unique': true})
    key : string;

   @OneToMany(
    () => Blogger,
    (blogger) => blogger.id_blogger,
    {eager: true}
   )
   bloggers?: Blogger[];
}
