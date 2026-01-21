import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join } from 'path';
import { User } from '../domain/user.entity';
import { MapState } from 'src/domain/map-state.entity';
import { ForestData } from 'src/domain/forest-data.entity';
import { AdminBoundary } from 'src/domain/admin-boundary.entity';

require('dotenv').config();

class ConfigService {
  constructor(private env: { [k: string]: string | undefined }) {}

  private getValue(key: string, throwOnMissing = true): string {
    const value = this.env[key];
    if (!value) {
      if (throwOnMissing){
      throw new Error(`config error - missing env.${key}`);
    }
    return '';
  }
    return value;
  }

  public ensureValues(keys: string[]) {
    keys.forEach((k) => this.getValue(k, true));
    return this;
  }

  public getPort() {
    return this.getValue('PORT', true);
  }

  public isProduction() {
    const mode = this.getValue('MODE', false);
    return mode != 'DEV';
  }

  public getTypeOrmConfig(): TypeOrmModuleOptions {
  const config = {
    type: 'postgres'as const,
    host: this.getValue('POSTGRES_HOST'),
    port: parseInt(this.getValue('POSTGRES_PORT')),
    username: this.getValue('POSTGRES_USER'),
    password: this.getValue('POSTGRES_PASSWORD'),
    database: this.getValue('POSTGRES_DATABASE'),
    entities: [User,MapState,ForestData,AdminBoundary, join(__dirname, '**', '*.entity.{ts,js}')],
    migrationsTableName: 'migration',
    synchronize: false,
    migrations: ['src/migration/*.ts'],
    ssl: this.isProduction(),
  };

  // DEBUG: Log what we're actually sending to TypeORM
  console.log('=== TYPEORM CONFIG ===');
  console.log('host:', config.host);
  console.log('port:', config.port);
  console.log('username:', config.username);
  console.log('password:', config.password);
  console.log('database:', config.database);
  console.log('======================');

  return config;
  }
}

const configService = new ConfigService(process.env).ensureValues([
  'POSTGRES_HOST',
  'POSTGRES_PORT',
  'POSTGRES_USER',
  'POSTGRES_PASSWORD',
  'POSTGRES_DATABASE',
]);

export { configService };
