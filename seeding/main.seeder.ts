import { User } from "entities/user.entity";
import { DataSource } from "typeorm";
import { Seeder, SeederFactoryManager } from "typeorm-extension";

export class MainSeeder implements Seeder{
    public async run(dataSource: DataSource, factoryManager: SeederFactoryManager): 
    Promise<any> { //dataSource access to repository, factoryManager access to coresponding factory
        //We cannot inject the repository in this place because it's seperated from module
         
        const userFactory = factoryManager.get(User);
        console.log("Seeding User...");
        const users = await userFactory.saveMany(10);

        //For entities that have relationships, it will be more complex
        //const uploadFactory = factoryManager.get((VideoUpload);
        //const videoUploads = await Promise.all(
        //  Array(10).fill("").map(async () => {
        //      const videoUpload = await uploadFactory.make({
        //          user:faker.helpers.arrayElement(users);
        //      })
        //      return videoUpload;
        //  })
        //);
        //This will be used if we actually want to insert specific values
        //const uploadRepository = datasource.getRepository(VideoUpload);
        //console.log("Seeding VideoUpload...");
        //await uploadRepository.save(videoUploads);
    }
}