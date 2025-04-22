import { MongoClient } from 'mongodb'

const MONGODB_URI = process.env.MONGODB_URI
const MONGODB_DB = process.env.MONGODB_DB

if (!MONGODB_URI) {
  throw new Error("Define the MONGODB_URI environmental variable");
}

if (!MONGODB_DB) {
  throw new Error("Define the MONGODB_DB environmental variable");
}

let cachedClient: any = null;
let cachedDb: any = null;

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return {
      client: cachedClient,
      db: cachedDb,
    };
  }

  const opts = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };

  let client = new MongoClient(MONGODB_URI as string, opts as any);
  await client.connect();
  let db = client.db(MONGODB_DB);

  cachedClient = client;
  cachedDb = db;

  return {
    client: cachedClient,
    db: cachedDb,
  };
}
