import { MongoClient, type Db } from "mongodb";

const uri = import.meta.env.VITE_MONGODB_URI || process.env.MONGODB_URI;

if (!uri) {
  throw new Error("Missing MongoDB URI. Set VITE_MONGODB_URI or MONGODB_URI in your environment.");
}

let client: MongoClient | null = null;
let db: Db | null = null;

function createMongoClient() {
  client = new MongoClient(uri, {
    serverApi: {
      version: "1",
      strict: true,
      deprecationErrors: true,
    },
  });
  return client;
}

export async function getMongoClient() {
  if (!client) {
    client = createMongoClient();
    await client.connect();
  }
  return client;
}

export async function getDb() {
  if (!db) {
    const mongo = await getMongoClient();
    db = mongo.db();
  }
  return db;
}
