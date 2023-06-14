import { Router } from 'express';
import MatcheController from '../controllers/MatchesControllers';
import verifyToken from '../middlewares/verifyToken';

const matcheRoutes = Router();

const controller = new MatcheController();

matcheRoutes.get('/matches', controller.acquireAllInProgress);
matcheRoutes.patch('/matches/:id/finish', verifyToken, controller.lastUpdate);
matcheRoutes.patch('/matches/:id', verifyToken, controller.updateGoals);
matcheRoutes.post('/matches', verifyToken, controller.create);

export default matcheRoutes;
