import express from 'express';
import IndexController from './controllers/IndexController';

const app = express();

app.get('/', IndexController.index);

app.listen(3333);
