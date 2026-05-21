import { createServer } from 'http';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { apiRouter } from './routes/index.js';
import { errorHandler, notFoundHandler } from './middleware/error.middleware.js';
import { requestLogger, logger } from './middleware/logger.middleware.js';
import { apiRateLimiter } from './middleware/rate-limit.middleware.js';
import { setupWebSocket } from './websocket/websocket.handler.js';

dotenv.config();

const app: express.Application = express();
const PORT = process.env.PORT ?? 3001;
const FRONTEND_URL = process.env.FRONTEND_URL ?? 'http://localhost:3000';
// ─── Sécurité ─────────────────────────────────────────────────────────────────
app.use(helmet());
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ─── Parsing ──────────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ─── Logging ──────────────────────────────────────────────────────────────────
app.use(requestLogger);

// ─── Rate limiting global ─────────────────────────────────────────────────────
app.use('/api', apiRateLimiter);

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use(apiRouter);

// ─── 404 & Error handlers ─────────────────────────────────────────────────────
app.use(notFoundHandler);
app.use(errorHandler);

// ─── HTTP Server + WebSocket ───────────────────────────────────────────────────
const httpServer = createServer(app);
setupWebSocket(httpServer, FRONTEND_URL);

httpServer.listen(PORT, () => {
  logger.info('SynTech Studios Backend started');
  logger.info(`Server: http://localhost:${PORT}`);
  logger.info(`Health: http://localhost:${PORT}/health`);
  logger.info(`WebSocket: ws://localhost:${PORT}`);
  logger.info(`Environment: ${process.env.NODE_ENV ?? 'development'}`);
});

export default app;
