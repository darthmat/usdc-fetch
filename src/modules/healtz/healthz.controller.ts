import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';

@Controller('healthz')
export class HealthController {
  @Get()
  @HttpCode(HttpStatus.OK)
  check() {
    return { status: 'OK', timestamp: new Date().toISOString() };
  }
}
