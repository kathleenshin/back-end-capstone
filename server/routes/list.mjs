
import express from "express";
import db from "../db/conn.mjs";
import { ObjectId } from "mongodb";
import PostList from "../models/List.mjs";
import PostRestaurant from "../models/Restaurant.mjs"
import {v4 as uuidv4} from 'uuid';

function generateShortUUID() {
    const fullUUID = uuidv4();
    const shortUUID = fullUUID.substring(0, 12); // Extract the first 12 characters
    return shortUUID;
}

const router = express.Router();

// This section will help you get a list of all the lists.
router.get("/", async (req, res) => {
    let collection =  db.collection("lists");
    let result = await collection.find({}).toArray();
    
    if (!result) {
        res.status(404).send("Not found");
    } else {
        res.status(200).send(result);
    }
});

// This section will help you get a single list by id
router.get("/list/:listId", async (req, res) => {
    let collection = db.collection("restaurants");
    let query = {listId: req.params.listId};
    let result = await collection.find(query).toArray();

    if (!result) {
        res.status(404).send("Not found");
    } else {
        res.status(200).send(result);
    }
});


// // This section will help you create a new list.
// router.post("/", async (req, res) => {
//     if (!req.body.name || req.body.name.trim() === "") {
//         res.status(400).send("Name is required");
//         return;
//     }

//     // let newDocument = new PostList({
//     //     listId: generateShortUUID(),
//     //     name: req.body.name
//     // });
//     let newDocument = {
//         listId: generateShortUUID(),
//         name: req.body.name
//     };
//     //const requestBody = req.body;
//     const newList = new PostList(newDocument);
//     let collection =  db.collection("lists");
//     let result = await collection.insertOne(newList);

//     if (!result) {
//         res.status(204).send("No content");
//     } else {
//         res.status(201).send(result);
//     }
// });


router.post("/", async (req, res) => {
    if (!req.body.name || req.body.name.trim() === "") {
      res.status(400).send("Name is required");
      return;
    }
  
    try {
      // Create a new instance of the PostList model directly from the request body
      const newList = new PostList({
        listId: generateShortUUID(),
        name: req.body.name
      });
  
      // Save the new document to the "lists" collection
      const result = await newList.save();
  
      // Respond with the newly inserted document
      res.status(201).send(result);
    } catch (error) {
      console.error("Error inserting the document:", error);
      res.status(500).send("An error occurred while saving the document.");
    }
  });
  
  // ... Other routes and server setup ...
  
  

// This section will help you update a list by id.
router.patch("/list/:listId", async (req, res) => {
    const query = { listId: req.params.listId };
    const updates =  {
    $set: {
        name: req.body.name
    }
    };

    let collection = db.collection("lists");
    let result = await collection.updateOne(query, updates);

    if (!result) {
        res.status(304).send("Not modified");
    } else {
        res.status(200).send(result);
    }
});


// This section will help you delete a list
router.delete("/list/:listId", async (req, res) => {
    if (!ObjectId.isValid(req.params.listId)) {
        res.status(400).send("Invalid ID");
        return;
    }

    const query = { listId: req.params.listId };

    const collection = db.collection("lists");
    let result = await collection.deleteOne(query);

    if (result.deletedCount === 0) {
        res.status(304).send("Not modified");
    } else {
        res.status(200).send("Deleted successfully");
    }
});


export default router;


// ************* Restaurants routes *************

// This section will help you get a single record by id
router.get("/list/:listId/:restaurantId", async (req, res) => {
    let collection = db.collection("restaurants");

    const restaurantQuery = { restaurantId: req.params.restaurantId};
    let result = await collection.findOne(restaurantQuery);

    if (!result) {
        res.status(404).send("Not found");
    } else {
        res.status(200).send(result);
    }
});

// This section will help you add a new restaurant to a list.
router.post("/list/:listId", async (req, res) => {
    if (!req.body.restaurantName || req.body.restaurantName.trim() === "") {
        res.status(400).send("Restaurant name is required");
        return;
    }
    const newRestaurant = new PostRestaurant({
        restaurantId: generateShortUUID(),
        restaurantName: req.body.restaurantName,
        listId: req.params.listId,
        cuisine: req.body.cuisine,
        phoneNumber: req.body.phoneNumber,
        address: req.body.address,
        pricePoint: req.body.pricePoint
    });
    
    let collection = db.collection("restaurants");
    let result = await collection.insertOne(newRestaurant);

    if (result.acknowledged === false) {
        res.status(404).send("Not found");
    } else {
        res.status(200).send(result);
    }
});


// This section will help you delete a restaurant from a list.
router.delete("/list/:listId/:restaurantId", async (req, res) => {
    const listQuery = { listId: req.params.listId};
    const restaurantQuery = { restaurantId: req.params.restaurantId, listId: req.params.listId};

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

