import { Module } from '@nestjs/common';
import { UsdcModule } from './modules/usdc/usdc.module';
import { HealthController } from './modules/healtz/healthz.controller';
import { CustomErrorHandlerFilter } from './utils/errorHandler';
import { APP_FILTER } from '@nestjs/core/constants';

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
