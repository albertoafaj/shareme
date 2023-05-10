# :construction: Em desenvolvimento :construction:- ShareMe - Social Mídia

Este é um repositório para prática de implementação de uma aplicação Fullstack com o uso das tecnolodias React, Redux and Tailwind no Frontend e o NodeJs, Express e Postgresql no Backend.  

## Descrição do projeto: 

ShareMe é uma app de rede social Fullstack desenvolvido em React, Redux and Tailwind, NodeJS e Express. Utiliza Jest para unitários, o supertest para testes de integração e Postgresql como banco de dados principal. 

## Funcionalidades do projeto

* Funcionalidade 1: Cadastrar usuário com os serviços de identidade do Google;
* Funcionalidade 2: Ao cadastrar armazenar o token em um cookie com opção HttpOnly no browser;
* Funcionalidade 3: Fazer autologin com autenticação do usuário no backend forncedndo o token armazenado no browser; 
* Funcionalidade 4: :construction: Em desenvolvimento :construction:
* Funcionalidade 5:  :construction: Em desenvolvimento :construction:

## Site do projeto:

:construction: Em desenvolvimento :construction:

## Instalação:

### Clonar o repositório:
```
$ git clone https://github.com/albertoafaj/shareme.git
```
### Instalar as dependências:
```
$ cd ./_backend/api/
$ npm install
$ cd ../../frontend
$ npm install

```
### Instalar Postgresql / PGADIM

https://www.postgresql.org/download/

https://www.pgadmin.org/download/

#### Casdastrar Bancos de dados no Postgres

* tst_shareme
* prd_ranek
   
### Cadastre as variáveis de ambiente

```
$ cd ./_backend/api/
```

Crie o arquivo ```.env``` na raiz do projeto:
```
DB_HOST="Host cadastrado no postgres"
DB_PORT="Porta do serviço postgres"
DB_USER="Usuário cadastrado no postgres"
DB_PASS="Senha cadastrada no postgres"
DB_PROD="prd_ranek"
DB_TEST="tst_ranek"
```

### Rodando a aplicação :

**Backend**
```
$ cd ./_backend/api/
$ npm start
```
**Frontend**
```
$ cd ./frontend/
$ npm start
```


### Testando a aplicação:
**Backend**
```
$ cd ./_backend/api/
$ npm run test
```

## Tecnologias utilizadas

**BackEnd**
* NodeJs
* Express
* Jest
* Supertest
* Knex
* Postgres

**Frontend**
* React
* Redux
* Tailwind

## Créditos: 

O frontend do aplicativo foi desenvolvido utilizando técnicas e trechos de código dó vídeo: 

![ShareMe](https://i.ibb.co/8cLfj3X/image.png);
