import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core/constants';
import { HealthController } from './modules/healtz/healthz.controller';
import { UsdcModule } from './modules/usdc/usdc.module';
import { CustomErrorHandlerFilter } from './utils/errorHandler';

@Module({
  imports: [UsdcModule],
  controllers: [HealthController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: CustomErrorHandlerFilter,
    },
  ],
})
export class AppModule {}
