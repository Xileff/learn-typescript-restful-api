import express from 'express';
import { authMiddleware } from '../middleware/auth-middleware';
import { UserController } from '../controller/user-controller';
import { ContactController } from '../controller/contact-controller';

export const apiRouter = express.Router();
apiRouter.use(authMiddleware); // after this line, if user is authenticated -> 'req' object will have 'user' data. otherwise the request will stop here.

// Users
apiRouter.get('/api/users/current', UserController.get);
apiRouter.patch('/api/users/current', UserController.update);
apiRouter.delete('/api/users/current', UserController.logout);

// Contacts
apiRouter.post('/api/contacts', ContactController.create);
apiRouter.get('/api/contacts/:contactId(\\d+)', ContactController.get);
apiRouter.put('/api/contacts/:contactId(\\d+)', ContactController.update);
