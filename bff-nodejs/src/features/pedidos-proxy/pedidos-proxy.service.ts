import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class PedidosProxyService {
  private readonly baseUrl = process.env.MS_PEDIDOS_URL || 'http://localhost:5002';

  getAll() {
    return axios.get(`${this.baseUrl}/api/pedidos`).then(r => r.data);
  }

  getById(id: number) {
    return axios.get(`${this.baseUrl}/api/pedidos/${id}`).then(r => r.data);
  }

  create(body: unknown) {
    return axios.post(`${this.baseUrl}/api/pedidos`, body).then(r => r.data);
  }

  update(id: number, body: unknown) {
    return axios.put(`${this.baseUrl}/api/pedidos/${id}`, body).then(r => r.data);
  }

  remove(id: number) {
    return axios.delete(`${this.baseUrl}/api/pedidos/${id}`).then(r => r.data);
  }
}
