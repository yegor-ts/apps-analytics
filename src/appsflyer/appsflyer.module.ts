import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { AppsflyerService } from './appsflyer.service';
import { HttpModule } from '@nestjs/axios';
import { InstallsModule } from 'src/installs/installs.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Installs } from 'src/installs/entities/installs.entity';

@Module({
  imports: [ConfigModule, HttpModule, InstallsModule, TypeOrmModule.forFeature([Installs])],
  providers: [
    {
      provide: 'AppsflyerServiceInterface',
      useClass: AppsflyerService,
    },
  ],
})
export class AppsflyerModule {}
