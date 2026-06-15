# DIRETRIZES DE ARQUITETURA - MICROSSERVIÇO 2 (PEDIDOS)

## Escopo
Domínio de transações e pedidos com persistência relacional.

## Regras Inegociáveis
1.  **Banco de Dados:** Utilização exclusiva de SQL Server / Azure SQL.
2.  **Metodologias:** Aplicação rigorosa de Clean Architecture e Vertical Slice (separação por Features).
3.  **Funcionalidade:** Exigido CRUD completo das entidades do domínio.
4.  **Documentação:** O Swagger deve ser configurado e exposto para documentação dos endpoints da API.