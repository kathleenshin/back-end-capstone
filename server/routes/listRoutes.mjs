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
    let collection = await db.collection("lists");
    let result = await collection.find({}).toArray();
    
    if (!result) {
        res.status(404).send("Not found");
    } else {
        res.status(200).send(result);
    }
});

// // This section will help you get a single list by id
// router.get("/list/:listId", async (req, res) => {
//     let collection = await db.collection("restaurants");
//     let query = {listId: req.params.listId};
//     let result = await collection.find(query).toArray();

//     if (!result) {
//         res.status(404).send("Not found");
//     } else {
//         res.status(200).send(result);
//     }
// });
// USE THIS IF CURRENT CODE DOESNT WORK:
// router.get("/list/:listId", async (req, res) => {
//     try {
//         let collection = await db.collection("lists");
//         let query = { listId: req.params.listId };
//         let result = await collection.findOne(query);

//         if (!result) {
//             res.status(404).send("Not found");
//         } else {
//             // Populate the restaurants associated with the list
//             const populatedList = await result.populate('restaurants').execPopulate();
//             res.status(200).send(populatedList);
//         }
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'An error occurred while fetching the list' });
//     }
// });
// listRoutes.mjs

// ... (existing imports and code)

// router.get("/list/:listId", async (req, res) => {
//     try {
//         const collection = await db.collection("lists");
//         const query = { listId: req.params.listId };
//         const result = await collection.findOne(query);

//         if (!result) {
//             res.status(404).send("Not found");
//         } else {
//             // Assuming result.restaurants is an array of restaurant IDs
//             if (!result.restaurants || result.restaurants.length === 0) {
//                 res.status(200).send(result);
//                 return;
//             }

//             const restaurantCollection = await db.collection("restaurants");
//             const restaurantIds = result.restaurants; // Assuming you already have valid restaurant IDs

//             // Manually fetch and populate the associated restaurants using restaurant IDs
//             const restaurants = await restaurantCollection.find({ restaurantId: { $in: restaurantIds } }).toArray();

//             // Assign the fetched restaurants to the list's 'restaurants' field
//             result.restaurants = restaurants;

//             res.status(200).send(result);
//         }
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'An error occurred while fetching the list' });
//     }
// });
// listRoutes.mjs

// ... (existing imports and code)

// router.get("/list/:listId", async (req, res) => {
//     try {
//         const collection = await db.collection("lists");
//         const query = { listId: req.params.listId };
//         const result = await collection.findOne(query);

//         if (!result) {
//             res.status(404).send("Not found");
//         } else {
//             // Assuming result.restaurants is an array of restaurant IDs
//             if (!result.restaurants || result.restaurants.length === 0) {
//                 res.status(200).send(result);
//                 return;
//             }

//             const restaurantCollection = await db.collection("restaurants");

//             // Manually fetch and populate the associated restaurants using restaurant IDs
//             // const restaurants = await restaurantCollection.find({ _id: { $in: result.restaurants } }).toArray();
//             const restaurants = await restaurantCollection.find({ restaurantId: req.params.restaurantId, listId: req.params.listId}).toArray();

//             // Assign the fetched restaurants to the list's 'restaurants' field
//             // result.restaurants = restaurants;

//             res.status(200).send(result);
//         }
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'An error occurred while fetching the list' });
//     }
// });

// This section will help you get a single list by id
router.get("/list/:listId", async (req, res) => {
    try {
        //const listId = "e7709794-5c8";
        const listId = req.params.listId

        let collection = await db.collection("restaurants");
        let query = { listId }; // Query for restaurants with the specified listId
        let result = await collection.find(query).toArray();

        if (!result || result.length === 0) {
            res.status(404).json({ message: "No restaurants found for the given listId" });
        } else {
            res.status(200).json(result);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while fetching restaurants' });
    }
});



// This section will help you create a new list.
router.post("/", async (req, res) => {
    if (!req.body.name || req.body.name.trim() === "") {
        res.status(400).send("Name is required");
        return;
    }

    let newList = new PostList({
        listId: generateShortUUID(),
        name: req.body.name,
        //userId: req.body.userId
    });

    let collection = db.collection("lists");
    let result = await collection.insertOne(newList);

    if (!result) {
        res.status(204).send("No content");
    } else {
        res.status(201).send(result);
    }
});


// This section will help you update a list by id.
router.patch("/list/:listId", async (req, res) => {
    const query = { listId: req.params.listId };
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
router.delete("/list/:listId", async (req, res) => {
    if (!ObjectId.isValid(req.params.listId)) {
        res.status(400).send("Invalid ID");
        return;
    }

    const query = { listId: req.params.listId };

    const collection = await db.collection("lists");
    let result = await collection.deleteOne(query);

    if (result.deletedCount === 0) {
        res.status(304).send("Not modified");
    } else {
        res.status(200).send("Deleted successfully");
    }
});


// ************* Restaurants routes *************

// // This section will help you get a single record by id
// router.get("/list/:listId/:restaurantId", async (req, res) => {
//     let collection = await db.collection("restaurants");

//     const restaurantQuery = { restaurantId: req.params.restaurantId};
//     let result = await collection.findOne(restaurantQuery);

//     if (!result) {
//         res.status(404).send("Not found");
//     } else {
//         res.status(200).send(result);
//     }
// });
// Retrieve a single restaurant
// listRoutes.mjs

// ... (existing imports and code)

router.get("/list/:listId/:restaurantId", async (req, res) => {
    try {
        const restaurantCollection = await db.collection("restaurants");

        const restaurantQuery = {
            listId: req.params.listId,
            restaurantId: req.params.restaurantId
        };

        const result = await restaurantCollection.findOne(restaurantQuery);

        if (!result) {
            res.status(404).send("Restaurant not found");
        } else {
            res.status(200).json(result);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while fetching the restaurant' });
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


export default router;