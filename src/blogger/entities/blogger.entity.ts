import { User } from "src/auth/entities/user.entity";
import { Blog } from "src/blog/entities/blog.entity";
import { Career } from "src/career/entities/career.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

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

    @OneToOne(() => User)
    @JoinColumn({name: 'id_user_blogger'})
    id_user_blogger : number

    @OneToMany(
        () => Blog,
        (blog) => blog.id_blogger,
        { eager: true }    
    )
    blogs?: Blog[];

    @ManyToOne(
        ()=> Career,
        career => career.bloggers
    )
    @JoinColumn({name: 'id_career'})
    id_career : Career;
}
