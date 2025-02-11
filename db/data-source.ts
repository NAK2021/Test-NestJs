import { config } from "dotenv";
import { User } from "entities/user.entity";
import { VideoUpload } from "entities/video_upload.entity";
import { DataSource, DataSourceOptions } from "typeorm";


config()
export const datasourceOption: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [User, VideoUpload], 
  // migrations: [],
  logging: false,
  synchronize: true, //In development --> set True --> help increase the pace
                      //In production --> set False
};  

const datasource = new DataSource(datasourceOption);
export default datasource;
