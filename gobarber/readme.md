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


## Alguns conceitos de banco de dados

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
