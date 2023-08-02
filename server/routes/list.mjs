
import express from "express";
import db from "../db/conn.mjs";
import { ObjectId } from "mongodb";

const router = express.Router();

// This section will help you get a list of all the lists.
router.get("/", async (req, res) => {
    let collection = await db.collection("lists");
    let result = await collection.find({}).toArray();
    
    if (!result) {
        res.status(404).send("Not found");
    } else {
        res.status(200).send(result);
    }
});

// This section will help you get a single list by id
router.get("/list/:id", async (req, res) => {
    let collection = await db.collection("lists");
    let query = {_id: new ObjectId(req.params.id)};
    let result = await collection.findOne(query);

    if (!result) {
        res.status(404).send("Not found");
    } else {
        res.status(200).send(result);
    }
});


// This section will help you create a new list.
router.post("/", async (req, res) => {
    // Check if the 'name' field is present in the request body and not empty
    if (!req.body.name || req.body.name.trim() === "") {
        res.status(400).send("Name is required");
        return;
    }

    let newDocument = {
        name: req.body.name,
    };
    let collection = await db.collection("lists");
    let result = await collection.insertOne(newDocument);

    if (!result) {
        res.status(204).send("No content");
    } else {
        res.status(201).send(result);
    }
});


// This section will help you update a list by id.
router.patch("/list/:id", async (req, res) => {
    const query = { _id: new ObjectId(req.params.id) };
    const updates =  {
    $set: {
        name: req.body.name
    }
    };

    let collection = await db.collection("lists");
    let result = await collection.updateOne(query, updates);

    if (!result) {
        res.status(304).send("Not modified");
    } else {
        res.status(200).send(result);
    }
});


// This section will help you delete a list
router.delete("/list/:id", async (req, res) => {
    // Check if the provided ID is a valid ObjectId
    if (!ObjectId.isValid(req.params.id)) {
        res.status(400).send("Invalid ID");
        return;
    }

    const query = { _id: new ObjectId(req.params.id) };

    const collection = db.collection("lists");
    let result = await collection.deleteOne(query);

    if (result.deletedCount === 0) {
        res.status(304).send("Not modified");
    } else {
        res.status(200).send("Deleted successfully");
    }
});


export default router;