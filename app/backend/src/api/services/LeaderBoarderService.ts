import { ModelStatic } from 'sequelize';
import { orderResults, getLeaderboardResults, leaderboardAll } from '../../utils/LeaderBoardUtils';
import Teams from '../../database/models/TeamsModel';
import Matches from '../../database/models/MatchesModel';
import InterfaceTeamLeaderboard from '../../Interfaces/InterfaceTeamLeaderBoard';

class LeaderboardService {
  protected modelMatches: ModelStatic<Matches> = Matches;
  protected modelTeams: ModelStatic<Teams> = Teams;

  async getHomeTeamRankings(): Promise<InterfaceTeamLeaderboard[]> {
    const findTeam = await this.modelTeams.findAll();
    const findMathes = await this.modelMatches.findAll({ where: { inProgress: false } });
    const result: InterfaceTeamLeaderboard[] = [];
    findTeam.forEach((t) => {
      const matche = findMathes.filter((m) => m.homeTeamId === t.id);
      result.push(getLeaderboardResults(t.teamName, matche, ['homeTeamGoals', 'awayTeamGoals']));
    });

    return orderResults(result);
  }

  async getAwayTeamRankings(): Promise<InterfaceTeamLeaderboard[]> {
    const findTeam = await this.modelTeams.findAll();
    const findMathes = await this.modelMatches.findAll({ where: { inProgress: false } });
    const result: InterfaceTeamLeaderboard[] = [];
    findTeam.forEach((t) => {
      const matche = findMathes.filter((m) => m.awayTeamId === t.id);
      result.push(getLeaderboardResults(t.teamName, matche, ['awayTeamGoals', 'homeTeamGoals']));
    });

    return orderResults(result);
  }

  async getAllTeamRankings(): Promise<InterfaceTeamLeaderboard[]> {
    const findTeam = await this.modelTeams.findAll();
    const findMathes = await this.modelMatches.findAll({ where: { inProgress: false } });
    const result: InterfaceTeamLeaderboard[] = [];
    findTeam.forEach((t) => {
      const matcheHome = findMathes.filter((m) => m.homeTeamId === t.id);
      const matcheAway = findMathes.filter((m) => m.awayTeamId === t.id);
      result.push(leaderboardAll(t.teamName, matcheHome, matcheAway));
    });

    return orderResults(result);
  }
}

export default LeaderboardService;
