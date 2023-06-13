import { Request, Response, Router } from 'express';
import TeamController from '../controllers/TeamControllers';
import TeamService from '../services/TeamServices';

const routes = Router();
const teamService = new TeamService();
const teamController = new TeamController(teamService);

routes.get('/teams/:id', (req: Request, res: Response) => teamController.getById(req, res));
routes.get('/teams', (req: Request, res: Response) => teamController.getAll(req, res));

export default routes;