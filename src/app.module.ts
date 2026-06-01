import { Module } from '@nestjs/common';
import { UsdcModule } from './modules/usdc/usdc.module';

@Module({
  imports: [UsdcModule],
})
export class AppModule {}
