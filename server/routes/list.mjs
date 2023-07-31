import express from "express";
import db from "../db/conn.mjs";
import { ObjectId } from "mongodb";

const router = express.Router();

// This section will help you get a list of all the lists.
router.get("/dashboard", async (req, res) => {
    let collection = await db.collection("lists");
    let results = await collection.find({}).toArray();
    res.send(results).status(200);
});

// This section will help you get a single list by id
router.get("/dashboard/list/:id", async (req, res) => {
    let collection = await db.collection("lists");
    let query = {_id: new ObjectId(req.params.id)};
    let result = await collection.findOne(query);

    if (!result) res.send("Not found").status(404);
    else res.send(result).status(200);
});

// This section will help you create a new list.
router.post("/dashboard", async (req, res) => {
    let newDocument = {
    name: req.body.name,
    };
    let collection = await db.collection("lists");
    let result = await collection.insertOne(newDocument);
    res.send(result).status(204);
});

// This section will help you update a list by id.
router.patch("/dashboard/list/:id", async (req, res) => {
    const query = { _id: new ObjectId(req.params.id) };
    const updates =  {
    $set: {
        name: req.body.name
    }
    };

    let collection = await db.collection("lists");
    let result = await collection.updateOne(query, updates);

    res.send(result).status(200);
});

// This section will help you delete a list
router.delete("/dashboard/list/:id", async (req, res) => {
    const query = { _id: new ObjectId(req.params.id) };

    const collection = db.collection("lists");
    let result = await collection.deleteOne(query);

    res.send(result).status(200);
});

export default router;