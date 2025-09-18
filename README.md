# Infinity Pai - Proposta de Agentes para o Desafio Inteli

Este é um projeto de sistema de agentes de IA criado com Next.js, Genkit e ShadCN UI como proposta para o desafio da Inteli.

## Deploy

[Link para o Deploy da Aplicação](https://your-deployment-link.com)

## Rodando Localmente

Siga estas instruções para obter uma cópia local do projeto em funcionamento.

### Pré-requisitos

Certifique-se de ter o Node.js (versão 18 ou superior) e o npm instalados em sua máquina.

- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/get-npm)

### Configuração da API Key

1.  Este projeto utiliza a API do Google Gemini. Você precisará de uma chave de API. Obtenha sua chave em [Google AI Studio](https://aistudio.google.com/app/apikey).
2.  Na raiz do projeto, crie um arquivo chamado `.env`.
3.  Dentro do arquivo `.env`, adicione a seguinte linha, substituindo `<SUA_CHAVE_API_AQUI>` pela sua chave do Gemini:
    ```
    GEMINI_API_KEY=<SUA_CHAVE_API_AQUI>
    ```

### Instalação e Execução

1.  Clone o repositório (se ainda não o fez).
2.  Instale as dependências do projeto:
    ```bash
    npm install
    ```
3.  Para rodar o servidor de desenvolvimento do Genkit (que gerencia os agentes de IA), execute em um terminal:
    ```bash
    npm run genkit:watch
    ```
4.  Em **outro** terminal, para rodar a aplicação Next.js (a interface do usuário), execute:
    ```bash
    npm run dev
    ```
5.  Abra [http://localhost:9002](http://localhost:9002) no seu navegador para ver a aplicação.
