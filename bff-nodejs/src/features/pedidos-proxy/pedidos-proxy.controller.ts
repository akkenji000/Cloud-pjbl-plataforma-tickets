import { Controller, Get, Post, Put, Delete, Param, Body, ParseIntPipe, HttpCode } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { PedidosProxyService } from './pedidos-proxy.service';

@ApiTags('Pedidos (Proxy)')
@Controller('api/pedidos')
export class PedidosProxyController {
  constructor(private readonly service: PedidosProxyService) {}

  @Get()
  @ApiOperation({ summary: 'Lista todos os pedidos (proxy → MS Pedidos)' })
  getAll() {
    return this.service.getAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Busca pedido por ID (proxy → MS Pedidos)' })
  getById(@Param('id', ParseIntPipe) id: number) {
    return this.service.getById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Cria pedido (proxy → MS Pedidos)' })
  create(@Body() body: unknown) {
    return this.service.create(body);
  }

  @Put(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Atualiza pedido (proxy → MS Pedidos)' })
  update(@Param('id', ParseIntPipe) id: number, @Body() body: unknown) {
    return this.service.update(id, body);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Remove pedido (proxy → MS Pedidos)' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
