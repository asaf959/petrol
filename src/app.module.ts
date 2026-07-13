import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { VehiclesModule } from './vehicles/vehicles.module';
import { StationsModule } from './stations/stations.module';
import { FuelRecordsModule } from './fuel-records/fuel-records.module';
import { ProfitsModule } from './profits/profits.module';
import { PersonalExpensesModule } from './personal-expenses/personal-expenses.module';
import { PartnerExpensesModule } from './partner-expenses/partner-expenses.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 5432),
        username: configService.get('DB_USER', 'postgres'),
        password: configService.get('DB_PASS', 'postgres'),
        database: configService.get('DB_NAME', 'petrol_db'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true,
        logging: configService.get('NODE_ENV') === 'development',
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    VehiclesModule,
    StationsModule,
    FuelRecordsModule,
    ProfitsModule,
    PersonalExpensesModule,
    PartnerExpensesModule,
  ],
})
export class AppModule {}
