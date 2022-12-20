import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";
import {config} from 'dotenv';
import { DataSource } from "typeorm";
config();

export const ormConfig = (): PostgresConnectionOptions => ({
 type: 'postgres',
 host: process.env.DB_HOST,
 port: +process.env.DB_PORT,
 username: process.env.DB_USER,
 database: process.env.DB_NAME,
 password: process.env.DB_PASSWORD,
 entities: [__dirname + '../../../**/*.entity{.ts,.js}'],
 /** For reader only */
 synchronize: true,
 migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
});

const datasource: DataSource = new DataSource(ormConfig());
export default datasource;