import { MongoClient } from "mongodb";

const connectionString = process.env.ATLAS_URI || "";
const client = new MongoClient(connectionString);

let conn;
try {
    conn = await client.connect();
} catch (e) {
    console.error("Error connecting to MongoDB:", e);
}

let db = conn.db("Cluster1");

export default db;

