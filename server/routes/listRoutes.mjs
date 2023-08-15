import express from "express";
import db from "../db/conn.mjs";
import { ObjectId } from "mongodb";
import {v4 as uuidv4} from 'uuid';
import fetch from 'node-fetch';
import userRoutes from "../routes/userRoutes.mjs";

function generateShortUUID() {
    const fullUUID = uuidv4();
    const shortUUID = fullUUID.substring(0, 12); // Extract the first 12 characters
    return shortUUID;
}

const router = express.Router();
// Search Routes

// router.post("/search", async (req, res) => {
//     const YELP_API = process.env.YELP_API_KEY;
//     const sdk = require('api')('@yelp-developers/v1.0#29blk6qj5xa');
//     sdk.auth(`Bearer ${YELP_API}`);
    
//     let searchRestaurant = {
//         location: req.body.location,
//         term: req.body.term,
//     };

//     sdk.v3_business_search(searchRestaurant)
//         .then(({ data }) => {
//             // ... (code to insert data.businesses[0] into the database)
//             res.send(data.businesses[0]).status(204);
//         })
//         .catch(err => {
//             // ... (error handling)
//         });
// });







// This section will help you get a list of all the lists.
router.get("/user/:subId", async (req, res) => {
router.get("/user/:subId", async (req, res) => {
    let collection = await db.collection("lists");
    let query = {subId: req.params.subId};
    let result = await collection.find(query).toArray();
    
    if (!result) {
        res.status(404).send("Not found");
    } else {
        res.status(200).send(result);
    }
});

// This section will help you get a single list by id
router.get("/user/:subId/list/:listId", async (req, res) => {
    let collection = await db.collection("lists");
    let query = {subId: req.params.subId, listId: req.params.listId};
    let result = await collection.find(query).toArray();

    if (!result) {
        res.status(404).send("Not found");
    } else {
        res.status(200).send(result);
    }
});


// // This section will help you create a new list.
//     // Need to update with subId for future functionality
// router.post("/", async (req, res) => {
//     if (!req.body.name || req.body.name.trim() === "") {
//         res.status(400).send("Name is required");
//         return;
//     }

//     let newDocument = {
//         listId: generateShortUUID(),
//         name: req.body.name
//     };
//     let collection = await db.collection("lists");
//     let result = await collection.insertOne(newDocument);

//     if (!result) {
//         res.status(204).send("No content");
//     } else {
//         res.status(201).send(result);
//     }
// });


// // This section will help you update a list by id.
//     // Need to update with subId for future functionality
// router.patch("/list/:listId", async (req, res) => {
//     const query = { listId: req.params.listId };
//     const updates =  {
//     $set: {
//         name: req.body.name
//     }
//     };

//     let collection = await db.collection("lists");
//     let result = await collection.updateOne(query, updates);

//     if (!result) {
//         res.status(304).send("Not modified");
//     } else {
//         res.status(200).send(result);
//     }
// });


// // This section will help you delete a list
//     // Need to update with subId for future functionality
// router.delete("/list/:listId", async (req, res) => {
//     if (!ObjectId.isValid(req.params.listId)) {
//         res.status(400).send("Invalid ID");
//         return;
//     }

//     const query = { listId: req.params.listId };

//     const collection = await db.collection("lists");
//     let result = await collection.deleteOne(query);

//     if (result.deletedCount === 0) {
//         res.status(304).send("Not modified");
//     } else {
//         res.status(200).send("Deleted successfully");
//     }
// });


// ************* Restaurants routes *************

// // This section will help you get a single restaurant record from a list by id
//     // Need to update with subId, listId for future functionality
// router.get("/user/:subId/list/:listId/:restaurantId", async (req, res) => {
//     let collection = await db.collection("restaurants");
//     const subId = req.params.subId;
//     const listId = req.params.listId;
//     const restaurantQuery = { restaurantId: req.params.restaurantId};
//     let result = await collection.findOne(restaurantQuery);

//     if (!result) {
//         res.status(404).send("Not found");
//     } else {
//         res.status(200).send(result);
//     }
// });

// // This section will help you add a new restaurant to a list.
//     // We already have a POST through searchRoutes but saving for future functionality
// router.post("/list/:listId", async (req, res) => {
//     if (!req.body.restaurantName || req.body.restaurantName.trim() === "") {
//         res.status(400).send("Restaurant name is required");
//         return;
//     }

//     let newDocument = {
//         restaurantId: generateShortUUID(),
//         restaurantName: req.body.restaurantName,
//         listId: req.params.listId 
//     };

//     let collection = await db.collection("restaurants");
//     let result = await collection.insertOne(newDocument);

//     if (result.acknowledged === false) {
//         res.status(404).send("Not found");
//     } else {
//         res.status(200).send(result);
//     }
// });


// This section will help you delete a restaurant from a list.
router.delete("/user/:subId/list/:listId/:restaurantId", async (req, res) => {
    const listQuery = { listId: req.params.listId};
    const restaurantQuery = { restaurantId: req.params.restaurantId, listId: req.params.listId, subId: req.params.subId};

    const listCollection = db.collection("lists");
    const restaurantCollection = db.collection("restaurants");

    const list = await listCollection.findOne(listQuery);
    if (!list) {
        res.status(404).send("List not found");
        return;
    }

    const result = await restaurantCollection.deleteOne(restaurantQuery);

    if (result.deletedCount === 0) {
        res.status(304).send("Not modified");
    } else {
        res.status(200).send("Deleted successfully");
    }
});


export default router;