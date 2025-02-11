import { BeforeInsert, Column, CreateDateColumn, Entity, ManyToOne, PrimaryColumn } from "typeorm";
import { v4 as uuidv4 } from 'uuid'; 
import { User } from "./user.entity";


@Entity()
export class VideoUpload{ //Add it in data_source
    @PrimaryColumn('uuid')
    id:string

    @Column()
    image_name:string

    @Column()
    image_path:string

    @CreateDateColumn()
    uploadedAt:Date

    @ManyToOne(()=>User,(user)=>user.videoUploads)
    user:User

    @BeforeInsert()
    generateId() {  
        this.id = uuidv4();  
    } 
}