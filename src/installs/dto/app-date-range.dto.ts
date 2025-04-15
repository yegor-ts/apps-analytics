import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsString } from 'class-validator';

export class AppDateRangeDto {
  @ApiProperty({
    description: 'Name of the application',
    example: 'MyApp',
  })
  @IsNotEmpty({ message: 'App name is required' })
  @IsString({ message: 'App name must be a string' })
  app_name: string;

  @ApiProperty({
    description: 'Start date in format (YYYY-MM-DD)',
    example: '2023-01-01',
  })
  @IsNotEmpty({ message: 'From date is required' })
  @IsDateString({ strict: false }, { message: 'From date must be a valid date string in YYYY-MM-DD format' })
  from: string;

  @ApiProperty({
    description: 'End date in format (YYYY-MM-DD)',
    example: '2023-01-31',
  })
  @IsNotEmpty({ message: 'To date is required' })
  @IsDateString({ strict: false }, { message: 'To date must be a valid date string in YYYY-MM-DD format' })
  to: string;
}
