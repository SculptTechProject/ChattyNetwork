import { Module } from '@nestjs/common';
import { DbService } from './db.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import * as fs from 'fs';
import 'dotenv/config';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: true, // WYLACZYC NA PRODUKCJI!!!!!!!! //TODO
      extra: {
        ssl: {
          ca: fs.readFileSync(process.cwd() + '/certs/ca.pem').toString(),
          rejectUnauthorized: true,
        },
      },
    }),
  ],
  providers: [
    {
      provide: DataSource,
      useFactory: async () => {
        const dataSource = new DataSource({
          type: 'mysql',
          host: process.env.DB_HOST,
          port: Number(process.env.DB_PORT),
          username: process.env.DB_USER,
          password: process.env.DB_PASS,
          database: process.env.DB_NAME,
          synchronize: true,
          entities: [],
        });
        return dataSource.initialize();
      },
    },
    DbService,
  ],
  exports: [DataSource, DbService],
})
export class DbModule {}
