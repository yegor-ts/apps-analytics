import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AppNameDto {
  @ApiProperty({
    description: 'Name of the application',
    example: 'MyApp',
  })
  @IsNotEmpty({ message: 'App name is required' })
  @IsString({ message: 'App name must be a string' })
  app_name: string;
}
