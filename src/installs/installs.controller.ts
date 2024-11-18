import { InstallsService } from './installs.service';
import {
  BadRequestException,
  Controller,
  Get,
  InternalServerErrorException,
  Query,
} from '@nestjs/common';
import { Installs } from './entities/installs.entity';
import { InstallStats } from './types/installs.types';

@Controller('analytics')
export class InstallsController {
  constructor(private readonly installsService: InstallsService) {}

  @Get('/apps')
  getAllApps(): Promise<string[]> {
    try {
      return this.installsService.getAllApps();
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch applications');
    }
  }

  @Get('/installs-by-time')
  getAppInstallsByTime(
    @Query('app_name') appName: string,
    @Query('from') from: string,
    @Query('to') to: string,
  ): Promise<{ period: string; total_installs: number }[]> {
    if (!appName || !from || !to)
      throw new BadRequestException('Missing required query parameters');

    return this.installsService.getAppInstallsByTime(appName, from, to);
  }

  @Get('/installs-by-device')
  getInstallsByDevices(
    @Query('from') from: string,
    @Query('to') to: string,
  ): Promise<{ device_model: string; installs: number }[]> {
    if (!from || !to)
      throw new BadRequestException('Missing required query parameters');

    return this.installsService.getInstallsByDevice(from, to);
  }

  @Get('/geo-analysis')
  async getGeoAnalysis(
    @Query('app_name') appName: string,
  ): Promise<{ city: string; installs: number }[]> {
    try {
      return await this.installsService.getGeoAnalysis(appName);
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to fetch geographic analysis data',
      );
    }
  }

  @Get('/idfv-distribution')
  async getIdfvDistribution(
    @Query('app_name') appName: string | undefined,
  ): Promise<InstallStats> {
    if (!appName)
      throw new BadRequestException('The app_name parameter is required');

    return await this.installsService.getIdfvDistribution(appName);
  }

  @Get('/installs-metadata')
  async getInstallsMetadata(
    @Query('from') from: string,
    @Query('to') to: string,
  ): Promise<Partial<Installs>[]> {
    if (!from || !to)
      throw new BadRequestException('Missing required query parameters');

    try {
      const installsMetadata =
        await this.installsService.getMetadataByDateRange(from, to);

      return installsMetadata;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
