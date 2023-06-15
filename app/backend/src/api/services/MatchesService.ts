import { ModelStatic } from 'sequelize';
import Teams from '../../database/models/TeamsModel';
import Matches from '../../database/models/MatchesModel';
import InterfaceResponse from '../../Interfaces/InterfaceResponse';
import InterfaceMatches from '../../Interfaces/InterfaceMatches';
import InterfaceCreateMatches from '../../Interfaces/InterfaceCreateMatches';

class MatcheService {
  protected model: ModelStatic<Matches> = Matches;
  protected teamModel: ModelStatic<Teams> = Teams;

  async getAll(): Promise<Matches[]> {
    return this.model.findAll({ include: [
      { model: Teams, as: 'homeTeam' },
      { model: Teams, as: 'awayTeam' },
    ] });
  }

  async acquireAllInProgress(inProgress: boolean): Promise<Matches[]> {
    return this.model.findAll(
      {
        where: { inProgress },
        include: [
          { model: Teams, as: 'homeTeam' },
          { model: Teams, as: 'awayTeam' },
        ],
      },
    );
  }

  async lastUpdate(id: number): Promise<InterfaceResponse> {
    this.model.update({ inProgress: false }, { where: { id } });

    return { message: 'Finished' };
  }

  // async updateGoals(body: InterfaceMatches, id: number): Promise<InterfaceResponse> {
  //   this.model.update(body, { where: { id } });

  //   return { message: 'updated goals' };
  // }

  async updateGoals(body: InterfaceMatches, id: number): Promise<InterfaceResponse> {
    await this.model.update(body, { where: { id } });

    return { message: 'updated goals' };
  }

  async create(body: InterfaceCreateMatches): Promise<InterfaceResponse> {
    const { homeTeamId, awayTeamId } = body;

    const findHomeTeam = await this.teamModel.findByPk(homeTeamId);
    if (!findHomeTeam) return { type: 404, message: 'There is no team with such id!' };

    const findAwayTeam = await this.teamModel.findByPk(awayTeamId);
    if (!findAwayTeam) return { type: 404, message: 'There is no team with such id!' };

    if (homeTeamId === awayTeamId) {
      return {
        type: 422,
        message: 'It is not possible to create a match with two equal teams',
      };
    }

    const created = await this.model.create({ ...body, inProgress: true });

    return { createdMatche: created };
  }
}

export default MatcheService;
