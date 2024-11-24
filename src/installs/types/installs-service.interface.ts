import { Installs } from '../entities/installs.entity';
import { CityDistribution, InstallStats } from './installs.types';

export interface InstallsServiceInterface {
  getAllApps(): Promise<string[]>;
  getInstallsByApp(
    appName: string,
  ): Promise<{ total_installs: number; city_distribution: CityDistribution }>;
  getAppInstallsByTime(
    appName: string,
    from: string,
    to: string,
  ): Promise<{ period: string; total_installs: number }[]>;
  getInstallsByDevice(
    from: string,
    to: string,
  ): Promise<{ device_model: string; installs: number }[]>;
  getGeoAnalysis(
    appName: string,
  ): Promise<{ city: string; installs: number }[]>;
  getIdfvDistribution(appName: string): Promise<InstallStats>;
  getMetadataByDateRange(
    from: string,
    to: string,
  ): Promise<Partial<Installs>[]>;
}
