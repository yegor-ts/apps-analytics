import { InstallsService } from './installs.service';
import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { Installs } from './entities/installs.entity';
import { CityDistribution, InstallStats } from './types/installs.types';

@Controller('analytics')
export class InstallsController {
  constructor(private readonly installsService: InstallsService) {}

  @Get('/apps')
  getAllApps(): Promise<string[]> {
    return this.installsService.getAllApps();
  }

  @Get('/installs-by-app')
  getInstallsByApp(
    @Query('app_name') appName: string,
  ): Promise<{ total_installs: number; city_distribution: CityDistribution }> {
    if (!appName)
      throw new BadRequestException('The app_name parameter is required');

    return this.installsService.getInstallsByApp(appName);
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
  getGeoAnalysis(
    @Query('app_name') appName: string,
  ): Promise<{ city: string; installs: number }[]> {
    if (!appName)
      throw new BadRequestException('The app_name parameter is required');

    return this.installsService.getGeoAnalysis(appName);
  }

  @Get('/idfv-distribution')
  getIdfvDistribution(
    @Query('app_name') appName: string,
  ): Promise<InstallStats> {
    if (!appName)
      throw new BadRequestException('The app_name parameter is required');

    return this.installsService.getIdfvDistribution(appName);
  }

  @Get('/installs-metadata')
  getInstallsMetadata(
    @Query('from') from: string,
    @Query('to') to: string,
  ): Promise<Partial<Installs>[]> {
    if (!from || !to)
      throw new BadRequestException('Missing required query parameters');

    return this.installsService.getMetadataByDateRange(from, to);
  }
}
