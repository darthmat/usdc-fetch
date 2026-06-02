import { FakeBlockchainService } from '@/modules/blockchain/blockchain.fake';
import { UsdcTransfer } from '@/modules/blockchain/blockchain.interface';
import { RpcError } from '@/utils/errors';
import { beforeEach, describe, expect, it } from 'vitest';
import { UsdcService } from '../usdc.service';

describe('UsdcService', () => {
  let service: UsdcService;
  let fakeBlockchain: FakeBlockchainService;

  beforeEach(() => {
    fakeBlockchain = new FakeBlockchainService();
    service = new UsdcService(fakeBlockchain);
  });

  describe('getBlockTransfers', () => {
    it('should return USDC transfers when blockchain service returns data', async () => {
      const mockTransfers: UsdcTransfer[] = [
        {
          from: '0x1111111111111111111111111111111111111111',
          to: '0x2222222222222222222222222222222222222222',
          value: '100',
          transactionHash: '0xabc123',
        },
        {
          from: '0x3333333333333333333333333333333333333333',
          to: '0x4444444444444444444444444444444444444444',
          value: '50',
          transactionHash: '0xdef456',
        },
      ];

      fakeBlockchain.setTransfers(BigInt(18000000), mockTransfers);

      const result = await service.getBlockTransfers(BigInt(18000000));

      expect(result).toEqual(mockTransfers);
      expect(result).toHaveLength(2);
    });

    it('should return empty array when no transfers found', async () => {
      const result = await service.getBlockTransfers(BigInt(18000000));
      expect(result).toEqual([]);
    });

    it('should throw RpcError when blockchain service fails', async () => {
      const originalError = new Error('Network error from RPC');
      fakeBlockchain.setError(originalError);

      await expect(service.getBlockTransfers(BigInt(18000000))).rejects.toThrow(
        RpcError,
      );
    });

    it('should return multiple transfers without modification', async () => {
      const blockNumber = BigInt(18000000);
      const mockTransfers: UsdcTransfer[] = Array.from(
        { length: 5 },
        (_, i) => ({
          from: `0x${String(i + 1).padStart(40, '0')}`,
          to: `0x${String(i + 100).padStart(40, '0')}`,
          value: String((i + 1) * 10),
          transactionHash: `0xtx${i}`,
        }),
      );

      fakeBlockchain.setTransfers(blockNumber, mockTransfers);

      const result = await service.getBlockTransfers(blockNumber);

      expect(result).toHaveLength(5);
      expect(result).toEqual(mockTransfers);
    });

    it('should preserve transfer data structure', async () => {
      const blockNumber = BigInt(18000000);
      const mockTransfer: UsdcTransfer = {
        from: '0x1234567890abcdef1234567890abcdef12345678',
        to: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
        value: '123.456789',
        transactionHash: '0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef',
      };

      fakeBlockchain.setTransfers(blockNumber, [mockTransfer]);

      const result = await service.getBlockTransfers(blockNumber);

      expect(result[0]).toEqual(mockTransfer);
    });
  });
});
