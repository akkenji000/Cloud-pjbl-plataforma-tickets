# Microfrontend — Plataforma de Tickets

SPA (Single Page Application) da Plataforma de Tickets. Dashboard que exibe eventos em destaque, histórico de pedidos e taxa de conveniência calculada dinamicamente.

## Arquitetura

Implementa o padrão **Microfrontend** como SPA independente e deployável:

```
src/
├── App.tsx        # Dashboard principal — consome exclusivamente o BFF
├── main.tsx       # Entry point React
└── assets/
```

**Regra fundamental:** o frontend **nunca acessa microsserviços diretamente**. Toda comunicação passa pelo BFF via `GET /api/aggregated-data`.

Em modo Docker, as chamadas `/api/` passam pelo **API Gateway** antes de chegar ao BFF:
```
Browser → Frontend nginx (:5173) → API Gateway (:8080) → BFF (:3000)
```

## Tecnologias

- **Framework:** React 18 + TypeScript
- **Build:** Vite
- **HTTP Client:** Axios
- **Servidor (produção/Docker):** nginx
- **Container:** Docker (multi-stage: Vite build → nginx serve)

## Como rodar localmente

### Com Docker Compose (recomendado — sobe stack completa)

Na raiz do monorepo:
```bash
docker-compose up --build
```

Acesse: `http://localhost:5173`

### Modo desenvolvimento (sem Docker)

Requer BFF rodando em `localhost:3000`:
```bash
cd frontend-spa
npm install
npm run dev
```

O Vite proxy redireciona `/api/` automaticamente para `http://localhost:3000`.

## O que o Dashboard exibe

- **Taxa de Conveniência** — calculada pela Azure Function (padrão 10.5%, VIP 5%)
- **Eventos em Destaque** — lista do MS Catálogo de Eventos (MongoDB)
- **Histórico de Pedidos** — lista do MS Pedidos (SQL Server)

## Alunos

- Arthur Kenji Kussaba
- Frederico Salvatti Cavalcante
- Eduardo Antonio Babinski Pedroso
