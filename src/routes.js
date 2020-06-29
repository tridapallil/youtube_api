import { Router } from 'express';
// import multer from 'multer';
// import multerConfig from './config/multer';

import UserController from './app/controllers/UserController';
import VideoController from './app/controllers/VideoController';
import SearchedController from './app/controllers/SearchedController';
import WatchController from './app/controllers/WatchController';
import WatchedController from './app/controllers/WatchedController';
import WatchingController from './app/controllers/WatchingController';
import WeekController from './app/controllers/WeekController';

import SessionController from './app/controllers/SessionController';
import authMiddleware from './app/middlewares/auth';

const routes = new Router();
// const upload = multer(multerConfig);

routes.post('/users', UserController.store);
routes.post('/weeks', WeekController.store);
routes.post('/login', SessionController.store);

routes.use(authMiddleware);
routes.get('/users', UserController.index);
routes.put('/users', UserController.update);
routes.get('/videos', VideoController.index);
routes.get('/videos/:id', VideoController.index);
routes.get('/searched', SearchedController.index);
routes.get('/watching', WatchingController.index);
routes.get('/watched', WatchedController.index);
routes.get('/watch', WatchController.index);
routes.get('/weeks', WeekController.index);
routes.put('/weeks', WeekController.update);

export default routes;
