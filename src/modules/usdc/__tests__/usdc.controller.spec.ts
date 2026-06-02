import {
  IBlockchain,
  UsdcTransfer,
} from '@/infra/blockchain/blockchain.interface';
import { CustomErrorHandlerFilter } from '@/utils/errorHandler';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { afterEach, beforeEach, describe, it, vi } from 'vitest';
import { UsdcController } from '../usdc.controller';
import { UsdcService } from '../usdc.service';

describe('UsdcController (e2e)', () => {
  let app: INestApplication;
  const mockGetUsdcTransfers = vi.fn();

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [UsdcController],
      providers: [
        UsdcService,
        {
          provide: IBlockchain,
          useValue: { getUsdcTransfers: mockGetUsdcTransfers },
        },
        {
          provide: APP_FILTER,
          useClass: CustomErrorHandlerFilter,
        },
      ],
    }).compile();

    app = module.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
      }),
    );
    await app.init();
  });

  afterEach(async () => {
    vi.clearAllMocks();
    await app.close();
  });

  describe('GET /usdc/transfers/:blockNumber', () => {
    it('should return 200 with transfers', async () => {
      const mockTransfers: UsdcTransfer[] = [
        {
          from: '0x1111111111111111111111111111111111111111',
          to: '0x2222222222222222222222222222222222222222',
          value: '1',
          transactionHash: '0xabc123',
        },
      ];

      mockGetUsdcTransfers.mockResolvedValue(mockTransfers);

      await request(app.getHttpServer())
        .get('/usdc/transfers/18000000')
        .expect(200)
        .expect(mockTransfers);
    });

    it('should return 200 when no transfers found', async () => {
      mockGetUsdcTransfers.mockResolvedValue([]);

      await request(app.getHttpServer())
        .get('/usdc/transfers/18000000')
        .expect(200)
        .expect([]);
    });

    it('should return 502 when RPC fails', async () => {
      mockGetUsdcTransfers.mockRejectedValue(new Error('RPC error'));

      await request(app.getHttpServer())
        .get('/usdc/transfers/18000000')
        .expect(502);
    });

    it('should return 400 for non-numeric block number', async () => {
      await request(app.getHttpServer()).get('/usdc/transfers/abc').expect(400);
    });
  });
});
