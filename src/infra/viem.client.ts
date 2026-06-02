import { createPublicClient, http, PublicClient } from 'viem';
import { mainnet } from 'viem/chains';
import { Config } from '@/config';

export function createViemClientAdapter(config: Config): PublicClient {
  return createPublicClient({
    chain: mainnet,
    transport: http(config.api.alchemy.url),
  });
}
