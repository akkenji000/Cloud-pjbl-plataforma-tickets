# DIRETRIZES DE ARQUITETURA - MICROSSERVIÇO 1 (CATÁLOGO)

## Escopo
Domínio de Produtos/Eventos com persistência NoSQL.

## Regras Inegociáveis
1.  **Banco de Dados:** Utilização exclusiva do MongoDB.
2.  **Metodologias:** Aplicação rigorosa de Clean Architecture e Vertical Slice (separação por Features).
3.  **Funcionalidade:** Exigido CRUD completo das entidades do domínio.
4.  **Documentação:** O Swagger deve ser configurado e exposto para documentação dos endpoints da API.