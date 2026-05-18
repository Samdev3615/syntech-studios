import { Router, type Router as ExpressRouter } from 'express';
import { getHealth, getStatus } from '../controllers/health.controller.js';

export const healthRouter: ExpressRouter = Router();

healthRouter.get('/', getHealth);
healthRouter.get('/status', getStatus);
