# DIRETRIZES DE ARQUITETURA - BFF AGGREGATOR (NODE.JS)

## Escopo
Atuar como Backend for Frontend, consolidando os dados dos microsserviços e da função serverless para o Microfrontend.

## Regras Inegociáveis
1.  **Agregação:** O endpoint principal (ex: `GET /aggregated-data`) deve consumir simultaneamente o Microsserviço 1 (Mongo), Microsserviço 2 (SQL) e a Azure Function, retornando tudo em um único response JSON.
2.  **Proxy CRUD:** Deve atuar como proxy transparente para operações de escrita ou leitura isoladas nos microsserviços.
3.  **Documentação:** O Swagger deve ser exposto obrigatoriamente.