import { PublicClient } from 'viem';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ViemBlockchainService } from './viem-blockchain.service';

describe('ViemBlockchainService', () => {
  let service: ViemBlockchainService;

  const mockGetLogs = vi.fn();

  const contractAddress = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48';

  beforeEach(() => {
    const mockClient: Partial<PublicClient> = {
      getLogs: mockGetLogs,
    };

    service = new ViemBlockchainService(
      mockClient as PublicClient,
      contractAddress,
    );
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('getUsdcTransfers', () => {
    it('should call getLogs with correct parameters', async () => {
      const blockNumber = BigInt(18000000);
      mockGetLogs.mockResolvedValue([]);

      await service.getUsdcTransfers(blockNumber);

      expect(mockGetLogs).toHaveBeenCalledWith({
        address: contractAddress,
        event: expect.anything(),
        fromBlock: blockNumber,
        toBlock: blockNumber,
      });
    });

    it('should fetch logs from viem and correctly map to business objects', async () => {
      const blockNumber = BigInt(18000000);

      mockGetLogs.mockResolvedValue([
        {
          args: {
            from: '0x1111111111111111111111111111111111111111',
            to: '0x2222222222222222222222222222222222222222',
            value: BigInt(1000000),
          },
          transactionHash: '0xabc123',
        },
      ]);

      const result = await service.getUsdcTransfers(blockNumber);

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        from: '0x1111111111111111111111111111111111111111',
        to: '0x2222222222222222222222222222222222222222',
        value: '1',
        transactionHash: '0xabc123',
      });
    });

    it('should format values with correct USDC decimal precision (6 decimals)', async () => {
      const blockNumber = BigInt(18000000);
      mockGetLogs.mockResolvedValue([
        {
          args: {
            from: '0x1111111111111111111111111111111111111111',
            to: '0x2222222222222222222222222222222222222222',
            value: BigInt(123456789),
          },
          transactionHash: '0xabc123',
        },
        {
          args: {
            from: '0x1111111111111111111111111111111111111111',
            to: '0x2222222222222222222222222222222222222222',
            value: BigInt(1),
          },
          transactionHash: '0xabc124',
        },
      ]);

      const result = await service.getUsdcTransfers(blockNumber);

      expect(result[0]!.value).toBe('123.456789');
      expect(result[1]!.value).toBe('0.000001');
    });

    it('should return an empty array when no logs are found', async () => {
      mockGetLogs.mockResolvedValue([]);

      const result = await service.getUsdcTransfers(BigInt(18000000));

      expect(result).toEqual([]);
    });

    it('should rethrow error when public client fails', async () => {
      mockGetLogs.mockRejectedValue(new Error('RPC Timeout'));

      await expect(service.getUsdcTransfers(BigInt(18000000))).rejects.toThrow(
        'RPC Timeout',
      );
    });
  });
});
