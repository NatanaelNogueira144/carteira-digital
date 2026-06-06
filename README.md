## Sobre o Projeto

- Controle financeiro de entradas e saídas, com um layout elegante, gráficos informativos e cards responsivos.
- Dashboard desenvolvido em **ReactJs** com **TypeScript** inteiramente componentizado com **componentes puros**.
- Os dados são carregados a partir de uma integração com a **Backend API** respectiva deste projeto.

## Layout & Componentes Responsivos

- [x] Para os gráficos, foi utilizada a bibliteca [**Recharts**](http://recharts.org/en-US) que é opensource.
- [x] Para efeito de número crescendo foi utilizada a biblioteca [**React CountUp**](https://www.npmjs.com/package/react-countup).

## Como Instalar

- Dentro de apps/backend, crie um novo arquivo .env e copie e cole nele o conteúdo que está em .env.sample, substituindo pelos valores de seu ambiente (caso necessário).
- Dentro de apps/frontend, crie um novo arquivo .env e copie e cole nele o conteúdo que está em .env.sample, substituindo pelos valores de seu ambiente (caso necessário).
- Após isto, instale as dependências, executando este comando no terminal, na pasta raiz:

```
pnpm install
```

Pronto! Agora é só executar o seguinte comando na pasta raiz para rodar ambos os apps:

```
pnpm start:dev
```

<div align="center">
  <small>Natanael Nogueira - 2025</small>
</div>