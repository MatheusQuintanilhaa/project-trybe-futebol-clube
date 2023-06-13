import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
import TeamModel from '../../src/database/models/TeamsModel';

import { Model } from 'sequelize';

chai.use(chaiHttp);

const { expect, request } = chai;

describe("Teste de funcionalidade: Pesquisar times", () => {
  beforeEach(sinon.restore);

  const sampleData: TeamModel[] = [
    new TeamModel({ id: 1, teamName: 'Flamengo', }),
    new TeamModel({ id: 2, teamName: 'Vasco'}),
  ];

  const sampleData2 = [
    { id: 1, teamName: 'Flamengo' },
    { id: 2, teamName: 'Vasco' }
  ];

  it('Devera retornar todos os times', async () => {
    sinon.stub(TeamModel, 'findAll').resolves(sampleData);
    const response = await chai.request(app).get('/teams');

    expect(response.status).to.be.equal(200);
    expect(response.body).to.be.deep.equal(sampleData2);
  });

  it('Deve retornar apenas um time', async () => {
    sinon.stub(Model, 'findByPk').resolves(sampleData[0]);
    const response = await request(app).get('/teams/1');

    expect(response.status).to.be.equal(200);
    expect(response.body).to.deep.equal(sampleData2[0]);
  })

})