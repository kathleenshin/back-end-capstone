import { MongoClient } from "mongodb";
import mongoose from "mongoose";

const connectionString = process.env.ATLAS_URI || "";

const client = new MongoClient(connectionString);

let conn;
try {
    conn = await client.connect();
} catch(e) {
    console.error(e);
}

mongoose.connect(connectionString,{ 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
    })
    .then(() => {
        console.log("Mongoose connected to MongoDB");
    })
    .catch((err) => {
        console.error("Error connecting Mongoose to MongoDB:", err);
    });


let db = conn.db("Cluster1");

export default db;

// import { MongoClient } from "mongodb";

// const connectionString = process.env.ATLAS_URI || "";
// const client = new MongoClient(connectionString);

// async function setupConnection() {
//     try {
//         await client.connect();
//         const db = client.db("Cluster1");
//         return db;
//     } catch (e) {
//     console.error("Error connecting to MongoDB:", e);
//     return null;
//     }
// }

// const dbPromise = setupConnection();



// export default dbPromise;
