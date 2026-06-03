import { FakeBlockchainService } from '@/modules/blockchain/blockchain.fake';
import {
  IBlockchain,
  UsdcTransfer,
} from '@/modules/blockchain/blockchain.interface';
import { CustomErrorHandlerFilter } from '@/utils/errorHandler';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { afterEach, beforeEach, describe, it, vi } from 'vitest';
import { UsdcController } from '../usdc.controller';
import { UsdcService } from '../usdc.service';

describe('UsdcController', () => {
  let app: INestApplication;
  let fakeBlockchain: FakeBlockchainService;

  beforeEach(async () => {
    fakeBlockchain = new FakeBlockchainService();

    const module = await Test.createTestingModule({
      controllers: [UsdcController],
      providers: [
        UsdcService,
        {
          provide: IBlockchain,
          useValue: fakeBlockchain,
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
        transformOptions: { enableImplicitConversion: true },
      }),
    );
    await app.init();
  });

  afterEach(async () => {
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

      fakeBlockchain.setTransfers(BigInt(18000000), mockTransfers);

      await request(app.getHttpServer())
        .get('/usdc/transfers/18000000')
        .expect(200)
        .expect(mockTransfers);
    });

    it('should return 200 when no transfers found', async () => {
      fakeBlockchain.setTransfers(BigInt(18000000), []);

      await request(app.getHttpServer())
        .get('/usdc/transfers/18000000')
        .expect(200)
        .expect([]);
    });

    it('should return 502 when RPC fails', async () => {
      fakeBlockchain.setError(new Error('RPC error'));

      await request(app.getHttpServer())
        .get('/usdc/transfers/18000000')
        .expect(502);
    });

    it('should return 400 for non-numeric block number', async () => {
      await request(app.getHttpServer()).get('/usdc/transfers/abc').expect(400);
    });
  });
});
