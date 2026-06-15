# Azure Function — Cálculo de Taxas

Função serverless responsável pelo cálculo de taxa de conveniência da Plataforma de Tickets.

## Arquitetura

Implementa o padrão **Serverless** via **Azure Functions v4** com modelo Isolated Worker:

```
TaxasFunction/
├── Program.cs                # HostBuilder — configuração do isolated worker
├── CalcularTaxaFunction.cs   # HTTP Trigger — lógica de cálculo de taxa
├── host.json                 # Configuração do runtime do Azure Functions
└── local.settings.json       # Configurações locais de desenvolvimento
```

**Regra de negócio:**
- `userId` contém `"vip"` → taxa de **5%**
- Demais usuários → taxa de **10.5%**

## Tecnologias

- **Runtime:** .NET 8 (net8.0 — requisito da imagem base Docker do Azure Functions isolated worker)
- **Framework:** Azure Functions v4 Isolated Worker
- **Container:** Docker (`azure-functions/dotnet-isolated:4-dotnet-isolated8.0`)

## Como rodar localmente

### Com Docker Compose

Na raiz do monorepo:
```bash
docker-compose up --build azure-function
```

Teste no browser:
```
http://localhost:7071/api/calcular-taxa?userId=usuario&preco=450
http://localhost:7071/api/calcular-taxa?userId=usuario-vip&preco=450
```

### Com Azure Functions Core Tools

```bash
cd azure-function/TaxasFunction
func start
```

## Endpoint

| Método | Rota | Parâmetros |
|---|---|---|
| GET | /api/calcular-taxa | `userId` (string), `preco` (decimal) |

**Resposta:**
```json
{
  "percentualAplicado": 10.5,
  "valorTaxa": 47.25,
  "mensagem": "Taxa de conveniência padrão aplicada.",
  "origem": "Azure Function"
}
```

## Alunos

- Arthur Kenji Kussaba
- Frederico Salvatti Cavalcante
- Eduardo Antonio Babinski Pedroso
