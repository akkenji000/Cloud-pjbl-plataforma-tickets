import { Module } from '@nestjs/common';
import { EventosProxyController } from './eventos-proxy.controller';
import { EventosProxyService } from './eventos-proxy.service';

@Module({
  controllers: [EventosProxyController],
  providers: [EventosProxyService],
})
export class EventosProxyModule {}
