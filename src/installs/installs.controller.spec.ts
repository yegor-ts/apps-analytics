import { ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { InstallsController } from './installs.controller';
import { InstallsServiceInterface } from './types/installs-service.interface';
import { CityDistribution, InstallStats } from './types/installs.types';
import { AppNameDto } from './dto/app-name.dto';
import { AppDateRangeDto } from './dto/app-date-range.dto';
import { DateRangeDto } from './dto/date-range.dto';

describe('InstallsController', () => {
  let controller: InstallsController;
  let installsService: jest.Mocked<InstallsServiceInterface>;
  let validationPipe: ValidationPipe;

  beforeEach(async () => {
    installsService = {
      getAllApps: jest.fn(),
      getInstallsByApp: jest.fn(),
      getAppInstallsByTime: jest.fn(),
      getInstallsByDevice: jest.fn(),
      getGeoAnalysis: jest.fn(),
      getIdfvDistribution: jest.fn(),
      getMetadataByDateRange: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [InstallsController],
      providers: [
        {
          provide: 'InstallsServiceInterface',
          useValue: installsService,
        },
      ],
    }).compile();

    controller = module.get<InstallsController>(InstallsController);
    validationPipe = new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    });
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAllApps', () => {
    it('should return a list of app names', async () => {
      const mockApps = ['Fix San', 'Temp'];
      installsService.getAllApps.mockResolvedValue(mockApps);

      const appsList = await controller.getAllApps();

      expect(appsList).toEqual(mockApps);
      expect(installsService.getAllApps).toHaveBeenCalled();
    });
  });

  describe('getInstallsByApp', () => {
    it('should return total installs and city distribution for a valid app name', async () => {
      const mockResponse = {
        total_installs: 100,
        city_distribution: {
          'New York': 50,
          London: 50,
        } as CityDistribution,
      };
      const validDto = { app_name: 'Fix San' };
      installsService.getInstallsByApp.mockResolvedValue(mockResponse);

      const result = await controller.getInstallsByApp(validDto);

      expect(result).toEqual(mockResponse);
      expect(installsService.getInstallsByApp).toHaveBeenCalledWith('Fix San');
    });

    it('should throw BadRequestException if app name is missing', async () => {
      const invalidDto = { app_name: '' };

      try {
        await validationPipe.transform(invalidDto, { type: 'query', metatype: AppNameDto });
        fail('ValidationPipe should throw an exception');
      } catch (error) {
        expect(error).toBeDefined();
        expect(installsService.getInstallsByApp).not.toHaveBeenCalled();
      }
    });
  });

  describe('getAppInstallsByTime', () => {
    it('should return install by time interval', async () => {
      const mockResponse = [
        { period: '2024-01-01', total_installs: 10 },
        { period: '2024-01-02', total_installs: 20 },
      ];
      const validDto = {
        app_name: 'Fix San',
        from: '2024-05-01',
        to: '2024-05-10',
      };
      installsService.getAppInstallsByTime.mockResolvedValue(mockResponse);

      const result = await controller.getAppInstallsByTime(validDto);

      expect(result).toEqual(mockResponse);
      expect(installsService.getAppInstallsByTime).toHaveBeenCalledWith('Fix San', '2024-05-01', '2024-05-10');
    });

    it('should throw BadRequestException if any required parameter is missing', async () => {
      const invalidDto = { app_name: '', from: '', to: '' };

      try {
        await validationPipe.transform(invalidDto, { type: 'query', metatype: AppDateRangeDto });
        fail('ValidationPipe should throw an exception');
      } catch (error) {
        expect(error).toBeDefined();
        expect(installsService.getAppInstallsByTime).not.toHaveBeenCalled();
      }
    });
  });

  describe('getInstallsByDevices', () => {
    it('should return installs by devices', async () => {
      const mockResponse = [
        {
          device_model: 'Iphone 14',
          installs: 14,
        },
        {
          device_model: 'Google Pixel',
          installs: 10,
        },
      ];
      const validDto = { from: '2024-05-01', to: '2024-05-10' };
      installsService.getInstallsByDevice.mockResolvedValue(mockResponse);

      const result = await controller.getInstallsByDevices(validDto);

      expect(result).toEqual(mockResponse);
      expect(installsService.getInstallsByDevice).toHaveBeenCalledWith('2024-05-01', '2024-05-10');
    });

    it('should throw BadRequestException if any required parameter is missing', async () => {
      const invalidDto = { from: '', to: '' };

      try {
        await validationPipe.transform(invalidDto, { type: 'query', metatype: DateRangeDto });
        fail('ValidationPipe should throw an exception');
      } catch (error) {
        expect(error).toBeDefined();
        expect(installsService.getInstallsByDevice).not.toHaveBeenCalled();
      }
    });
  });

  describe('getGeoAnalysis', () => {
    it('should return geo analysis by app', async () => {
      const mockResponse = [
        {
          city: 'New York',
          installs: 2,
        },
        {
          city: 'London',
          installs: 1,
        },
      ];
      const validDto = { app_name: 'Fix San' };
      installsService.getGeoAnalysis.mockResolvedValue(mockResponse);

      const result = await controller.getGeoAnalysis(validDto);

      expect(result).toEqual(mockResponse);
      expect(installsService.getGeoAnalysis).toHaveBeenCalledWith('Fix San');
    });

    it('should throw BadRequestException if app_name is missing', async () => {
      const invalidDto = { app_name: '' };

      try {
        await validationPipe.transform(invalidDto, { type: 'query', metatype: AppNameDto });
        fail('ValidationPipe should throw an exception');
      } catch (error) {
        expect(error).toBeDefined();
        expect(installsService.getGeoAnalysis).not.toHaveBeenCalled();
      }
    });
  });

  describe('getIdfvDistribution', () => {
    it('should return idfv ditribution by app', async () => {
      const mockResponse: InstallStats = {
        total_installs: 2,
        is_lat_distribution: {
          enabled: 1,
          disabled: 1,
        },
        percentage_with_lat_enabled: 50,
      };
      const validDto = { app_name: 'Fix San' };
      installsService.getIdfvDistribution.mockResolvedValue(mockResponse);

      const result = await controller.getIdfvDistribution(validDto);

      expect(result).toEqual(mockResponse);
      expect(installsService.getIdfvDistribution).toHaveBeenCalledWith('Fix San');
    });

    it('should throw BadRequestException if app_name is missing', async () => {
      const invalidDto = { app_name: '' };

      try {
        await validationPipe.transform(invalidDto, { type: 'query', metatype: AppNameDto });
        fail('ValidationPipe should throw an exception');
      } catch (error) {
        expect(error).toBeDefined();
        expect(installsService.getIdfvDistribution).not.toHaveBeenCalled();
      }
    });
  });

  describe('getInstallsMetadata', () => {
    it('should return installs metadata', async () => {
      const mockResponse = [
        {
          idfv: '7a07bfd0-acac-4db2-bdb4-b9ae65c2148b',
          app_name: 'Kanlam',
          city: 'Cimo de Vila',
          device_model: 'Realme C3i',
          install_time: '17:19:00',
          is_lat: false,
          date: new Date('2024-04-01'),
        },
      ];
      const validDto = { from: '2024-05-01', to: '2024-05-10' };
      installsService.getMetadataByDateRange.mockResolvedValue(mockResponse);

      const result = await controller.getInstallsMetadata(validDto);

      expect(result).toEqual(mockResponse);
      expect(installsService.getMetadataByDateRange).toHaveBeenCalledWith('2024-05-01', '2024-05-10');
    });

    it('should throw BadRequestException if any required parameter is missing', async () => {
      const invalidDto = { from: '', to: '' };

      try {
        await validationPipe.transform(invalidDto, { type: 'query', metatype: DateRangeDto });
        fail('ValidationPipe should throw an exception');
      } catch (error) {
        expect(error).toBeDefined();
        expect(installsService.getMetadataByDateRange).not.toHaveBeenCalled();
      }
    });
  });
});
