import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
// import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { datasourceOption } from 'db/data-source';
import { LoggerMiddleware } from 'middleware/log/logger.middleware';
import { UsersModule } from 'module/users/users.module';
import { AuthModule } from 'module/auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from 'middleware/guard/auth.guard';
import { RolesGuard } from 'middleware/guard/roles.gurad';
import { VideoUploadModule } from 'module/video_upload/video_upload.module';

@Module({
  imports: [ //Lấy thông tin về để sử dụng (MODULE)
    UsersModule,
    AuthModule,
    VideoUploadModule,
    TypeOrmModule.forRoot(//datasource
      datasourceOption
    )
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule implements NestModule{
  configure(consumer: MiddlewareConsumer) { //MiddlewareConsumer is a helper class
    consumer
      .apply(LoggerMiddleware) //Sử dụng middlewares nào
      .exclude() //Ngoại trừ 
      .forRoutes({path: "users", method: RequestMethod.GET}); //Cho route nào
  }
}
