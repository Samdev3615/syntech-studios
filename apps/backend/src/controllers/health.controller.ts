import type { Request, Response } from 'express';

export function getHealth(_req: Request, res: Response): void {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'SynTech Studios Backend',
    version: '0.2.0',
  });
}

export function getStatus(_req: Request, res: Response): void {
  res.json({
    message: 'SynTech Studios API v1',
    version: '0.2.0',
    environment: process.env.NODE_ENV ?? 'development',
    uptime: Math.floor(process.uptime()),
  });
}
