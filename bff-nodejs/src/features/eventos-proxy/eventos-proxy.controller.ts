import { Controller, Get, Post, Put, Delete, Param, Body, HttpCode } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { EventosProxyService } from './eventos-proxy.service';

@ApiTags('Eventos (Proxy)')
@Controller('api/eventos')
export class EventosProxyController {
  constructor(private readonly service: EventosProxyService) {}

  @Get()
  @ApiOperation({ summary: 'Lista todos os eventos (proxy → MS Catálogo)' })
  getAll() {
    return this.service.getAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Busca evento por ID (proxy → MS Catálogo)' })
  getById(@Param('id') id: string) {
    return this.service.getById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Cria evento (proxy → MS Catálogo)' })
  create(@Body() body: unknown) {
    return this.service.create(body);
  }

  @Put(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Atualiza evento (proxy → MS Catálogo)' })
  update(@Param('id') id: string, @Body() body: unknown) {
    return this.service.update(id, body);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Remove evento (proxy → MS Catálogo)' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
