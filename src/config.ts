import * as z from 'zod';

export const envSchema = z.object({
  host: z.string().default('localhost'),
  port: z.coerce.number().default(4000),
  redis: z.object({
    host: z.string().default('localhost'),
    port: z.coerce.number().default(6379),
    password: z.string().optional(),
    db: z.number().default(0),
  }),
  api: z.object({
    alchemy: z.object({
      url: z.string(),
    }),
  }),
  usdc: z.object({
    contractAddress: z
      .string()
      .startsWith('0x')
      .length(42)
      .default('0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'),
  }),
});

export const config = envSchema.parse({
  host: process.env.APP_HOST,
  port: process.env.PORT,
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD,
    db: process.env.REDIS_DB,
  },
  api: {
    alchemy: {
      url: process.env.RPC_URL,
    },
  },
  usdc: {
    contractAddress: process.env.USDC_ADDRESS,
  },
});

export type Config = z.infer<typeof envSchema>;
