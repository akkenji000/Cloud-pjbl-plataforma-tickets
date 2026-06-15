# MS Pedidos

Microsserviço responsável pelo domínio de pedidos e transações da Plataforma de Tickets.

## Arquitetura

Implementa **Clean Architecture** com **Vertical Slice**:

```
src/Pedidos.API/
├── Domain/
│   ├── Entities/        # Pedido.cs
│   └── Interfaces/      # IPedidoRepository.cs
├── Application/
│   └── Features/        # CreatePedido, GetPedido, GetAllPedidos, UpdatePedido, DeletePedido
├── Infrastructure/
│   ├── Persistence/     # AppDbContext.cs (EF Core)
│   └── Repositories/    # PedidoRepository.cs
└── Controllers/         # PedidosController.cs
tests/
├── Unit/                # CreatePedidoHandlerTests.cs (xUnit + Moq)
└── Architecture/        # ArchitectureTests.cs (NetArchTest.Rules)
```

O schema do banco é criado automaticamente via `EnsureCreated()` na inicialização.

## Tecnologias

- **Runtime:** .NET 10 / ASP.NET Core 10
- **Banco de dados:** SQL Server 2022 + Entity Framework Core 9
- **Documentação:** Swagger / OpenAPI (Swashbuckle)
- **Testes:** xUnit, Moq, NetArchTest.Rules
- **Container:** Docker (multi-stage build)

## Como rodar localmente

### Com Docker Compose (recomendado — sobe SQL Server junto)

Na raiz do monorepo:
```bash
docker-compose up --build ms-pedidos sqlserver-pedidos
```

Acesse: `http://localhost:5002/swagger`

### Sem Docker (requer SQL Server local ou Azure SQL)

```bash
export ConnectionStrings__SqlServer="Server=localhost,1433;Database=pedidos_db;User=sa;Password=SuaSenha;TrustServerCertificate=True"

cd ms-pedidos
dotnet run --project src/Pedidos.API
```

### Rodar testes

```bash
cd ms-pedidos
dotnet test
```

## Endpoints

| Método | Rota | Descrição |
|---|---|---|
| GET | /api/pedidos | Lista todos os pedidos |
| GET | /api/pedidos/{id} | Busca pedido por ID |
| POST | /api/pedidos | Cria novo pedido |
| PUT | /api/pedidos/{id} | Atualiza pedido |
| DELETE | /api/pedidos/{id} | Remove pedido |

## Alunos

- Arthur Kenji Kussaba
- Frederico Salvatti Cavalcante
- Eduardo Antonio Babinski Pedroso
