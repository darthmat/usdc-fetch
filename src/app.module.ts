import { Module } from '@nestjs/common';
import { UsdcModule } from './modules/usdc/usdc.module';
import { HealthController } from './modules/healtz/healthz.controller';

@Module({
  imports: [UsdcModule],
  controllers: [HealthController],
})
export class AppModule {}
