# Plataforma de Venda de Tickets — PJBL

Aplicação distribuída de gerenciamento e venda de ingressos para eventos, construída com microsserviços, BFF, microfrontend e funções serverless na nuvem.

**Equipe:** Arthur Kenji Kussaba · Frederico Salvatti Cavalcante · Eduardo Antonio Babinski Pedroso

---

## Arquitetura

O sistema segue uma arquitetura de **Microsserviços com Persistência Poliglota**, orquestrada por um **BFF (Backend for Frontend)** e exposta via **API Gateway**.

```
Browser
  └── Frontend SPA (React :5173)
        └── API Gateway (nginx :8080)
              └── BFF NestJS (:3000)
                    ├── MS Catálogo de Eventos (C# :5001) → MongoDB Atlas (AWS São Paulo)
                    ├── MS Pedidos (C# :5002)             → Azure SQL (Canada Central)
                    └── Azure Function (HTTP Trigger)      → Azure (Canada Central)
```

> Em produção, o nginx é substituído pelo **AWS API Gateway** como ponto de entrada externo.

### Padrões Aplicados

| Padrão | Onde se aplica |
|---|---|
| Clean Architecture | MS Catálogo e MS Pedidos (Domain → Application → Infrastructure → API) |
| Vertical Slice | Features isoladas por diretório (`CreateEvento`, `GetPedido`, etc.) |
| BFF | NestJS agrega dados dos 3 serviços em um único response |
| API Gateway | nginx (local) / AWS API Gateway (produção) |
| Microfrontend | SPA React deployável independentemente |
| Serverless | Azure Function calcula taxa de conveniência por usuário |
| Database per Service | MongoDB para eventos, Azure SQL para pedidos |

### Stack

| Componente | Tecnologia | Porta |
|---|---|---|
| Frontend (SPA) | React 18 + Vite + TypeScript | 5173 |
| API Gateway | nginx | 8080 |
| BFF | NestJS 11 + Node.js 20 | 3000 |
| MS Catálogo de Eventos | ASP.NET Core 10 (C#) | 5001 |
| MS Pedidos | ASP.NET Core 10 (C#) | 5002 |
| Azure Function | .NET 8 Isolated Worker | Azure |
| Banco de Eventos | MongoDB Atlas (M0 FREE) | Cloud |
| Banco de Pedidos | Azure SQL Database (Basic) | Cloud |

Documentação completa: [`docs/arc42/arc42-plataforma-tickets.md`](docs/arc42/arc42-plataforma-tickets.md)

---

## Pré-requisitos

- **[Docker Desktop](https://www.docker.com/products/docker-desktop/)** — inclui Docker e Docker Compose
- **Git**

> Os bancos de dados (MongoDB Atlas e Azure SQL) são gerenciados na nuvem — não é necessário instalar nada localmente para eles. As credenciais de acesso devem ser solicitadas à equipe.

---

## Passo a passo — rodar localmente

### 1. Clonar o repositório

```bash
git clone https://github.com/akkenji000/Cloud-pjbl-plataforma-tickets.git
cd Cloud-pjbl-plataforma-tickets
```

### 2. Configurar as variáveis de ambiente

Copie o arquivo de exemplo:

```bash
# Linux / macOS
cp .env.example .env

# Windows (PowerShell)
Copy-Item .env.example .env
```

Abra o `.env` e preencha com as credenciais reais:

```env
# MongoDB Atlas — banco de eventos (AWS São Paulo)
MONGODB_CONNECTION_STRING=mongodb+srv://<user>:<password>@pjbl-cluster.mongodb.net/catalogo_eventos?appName=pjbl-cluster

# Azure SQL — banco de pedidos (Canada Central)
AZURE_SQL_CONNECTION_STRING=Server=tcp:pjbl-sql-server.database.windows.net,1433;Initial Catalog=pedidos_db;User ID=<user>;Password=<password>;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;

# Azure Function deployada no Azure (Canada Central)
AZURE_FUNCTION_URL=https://pjbl-taxas-function-dhbcg8bjhtbafya5.canadacentral-01.azurewebsites.net
```

> O arquivo `.env` não é versionado. Solicite os valores reais à equipe.

### 3. Subir todos os serviços

```bash
docker compose up --build
```

O build compila todos os serviços a partir do código-fonte. Na primeira execução leva alguns minutos. Aguarde até ver os logs dos 5 containers estabilizarem.

### 4. Acessar a aplicação

| URL | O que abre |
|---|---|
| http://localhost:5173 | Frontend SPA — interface principal |
| http://localhost:8080/api/eventos | Eventos via API Gateway → BFF → MS Catálogo |
| http://localhost:8080/api/pedidos | Pedidos via API Gateway → BFF → MS Pedidos |
| http://localhost:8080/api/aggregated-data?userId=1 | Dashboard agregado (eventos + pedidos + taxa) |
| http://localhost:3000/api/docs | Swagger do BFF |
| http://localhost:5001/swagger | Swagger do MS Catálogo de Eventos |
| http://localhost:5002/swagger | Swagger do MS Pedidos |

### 5. Parar os serviços

```bash
docker compose down
```

---

## Alternativa — usar imagens do Docker Hub

Se não quiser compilar o código localmente, baixe as imagens já publicadas:

```bash
docker pull akknj0000/ms-catalogo-eventos:latest
docker pull akknj0000/ms-pedidos:latest
docker pull akknj0000/bff-nodejs:latest
docker pull akknj0000/api-gateway:latest
docker pull akknj0000/frontend-spa:latest
```

Em seguida suba sem o flag `--build`:

```bash
docker compose up
```

---

## Rodar os testes

Requer [.NET SDK 10](https://dotnet.microsoft.com/download) instalado na máquina.

```bash
# MS Catálogo de Eventos
cd ms-catalogo-eventos
dotnet test

# MS Pedidos
cd ms-pedidos
dotnet test
```

Cada microsserviço possui:
- **Testes unitários** (xUnit + Moq) — validam handlers da camada Application com repositório mockado
- **Testes de arquitetura** (NetArchTest.Rules) — verificam que a camada Domain não depende de Infrastructure

---

## Estrutura do Monorepo

```
.
├── docker-compose.yml           # Orquestração local dos 5 containers
├── .env.example                 # Template de variáveis de ambiente
├── api-gateway/                 # API Gateway — nginx
├── frontend-spa/                # Microfrontend — React + Vite
├── bff-nodejs/                  # BFF agregador — NestJS
│   └── src/features/
│       ├── aggregated-data/     # GET /api/aggregated-data
│       ├── eventos-proxy/       # Proxy CRUD de eventos
│       └── pedidos-proxy/       # Proxy CRUD de pedidos
├── ms-catalogo-eventos/         # MS Catálogo — C# + MongoDB Atlas
│   ├── src/CatalogoEventos.API/
│   │   ├── Domain/              # Entidades e interfaces
│   │   ├── Application/Features/ # Handlers por feature (Vertical Slice)
│   │   ├── Infrastructure/      # Repositório MongoDB
│   │   └── Controllers/
│   └── tests/
├── ms-pedidos/                  # MS Pedidos — C# + Azure SQL
│   ├── src/Pedidos.API/
│   │   ├── Domain/
│   │   ├── Application/Features/
│   │   ├── Infrastructure/      # Repositório EF Core
│   │   └── Controllers/
│   └── tests/
├── azure-function/              # Azure Function — cálculo de taxa
└── docs/
    ├── arc42/                   # Documentação Arc42 (11 seções)
    │   ├── arc42-plataforma-tickets.md
    │   └── arc42-plataforma-tickets.html
    └── prints/                  # Screenshots da aplicação em execução
```

---

## Links

| Artefato | URL |
|---|---|
| Repositório GitHub | https://github.com/akkenji000/Cloud-pjbl-plataforma-tickets |
| Docker Hub — MS Catálogo | https://hub.docker.com/r/akknj0000/ms-catalogo-eventos |
| Docker Hub — MS Pedidos | https://hub.docker.com/r/akknj0000/ms-pedidos |
| Docker Hub — BFF | https://hub.docker.com/r/akknj0000/bff-nodejs |
| Docker Hub — API Gateway | https://hub.docker.com/r/akknj0000/api-gateway |
| Docker Hub — Frontend | https://hub.docker.com/r/akknj0000/frontend-spa |
| Azure Function (produção) | https://pjbl-taxas-function-dhbcg8bjhtbafya5.canadacentral-01.azurewebsites.net/api/calcular-taxa?userId=1&preco=100 |
