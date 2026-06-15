# DIRETRIZES DE ARQUITETURA - MICROFRONTEND (REACT)

## Escopo
Interface Single Page Application (SPA) para consumo de dados da plataforma de tickets.

## Regras Inegociáveis
1.  **Comunicação Restrita:** O frontend deve consumir dados EXCLUSIVAMENTE do BFF (`bff-nodejs`). É proibida qualquer chamada HTTP direta para as portas dos microsserviços ou para a Azure Function.
2.  **Tecnologia:** Utilizar React.
3.  **Responsabilidade:** Foco apenas na renderização de UI, tratamento de estado visual e exibição de erros amigáveis. Regras de negócio pesadas devem ser repassadas ao BFF.