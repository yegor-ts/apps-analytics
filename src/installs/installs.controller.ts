import { Controller, Get, Inject, Query } from '@nestjs/common';
import { ApiBadRequestResponse, ApiInternalServerErrorResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Installs } from './entities/installs.entity';
import { InstallsServiceInterface } from './types/installs-service.interface';
import { CityDistribution, InstallStats } from './types/installs.types';
import { AppNameDto } from './dto/app-name.dto';
import { DateRangeDto } from './dto/date-range.dto';
import { AppDateRangeDto } from './dto/app-date-range.dto';

@ApiTags('analytics')
@Controller('analytics')
export class InstallsController {
  constructor(
    @Inject('InstallsServiceInterface')
    private readonly installsService: InstallsServiceInterface,
  ) {}

  @Get('/apps')
  @ApiOkResponse({
    description: 'List of app names has been successfuly fetched.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal Server Error. An unexpected error occurred.',
  })
  getAllApps(): Promise<string[]> {
    return this.installsService.getAllApps();
  }

  @Get('/installs-by-app')
  @ApiOkResponse({
    description: 'Installs by app have been successfuly fetched.',
  })
  @ApiBadRequestResponse({
    description: 'Bad Request: The "app_name" query parameter is required.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal Server Error. An unexpected error occurred.',
  })
  async getInstallsByApp(
    @Query() appNameDto: AppNameDto,
  ): Promise<{ total_installs: number; city_distribution: CityDistribution }> {
    return this.installsService.getInstallsByApp(appNameDto.app_name);
  }

  @Get('/installs-by-time')
  @ApiOkResponse({
    description: 'Installs by time interval have been successfuly fetched.',
  })
  @ApiBadRequestResponse({
    description: 'Bad Request: Missing required query parameters.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal Server Error. An unexpected error occurred.',
  })
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
  @ApiOkResponse({
    description: 'Installs by devices have been successfuly fetched.',
  })
  @ApiBadRequestResponse({
    description: 'Bad Request: Missing required query parameters.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal Server Error. An unexpected error occurred.',
  })
  async getInstallsByDevices(
    @Query() dateRangeDto: DateRangeDto,
  ): Promise<{ device_model: string; installs: number }[]> {
    return this.installsService.getInstallsByDevice(dateRangeDto.from, dateRangeDto.to);
  }

  @Get('/geo-analysis')
  @ApiOkResponse({
    description: 'Successfully fetched the geographical distribution of installs.',
  })
  @ApiBadRequestResponse({
    description: 'Bad Request: The "app_name" query parameter is required.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal Server Error. An unexpected error occurred.',
  })
  async getGeoAnalysis(@Query() appNameDto: AppNameDto): Promise<{ city: string; installs: number }[]> {
    return this.installsService.getGeoAnalysis(appNameDto.app_name);
  }

  @Get('/idfv-distribution')
  @ApiOkResponse({
    description: 'Idfv distribution has been successfuly fetched.',
  })
  @ApiBadRequestResponse({
    description: 'Bad Request: The "app_name" query parameter is required.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal Server Error. An unexpected error occurred.',
  })
  async getIdfvDistribution(@Query() appNameDto: AppNameDto): Promise<InstallStats> {
    return this.installsService.getIdfvDistribution(appNameDto.app_name);
  }

  @Get('/installs-metadata')
  @ApiOkResponse({
    description: 'Install metadata have been successfuly fetched.',
  })
  @ApiBadRequestResponse({
    description: 'Bad Request: Missing required query parameters.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal Server Error. An unexpected error occurred.',
  })
  async getInstallsMetadata(@Query() dateRangeDto: DateRangeDto): Promise<Partial<Installs>[]> {
    return this.installsService.getMetadataByDateRange(dateRangeDto.from, dateRangeDto.to);
  }
}
