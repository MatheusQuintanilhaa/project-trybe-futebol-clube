import { Request, Response } from 'express';
import LeaderboardService from '../services/LeaderBoarderService';

class LeaderboardController {
  private _service: LeaderboardService = new LeaderboardService();

  getRankHome = async (_req: Request, res: Response) => {
    const result = await this._service.getHomeTeamRankings();

    return res.status(200).json(result);
  };

  getRankAway = async (_req: Request, res: Response) => {
    const result = await this._service.getAwayTeamRankings();

    return res.status(200).json(result);
  };

  getRankAll = async (_req: Request, res: Response) => {
    const result = await this._service.getAllTeamRankings();

    return res.status(200).json(result);
  };
}

export default LeaderboardController;
