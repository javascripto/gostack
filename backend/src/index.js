const express = require('express');
const { uuid, isUuid } = require('uuidv4');

const app = express();


const projects = [];

function logRequest(request, response, next) {
  const { method, url } = request;
  const logLabel = `[${method.toUpperCase()}] ${url}`;
  console.time(logLabel);
  next();
  console.timeEnd(logLabel);
}

function validateProjectId(request, response, next) {
  const { id } = request.params;
  return isUuid(id)
    ? next()
    : response.status(400).json({ error: 'Invalid project ID.'});
}

app.use(express.json());
app.use(logRequest);
app.use('/projects/:id', validateProjectId);

app.get('/', (request, response) => {
  return response.json({ message: 'Hello World' });
});

app.get('/projects', (request, response) => {
  const { title } = request.query;
  const result = title
    ? projects.filter(project => project.title.includes(title))
    : projects;
  return response.json(result);
});

app.get('/projects/:id', (request, response) => {
  const { id } = request.params;
  return response.json(projects.find(project => project.id === id));
});

app.post('/projects', (request, response) => {
  const { title, owner } = request.body;
  const project = { id: uuid(), title, owner };
  projects.push(project);
  return response.json(project);
});

app.put('/projects/:id', (request, response) => {
  const { id } = request.params;
  const { title, owner } = request.body;
  const project = projects.find(project => project.id === id);
  if (!project) {
    return response.status(404).json({ message: 'Project not found!'});
  }
  return response.json(Object.assign(project, { id, title, owner }));
});

app.delete('/projects/:id', (request, response) => {
  const { id } = request.params;
  const index = projects.findIndex(project => project.id === id);
  if (index === -1) {
    return response.status(404).json({ message: 'Project not found!'});
  }
  projects.splice(index, 1);
  return response.status(204).json();
});

app.listen(3333, () => {
  console.log('🚀 Back-end started!');
});
