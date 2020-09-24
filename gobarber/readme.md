# GoBarber

## O que foi feito até agora?

Foi definido o escopo inicial da aplicação:
GoBarber. Uma aplicação para gerenciar o agendamento de horários em uma barbearia
Foram criadas duas rotas na aplicação:
Uma rota que faz a listagem de todos os agendamentos e outra que cria novos agendamentos.

Inicialmente Foi criado um arquivo de rotas com toda a lógica inicial de requisições e respostas referentes a agendamentos na barbearia.

Os agentadentos eram armazenados em um simples array na memória da aplicação.

```ts
// ...
const appointmentsRouter = Router()
const appointments = [];
appointmentsRouter
  .get('/', (req, res) => res.json(appointments));
  .post('/', (req, res) => {
    const appointment = {id: uuid(), ...req.body };
    appointments.push(appointment);
    return res.json(appointment);
  });
routes.use('/appointments', appointmentsRouter)
// ...
```

Cada agendamento era criado como um objeto literal simples com três propriedades: um identificador único gerado pela lib uuidv4 (id), o nome do barbeiro (provider) e a data do agendamento (date).

```ts
interface Appointment {
  id: string;
  provider: string;
  date: Date;
}
```

As unicas regras de negócio definidas eram:

1. Não é permitido dois agendamentos para o memso horário
2. Agendamentos são marcados sempre no minuto zero da hora selecionada.

Depois do MVP inicial, a aplicação foi dividida em mais partes, cada uma com sua responsabilidade específica para seguir o conceito de SoC (Separation of Concerns).

O ponto inicial da aplicação continua sendo a rota que recebe uma requisição e transforma a data recebida como string em um objeto `Date` da aplicação.

Depois o handler da rota instancia um serviço (`CreateAppointmentService`) de responsabilidade única para criação de um novo agendamento (`Appointment`) por meio do método execute.

Para representar a forma com que o agendamento é salva na aplicação vamos criar uma classe Model chamada `Appointment`. Essa classe recebe no construtor um objeto com as propriedades `date` e `provider` para criação da entidade agendamento e gera um id a partir da lib uuidv4.

As classes de Service e Model não devem ter a responsabilidade de manipular o acesso a dados. Para isso vamos usar uma outra classe `Repository` chamada `AppointmentsRepository`. Ela será repsponsável por salvar nos dados na aplicação e buscar por agendamentos em um determinado horário.

O fluxo da criação de um novo agendamento fica da seguinte forma:
`Rota -> Requesthandler -> Service -> Repository -> resposta do Requesthandler`

### Mais detalhes:

- Diferente do padrão ActiveRecord onde a própria classe Model manipula o acesso a dados, a - aplicação usou o padrão Repository para esta funcionalidade.
- Repository é injetado no service seguindo o DIP do SOLID.
- Service usa repository para manipular dados.
- Service armazena toda regra de negócio.
- Service não conhece objeto de Request/Response do framework.
- Service podem lançar exceções que serão capturadas no RequestHandler/Controller.
- Dados entre camadas distintas da aplicação são trafegados por meio de DTO's.

## Alguns conceitos de Arquitetura de Software

- `SoC`: Separation of Concerns (Separação de preocupações)
- `DTO` - Data Transfer Object (Objeto de transferência de dados)
- `Model`/`Entidade`: Representação de como um dado é salvo na aplicação
- `Repository` - Classe responsável por manipular o acesso a dados dados
- Rotas - Mapeiam urls para seus respectivos controllers
- `Controller` - Controla o fluxo de requisições e respostas da aplicação delegando responsabilidade para outra classe
- `Service` - Responsável por tratar da regra de negócio da aplicação. Geralmente cada service tem uma única responsabilidade/método chamado de execute ou run por exemplo
- `DRY` - Don't Repeat Yourself

### SOLID

- `SRP` - Single Responsability Principle (SOLID) - Principio da Responsabilidade única
- `DIP` - Dependency Inversion Principle (SOLID) - Principio da Inversão de Dependência


## Docker

## Definições

- Imagem: Sistema/Software/Pacote modelo como base
- Container: instancia de uma imagem
- Docker Registry (Docker Hub)
- DockerFile: receita de uma imagem
- Instalação: https://www.notion.so/Instalando-Docker-6290d9994b0b4555a153576a1d97bee2

### Exemplo de um DockerFile

```DockerFile
# Partimos de uma imagem existente
FROM node:10

# Definimos a pasta de trabalho e copiamos os arquivos
WORKDIR /usr/app
COPY . ./

# Instalamos as dependencias
RUN yarn

# Qual porta queremos expor?
EXPOSE 3333

# Executamos nossa aplicação
CMD yarn start
```

### TODO

- [ ] Pesquisar sobre docker nativo do windows nas novas versões

### Rodando uma imagem postgres

- Porta do postgres: 5432
- Verificar execução da porta: lsof -i | grep 5432
- Comando:

  ```sh
  docker run \
    --name gostack_postgres \
    -e POSTGRES_PASSWORD=docker \
    -p 5432:5432 \
    -d postgres
  ```

#### Parametros:

- `--name`: apelido_dado_localmente
- `-e`: Variavel de ambiente
- `-p`: porta_da_maquina:porta_do_container
- `-d`: nome da imagem

### Alguns comandos do docker

- Listando containers: `docker ps`
- Listando todos containers: `docker ps -a`
- Ver saida de logs de um container: `docker logs bf44c1cd8d78`
- Parando container: `docker stop bf44c1cd8d78`
- Iniciando container por nome ou id: `docker start gostack_postgres`


### Outros detalhes

- Usuario padrão: postgres
- Senha configurada das variaveis de ambiente: docker
- Clientes sugeridos: dbeaver, postbird, navicat, sequelpro, heidisql
- Cheat sheet: https://www.postgresqltutorial.com/postgresql-cheat-sheet/

## TypeORM

- NPM Script do typeorm typescript: `ts-node-dev ./node_modules/typeorm/cli.js`
- Criando migration: `yarn typeorm migration:create -n CreateAppointments`
- Rodando migration: `yarn typeorm migration:run`
- Desfazer migration `yarn typeorm migration:revert`
- Migrations não devem ser alteradas depois de enviadas para branch master
- Alterações na base e tabelas devem ser feitas todas a partir de migrations
- Migration da tabela appointments

  ```ts
  import { MigrationInterface, QueryRunner, Table } from 'typeorm';

  class CreateAppointments1594186870103 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.createTable(
        new Table({
          name: 'appointments',
          columns: [
            {
              name: 'id',
              type: 'varchar',
              isPrimary: true,
              generationStrategy: 'uuid',
            },
            {
              name: 'provider',
              type: 'varchar',
              isNullable: false,
            },
            {
              name: 'date',
              type: 'timestamp with time zone', // Apenas postgres
              isNullable: false,
            },
          ],
        }),
      );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.dropTable('appointments');
    }
  }

  export default CreateAppointments1594186870103;

  ```

- Model da tabela appointments

  ```ts
  import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

  @Entity('appointments')
  class Appointment {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    provider: string;

    @Column('timestamp with time zone')
    date: Date;
  }

  export default Appointment;

  ```

### Resumo do que foi feito:

- Instalação do driver de postgres (pg)
- Instalação do ORM typeorm e configuração para rodar com typescript
- Instalação do reflect-metadata que é uma dependencia muito usada no typescript
- Configuração da conexão com o banco de dados
- Criação de migration
- Adaptação de model e repository para integrar com typeorm


## Cadastro de usuários

### Alteração de colunas por meio de migrations

```ts
import {
  QueryRunner,
  TableColumn,
  TableForeignKey,
  MigrationInterface,
} from 'typeorm';

class AlterProviderFieldToProviderId1594345210734 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('appointments', 'provider');
    await queryRunner.addColumn('appointments', new TableColumn({
      name: 'provider_id',
      type: 'uuid',
      isNullable: true,
    }));
    await queryRunner.createForeignKey('appointments', new TableForeignKey({
      name: 'AppointmentProvider',
      columnNames: ['provider_id'],
      referencedColumnNames: ['id'],
      referencedTableName: 'users',
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('appointments', 'AppointmentProvider');
    await queryRunner.dropColumn('appointments', 'provider_id');
    await queryRunner.addColumn('appointments', new TableColumn({
      name: 'provider',
      type: 'varchar',
    }));
  }
}

export default AlterProviderFieldToProviderId1594345210734;

```

### Opções de chave extrangeira ao remover/alterar registros
  - `RESTRICT`  Não deixa deletar o usuario
  - `SET NULL`: Seta o provider_id como nulo
  - `CASCADE`: Deleta todos agendamentos ao deletar o usuario
  - Detalhes: http://www.bosontreinamentos.com.br/mysql/opcoes-de-chave-estrangeira-mysql/

### Relacionamentos

#### Tipos de relacionamentos entre classes:

- Agregação
- Composição
- Dependencia

#### Cardinalidade nos relacionamentos: 1:1, 1:N, N:N

- Um para Um (OneToOne)
  - 1 usuário tem 1 agendamento e vice versa
- Um para Muitos (OneToMany)
  - 1 usuário pode ter mais de 1 agendamento
- Muitos para Muitos (ManyToMany)
  - usuários podem ter mais de 1 agentamento e agendamentos podem atender mais de 1 usuário por vez

### Resumo do que foi feito

- Criação do Model User e da Migration da tabela users
- Criação de migration que modifca campo da tabela appointments
- Relacionamento entre users e appointments
- Definição de estratégia de remoção e atualização em tabelas relacionadas
- Criação de rota e service para criação de usuários


## Autenticação

### Resumo do que foi feito

- Autenticação com JWT
- Middleware de autenticação e proteção de endpoints privados
- Declaração de tipos complementares para bibliotecas existentes


## Upload de arquivos

### Resumo do que foi feito

- Utilização da library multer para upload de arquivos
- Adição de uma nova coluna na tabela de usuarios para armazenar o diretorio do avatar
- Criação de rota estática para disponibilizar imagens de avatres dos usuarios
- Nova request de upload com a extensão RestClient
- Uso da extensão do drawio para criar um avatar de exemplo

## Lidando com erros

### Resumo do que foi feito

- Criação e uso da classe de erros da aplicação
- Remoção de blocos try/catch nos request handlers
- Exposição de erros personalizados para o cliente e ocultacão de erros internos
- Configuração de middleware de error handler que recebe um callback com 4 argumentos

### Arquitetura e DDD

#### Separação em modulos, contextos limitados, organizando estrutura de diretorios

Estrutura da plicação foi modificada. Dentro de src agora temos inicialmente três diretorios (config, modules, shared).

O diretório modules é onde a aplicação separa contextos de dominio, já o shared é onde ficam recursos compartilhados em toda aplicação.

#### Camada de domínio x Camda de infra

Na camada de dominio ficam as regras de negocio e a area de conhecimento de um dominio.
Na camada de infraficam ferramentas escolhidas para se relacionar com camada de dominio.
Ex: database, email, tecnologias usadas na aplicação que são discutidas pelo CTO e devs.
O arquivo server.ts, rotas da aplicação e middlewares foram movidos para shared/infra/http pois estão ligados ao framework express e protocolo http. Caso algum dia a aplicação mude a forma de comunicação para grpc por exemplo, os arquivos já estão separados.
Migrations do typeorm foram movidas para shared/infra/typeorm pois estão ligadas com a tecnologia de banco.
O diretorio de erros apenas foi movido para shared/erros porque são compartilhados na aplicação mas nao fazem parte da camada de infra.
Dentro de cada modulo que temos até o momento (users, appointments), tambem temos uma camada de infra.
Entidades models do typeorm foram movidas para camada de infra de cada modulo pois estão ligadas diretamente com o typeorm por meio de decorators.
Services, repositories tambem foram separados e estão em seus respectivos diretorios separados por módulos.

#### Configurando import paths no tsconfig

Para termos imports sem caminhos relativos, podemos usar atalho como `import User from '~models/users'` ou `import User from '@models/users'`.
Para isso é necessário configurar duas propriedades no `tsconfig.json`: `baseUrl` e `paths`
Também é necessário utilizar um plugin para o `ts-node-dev` entender os atalhos de importação

- Configuração do `tsconfig`

```json
"baseUrl": "./src",
"paths": {
  "@modules/*": ["modules/*"],
  "@config/*": ["config/*"],
  "@shared/*": ["shared/*"]
},
```

- Plugin para `ts-node-dev`: `yarn add -D tsconfig-paths`.
- Após instalar o plugin, altere no `package.json` os scripts de execução do `ts-node-dev` para registrar o plugin:
`ts-node-dev -r tsconfig-paths/register --inspect --transpile-only --ignore-watch node_modules src/shared/infra/http/server.ts`

#### Liskov Substitution Principle

O Repositorio de appointments extende da uma classe do typeorm e isso deixa a classe de repository muito acoplada à tecnologia usada.
Para desfazer esse acoplamento vamos mover o repository para camada de infra do modulo de appointments e criar uma interface de Repository no diretório que a classe Appointments se encontrva antes.
A interface servirá para abstrair o comportamento do repositório para que o mesmo possa ser substituído caso necessário.
Assim a aplicação passa a não conhecer mais a tecnologia de armazenamento utilizada, podendo implementar outras classes de repositorio que obtenha os dados da memoria do computador no lugar de um banco de dados por exemplo.
Essa alteração é uma forma de aplicar o princípio de substituição de Liskov. É o princípio que representa a letra "L" no acrônimo S.O.L.I.D.

### Reescrevendo repositorio

Para desacoplar as classes de repository da tecnologia typeorm, vamos remover a instrução de herança e o decorator usado nas classes de repository.
Para usarmos ainversão de dependencia e fazermos a aplicação depender de abstrações ao invés de implementações, tambem declaramos interfaces para os repositorios da aplicação (UsersRepository, AppointmentsRepository). Cada repositorio deve implementar algums métodos utilizando o Repository do typeorm mas sem herança de classes que trazem métodos extras para a classe.
Assim podemos ter mais controle do que a classe de reposity faz.

### Injeção de dependencias

Até agora estávamos instanciando manualmente cada repository e service usado dos endpoints da aplicação. Já estávamos proparados com principios SOLID para desacoplar a aplicação por meio de interfaces, inversão de dependencia, e substituição de classes de mesma interface etc. Agora vamos usar algo para facilitar o trabalho de obter instancias das classes utilizadas como singletons por meios de containers de injeção de dependencias providos pela biblioteca `tsyringe` da microsoft.

- Primeiro isntalamos a lib com o comando: `yarn add tsyringe`
- Depois registramos as classes que serão injetadas como dependencias nos construtores de outras classes.

```ts
container.registerSingleton<IUsersRepository>(
  UsersRepository.name,
  UsersRepository,
);
```

- Agora já podemos marcar nossas classes de serviços com o decorator `@injectable()` para permitir recuperar isntancias das mesmas nos endpoints. Tambem marcamos as dependencias da classe com o decorator `@inject()` e informamos qual classe será registrada como implementação para abstracóes de determinadas interface.

```ts
@injectable()
class CreateUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  execute() { /*...*/ }
}
```
- Por ultimo vamos substituir as instancias dos Repositories e Services nos arquivos de rotas pela instancia do serviço que cada rota usa e que é obtido por meio do container de injeção de dependencias por meio do método `resolve()`.

```ts
const createUser = container.resolve(CreateUserService);
createUser.execute(/*...*/)
```

### Configuração do Jest para testes com typescript

- `yarn add jest ts-jest @types/jest -D`
- `yarn jest --init`
- Após a instalação e inicialização do jest, algumas configurações precisam ser feitas no `jest.config.js` e `.eslintrc.json`

```js
// jest.config.js

const { pathsToModuleNameMapper } = require('ts-jest/utils')
const { compilerOptions } = require('./tsconfig.json')

{
  preset: 'ts-jest',
  testMatch: [
    "**/*.(spec|test).ts"
  ],
  // ConfiguraçÕes de cobertura de testes
  collectCoverage: true,
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    '<rootDir>/src/moduels/**/services/*.ts'
  ],
  coverageReporters: [
    "text-summary",
    "lcov",
  ],
  // Configuração para utilizar import path customizado
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: '<rootDir>/src/'
  }),
}
```

```js
// .eslintrc.json
{
  "env": {
    "es6": true,
    "node": true,
    "jest": true
  },
}
```

- Para facilitar os testes unitários da aplicação, algumas classes foram alteradas para respeitar alguns principios do SOLID e também facilitar a substituição por classes dublês nos testes. Exemplo: FakeUsersRepository, FakeAppointmentsRepository HashProvider, StorageProvider.

- Uma coisa que percebi referente ao container de injeção de  dependencias é que classes ue possuem construtor não podem ser registradas no container como singleton, mas sim com instancia já instanciando a mesma:

```ts
container.registerInstance<IMailProvider>(
  'MailProvider',
  new EtherealMailProvider(),
);

```
