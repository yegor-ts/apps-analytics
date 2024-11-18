import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Installs } from './entities/installs.entity';
import { InstallStats, CityDistribution } from './types/installs.types';

@Injectable()
export class InstallsService {
  constructor(
    @InjectRepository(Installs)
    private readonly installsRepository: Repository<Installs>,
  ) {}

  async getAllApps(): Promise<string[]> {
    try {
      const result = await this.installsRepository
        .createQueryBuilder('installs')
        .select('DISTINCT installs.app_name', 'app_name')
        .getRawMany();

      return result.map((row) => row.app_name);
    } catch (error) {
      throw new InternalServerErrorException('Failed to process applications');
    }
  }

  async getInstallsByApp(
    appName: string,
  ): Promise<{ total_installs: number; city_distribution: CityDistribution }> {
    try {
      const totalInstalls = await this.installsRepository
        .createQueryBuilder('installs')
        .where('installs.app_name = :appName', { appName })
        .getCount();

      const cityDistributionRaw = await this.installsRepository
        .createQueryBuilder('installs')
        .select('installs.city', 'city')
        .addSelect('COUNT(*)', 'installs')
        .where('installs.app_name = :appName', { appName })
        .groupBy('installs.city')
        .orderBy('installs', 'DESC')
        .getRawMany();

      const cityDistribution: CityDistribution = {};
      cityDistributionRaw.forEach((row) => {
        cityDistribution[row.city] = row.installs;
      });

      return {
        total_installs: totalInstalls,
        city_distribution: cityDistribution,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed processing installs by app',
      );
    }
  }

  async getAppInstallsByTime(
    appName: string,
    from: string,
    to: string,
  ): Promise<{ period: string; total_installs: number }[]> {
    try {
      const result = await this.installsRepository
        .createQueryBuilder('installs')
        .select("TO_CHAR(installs.date, 'YYYY-MM-DD')", 'period')
        .addSelect('COUNT(installs.id)', 'total_installs')
        .where('installs.app_name = :appName', { appName })
        .andWhere('installs.date >= :from', { from })
        .andWhere('installs.date <= :to', { to })
        .groupBy('period')
        .orderBy('period', 'ASC')
        .getRawMany();

      return result.map((row) => ({
        period: row.period,
        total_installs: parseInt(row.total_installs, 10),
      }));
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to fetch application installs by time',
      );
    }
  }

  async getInstallsByDevice(
    from: string,
    to: string,
  ): Promise<{ device_model: string; installs: number }[]> {
    try {
      const result = await this.installsRepository
        .createQueryBuilder('installs')
        .select('installs.device_model', 'device_model')
        .addSelect('COUNT(installs.id)', 'installs')
        .where('installs.date >= :from', { from })
        .andWhere('installs.date <= :to', { to })
        .groupBy('device_model')
        .orderBy('installs', 'DESC')
        .getRawMany();

      return result.map((row) => ({
        device_model: row.device_model,
        installs: row.installs,
      }));
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to fetch installs by device',
      );
    }
  }

  async getGeoAnalysis(
    appName: string,
  ): Promise<{ city: string; installs: number }[]> {
    try {
      const result = await this.installsRepository
        .createQueryBuilder('installs')
        .select('installs.city', 'city')
        .addSelect('COUNT(*)', 'installs')
        .groupBy('installs.city')
        .where('installs.app_name = :appName', { appName })
        .orderBy('installs', 'DESC')
        .getRawMany();

      return result.map((row) => ({
        city: row.city,
        installs: parseInt(row.installs, 10),
      }));
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to process geographic analysis data',
      );
    }
  }

  async getIdfvDistribution(appName: string): Promise<InstallStats> {
    try {
      const result = this.installsRepository
        .createQueryBuilder('installs')
        .where('installs.app_name = :appName', { appName });

      const totalInstalls = await result.getCount();

      const isLatDistribution = await result
        .select([
          `SUM(CASE WHEN installs.is_lat = true THEN 1 ELSE 0 END) AS enabled`,
          `SUM(CASE WHEN installs.is_lat = false THEN 1 ELSE 0 END) AS disabled`,
        ])
        .getRawOne();

      const percentageWithLatEnabled = totalInstalls
        ? Math.round((isLatDistribution.enabled / totalInstalls) * 100)
        : 0;

      return {
        total_installs: totalInstalls,
        is_lat_distribution: {
          enabled: Number(isLatDistribution.enabled) || 0,
          disabled: Number(isLatDistribution.disabled) || 0,
        },
        percentage_with_lat_enabled: percentageWithLatEnabled,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to fetch idfv distribution data',
      );
    }
  }

  async getMetadataByDateRange(
    from: string,
    to: string,
  ): Promise<Partial<Installs>[]> {
    try {
      return await this.installsRepository
        .createQueryBuilder('installs')
        .select('installs.idfv', 'idfv')
        .addSelect('installs.app_name', 'app_name')
        .addSelect('installs.city', 'city')
        .addSelect('installs.device_model', 'device_model')
        .addSelect('installs.install_time', 'install_time')
        .addSelect("TO_CHAR(installs.date, 'YYYY-MM-DD')", 'date')
        .addSelect('installs.is_lat', 'is_lat')
        .where('installs.date BETWEEN :from AND :to', { from, to })
        .orderBy('installs.date', 'ASC')
        .getRawMany();
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to fetch installs metadata',
      );
    }
  }
}
