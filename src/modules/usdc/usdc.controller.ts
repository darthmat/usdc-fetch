import { Controller, Get, Param } from '@nestjs/common';
import { UsdcService } from './usdc.service';
import { GetBlockTransfersDto } from './usdc.dto';

@Controller('usdc')
export class UsdcController {
  constructor(private readonly usdcService: UsdcService) {}

  @Get('transfers/:blockNumber')
  async getTransfers(@Param() params: GetBlockTransfersDto) {
    return await this.usdcService.getBlockTransfers(BigInt(params.blockNumber));
  }
}
