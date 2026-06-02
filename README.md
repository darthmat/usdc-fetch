# usdc-transfers

A NestJS service that exposes a single endpoint for querying all USDC transfer events that occurred in a given Ethereum block. Built on **Fastify** with **Viem** for blockchain access and **Redis** for block-level caching.

---

## Prerequisites

- [Docker](https://www.docker.com/) & Docker Compose
- [pnpm](https://pnpm.io/)
- Redis

---

## Getting Started

**Step 1.** Copy the config file and fill in your credentials:

```bash
cp .env.example .env
```

**Step 2.** Run via Docker (easiest):

```bash
docker compose up --build
```

Or locally, without containers:

```bash
pnpm install
pnpm start:dev
```

---

## API Endpoints

| Method | Path                           | Description                                   |
| ------ | ------------------------------ | --------------------------------------------- |
| `GET`  | `/api/healthz`                 | Health check                                  |
| `GET`  | `/usdc/transfers/:blockNumber` | Returns all USDC transfers in the given block |

### Example Response

```json
[
  {
    "from": "0x1111111111111111111111111111111111111111",
    "to": "0x2222222222222222222222222222222222222222",
    "value": "123.456789",
    "transactionHash": "0xabc123..."
  }
]
```

---

## Architecture — Why These Decisions?

### Blockchain Abstraction (`IBlockchain`)

The service layer never touches Viem directly. It talks to `IBlockchain` — an abstract class used as a NestJS DI token. This means the blockchain provider can be swapped or mocked without touching business logic. Tests inject a `FakeBlockchainService` instead of a real RPC client.

### Decorator-Based Caching

Rather than mixing cache logic into the blockchain service, `ViemBlockchainServiceCached` wraps `ViemBlockchainService` as a decorator. The core service stays clean and focused on fetching logs, while all Redis concerns live in one place. Ethereum blocks are immutable — once a block is confirmed, its transfers never change — so results are cached with a 1-year TTL.

### Viem over ethers.js

Viem is used for querying the Ethereum RPC. It provides typed ABI parsing, structured log decoding, and a smaller bundle footprint compared to ethers.js.

### Custom Error Handling

Domain errors (`EntityNotFoundError`, `RpcError`, `UnavailableServiceError`) are plain classes with no NestJS coupling. `CustomErrorHandlerFilter` maps them to HTTP responses in one place. Controllers stay clean — no try/catch, no `HttpException` imports.

### Environment Validation at Startup

All environment variables are parsed and validated by Zod before the application boots. If a required variable is missing or malformed, the process exits immediately with a clear error — rather than failing silently at runtime.

---

## Tests

The project covers three layers:

- **Unit tests** for `ViemBlockchainService` — verifies log fetching, decimal formatting, and RPC error propagation using a Viem client mock
- **Unit tests** for `UsdcService` — verifies business logic using `FakeBlockchainService` instead of mocks
- **E2E tests** for `UsdcController` — verifies HTTP wiring, validation, and error mapping using Supertest against a real NestJS application with `IBlockchain` overridden

```bash
pnpm test
```
