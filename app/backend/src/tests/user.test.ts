import * as sinon from 'sinon';
import * as chai from 'chai';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
import UserModel from '../database/models/UserModel';

import { Model } from 'sequelize';

chai.use(chaiHttp);

const { expect, request } = chai;

const JASON_WEB_TOKEN_SECRET = process.env.JWT_SECRET || 'secret' as string;
describe('Vefificando a aplicação: POST /login', () => {
  beforeEach(sinon.restore);

  const user = new UserModel({
    id: 1,
    username: 'Matheus Quintanilha',
    role: 'admin',
    email: 'matheus.quintanilha@gmail.com',
    password: '123456'
  })

  it('Deve retornar um token JWT com sucesso', async () => {
    const body = { email: 'matheus.quintanilha@gmail.com', password: '123456'}

    sinon.stub(Model, 'findOne').resolves(user);
    sinon.stub(bcrypt, 'compareSync').resolves(true);

    const result = await request(app).post('/login').send(body);

    expect(result.status).to.be.equal(200);
    expect(result.body).to.haveOwnProperty('token');
  });

  it('Deve retornar um erro caso o email não exista', async () => {
    const body = { email: '', password: '123456'}

    sinon.stub(Model, 'findOne').resolves(user);
    sinon.stub(bcrypt, 'compareSync').resolves(true);

    const result = await request(app).post('/login').send(body);

    expect(result.status).to.be.equal(400);
    expect(result.body).to.deep.equal({ message: 'All fields must be filled'})
  });

  it('Deve retornar um erro caso o formato do email seja inválido', async () => {
    const body = { email: 'emailinválido', password: '123456'}

    sinon.stub(Model, 'findOne').resolves(user);
    sinon.stub(bcrypt, 'compareSync').resolves(true);

    const result = await request(app).post('/login').send(body);

    expect(result.status).to.be.equal(401);
    expect(result.body).to.deep.equal({ message: 'Invalid email or password'})
  });

  it('Deve retornar um erro caso não existir um usuário com o password', async () => {
    const body = { email: 'matheus.quintanilha@gmail.com', password: ''}

    sinon.stub(Model, 'findOne').resolves(user);
    sinon.stub(bcrypt, 'compareSync').resolves(true);

    const result = await request(app).post('/login').send(body);

    expect(result.status).to.be.equal(400);
    expect(result.body).to.deep.equal({ message: 'All fields must be filled'})
  });

  it('Deve retornar um erro caso o email seja incorreto ', async () => {
    const body = { email: 'matheus.quintanilha@gmail.com', password: '123456'}

    sinon.stub(Model, 'findOne').resolves(null);

    const result = await request(app).post('/login').send(body);

    expect(result.status).to.be.equal(401);
    expect(result.body).to.deep.equal({ message: 'Invalid email or password'})
  });

  it('Deve retornar um erro caso password seja incorreto', async () => {
    const body = { email: 'matheus.quintanilha@gmail.com', password: '12345678'}

    sinon.stub(Model, 'findOne').resolves(user);

    const result = await request(app).post('/login').send(body);

    expect(result.status).to.be.equal(401);
    expect(result.body).to.deep.equal({ message: 'Invalid email or password'})
  });
});

describe('Vefificando a aplicação: GET /login/role', () => {
  beforeEach(sinon.restore);

  const user = { 
    id: 1,
    username: 'Matheus Quintanilha',
    role: 'admin',
    email: 'matheus.quintanilha@gmail.com',
   };

  it('Deve retornar a role do usuário autenticado', async () => {
    const token = jwt.sign(user, JASON_WEB_TOKEN_SECRET);
    const result = await request(app).get('/login/role').set('Authorization', token);

    expect(result.status).to.deep.equal(200);
    expect(result.body).to.deep.equal({ role: 'admin'})
  });

  it('Deverá retornar um erro 401 se o token estiver ausente', async () => {
    const result = await request(app).get('/login/role')

    expect(result.status).to.deep.equal(401);
    expect(result.body).to.deep.equal({ message: 'Token not found'})
  });

  it('Deverá retornar um erro 401 se o token for inválido', async () => {
    const token = 'token_inválido';

    const result = await request(app)
      .get('/login/role')
      .set('Authorization', token);

    expect(result.status).to.deep.equal(401);
    expect(result.body).to.deep.equal({ message: 'Token must be a valid token'})
  });
})