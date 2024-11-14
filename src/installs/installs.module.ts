import { Module } from '@nestjs/common';
import { InstallsService } from './installs.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Installs } from './entities/installs.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Installs])],
  providers: [InstallsService],
  exports: [InstallsService],
})
export class InstallsModule {}
