import {
  BadRequestException,
  Controller,
  Get,
  Inject,
  Query,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { Installs } from './entities/installs.entity';
import { InstallsServiceInterface } from './types/installs-service.interface';
import { CityDistribution, InstallStats } from './types/installs.types';

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
  @ApiQuery({
    name: 'app_name',
    type: String,
    required: true,
  })
  @ApiOkResponse({
    description: 'Installs by app have been successfuly fetched.',
  })
  @ApiBadRequestResponse({
    description: 'Bad Request: The "app_name" query parameter is required.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal Server Error. An unexpected error occurred.',
  })
  getInstallsByApp(
    @Query('app_name') appName: string,
  ): Promise<{ total_installs: number; city_distribution: CityDistribution }> {
    if (!appName)
      throw new BadRequestException('The app_name parameter is required');

    return this.installsService.getInstallsByApp(appName);
  }

  @Get('/installs-by-time')
  @ApiQuery({
    name: 'app_name',
    type: String,
    required: true,
  })
  @ApiQuery({
    name: 'from',
    type: String,
    required: true,
  })
  @ApiQuery({
    name: 'to',
    type: String,
    required: true,
  })
  @ApiOkResponse({
    description: 'Installs by time interval have been successfuly fetched.',
  })
  @ApiBadRequestResponse({
    description: 'Bad Request: Missing required query parameters.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal Server Error. An unexpected error occurred.',
  })
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
  @ApiQuery({
    name: 'from',
    type: String,
    required: true,
  })
  @ApiQuery({
    name: 'to',
    type: String,
    required: true,
  })
  @ApiOkResponse({
    description: 'Installs by devices have been successfuly fetched.',
  })
  @ApiBadRequestResponse({
    description: 'Bad Request: Missing required query parameters.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal Server Error. An unexpected error occurred.',
  })
  getInstallsByDevices(
    @Query('from') from: string,
    @Query('to') to: string,
  ): Promise<{ device_model: string; installs: number }[]> {
    if (!from || !to)
      throw new BadRequestException('Missing required query parameters');

    return this.installsService.getInstallsByDevice(from, to);
  }

  @Get('/geo-analysis')
  @ApiQuery({
    name: 'app_name',
    type: String,
    required: true,
  })
  @ApiOkResponse({
    description:
      'Successfully fetched the geographical distribution of installs.',
  })
  @ApiBadRequestResponse({
    description: 'Bad Request: The "app_name" query parameter is required.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal Server Error. An unexpected error occurred.',
  })
  getGeoAnalysis(
    @Query('app_name') appName: string,
  ): Promise<{ city: string; installs: number }[]> {
    if (!appName)
      throw new BadRequestException('The app_name parameter is required');

    return this.installsService.getGeoAnalysis(appName);
  }

  @Get('/idfv-distribution')
  @ApiQuery({
    name: 'app_name',
    type: String,
    required: true,
  })
  @ApiOkResponse({
    description: 'Idfv distribution has been successfuly fetched.',
  })
  @ApiBadRequestResponse({
    description: 'Bad Request: The "app_name" query parameter is required.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal Server Error. An unexpected error occurred.',
  })
  getIdfvDistribution(
    @Query('app_name') appName: string,
  ): Promise<InstallStats> {
    if (!appName)
      throw new BadRequestException('The app_name parameter is required');

    return this.installsService.getIdfvDistribution(appName);
  }

  @Get('/installs-metadata')
  @ApiQuery({
    name: 'from',
    type: String,
    required: true,
  })
  @ApiQuery({
    name: 'to',
    type: String,
    required: true,
  })
  @ApiOkResponse({
    description: 'Install metadata have been successfuly fetched.',
  })
  @ApiBadRequestResponse({
    description: 'Bad Request: Missing required query parameters.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal Server Error. An unexpected error occurred.',
  })
  getInstallsMetadata(
    @Query('from') from: string,
    @Query('to') to: string,
  ): Promise<Partial<Installs>[]> {
    if (!from || !to)
      throw new BadRequestException('Missing required query parameters');

    return this.installsService.getMetadataByDateRange(from, to);
  }
}
