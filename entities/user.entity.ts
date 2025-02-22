import { BeforeInsert, Column, Entity, JoinColumn, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { v4 as uuidv4 } from 'uuid'; 
import { VideoUpload } from "./video_upload.entity";
import { InvalidatedToken } from "./invalidated_token.entity";

@Entity()
export class User{
    @PrimaryColumn('uuid')
    id:string

    @Column()
    username:string

    @Column()
    password:string

    @Column({default: "admin"})
    role:string

    @OneToMany(()=>VideoUpload,(videoUploads)=>videoUploads.user)
    @JoinColumn({name:"video_upload_id"})
    videoUploads:VideoUpload 

    @OneToMany(()=>InvalidatedToken,(invalidated_tokens)=>invalidated_tokens.user)
    @JoinColumn({name:"invalidated_token_id"})
    invalidated_tokens:InvalidatedToken 

    //một decorator TypeORM 
    // cho phép bạn chạy một hàm trước khi 
    // một thực thể được lưu vào cơ sở dữ liệu.
    @BeforeInsert()
    generateId() {  
        this.id = uuidv4();  
    } 
}