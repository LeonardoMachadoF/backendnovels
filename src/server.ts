import express from 'express';
import dotenv from 'dotenv';
import mainRoutes from './routes';
import cors from 'cors';
import path from 'path';

dotenv.config();

const server = express();

server.use(cors());
server.use(express.urlencoded({ extended: true }));
server.use(express.json());

server.use(express.static(path.join(__dirname, '../public')));

server.use('/api', mainRoutes)

server.listen(process.env.PORT);