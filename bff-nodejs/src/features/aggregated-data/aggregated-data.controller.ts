import { Controller, Get, Headers } from '@nestjs/common';
import { ApiOperation, ApiTags, ApiHeader } from '@nestjs/swagger';
import { AggregatedDataService } from './aggregated-data.service';

@ApiTags('Agregação')
@Controller('api')
export class AggregatedDataController {
  constructor(private readonly service: AggregatedDataService) {}

  @Get('aggregated-data')
  @ApiOperation({ summary: 'Retorna todos os dados consolidados para o Dashboard' })
  @ApiHeader({ name: 'x-user-id', required: false, description: 'ID do usuário logado' })
  async getAggregatedData(@Headers('x-user-id') userId: string) {
    return this.service.getAggregatedData(userId || 'user-default');
  }
}
