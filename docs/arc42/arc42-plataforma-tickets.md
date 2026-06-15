# Arc42 — Plataforma de Venda de Tickets

> Documentação de Arquitetura de Software seguindo o template Arc42 (11 seções)
> Projeto: PJBL — Arquitetura de Soluções em Nuvem
> Data: 2026-06-14

---

## 1. Introdução e Objetivos

### 1.1 Escopo do Sistema

A **Plataforma de Venda de Tickets** é um sistema distribuído baseado em microsserviços para gerenciamento e comercialização de ingressos para eventos culturais e esportivos. O sistema permite que usuários consultem o catálogo de eventos, realizem pedidos de ingressos e recebam valores de taxa de conveniência calculados dinamicamente.

### 1.2 Objetivos de Qualidade

| Prioridade | Atributo de Qualidade | Descrição |
|---|---|---|
| 1 | Escalabilidade | Cada microsserviço pode escalar independentemente conforme demanda |
| 2 | Manutenibilidade | Clean Architecture + Vertical Slice facilitam evolução por feature |
| 3 | Resiliência | BFF usa `Promise.allSettled()` para chamadas paralelas com fallback |
| 4 | Testabilidade | Domínio isolado de infraestrutura; testes unitários e de arquitetura |
| 5 | Portabilidade | Todos os serviços containerizados via Docker |

### 1.3 Stakeholders

| Stakeholder | Papel | Interesse |
|---|---|---|
| Usuário Final | Comprador de ingressos | Interface fluida e preços corretos |
| Administrador | Gestor da plataforma | CRUD de eventos e gestão de pedidos |
| Equipe de Desenvolvimento | Time PJBL | Código limpo, testável e bem documentado |
| Professor/Avaliador | Avaliador acadêmico | Conformidade com requisitos arquiteturais |

---

## 2. Restrições de Arquitetura

### 2.1 Restrições Técnicas

- **Runtime .NET**: SDK 10.0 para microsserviços C# (ASP.NET Core 10)
- **Azure Functions**: Mantido em net8.0 por limitação da imagem base Docker do isolated worker
- **BFF**: Node.js 20 + NestJS (módulos de features, Vertical Slice)
- **Bancos de Dados**: MongoDB 7 (eventos, NoSQL) e SQL Server 2022 (pedidos, relacional)
- **Containerização**: Docker + Docker Compose obrigatórios; imagens publicáveis no Docker Hub

### 2.2 Restrições Organizacionais

- Entrega até 15/06/2026 às 23:59
- Projeto acadêmico — não há SLA de produção; `EnsureCreated()` substitui migrations EF Core
- Repositório monorepo público no GitHub

### 2.3 Convenções e Padrões

- Clean Architecture com isolamento Domain → Application → Infrastructure → API
- Vertical Slice: código agrupado por feature (`CreateEvento`, `GetEvento`, etc.)
- Persistência Poliglota: cada MS possui seu próprio banco de dados
- Sem compartilhamento de banco entre microsserviços

---

## 3. Contexto e Escopo do Sistema

### 3.1 Diagrama de Contexto (C4 Nível 1)

> Ver: `docs/diagrams/c4-level1-context.puml`

### 3.2 Contexto de Negócio

| Parceiro Externo | Entrada | Saída |
|---|---|---|
| Usuário Final | Acessa /dashboard via browser | Visualiza eventos e faz pedidos |
| Administrador | CRUD via API REST | Respostas JSON com dados atualizados |
| MongoDB Atlas | — | Persistência de catálogo de eventos |
| Azure SQL / SQL Server | — | Persistência de pedidos e transações |
| Docker Hub | — | Registro e distribuição de imagens |

### 3.3 Contexto Técnico

O sistema é acessado via HTTPS na camada do Microfrontend React. O BFF NestJS na porta 3000 agrega dados dos demais serviços internos, todos dentro da rede Docker Compose (`pjbl-network`).

---

## 4. Estratégia de Solução

### 4.1 Decisões Arquiteturais Fundamentais

| Decisão | Escolha | Justificativa |
|---|---|---|
| Arquitetura | Microsserviços | Isolamento de domínios, escalabilidade independente |
| Padrão interno | Clean Architecture + Vertical Slice | Coesão por feature, testabilidade do domínio |
| Frontend | Microfrontend (SPA) | Desacoplamento do backend, deploy independente |
| Agregação de API | BFF (Backend for Frontend) | Reduz chattiness do frontend, oculta complexidade interna |
| Cálculo serverless | Azure Function (HTTP Trigger) | Isolamento de lógica de taxas, paradigma serverless |
| Banco MS Eventos | MongoDB | Flexibilidade de schema para entidades de eventos |
| Banco MS Pedidos | SQL Server + EF Core | Consistência transacional para dados financeiros |

### 4.2 Padrão de Resiliência

O BFF utiliza `Promise.allSettled()` para chamar os três serviços em paralelo. Em caso de falha de qualquer serviço, o BFF retorna dados de fallback em vez de propagar erros ao frontend.

### 4.3 Estilos Arquiteturais Aplicados

Esta seção documenta cada estilo arquitetural adotado no projeto, conforme exigido pelo escopo acadêmico da disciplina.

#### 4.3.1 Serverless

**Como se aplica:** A **Azure Function** (`CalcularTaxaFunction`) é o componente serverless do sistema. Implementada no modelo Isolated Worker do Azure Functions v4, ela responde a um **HTTP Trigger** (`GET /api/calcular-taxa`) e calcula a taxa de conveniência por usuário sem gerenciar infraestrutura de servidor. O ciclo de vida da função é gerenciado pelo runtime do Azure Functions — a função existe apenas durante a execução da requisição.

**Vantagem aplicada:** A lógica de cálculo de taxas fica completamente isolada dos microsserviços, podendo evoluir ou escalar de forma independente.

#### 4.3.2 Microfrontend

**Como se aplica:** O **frontend-spa** é uma Single Page Application (SPA) em React/Vite que constitui o microfrontend do sistema. Ele consome dados **exclusivamente pelo BFF** (nunca diretamente pelos microsserviços), respeitando o contrato de isolamento de camadas. Em cenários de maior escala, este microfrontend poderia ser composto com outros MFEs via Module Federation, mas no escopo atual representa a camada de apresentação isolada e independentemente deployável.

#### 4.3.3 Backend for Frontend (BFF) + Microservices + Database per Service

**BFF:** O **bff-nodejs** (NestJS :3000) é o único ponto de contato do frontend com o backend. Ele possui dois papéis:
1. **Agregação** (`GET /api/aggregated-data`): chama MS Catálogo, MS Pedidos e Azure Function em paralelo e retorna um único JSON consolidado.
2. **Proxy CRUD**: repassa operações de escrita/leitura isoladas para cada microsserviço de forma transparente (`/api/eventos`, `/api/pedidos`).

**Microservices:** MS Catálogo de Eventos (C# :5001) e MS Pedidos (C# :5002) são serviços independentes com código, deploy e escalabilidade próprios.

**Database per Service:** Cada microsserviço possui seu banco de dados exclusivo — MongoDB para eventos, SQL Server para pedidos. Não há compartilhamento de banco entre serviços (Persistência Poliglota).

#### 4.3.4 API Gateway

**Como se aplica:** O **api-gateway** (nginx :8080) é o ponto único de entrada externo da plataforma. Centraliza:
- **Roteamento:** todo tráfego `/api/` é roteado para o BFF, que distribui internamente.
- **Abstração:** clientes externos conhecem apenas o gateway, não os endereços internos dos serviços.
- **Extensibilidade:** em produção, este nginx poderia ser substituído por AWS API Gateway, Azure API Management ou Kong, adicionando autenticação JWT, rate limiting e logging centralizado.

**Fluxo com gateway:** `Frontend → API Gateway (:8080) → BFF (:3000) → Microserviços (:5001/:5002) / Azure Function (:7071)`

#### 4.3.5 Arquitetura Orientada a Eventos (EDA — Event-Driven Architecture)

**Contexto no projeto atual:** A plataforma utiliza comunicação **síncrona HTTP** entre seus componentes. Contudo, o padrão EDA está presente de forma embrionária e é a evolução natural do sistema:

**Onde EDA já se manifesta:**
- A **Azure Function** é um componente orientado a eventos por natureza — ela reage a um *evento HTTP* (trigger). O modelo de Azure Functions suporta nativamente triggers de filas (Service Bus, Event Hub, Storage Queue), sendo a transição para EDA assíncrono imediata.

**Evolução para EDA plena (arquitetura futura):**
```
MS Pedidos ──(evento: PedidoCriado)──▶ Azure Service Bus / Event Hub
                                              │
                          ┌───────────────────┤
                          ▼                   ▼
               MS Notificações        MS Catálogo
             (email confirmação)    (atualiza vagas)
```

Em um cenário de produção, eventos como `PedidoCriado`, `EventoCancelado` e `CapacidadeEsgotada` seriam publicados em um broker (Azure Service Bus ou Kafka), permitindo que os consumidores reajam de forma desacoplada e assíncrona. Este padrão elimina o acoplamento temporal entre serviços e aumenta a resiliência do sistema.

#### 4.3.6 Clean Architecture

**Como se aplica:** Cada microsserviço C# segue Clean Architecture com 4 camadas isoladas:
- **Domain**: entidades (`Evento`, `Pedido`) e interfaces de repositório (`IEventoRepository`, `IPedidoRepository`) — sem dependências externas.
- **Application**: handlers de features (Vertical Slice) que orquestram casos de uso usando apenas interfaces do Domain.
- **Infrastructure**: implementações concretas de repositórios (MongoDB, EF Core) e contextos de banco.
- **Controllers (API)**: recebem HTTP, delegam para handlers da Application.

A regra de dependência é estrita: camadas internas não conhecem camadas externas.

#### 4.3.7 Vertical Slice

**Como se aplica:** Dentro da camada Application, o código é organizado por **feature** (não por tipo técnico). Cada operação CRUD tem seu próprio diretório com Handler, Request e Response isolados:
```
Application/Features/
  CreateEvento/   ← CreateEventoHandler + CreateEventoRequest + CreateEventoResponse
  GetEvento/      ← GetEventoHandler + GetEventoResponse
  UpdateEvento/   ← UpdateEventoHandler + UpdateEventoRequest
  DeleteEvento/   ← DeleteEventoHandler
```
Adicionar uma nova feature (ex: `PublicarEvento`) exige criar apenas um novo diretório, sem tocar em outras features.

#### 4.3.8 Testes Unitários de Arquitetura

**Testes Unitários (xUnit + Moq):** Validam o comportamento dos handlers da camada Application em isolamento total — o repositório é mockado, garantindo que a lógica de negócio seja testada sem dependências de infraestrutura.

**Testes de Arquitetura (NetArchTest.Rules):** Verificam automaticamente que as regras de isolamento da Clean Architecture são respeitadas no código compilado:
```csharp
// Garante que Domain não depende de Infrastructure
Types.InAssembly(assembly)
    .That().ResideInNamespace("..Domain..")
    .ShouldNot().HaveDependencyOn("..Infrastructure..")
    .GetResult().IsSuccessful // true
```
Os 6 testes (3 por MS) rodam via `dotnet test` e estão integrados ao pipeline de build.

---

## 5. Visão de Building Blocks

### 5.1 Nível 1 — Sistema Completo

> Ver: `docs/diagrams/c4-level2-container.puml`

O sistema é composto por:
1. **Microfrontend** (React/Vite :5173) — SPA
2. **BFF** (NestJS :3000) — Agregador
3. **MS Catálogo de Eventos** (ASP.NET Core :5001)
4. **MS Pedidos** (ASP.NET Core :5002)
5. **Azure Function** (:7071) — Cálculo de taxas
6. **MongoDB** (:27017) — Banco de eventos
7. **SQL Server** (:1433) — Banco de pedidos

### 5.2 Nível 2 — MS Catálogo de Eventos

> Ver: `docs/diagrams/c4-level3-component.puml`

| Componente | Camada | Responsabilidade |
|---|---|---|
| `EventosController` | API | Roteamento HTTP + validação de entrada |
| `Create/Get/Update/Delete EventoHandler` | Application | Orquestração de casos de uso |
| `IEventoRepository` | Domain | Contrato de abstração de dados |
| `EventoRepository` | Infrastructure | Implementação MongoDB |
| `MongoDbContext` | Infrastructure | Gerenciamento de conexão |

### 5.3 Nível 3 — Diagrama de Classes

> Ver: `docs/diagrams/c4-level4-classes.puml`

---

## 6. Visão de Runtime

### 6.1 Cenário: Usuário Acessa o Dashboard

> Ver: `docs/diagrams/uml-sequence.puml`

**Fluxo principal:**
1. Browser aciona `GET /api/aggregated-data` no BFF com header `x-user-id`
2. BFF dispara em paralelo via `Promise.allSettled()`:
   - `GET /api/eventos` → MS Catálogo → MongoDB
   - `GET /api/pedidos` → MS Pedidos → SQL Server
   - `GET /api/calcular-taxa?userId=&preco=` → Azure Function
3. BFF aguarda todas as respostas e monta payload agregado
4. Frontend renderiza dashboard com dados consolidados

### 6.2 Cenário: Criação de Evento

1. `POST /api/eventos` com payload JSON
2. `EventosController` recebe e valida a request
3. `CreateEventoHandler` instancia `Evento` e chama `IEventoRepository.CreateAsync()`
4. `EventoRepository` insere documento na collection MongoDB
5. Retorna `201 Created` com objeto criado

---

## 7. Visão de Deployment

### 7.1 Infraestrutura Docker Compose

Todos os 6 serviços são orquestrados via `docker-compose.yml` na raiz do monorepo. Cada serviço possui um `Dockerfile` com multi-stage build.

| Serviço | Imagem Base | Porta | Variáveis de Ambiente |
|---|---|---|---|
| mongodb-eventos | mongo:latest | 27017 | MONGO_INITDB_ROOT_* |
| sqlserver-pedidos | mssql/server:2022-latest | 1433 | ACCEPT_EULA, MSSQL_SA_PASSWORD |
| ms-catalogo-eventos | dotnet/aspnet:10.0 | 5001 | MongoDB__*, ASPNETCORE_URLS |
| ms-pedidos | dotnet/aspnet:10.0 | 5002 | ConnectionStrings__SqlServer, ASPNETCORE_URLS |
| azure-function | dotnet-isolated:4-dotnet-isolated8.0 | 7071 | — |
| bff-nodejs | node:20-alpine | 3000 | MS_EVENTOS_URL, MS_PEDIDOS_URL, AZURE_FUNCTION_URL |

### 7.2 Publicação no Docker Hub

Para publicar as imagens:
```bash
docker build -t <usuario>/pjbl-ms-catalogo-eventos:latest ./ms-catalogo-eventos
docker push <usuario>/pjbl-ms-catalogo-eventos:latest

docker build -t <usuario>/pjbl-ms-pedidos:latest ./ms-pedidos
docker push <usuario>/pjbl-ms-pedidos:latest

docker build -t <usuario>/pjbl-azure-function:latest ./azure-function
docker push <usuario>/pjbl-azure-function:latest

docker build -t <usuario>/pjbl-bff:latest ./bff-nodejs
docker push <usuario>/pjbl-bff:latest
```

---

## 8. Conceitos Transversais

### 8.1 Modelo de Domínio

**Evento** (MongoDB):
- `Id` (ObjectId), `Nome`, `Data`, `Local`, `Capacidade`, `PrecoBase`, `Categoria`, `Status`

**Pedido** (SQL Server):
- `Id` (int, PK), `EventoId` (referência lógica), `ClienteNome`, `ClienteEmail`, `Quantidade`, `ValorTotal`, `Status`, `DataPedido`

### 8.2 Segurança

- Nível acadêmico: sem autenticação JWT em produção neste escopo
- Senhas de bancos gerenciadas via variáveis de ambiente no Docker Compose
- `TrustServerCertificate=True` no SQL Server (aceitável em ambiente de dev/lab)

### 8.3 Logging e Observabilidade

- ASP.NET Core: logs padrão via `ILogger<T>` integrado ao framework
- NestJS: `Logger` nativo do NestJS em cada módulo
- Azure Function: logs via `ILogger` do isolated worker

### 8.4 Tratamento de Erros

- MS C#: retorno de `404 NotFound` para recursos não encontrados, `400 BadRequest` para validação básica
- BFF: `Promise.allSettled()` com fallback de dados — nunca retorna 500 por falha de dependência
- Azure Function: retorno de taxa padrão `10.5%` caso parâmetros sejam inválidos

### 8.5 Testes

- **Unitários**: xUnit + Moq — testam handlers de Application isolados de Infrastructure
- **Arquitetura**: NetArchTest.Rules — garantem que Domain não depende de Infrastructure
- **Execução**: `dotnet test` em cada solução `.slnx`

---

## 9. Decisões de Arquitetura (ADRs)

### ADR-001: Vertical Slice dentro de Clean Architecture

**Contexto**: O padrão Clean Architecture tradicional organiza código por camada técnica (todos os repositórios juntos, todos os controllers juntos). Para features distintas, isso aumenta o acoplamento entre funcionalidades não relacionadas.

**Decisão**: Adotar Vertical Slice dentro das camadas Application. Cada feature (`CreateEvento`, `GetEvento`, etc.) fica em seu próprio diretório com Handler, Request e Response.

**Consequência**: Adicionar uma nova feature exige tocar apenas um diretório; não há risco de quebrar outras features.

---

### ADR-002: Persistência Poliglota

**Contexto**: Eventos e Pedidos possuem características de dados distintas — eventos têm schema flexível, pedidos exigem consistência transacional.

**Decisão**: MongoDB para o MS de Catálogo (schema livre, documentos JSON), SQL Server + EF Core para o MS de Pedidos (transações ACID, schema rígido).

**Consequência**: Cada MS é dono exclusivo de seu banco. Não há joins entre bancos. `EventoId` no Pedido é uma referência lógica (string), não uma FK.

---

### ADR-003: BFF com Promise.allSettled()

**Contexto**: O frontend precisa de dados de 3 fontes distintas. Chamadas sequenciais aumentam a latência; uma falha em cascata derrubaria o dashboard inteiro.

**Decisão**: BFF realiza 3 chamadas em paralelo com `Promise.allSettled()`. Cada resultado é avaliado individualmente; falhas retornam dados de fallback.

**Consequência**: O dashboard renderiza parcialmente mesmo se um dos serviços estiver fora do ar.

---

### ADR-004: EnsureCreated() em vez de Migrations EF Core

**Contexto**: EF Core Migrations exigem um histórico de migrações controlado, compatível com CI/CD. No escopo acadêmico, com banco efêmero em container, isso é overhead desnecessário.

**Decisão**: `EnsureCreated()` na inicialização do MS Pedidos. O banco é criado automaticamente ao subir o container.

**Consequência**: Schema não é versionado; adequado para o contexto de laboratório.

---

## 10. Riscos e Débitos Técnicos

| Risco | Impacto | Mitigação |
|---|---|---|
| Acoplamento temporal entre serviços no docker-compose | Médio | `depends_on` no docker-compose garante ordem de inicialização |
| SQL Server demora ~30s para iniciar no container | Alto | MS Pedidos pode falhar no primeiro `EnsureCreated()` — restart do container resolve |
| Ausência de autenticação JWT | Médio | Escopo acadêmico; produção exigiria OAuth2/OIDC |
| Sem circuit breaker no BFF | Baixo | `Promise.allSettled()` com fallback mitiga; Resilience4j/Polly seriam a próxima evolução |
| Imagens Docker com `latest` tag | Baixo | Em produção usar tags versionadas para determinismo |

---

## 11. Glossário

| Termo | Definição |
|---|---|
| BFF | Backend for Frontend — camada de agregação dedicada ao frontend |
| Clean Architecture | Padrão de Robert C. Martin — isolamento entre Domain, Application, Infrastructure e API |
| Vertical Slice | Organização de código por feature, não por camada técnica |
| Microsserviço | Serviço independente com domínio, banco e deploy próprios |
| Persistência Poliglota | Uso de diferentes tecnologias de banco de dados conforme o domínio |
| Azure Function | Função serverless executada via HTTP Trigger na plataforma Azure |
| Isolated Worker | Modelo de execução do Azure Functions para .NET que roda fora do processo host |
| EnsureCreated() | Método do EF Core que cria o banco se não existir, sem controle de migrations |
| Promise.allSettled() | Método JavaScript que executa N promises em paralelo e retorna todos os resultados, incluindo falhas |
| ObjectId | Tipo de ID padrão do MongoDB, gerado automaticamente pelo driver |
