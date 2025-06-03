import { MongoClient, Db } from 'mongodb';

declare global {
  var __db: Db | undefined;
}

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}

let dbInstance: Db;

// Initialize database connection
const initializeDb = async (): Promise<Db> => {
  if (dbInstance) {
    return dbInstance;
  }

  if (process.env.NODE_ENV === 'production') {
    const client = new MongoClient(DATABASE_URL!);
    await client.connect();
    dbInstance = client.db();
  } else {
    if (!global.__db) {
      const client = new MongoClient(DATABASE_URL!);
      await client.connect();
      global.__db = client.db();
    }
    dbInstance = global.__db;
  }

  return dbInstance;
};

export async function getDb(): Promise<Db> {
  if (!dbInstance) {
    return await initializeDb();
  }
  return dbInstance;
}

// For compatibility, export a proxy that forces initialization
export const db = new Proxy({} as Db, {
  get(target, prop) {
    if (!dbInstance) {
      throw new Error(
        'Database not initialized. Use getDb() instead or ensure proper initialization.'
      );
    }
    return (dbInstance as any)[prop];
  }
});
