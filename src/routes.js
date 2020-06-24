import { Router } from 'express';
// import multer from 'multer';
// import multerConfig from './config/multer';

import UserController from './app/controllers/UserController';
import VideoController from './app/controllers/VideoController';
import WeekController from './app/controllers/WeekController';

import SessionController from './app/controllers/SessionController';
import authMiddleware from './app/middlewares/auth';

const routes = new Router();
// const upload = multer(multerConfig);

routes.post('/users', UserController.store);
routes.post('/login', SessionController.store);

routes.use(authMiddleware);
routes.get('/users', UserController.index);
routes.get('/videos', VideoController.index);
routes.get('/weeks', WeekController.index);
routes.post('/weeks', WeekController.store);
routes.put('/weeks', WeekController.update);
// routes.put('/users', UserController.update);

export default routes;
