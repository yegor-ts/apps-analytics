export interface LatDistribution {
  enabled: number;
  disabled: number;
}

export interface InstallStats {
  total_installs: number;
  is_lat_distribution: LatDistribution;
  percentage_with_lat_enabled: number;
}
