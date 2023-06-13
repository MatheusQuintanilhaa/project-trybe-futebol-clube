import TeamsModel from '../database/models/TeamsModel';

export default interface InterfaceServiceTeam {
  getAll(): Promise<TeamsModel[]>;
  getById(id: number): Promise<TeamsModel | null>;
}
