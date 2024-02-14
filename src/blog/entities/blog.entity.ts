import { Blogger } from "src/blogger/entities/blogger.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('blog')
export class Blog {
    @PrimaryGeneratedColumn('increment')
    id_blog : number;

    @Column('text')
    content : string;
    @Column('date', {'default': new Date().toISOString()})
    date_last_change : Date;
    @Column('date', {
        'default': new Date().toISOString(), 
        'nullable': false
    })
    date_publication : Date;
    @Column('varchar')
    title : string;
    @Column('varchar')
    slug : string;
    @Column('text')
    description : string;
    
    @ManyToOne(
        ()=> Blogger,
        blogger => blogger.blogs
    )
    @JoinColumn({name: 'id_blogger'})
    id_blogger : Blogger;
}
