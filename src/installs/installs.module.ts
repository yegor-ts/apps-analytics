import { Module } from '@nestjs/common';
import { InstallsService } from './installs.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Installs } from './entities/installs.entity';
import { InstallsController } from './installs.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Installs])],
  providers: [InstallsService],
  exports: [InstallsService],
  controllers: [InstallsController],
})
export class InstallsModule {}
