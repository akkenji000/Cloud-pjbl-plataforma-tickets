import { Module } from '@nestjs/common';
import { AggregatedDataModule } from './features/aggregated-data/aggregated-data.module';
import { EventosProxyModule } from './features/eventos-proxy/eventos-proxy.module';
import { PedidosProxyModule } from './features/pedidos-proxy/pedidos-proxy.module';

@Module({
  imports: [AggregatedDataModule, EventosProxyModule, PedidosProxyModule],
})
export class AppModule {}
