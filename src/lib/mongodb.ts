import { MongoClient } from 'mongodb';
import dns from 'dns';

// Fix for Windows / local ISPs where default DNS resolver fails SRV queries (querySrv ECONNREFUSED)
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch {
  // Ignore in environments where setting DNS servers is restricted
}

const DIRECT_ATLAS_URI =
  'mongodb://gatecode026:tBNyNzO68BNn3Zkn@ac-4yhspek-shard-00-00.1meot8l.mongodb.net:27017,ac-4yhspek-shard-00-01.1meot8l.mongodb.net:27017,ac-4yhspek-shard-00-02.1meot8l.mongodb.net:27017/?ssl=true&replicaSet=atlas-xkvfz9-shard-0&authSource=admin';

const options = {
  serverSelectionTimeoutMS: 8000,
  connectTimeoutMS: 10000,
};

let clientPromise: Promise<MongoClient> | null = null;

async function createClient(uri: string): Promise<MongoClient> {
  const client = new MongoClient(uri, options);
  return client.connect();
}

function getClientPromise(): Promise<MongoClient> {
  const uri = process.env.MONGODB_DIRECT_URI || process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('Missing environment variable: "MONGODB_URI". Please set MONGODB_URI in your .env or .env.local file.');
  }

  if (uri.includes('<cluster-url>') || uri.includes('<username>') || uri.includes('<password>')) {
    throw new Error('Placeholder detected in .env: Please replace <username>, <password>, and <cluster-url> with your real MongoDB Atlas credentials or use a local MongoDB connection string.');
  }

  const connectWithFallback = async (): Promise<MongoClient> => {
    try {
      return await createClient(uri);
    } catch (err: any) {
      if (err?.code === 'ECONNREFUSED' || err?.message?.includes('querySrv')) {
        console.warn('MongoDB SRV lookup failed, falling back to direct replica set connection...');
        return await createClient(DIRECT_ATLAS_URI);
      }
      throw err;
    }
  };

  if (process.env.NODE_ENV === 'development') {
    // In development mode, use a global variable so that the value
    // is preserved across module reloads caused by HMR.
    let globalWithMongo = global as typeof globalThis & {
      _mongoClientPromise?: Promise<MongoClient>;
    };

    if (!globalWithMongo._mongoClientPromise) {
      globalWithMongo._mongoClientPromise = connectWithFallback().catch((err) => {
        // Reset on failure so subsequent requests can retry rather than staying permanently failed
        globalWithMongo._mongoClientPromise = undefined;
        throw err;
      });
    }
    return globalWithMongo._mongoClientPromise;
  } else {
    // In production mode, it's best to not use a global variable.
    if (!clientPromise) {
      clientPromise = connectWithFallback().catch((err) => {
        clientPromise = null;
        throw err;
      });
    }
    return clientPromise;
  }
}

export async function getDb() {
  const connection = await getClientPromise();
  return connection.db(process.env.MONGODB_DB || 'rhst_db');
}

export default getClientPromise;

