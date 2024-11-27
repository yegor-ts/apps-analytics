import { InternalServerErrorException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { InstallsService } from './installs.service';
import { Installs } from './entities/installs.entity';
import { InstallsServiceInterface } from './types/installs-service.interface';

describe('InstallsService', () => {
  let service: InstallsServiceInterface;

  const mockQueryBuilder = {
    select: jest.fn().mockReturnThis(),
    addSelect: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    groupBy: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    getRawMany: jest.fn(),
    getRawOne: jest.fn(),
    getCount: jest.fn(),
  };

  const mockRepository = {
    createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: 'InstallsServiceInterface',
          useClass: InstallsService,
        },
        {
          provide: getRepositoryToken(Installs),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<InstallsServiceInterface>('InstallsServiceInterface');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAllApps', () => {
    it('should return a list of app names', async () => {
      const mockData = [{ app_name: 'Fix San' }, { app_name: 'Temp' }];

      mockQueryBuilder.getRawMany.mockResolvedValue(mockData);

      const result = await service.getAllApps();

      expect(result).toEqual(['Fix San', 'Temp']);
      expect(mockRepository.createQueryBuilder).toHaveBeenCalled();
    });

    it('should throw an InternalServerErrorException on error', async () => {
      mockQueryBuilder.getRawMany.mockRejectedValue(new Error());
      await expect(service.getAllApps()).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('getInstallsByApp', () => {
    it('should return total installs and city distribution', async () => {
      mockQueryBuilder.getCount.mockResolvedValue(100);
      mockQueryBuilder.getRawMany.mockResolvedValue([
        { city: 'New York', installs: 50 },
        { city: 'London', installs: 50 },
      ]);

      const result = await service.getInstallsByApp('Fix San');

      expect(result).toEqual({
        total_installs: 100,
        city_distribution: {
          'New York': 50,
          London: 50,
        },
      });
      expect(mockRepository.createQueryBuilder).toHaveBeenCalled();
    });

    it('should throw an InternalServerErrorException on error', async () => {
      mockQueryBuilder.getCount.mockRejectedValue(new Error());
      await expect(service.getInstallsByApp('Fix San')).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('getAppInstallsByTime', () => {
    it('should return total installs by time period', async () => {
      const mockData = [
        { period: '2024-01-01', total_installs: '10' },
        { period: '2024-01-02', total_installs: '20' },
      ];

      mockQueryBuilder.getRawMany.mockResolvedValue(mockData);

      const result = await service.getAppInstallsByTime('TestApp', '2024-01-01', '2024-01-31');

      expect(result).toEqual([
        { period: '2024-01-01', total_installs: 10 },
        { period: '2024-01-02', total_installs: 20 },
      ]);
      expect(mockRepository.createQueryBuilder).toHaveBeenCalled();
    });

    it('should throw an InternalServerErrorException on error', async () => {
      mockQueryBuilder.getRawMany.mockRejectedValue(new Error());
      await expect(service.getAppInstallsByTime('Fix San', '2024-05-01', '2024-05-02')).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('getInstallsByDevice', () => {
    it('should return installs count by device model', async () => {
      const mockData = [
        {
          device_model: 'Iphone 14',
          installs: 14,
        },
        {
          device_model: 'Google Pixel',
          installs: 10,
        },
      ];

      mockQueryBuilder.getRawMany.mockResolvedValue(mockData);

      const result = await service.getInstallsByDevice('2024-05-01', '2024-05-10');

      expect(result).toEqual([
        {
          device_model: 'Iphone 14',
          installs: 14,
        },
        {
          device_model: 'Google Pixel',
          installs: 10,
        },
      ]);
      expect(mockRepository.createQueryBuilder).toHaveBeenCalled();
    });

    it('should throw an InternalServerErrorException on error', async () => {
      mockQueryBuilder.getRawMany.mockRejectedValue(new Error());
      await expect(service.getInstallsByDevice('2024-05-01', '2024-05-10')).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('getGeoAnalysis', () => {
    it('should return installs count by city', async () => {
      const mockData = [
        {
          city: 'New York',
          installs: '2',
        },
        {
          city: 'London',
          installs: '1',
        },
      ];

      mockQueryBuilder.getRawMany.mockResolvedValue(mockData);

      const result = await service.getGeoAnalysis('Fix San');

      expect(result).toEqual([
        {
          city: 'New York',
          installs: 2,
        },
        {
          city: 'London',
          installs: 1,
        },
      ]);
      expect(mockRepository.createQueryBuilder).toHaveBeenCalled();
    });

    it('should throw an InternalServerErrorException on error', async () => {
      mockQueryBuilder.getRawMany.mockRejectedValue(new Error());
      await expect(service.getGeoAnalysis('Fix San')).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('getIdfvDistribution', () => {
    it('should return total installs, count of enabled and disabled lats with percetage of enabled lats', async () => {
      const mockCount = 2;
      const mockRawResult = {
        enabled: 1,
        disabled: 1,
      };

      mockQueryBuilder.getCount.mockResolvedValue(mockCount);
      mockQueryBuilder.getRawOne.mockResolvedValue(mockRawResult);

      const result = await service.getIdfvDistribution('Fix San');

      expect(result).toEqual({
        total_installs: 2,
        is_lat_distribution: {
          enabled: 1,
          disabled: 1,
        },
        percentage_with_lat_enabled: 50,
      });
      expect(mockRepository.createQueryBuilder).toHaveBeenCalled();
    });

    it('should throw an InternalServerErrorException on error', async () => {
      mockQueryBuilder.getRawOne.mockRejectedValue(new Error());
      await expect(service.getIdfvDistribution('Fix San')).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('getMetadataByDateRange', () => {
    it('should return installs metadata by time interval', async () => {
      const mockData = [
        {
          idfv: '7a07bfd0-acac-4db2-bdb4-b9ae65c2148b',
          app_name: 'Kanlam',
          city: 'Cimo de Vila',
          device_model: 'Realme C3i',
          install_time: '17:19:00',
          is_lat: false,
          date: '2024-04-01',
        },
      ];

      mockQueryBuilder.getRawMany.mockResolvedValue(mockData);

      const result = await service.getMetadataByDateRange('2024-05-01', '2024-05-10');

      expect(result).toEqual([
        {
          idfv: '7a07bfd0-acac-4db2-bdb4-b9ae65c2148b',
          app_name: 'Kanlam',
          city: 'Cimo de Vila',
          device_model: 'Realme C3i',
          install_time: '17:19:00',
          is_lat: false,
          date: '2024-04-01',
        },
      ]);
      expect(mockRepository.createQueryBuilder).toHaveBeenCalled();
    });

    it('should throw an InternalServerErrorException on error', async () => {
      mockQueryBuilder.getRawMany.mockRejectedValue(new Error());
      await expect(service.getMetadataByDateRange('2024-05-01', '2024-05-10')).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });
});
