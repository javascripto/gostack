import { uuid } from 'uuidv4';
import { Router } from 'express';

const appointmentsRouter = Router();

const appointments = [];

appointmentsRouter.post('/', (request, response) => {
  const { provider, date } = request.body;
  const appointment = {
    id: uuid(),
    provider,
    date,
  };
  appointments.push(appointment);
  response.json(appointment);
});

export default appointmentsRouter;
