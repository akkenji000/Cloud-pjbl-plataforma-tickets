import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class AggregatedDataService {
  private readonly eventosUrl = process.env.MS_EVENTOS_URL || 'http://localhost:5001';
  private readonly pedidosUrl = process.env.MS_PEDIDOS_URL || 'http://localhost:5002';
  private readonly functionUrl = process.env.AZURE_FUNCTION_URL || 'https://pjbl-taxas-function-dhbcg8bjhtbafya5.canadacentral-01.azurewebsites.net';

  async getAggregatedData(userId: string) {
    const [eventosResult, pedidosResult, taxaResult] = await Promise.allSettled([
      axios.get(`${this.eventosUrl}/api/eventos`),
      axios.get(`${this.pedidosUrl}/api/pedidos`),
      axios.get(`${this.functionUrl}/api/calcular-taxa?userId=${userId}&preco=450`),
    ]);

    return {
      usuarioId: userId,
      taxaConvenienciaAtual: taxaResult.status === 'fulfilled'
        ? taxaResult.value.data
        : { percentualAplicado: 10.5, mensagem: 'Taxa padrão (fallback)', origem: 'Azure Function (Fallback)' },
      eventosEmDestaque: eventosResult.status === 'fulfilled' ? eventosResult.value.data : [],
      meusUltimosPedidos: pedidosResult.status === 'fulfilled' ? pedidosResult.value.data : [],
    };
  }
}
