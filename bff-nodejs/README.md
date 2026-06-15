# BFF — Backend for Frontend

Camada de agregação da Plataforma de Tickets. Único ponto de contato entre o Microfrontend e os microsserviços internos.

## Arquitetura

Implementa o padrão **BFF (Backend for Frontend)** com **Vertical Slice** em NestJS:

```
src/
├── features/
│   ├── aggregated-data/     # GET /api/aggregated-data — agregação paralela
│   ├── eventos-proxy/       # CRUD /api/eventos — proxy para MS Catálogo
│   └── pedidos-proxy/       # CRUD /api/pedidos — proxy para MS Pedidos
└── app.module.ts
```

**Responsabilidades:**
- **Agregação:** `GET /api/aggregated-data` chama MS Catálogo, MS Pedidos e Azure Function em paralelo via `Promise.allSettled()`, com fallback em caso de falha individual.
- **Proxy CRUD:** repassa operações de escrita/leitura isoladas para cada microsserviço.

## Tecnologias

- **Runtime:** Node.js 20
- **Framework:** NestJS 11
- **HTTP Client:** Axios
- **Documentação:** Swagger / OpenAPI (`@nestjs/swagger`)
- **Container:** Docker (multi-stage build, node:20-alpine)

## Como rodar localmente

### Com Docker Compose (recomendado)

Na raiz do monorepo:
```bash
docker-compose up --build bff-nodejs ms-catalogo-eventos ms-pedidos azure-function
```

- API: `http://localhost:3000`
- Swagger: `http://localhost:3000/api/docs`

### Sem Docker

```bash
cd bff-nodejs
npm install

export MS_EVENTOS_URL=http://localhost:5001
export MS_PEDIDOS_URL=http://localhost:5002
export AZURE_FUNCTION_URL=http://localhost:7071

npm run start:dev
```

## Endpoints principais

| Método | Rota | Descrição |
|---|---|---|
| GET | /api/aggregated-data | Dados agregados de todos os serviços |
| GET/POST/PUT/DELETE | /api/eventos | Proxy CRUD → MS Catálogo de Eventos |
| GET/POST/PUT/DELETE | /api/pedidos | Proxy CRUD → MS Pedidos |

## Alunos

- Arthur Kenji Kussaba
- Frederico Salvatti Cavalcante
- Eduardo Antonio Babinski Pedroso
