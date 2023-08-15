import express from "express";
import db from "../db/conn.mjs";
import User from "../models/User.mjs";

const router = express.Router();

// This section will help you get all the users
router.get("/users", async (req, res) => {
    let collection = await db.collection("users");
    let result = await collection.find({}).toArray();
    
    if (!result) {
        res.status(404).send("User Not found");
    } else {
        res.status(200).send(result);
    }
});
// This section will help you get a user by sub id
router.get("/users/:subId", async (req, res) => {
    let collection = await db.collection("users");
    let query = {subId: req.params.subId};
    let result = await collection.find({query}).toArray();

    if (!result) {
        res.status(404).send("User Not found");
    } else {
        res.status(200).send(result);
    }
});

router.post("/save-user", async (req, res) => {
    const subId = req.body.subId;

    try {
    const existingUser = await User.findOne({ subId });
    if (existingUser) {
        res.status(200).json({ message: "User already exists" });
    } else {
        const newUser = new User({
        subId: req.body.subId,
        name: req.body.name,
        givenName: req.body.givenName,
        email: req.body.email,
        picture: req.body.picture 
        });
        const UserCollection = db.collection("users");
        const result = await UserCollection.insertOne(newUser);
        
        if (!result) {
        res.status(204).send("No content");
        } else {
        res.status(201).json({ message: "User saved to database", user: newUser });
        }
    }
    } catch (error) {
    res.status(500).json({ error: "Internal server error" });
    }
});


export default router;

