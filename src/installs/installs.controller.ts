import { Controller, Get, Inject, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Installs } from './entities/installs.entity';
import { InstallsServiceInterface } from './types/installs-service.interface';
import { CityDistribution, InstallStats } from './types/installs.types';
import { AppNameDto } from './dto/app-name.dto';
import { DateRangeDto } from './dto/date-range.dto';
import { AppDateRangeDto } from './dto/app-date-range.dto';
import { ApiAnalyticsResponses } from './decorators/api-responses.decorator';

@ApiTags('analytics')
@Controller('analytics')
export class InstallsController {
  constructor(
    @Inject('InstallsServiceInterface')
    private readonly installsService: InstallsServiceInterface,
  ) {}

  @Get('/apps')
  @ApiAnalyticsResponses('List of app names has been successfully fetched.')
  getAllApps(): Promise<string[]> {
    return this.installsService.getAllApps();
  }

  @Get('/installs-by-app')
  @ApiAnalyticsResponses('Installs by app have been successfully fetched.')
  async getInstallsByApp(
    @Query() appNameDto: AppNameDto,
  ): Promise<{ total_installs: number; city_distribution: CityDistribution }> {
    return this.installsService.getInstallsByApp(appNameDto.app_name);
  }

  @Get('/installs-by-time')
  @ApiAnalyticsResponses('Installs by time interval have been successfully fetched.')
  async getAppInstallsByTime(
    @Query() appDateRangeDto: AppDateRangeDto,
  ): Promise<{ period: string; total_installs: number }[]> {
    return this.installsService.getAppInstallsByTime(
      appDateRangeDto.app_name,
      appDateRangeDto.from,
      appDateRangeDto.to,
    );
  }

  @Get('/installs-by-device')
  @ApiAnalyticsResponses('Installs by devices have been successfully fetched.')
  async getInstallsByDevices(
    @Query() dateRangeDto: DateRangeDto,
  ): Promise<{ device_model: string; installs: number }[]> {
    return this.installsService.getInstallsByDevice(dateRangeDto.from, dateRangeDto.to);
  }

  @Get('/geo-analysis')
  @ApiAnalyticsResponses('Successfully fetched the geographical distribution of installs.')
  async getGeoAnalysis(@Query() appNameDto: AppNameDto): Promise<{ city: string; installs: number }[]> {
    return this.installsService.getGeoAnalysis(appNameDto.app_name);
  }

  @Get('/idfv-distribution')
  @ApiAnalyticsResponses('IDFV distribution has been successfully fetched.')
  async getIdfvDistribution(@Query() appNameDto: AppNameDto): Promise<InstallStats> {
    return this.installsService.getIdfvDistribution(appNameDto.app_name);
  }

  @Get('/installs-metadata')
  @ApiAnalyticsResponses('Install metadata have been successfully fetched.')
  async getInstallsMetadata(@Query() dateRangeDto: DateRangeDto): Promise<Partial<Installs>[]> {
    return this.installsService.getMetadataByDateRange(dateRangeDto.from, dateRangeDto.to);
  }
}
