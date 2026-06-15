import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class EventosProxyService {
  private readonly baseUrl = process.env.MS_EVENTOS_URL || 'http://localhost:5001';

  getAll() {
    return axios.get(`${this.baseUrl}/api/eventos`).then(r => r.data);
  }

  getById(id: string) {
    return axios.get(`${this.baseUrl}/api/eventos/${id}`).then(r => r.data);
  }

  create(body: unknown) {
    return axios.post(`${this.baseUrl}/api/eventos`, body).then(r => r.data);
  }

  update(id: string, body: unknown) {
    return axios.put(`${this.baseUrl}/api/eventos/${id}`, body).then(r => r.data);
  }

  remove(id: string) {
    return axios.delete(`${this.baseUrl}/api/eventos/${id}`).then(r => r.data);
  }
}
