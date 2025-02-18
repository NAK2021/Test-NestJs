//Use black list technique to do this
//Every time logout, we have to invalidate both access and refresh token
//Create an id for token 
// 1 to Many with User

import { BeforeInsert, Column, Entity, ManyToOne, PrimaryColumn } from "typeorm";
import { User } from "./user.entity";


@Entity()
export class InvalidatedToken {
    @PrimaryColumn('uuid')
    id:string

    @Column()
    time_stamp: Date

    @ManyToOne(()=>User,(user)=>user.invalidated_tokens)
    user:User
}
