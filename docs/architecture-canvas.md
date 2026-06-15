# Software Architecture Canvas — Plataforma de Venda de Tickets

> Formato: Architecture Canvas (visão condensada de uma página)
> Projeto: PJBL — Arquitetura de Soluções em Nuvem | Data: 2026-06-14

---

## 1. Descrição do Sistema

**Nome:** Plataforma de Venda de Tickets
**Tipo:** Aplicação distribuída baseada em microsserviços
**Resumo:** Sistema para gerenciamento e comercialização de ingressos de eventos. Usuários consultam catálogo, fazem pedidos e recebem taxas calculadas dinamicamente via Azure Function serverless.

---

## 2. Requisitos Funcionais Principais

| # | Requisito |
|---|---|
| RF-01 | CRUD completo de Eventos (Catálogo) com persistência em MongoDB |
| RF-02 | CRUD completo de Pedidos com persistência em SQL Server |
| RF-03 | Cálculo de taxa de conveniência por usuário (regra: VIP = 5%, padrão = 10.5%) |
| RF-04 | Dashboard agregado que combina eventos, pedidos e taxa em uma única chamada |
| RF-05 | Documentação Swagger (OpenAPI) em cada microsserviço C# |

---

## 3. Requisitos de Qualidade (Atributos)

| Atributo | Meta |
|---|---|
| Escalabilidade | Cada serviço escala independentemente via container |
| Resiliência | Fallback no BFF garante dashboard funcional mesmo com serviços degradados |
| Manutenibilidade | Vertical Slice — nova feature toca apenas 1 diretório |
| Testabilidade | Domain isolado de Infrastructure; cobertura com xUnit + Moq + NetArchTest |
| Portabilidade | Todos os serviços containerizados — `docker-compose up` sobe todo o stack |

---

## 4. Restrições

| Tipo | Restrição |
|---|---|
| Tecnologia | .NET 10 para MS C#; net8.0 para Azure Function (imagem base) |
| Banco de dados | MongoDB (eventos) e SQL Server (pedidos) — sem compartilhamento |
| Deploy | Imagens devem ser publicáveis no Docker Hub |
| Prazo | Entrega: 15/06/2026 23:59 |
| Padrões | Clean Architecture + Vertical Slice obrigatórios |

---

## 5. Componentes Principais (Building Blocks)

```
┌─────────────────────────────────────────────────────────────┐
│                    PLATAFORMA DE TICKETS                     │
│                                                              │
│  ┌──────────────┐     ┌──────────────────────────────────┐  │
│  │  Microfrontend│────▶│          BFF (NestJS)            │  │
│  │ React + Vite  │     │   AggregatedDataController       │  │
│  │   :5173       │     │   AggregatedDataService          │  │
│  └──────────────┘     │   Promise.allSettled() + fallback │  │
│                        └──────────┬──────────┬────────────┘  │
│                                   │          │          │    │
│              ┌────────────────────┘          │          │    │
│              ▼                               ▼          ▼    │
│  ┌────────────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │ MS Catálogo Eventos│  │  MS Pedidos  │  │Azure Function│ │
│  │   ASP.NET :5001    │  │ ASP.NET :5002│  │  .NET 8 :7071│ │
│  │ Clean Arch + Slice │  │ Clean Arch + │  │ HTTP Trigger │ │
│  │ CRUD de Eventos    │  │ Slice Pedidos│  │ Calc. Taxas  │ │
│  └────────┬───────────┘  └──────┬───────┘  └──────────────┘ │
│           │                     │                             │
│           ▼                     ▼                             │
│  ┌──────────────────┐  ┌────────────────────┐               │
│  │     MongoDB      │  │    SQL Server 2022  │               │
│  │  Collection:     │  │  Table: Pedidos     │               │
│  │  eventos         │  │  EF Core / int PK   │               │
│  └──────────────────┘  └────────────────────┘               │
└─────────────────────────────────────────────────────────────┘
```

---

## 6. Decisões de Arquitetura Chave

| ADR | Decisão | Motivação |
|---|---|---|
| ADR-001 | Vertical Slice dentro de Clean Architecture | Features isoladas, sem acoplamento entre elas |
| ADR-002 | Persistência Poliglota (MongoDB + SQL Server) | Melhor fit por domínio (flexível vs. transacional) |
| ADR-003 | BFF com `Promise.allSettled()` | Resiliência — fallback por serviço, sem cascade failure |
| ADR-004 | `EnsureCreated()` em vez de Migrations | Simplicidade no contexto acadêmico / lab |

---

## 7. Visão de Deployment

| Serviço | Porta | Base Image | Banco |
|---|---|---|---|
| frontend-spa | 5173 | node:20-alpine | — |
| bff-nodejs | 3000 | node:20-alpine | — |
| ms-catalogo-eventos | 5001 | dotnet/aspnet:10.0 | MongoDB :27017 |
| ms-pedidos | 5002 | dotnet/aspnet:10.0 | SQL Server :1433 |
| azure-function | 7071 | dotnet-isolated:4-dotnet-isolated8.0 | — |

**Orquestração:** Docker Compose (`docker-compose.yml` na raiz do monorepo)
**Publicação:** Docker Hub (`docker push <usuario>/pjbl-<servico>:latest`)

---

## 8. Modelo de Dados

**Evento** (MongoDB — sem schema fixo):
```json
{
  "_id": "ObjectId",
  "nome": "Rock in Rio 2027",
  "data": "ISODate",
  "local": "Cidade do Rock",
  "capacidade": 100000,
  "precoBase": 450.00,
  "categoria": "Música",
  "status": "Ativo"
}
```

**Pedido** (SQL Server — schema rígido):
```sql
Id          INT IDENTITY PK
EventoId    NVARCHAR(50)       -- referência lógica (sem FK entre bancos)
ClienteNome NVARCHAR(200)
ClienteEmail NVARCHAR(200)
Quantidade  INT
ValorTotal  DECIMAL(18,2)
Status      NVARCHAR(50)
DataPedido  DATETIME2
```

---

## 9. Riscos Principais

| Risco | Mitigação |
|---|---|
| SQL Server demora ~30s para iniciar | `depends_on` no compose; restart do MS Pedidos se necessário |
| Sem autenticação JWT | Escopo acadêmico; em produção usar OAuth2/OIDC |
| Imagem dotnet:10.0 pode não estar estável | Testado com SDK 10.0.204; build validado |

---

## 10. Diagramas e Documentação Complementar

| Artefato | Localização |
|---|---|
| C4 Nível 1 (Contexto) | `docs/diagrams/c4-level1-context.puml` |
| C4 Nível 2 (Containers) | `docs/diagrams/c4-level2-container.puml` |
| C4 Nível 3 (Componentes) | `docs/diagrams/c4-level3-component.puml` |
| C4 Nível 4 / UML Classes | `docs/diagrams/c4-level4-classes.puml` |
| UML Sequência | `docs/diagrams/uml-sequence.puml` |
| UML Componentes | `docs/diagrams/uml-components.puml` |
| Diagrama ER | `docs/diagrams/er-diagram.puml` |
| Arc42 Completo | `docs/arc42/arc42-plataforma-tickets.md` |
