/**
 * Tests unitaires — SessionService
 * Mode DEMO testé sans DB ni Redis (en mémoire)
 */

// Mock Redis pour éviter les appels réseau en test
jest.mock('../database/redis.js', () => ({
  redisHelpers: {
    setSession: jest.fn().mockResolvedValue(undefined),
    getSession: jest.fn().mockResolvedValue(null),
    deleteSession: jest.fn().mockResolvedValue(undefined),
  },
}));

// Mock DB Drizzle pour éviter les appels PostgreSQL en test
jest.mock('../database/client.js', () => ({
  db: {
    insert: jest.fn().mockReturnValue({ values: jest.fn().mockResolvedValue(undefined) }),
    select: jest.fn().mockReturnValue({
      from: jest.fn().mockReturnValue({
        where: jest.fn().mockReturnValue({
          limit: jest.fn().mockResolvedValue([]),
        }),
      }),
    }),
    delete: jest.fn().mockReturnValue({ where: jest.fn().mockResolvedValue(undefined) }),
    update: jest.fn().mockReturnValue({ set: jest.fn().mockReturnValue({ where: jest.fn().mockResolvedValue(undefined) }) }),
  },
}));

// Mock logger pour pas polluer la sortie de test
jest.mock('../middleware/logger.middleware.js', () => ({
  logger: { info: jest.fn(), error: jest.fn(), warn: jest.fn() },
  requestLogger: jest.fn(),
}));

import { SessionService } from '../services/session.service.js';

describe('SessionService — Mode DEMO', () => {
  let service: SessionService;

  beforeEach(() => {
    service = new SessionService();
  });

  it('crée une session demo avec les bons champs', async () => {
    const session = await service.create('demo', { clientName: 'Jean Dupont' });

    expect(session.id).toBeDefined();
    expect(session.privacyMode).toBe('demo');
    expect(session.status).toBe('active');
    expect(session.createdAt).toBeDefined();
    expect(session.metadata?.clientName).toBe('Jean Dupont');
  });

  it('retrouve une session demo par son ID', async () => {
    const created = await service.create('demo');
    const found = await service.getById(created.id);

    expect(found).not.toBeNull();
    expect(found?.id).toBe(created.id);
    expect(found?.privacyMode).toBe('demo');
  });

  it('retourne null pour un ID inexistant', async () => {
    const found = await service.getById('id-qui-nexiste-pas');
    expect(found).toBeNull();
  });

  it('supprime une session demo', async () => {
    const created = await service.create('demo');
    await service.delete(created.id);
    const found = await service.getById(created.id);
    expect(found).toBeNull();
  });
});

describe('SessionService — Mode PRIVATE', () => {
  let service: SessionService;

  beforeEach(() => {
    service = new SessionService();
  });

  it('crée une session private avec expiresAt', async () => {
    const session = await service.create('private');

    expect(session.privacyMode).toBe('private');
    expect(session.expiresAt).toBeDefined();
    // expiresAt doit être dans ~2h
    const expiresAt = new Date(session.expiresAt!).getTime();
    const now = Date.now();
    expect(expiresAt).toBeGreaterThan(now);
    expect(expiresAt).toBeLessThan(now + 3 * 60 * 60 * 1000); // moins de 3h
  });
});
