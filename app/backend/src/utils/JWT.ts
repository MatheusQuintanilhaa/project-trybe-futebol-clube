import { sign } from 'jsonwebtoken';
import ILoginJWT from '../Interfaces/InterfaceLoginJWT';

const JWT_SECRET = process.env.JWT_SECRET as string;

const generateToken = (login: ILoginJWT) =>
  sign(login, JWT_SECRET, { expiresIn: '1d', algorithm: 'HS256' });

export default generateToken;
