import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Installs } from 'src/installs/entities/installs.entity';
import * as csv from 'csv-parser';

@Injectable()
export class AppsflyerService {
  private readonly apiToken = this.configService.get('API_TOKEN');
  private readonly baseUrl = this.configService.get('API_URL');
  private readonly logger = new Logger(AppsflyerService.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    @InjectRepository(Installs)
    private readonly installsRepository: Repository<Installs>,
  ) {}

  @Cron(CronExpression.EVERY_30_SECONDS)
  async fetchData() {
    const BATCH_SIZE = 100;

    const requestUrl = `${this.baseUrl}key=${this.apiToken}`;
    let batch: Partial<Installs>[] = [];

    try {
      this.logger.log('Starting fetch and save process...');

      const response = await this.httpService.axiosRef.get(requestUrl, {
        responseType: 'stream',
      });

      const csvStream = response.data
        .pipe(csv())
        .on('data', async (row) => {
          batch.push(row);

          if (batch.length === BATCH_SIZE) {
            csvStream.pause();
            try {
              await this.installsRepository.save(batch);
              batch = [];
            } catch (error) {
              throw new HttpException(
                error.message,
                HttpStatus.INTERNAL_SERVER_ERROR,
              );
            } finally {
              csvStream.resume();
            }
          }
        })
        .on('end', async () => {
          try {
            if (batch.length > 0 && batch.length !== BATCH_SIZE) {
              await this.installsRepository.save(batch);
            }
            this.logger.log('Successfully fetched and saved to the database');
          } catch (error) {
            throw new HttpException(
              error.message,
              HttpStatus.INTERNAL_SERVER_ERROR,
            );
          }
        })
        .on('error', (error) => {
          throw new HttpException(
            error.message,
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_GATEWAY);
    }
  }
}
