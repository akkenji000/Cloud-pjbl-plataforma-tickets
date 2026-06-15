# DIRETRIZES DE ARQUITETURA - AZURE FUNCTION

## Escopo
Componente Serverless para enriquecimento de dados da plataforma.

## Regras Inegociáveis
1.  **Gatilho:** Deve ser exposta estritamente via HTTP Trigger.
2.  **Responsabilidade:** Executar cálculos isolados ou regras de enriquecimento rápido para compor o payload do BFF.
3.  **Desacoplamento:** Não deve possuir conexão direta com os bancos de dados principais do sistema.