import db from '../../lib/db';

// Mock PrismaClient
jest.mock('@prisma/client', () => {
  const mockPrismaClient = {
    workSession: {
      create: jest.fn(),
      update: jest.fn(),
      findMany: jest.fn()
    },
    user: {
      create: jest.fn(),
      findUnique: jest.fn()
    },
    focusInsight: {
      create: jest.fn(),
      findMany: jest.fn()
    },
    $connect: jest.fn(),
    $disconnect: jest.fn()
  };
  
  return {
    PrismaClient: jest.fn(() => mockPrismaClient)
  };
});

describe('Database Client', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  it('should export a Prisma client instance', () => {
    expect(db).toBeDefined();
    expect(db.workSession).toBeDefined();
    expect(db.user).toBeDefined();
    expect(db.focusInsight).toBeDefined();
  });
  
  it('should have required models', () => {
    // Check if required tables/models exist
    expect(db.workSession).toBeDefined();
    expect(db.user).toBeDefined();
    expect(db.focusInsight).toBeDefined();
  });
  
  it('should handle connection errors', async () => {
    // Mock a connection error
    (db.$connect as jest.Mock).mockRejectedValueOnce(new Error('Database connection error'));
    
    // Test that connection errors are properly caught
    await expect(db.$connect()).rejects.toThrow('Database connection error');
  });
  
  it('should handle disconnection properly', async () => {
    await db.$disconnect();
    expect(db.$disconnect).toHaveBeenCalled();
  });
}); 