import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty } from 'class-validator';

export class DateRangeDto {
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
