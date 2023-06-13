import { Request, Response, Router } from 'express';

import UserController from '../controllers/UserControllers';
import validateLogin from '../middlewares/UserMiddlewares';
import verifyToken from '../middlewares/verifyToken';

const router = Router();

const controller = new UserController();

router.get(
  '/login/role',
  verifyToken,
  (_req: Request, res: Response) => res.status(200).json({ role: res.locals.user.role }),
);

router.post('/login', validateLogin, controller.login);

export default router;
