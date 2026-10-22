import { MongoClient } from 'mongodb';

const options = {};

let client: MongoClient | null = null;
let clientPromise: Promise<MongoClient> | null = null;

function getClientPromise(): Promise<MongoClient> {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('Missing environment variable: "MONGODB_URI". Please set MONGODB_URI in your .env or .env.local file.');
  }

  if (uri.includes('<cluster-url>') || uri.includes('<username>') || uri.includes('<password>')) {
    throw new Error('Placeholder detected in .env: Please replace <username>, <password>, and <cluster-url> with your real MongoDB Atlas credentials or use a local MongoDB connection string.');
  }

  if (process.env.NODE_ENV === 'development') {
    // In development mode, use a global variable so that the value
    // is preserved across module reloads caused by HMR.
    let globalWithMongo = global as typeof globalThis & {
      _mongoClientPromise?: Promise<MongoClient>;
    };

    if (!globalWithMongo._mongoClientPromise) {
      client = new MongoClient(uri, options);
      globalWithMongo._mongoClientPromise = client.connect();
    }
    return globalWithMongo._mongoClientPromise;
  } else {
    // In production mode, it's best to not use a global variable.
    if (!clientPromise) {
      client = new MongoClient(uri, options);
      clientPromise = client.connect();
    }
    return clientPromise;
  }
}

export async function getDb() {
  const connection = await getClientPromise();
  return connection.db(process.env.MONGODB_DB || 'rhst_db');
}

export default getClientPromise;

