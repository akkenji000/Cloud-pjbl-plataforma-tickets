# MS Catálogo de Eventos

Microsserviço responsável pelo domínio de eventos culturais e esportivos da Plataforma de Tickets.

## Arquitetura

Implementa **Clean Architecture** com **Vertical Slice**:

```
src/CatalogoEventos.API/
├── Domain/
│   ├── Entities/        # Evento.cs
│   └── Interfaces/      # IEventoRepository.cs
├── Application/
│   └── Features/        # CreateEvento, GetEvento, GetAllEventos, UpdateEvento, DeleteEvento
├── Infrastructure/
│   ├── Persistence/     # MongoDbContext.cs
│   └── Repositories/    # EventoRepository.cs
└── Controllers/         # EventosController.cs
tests/
├── Unit/                # CreateEventoHandlerTests.cs (xUnit + Moq)
└── Architecture/        # ArchitectureTests.cs (NetArchTest.Rules)
```

A camada Domain não possui dependência de nenhuma outra camada — garantido por testes de arquitetura automatizados.

## Tecnologias

- **Runtime:** .NET 10 / ASP.NET Core 10
- **Banco de dados:** MongoDB (driver oficial 3.x)
- **Documentação:** Swagger / OpenAPI (Swashbuckle)
- **Testes:** xUnit, Moq, NetArchTest.Rules
- **Container:** Docker (multi-stage build)

## Como rodar localmente

### Com Docker Compose (recomendado — sobe MongoDB junto)

Na raiz do monorepo:
```bash
docker-compose up --build ms-catalogo-eventos mongodb-eventos
```

Acesse: `http://localhost:5001/swagger`

### Sem Docker (requer MongoDB local ou Atlas)

```bash
# Configure a connection string no appsettings.json ou via variável de ambiente
export MongoDB__ConnectionString="mongodb://localhost:27017"
export MongoDB__DatabaseName="catalogo_eventos"

cd ms-catalogo-eventos
dotnet run --project src/CatalogoEventos.API
```

### Rodar testes

```bash
cd ms-catalogo-eventos
dotnet test
```

## Endpoints

| Método | Rota | Descrição |
|---|---|---|
| GET | /api/eventos | Lista todos os eventos |
| GET | /api/eventos/{id} | Busca evento por ID |
| POST | /api/eventos | Cria novo evento |
| PUT | /api/eventos/{id} | Atualiza evento |
| DELETE | /api/eventos/{id} | Remove evento |

## Alunos

- Arthur Kenji Kussaba
- Frederico Salvatti Cavalcante
- Eduardo Antonio Babinski Pedroso
