import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { databaseConfig } from './config/database.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppsflyerModule } from './appsflyer/appsflyer.module';
import { ScheduleModule } from '@nestjs/schedule';
import { InstallsModule } from './installs/installs.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot(databaseConfig),
    ScheduleModule.forRoot(),
    AppsflyerModule,
    InstallsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
