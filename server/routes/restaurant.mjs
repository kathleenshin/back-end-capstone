import express from "express";
import db from "../db/conn.mjs";
import { ObjectId } from "mongodb";

const router = express.Router();

// // This section will help you get a list of all the restaurants.
// router.get("/list/:id", async (req, res) => {
//     let collection = await db.collection("lists");
//     let results = await collection.find({}).toArray();
//     res.send(results).status(200);
// });

router.get("/list/:id", async (req, res) => {
    let collection = await db.collection("lists");
    let listId = req.params.id;
    let query = { _id: new ObjectId(listId) };
    let list = await collection.findOne(query);

    if (!list) res.send("List not found").status(404);
    else res.send(list.restaurants).status(200);
});

// // This section will help you get a single restaurant by id
// router.get("/list/listId/restaurantId", async (req, res) => {
//     let collection = await db.collection("lists");
//     let query = {_id: new ObjectId(req.params.id)};
//     let result = await collection.findOne(query);

//     if (!result) res.send("Not found").status(404);
//     else res.send(result).status(200);
// });

router.get("/list/:listId/restaurant/:restaurantId", async (req, res) => {
    let collection = await db.collection("lists");
    let listId = req.params.listId;
    let restaurantId = req.params.restaurantId;
    let query = { _id: new ObjectId(listId), "restaurants._id": new ObjectId(restaurantId) };
    let result = await collection.findOne(query);

    if (!result) res.send("Not found").status(404);
    else {
        // Find the specific restaurant within the list
        const restaurant = result.restaurants.find((r) => r._id.equals(new ObjectId(restaurantId)));
        if (!restaurant) res.send("Restaurant not found in the list").status(404);
        else res.send(restaurant).status(200);
    }
});



// This section will help you update a list by id.
router.patch("/:id", async (req, res) => {
    const query = { _id: new ObjectId(req.params.id) };
    const updates =  {
    $set: {
        name: req.body.name,
        position: req.body.position,
        level: req.body.level
    }
    };

    let collection = await db.collection("lists");
    let result = await collection.updateOne(query, updates);

    res.send(result).status(200);
});

// This section will help you delete a list.
router.delete("/:id", async (req, res) => {
    const query = { _id: new ObjectId(req.params.id) };

    const collection = db.collection("lists");
    let result = await collection.deleteOne(query);

    res.send(result).status(200);
});

export default router;