# Plataforma de Venda de Tickets — PJBL

Aplicação distribuída de gerenciamento e venda de ingressos para eventos, construída com microsserviços, BFF, microfrontend e funções serverless na nuvem.

## Equipe

- Arthur Kenji Kussaba
- Frederico Salvatti Cavalcante
- Eduardo Antonio Babinski Pedroso

---

## Arquitetura

O sistema segue uma arquitetura de **Microsserviços com Persistência Poliglota**, orquestrada por um **BFF (Backend for Frontend)** e exposta via **API Gateway**.

```
Browser
  └── Frontend SPA (React :5173)
        └── API Gateway (nginx :8080)
              └── BFF NestJS (:3000)
                    ├── MS Catálogo de Eventos (C# :5001) → MongoDB Atlas
                    ├── MS Pedidos (C# :5002)             → Azure SQL
                    └── Azure Function (HTTP Trigger)      → Azure (Canada Central)
```

### Padrões Aplicados

| Padrão | Onde se aplica |
|---|---|
| Clean Architecture | MS Catálogo e MS Pedidos (Domain → Application → Infrastructure → API) |
| Vertical Slice | Features isoladas por diretório (`CreateEvento`, `GetPedido`, etc.) |
| BFF | NestJS agrega dados dos 3 serviços em um único response |
| API Gateway | nginx centraliza entrada e roteia para o BFF |
| Microfrontend | SPA React deployável independentemente |
| Serverless | Azure Function calcula taxa de conveniência por usuário |
| Database per Service | MongoDB para eventos, Azure SQL para pedidos |
| EDA (orientação futura) | Azure Function pronta para triggers de fila (Service Bus) |

---

## Stack Tecnológica

| Componente | Tecnologia | Porta |
|---|---|---|
| Frontend (SPA) | React 18 + Vite + TypeScript | 5173 |
| API Gateway | nginx | 8080 |
| BFF | NestJS 11 + Node.js 20 | 3000 |
| MS Catálogo de Eventos | ASP.NET Core 10 (C#) | 5001 |
| MS Pedidos | ASP.NET Core 10 (C#) | 5002 |
| Azure Function | .NET 8 Isolated Worker | Azure |
| Banco de Eventos | MongoDB Atlas | Atlas Cloud |
| Banco de Pedidos | Azure SQL Database | Azure Cloud |

---

## Estrutura do Monorepo

```
pjbl-plataforma-tickets/
├── docker-compose.yml          # Orquestração dos serviços
├── .env.example                # Variáveis de ambiente necessárias
├── api-gateway/                # nginx — API Gateway
├── frontend-spa/               # Microfrontend React
├── bff-nodejs/                 # BFF NestJS
├── ms-catalogo-eventos/        # Microsserviço 1 — C# + MongoDB
├── ms-pedidos/                 # Microsserviço 2 — C# + Azure SQL
├── azure-function/             # Azure Function — Cálculo de Taxas
└── docs/
    ├── arc42/                  # Documentação Arc42 (11 seções)
    └── architecture-canvas.md  # Software Architecture Canvas
```

---

## Como Rodar

### Pré-requisitos

- Docker Desktop instalado e rodando
- Conta no MongoDB Atlas (cluster M0 gratuito)
- Banco Azure SQL criado (Basic tier)

### Configuração

```bash
cp .env.example .env
# Edite o .env com suas credenciais reais
```

### Subir todos os serviços

```bash
docker-compose up --build
```

### Acessar

| Serviço | URL |
|---|---|
| Frontend | http://localhost:5173 |
| API Gateway | http://localhost:8080 |
| BFF | http://localhost:3000 |
| Swagger BFF | http://localhost:3000/api/docs |
| Swagger MS Catálogo | http://localhost:5001/swagger |
| Swagger MS Pedidos | http://localhost:5002/swagger |

---

## Docker Hub

As imagens estão publicadas em:

| Imagem | Docker Hub |
|---|---|
| MS Catálogo de Eventos | `akknj0000/ms-catalogo-eventos:latest` |
| MS Pedidos | `akknj0000/ms-pedidos:latest` |
| BFF | `akknj0000/bff-nodejs:latest` |
| API Gateway | `akknj0000/api-gateway:latest` |
| Frontend | `akknj0000/frontend-spa:latest` |

---

## Testes

```bash
# MS Catálogo de Eventos
cd ms-catalogo-eventos && dotnet test

# MS Pedidos
cd ms-pedidos && dotnet test
```

Cada microsserviço possui:
- **Testes unitários** (xUnit + Moq) — validam handlers da camada Application
- **Testes de arquitetura** (NetArchTest.Rules) — garantem isolamento da Clean Architecture
