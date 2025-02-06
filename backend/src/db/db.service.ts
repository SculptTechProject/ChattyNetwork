import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class DbService {
  constructor(private readonly dataSource: DataSource) {}

  // eslint-disable-next-line @typescript-eslint/require-await
  async getConnection() {
    return this.dataSource;
  }
}
