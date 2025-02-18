import { faker } from "@faker-js/faker";  
import { User } from "entities/user.entity";
import { Role } from "module/auth/util/role.enum";
import { setSeederFactory } from "typeorm-extension";

export const UserFactory = setSeederFactory(User,() =>{
    const user = new User();
    user.username = faker.internet.username();
    user.password = faker.internet.password();
    user.role = Role.ADMIN;

    return user;
}); //(Type,cb(faker:Facker))