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
