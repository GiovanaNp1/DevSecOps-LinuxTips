# Desafio Magalu

Projeto de API REST utilizando NodeJS e Clean Architecture 


### Pré-requisitos

Foram usados as seguintes tecnologias

- [NodeJS](https://nodejs.org/pt/blog/release/v22.11.0) - Versão v22.11.0
- [NPM](https://www.npmjs.com/) - Versão v10.9.0
- [MongoDB](https://www.mongodb.com/products/platform/atlas-database) - Utilizado MongoDB Atlas

### Explicação sobre o projetos

A Ideia do projeto seria criar uma API simples, pensando em resiliencia e armazenamento eficaz de cada componente, utilizando as maiores vantagens de Moogose e de bancos de dados com utilização de indexações para tratativas de erros. 

Alguns pontos importantes sobre cada ideia, para conseguir a preveção de dados duplicados, resolvi utilizar dentro dos models bloqueios de index unicos para ter a prevenção de dados duplicados e ter a consistencia maior do que seria permitido em cada documento ou não.
Para autenticação resolvi utilizar o JWT configurado para 1 hora de token, por mais que possui a possibilidade de fazer o utilizador de refrash tokens, não vi necessidades de utilizar nesse momento o projeto.

Tambem para me auxiliar na velocidade de produção de Documentações de sistemas, utilizei a biblioteca do swagger-autogen que utiliza OpenAI para auxiliar na criação de uma documentação com maior velocidade.

Coisas que gostaria de ter feito a realização seria para nas chamadas de GET de sistema, criar uma resiliencia de buscar na API ofertada no desafio e que em caso do sistema estivesse fora do ar, conseguir puxar das bases criadas no MongoDB e Testes de software para ter uma maior base de qualidade de software

A Arquitetura está na seguinte estrutura:

Desafio/
-  API/controllers/ Lógica que se encontra os controle de cada requisição
-  API/routes/ Arquivo de definições de rotas de sistemas
-  domain/useCases/ Regras de negócio e casos unicos de sistema
-  domain/Models/ Modelagem de Objetos de sistemas 
-  infra/database/ Criação de logicas de acesso aos dados de database
-  infra/services/ Serviço de chamadas externas de aplicação
-  auth/ Arquivo de configuração de autheticação
-  config/ Arquivos de configuração
-  .env Variavel de ambiente
-  index.js Local de Runtime inicial, local de rotas pais e injeções de dependencias
-  README.md documentação de sistema


