import express from "express";
import db from "../db/conn.mjs";
import { ObjectId } from "mongodb";
import {v4 as uuidv4} from 'uuid';
import fetch from 'node-fetch';
import mongoose from "mongoose";
import PostRestaurant from "../models/Restaurant.mjs";
import PostList from "../models/List.mjs";
import PostFavoritesList from "../models/Favorites.mjs";

function generateShortUUID() {
    const fullUUID = uuidv4();
    const shortUUID = fullUUID.substring(0, 12); // Extract the first 12 characters
    return shortUUID;
}

const router = express.Router();

// Route for getting user-specific data
router.get('/:sub', async (req, res) => {
    try {
        const userId = req.params.sub
        const userData = req.User.findOne({ googleSub: userId });
        
        if (!userData) {
            return res.status(404).json({ message: 'User data not found' });
        }

        return res.json(userData);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
})



router.get('/search', async (req, res) => {
    //const { term, latitude, longitude } = req.query;
    const { term } = req.query
    const { name } = req.body;
    // const url = `https://api.yelp.com/v3/businesses/search?latitude=${latitude}&longitude=${longitude}&term=${term}&sort_by=best_match&limit=5`;
    //const url = `https://api.yelp.com/v3/autocomplete/search?term=${term}&location=${location}&sort_by=best_match&limit=5`;
    const url = `https://api.yelp.com/v3/businesses/search?term=${term}&location=Seattle&sort_by=best_match&limit=5`;
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${process.env.YELP_API_KEY}`
        }
    };

    try {
        const response = await fetch(url, options);
        const json = await response.json(name);
        res.json(json); // Return the Yelp API response as JSON
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'An error occurred' });
    }
});

// OLD CODE # 1
// // This section will help you add a new restaurant to a list.
// router.post("/list/:listId", async (req, res) => {
//     if (!req.body.restaurantName || req.body.restaurantName.trim() === "") {
//         res.status(400).send("Restaurant name is required");
//         return;
//     }

//     const newRestaurant = new PostRestaurant({
//         restaurantId: generateShortUUID(),
//         restaurantName: req.body.restaurantName,
//         listId: req.params.listId,
//         cuisine: req.body.cuisine,
//         phoneNumber: req.body.phoneNumber,
//         address: req.body.address,
//         pricePoint: req.body.pricePoint
//     });

//     let collection = await db.collection("restaurants");
//     let result = await collection.insertOne(newRestaurant);

//     if (result.acknowledged === false) {
//         res.status(404).send("Not found");
//     } else {
//         res.status(200).send(result);
//     }
// });

// OLD CODE # 2
// // Route to save restaurant data to a list
// router.post('/', async (req, res) => {
//     //const restaurantData = req.body.restaurantData; // Assuming this is the data from the Yelp API request
//     //const listId = req.body.listId; // The ID of the list to which you want to add the restaurant

//     try {
//         // Check if the favorites list exists
//         // const existingList = await Lists.findById(listId);
//         const listName = "Favorites";
//         let listCollection = await db.collection("lists");
//         const existingList = await listCollection.findOne({ name: listName });

//         if (existingList) {
//         // If the list exists, add its ID to the restaurant data
//         //const newRestaurant = new PostRestaurant();
//         //await newRestaurant.save();

//         let newRestaurant = new PostRestaurant({
//             listId: listName.listId,
//             restaurantName: req.body.name,
//             cuisine: req.body.categories,
//             phoneNumber: req.body.display_phone,
//             address: req.body.display_address,
//             pricePoint: req.body.price,
//             restaurantId: generateShortUUID()
//         });
    
//         let collection = db.collection("restaurants");
//         let result = await collection.insertOne(newRestaurant);


//         } else {
//         // If the list doesn't exist, create a new one
//         const newList = new PostFavoritesList({
//             listId: generateShortUUID()
//         });
        
//         let listCollection = await db.collection("lists");
//         let result = await listCollection.insertOne(newList);
//         }

//         // Create a new restaurant document using the Restaurant schema
//         let newRestaurant = new PostRestaurant({
//             listId: listName.listId,
//             restaurantName: req.body.name,
//             cuisine: req.body.categories,
//             phoneNumber: req.body.display_phone,
//             address: req.body.display_address,
//             pricePoint: req.body.price,
//             restaurantId: generateShortUUID()
//         });

//         let collection = db.collection("restaurants");
//         let result = await collection.insertOne(newRestaurant);

//         res.status(201).json({ message: 'Restaurant saved successfully' });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'An error occurred while saving the restaurant' });
//     }
//     });

// router.post('/', async (req, res) => {
//     const listName = "Favorites"; // Name of the list you want to associate with

//     try {
//         let listCollection = await db.collection("lists");
//         const existingList = await listCollection.findOne({ name: listName });

//         if (!existingList) {
//             // If the list doesn't exist, create a new one
//             const newList = new PostFavoritesList({
//                 listId: generateShortUUID()
//             });
            
//             await listCollection.insertOne(newList);
            
//             // Associate the new list's ID with the restaurant data
//             req.body.listId = newList.listId;
//         } else {
//             // If the list exists, associate its ID with the restaurant data
//             req.body.listId = existingList.listId;
//         }

//         // Create a new restaurant instance
//         const newRestaurant = new PostRestaurant({
//             listId: req.body.listId, // Use the list ID to populate the reference
//             restaurantName: req.body.name,
//             cuisine: req.body.categories,
//             phoneNumber: req.body.display_phone,
//             address: req.body.display_address,
//             pricePoint: req.body.price,
//             restaurantId: generateShortUUID()
//         });

//         // Insert the restaurant instance into the restaurants collection
//         let restaurantCollection = await db.collection("restaurants");
//         let result = await restaurantCollection.insertOne(newRestaurant);

//         // res.status(201).json({ message: 'Restaurant saved successfully' });
//         //res.status(201).send(result);
//         if (!result) {
//             res.status(204).send("No content");
//         } else {
//             res.status(201).send(result);
//         }
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'An error occurred while saving the restaurant' });
//     }
// });

router.post('/', async (req, res) => {
    const listName = "Favorites"; // Name of the list you want to associate with

    try {
        let listCollection = await db.collection("lists");
        const existingList = await listCollection.findOne({ name: listName });

        if (!existingList) {
            // If the list doesn't exist, create a new one
            const newList = new PostFavoritesList({
                listId: generateShortUUID()
            });
            
            await listCollection.insertOne(newList);
            
            // Associate the new list's ID with the restaurant data
            req.body.listId = newList.listId;
        } else {
            // If the list exists, associate its ID with the restaurant data
            // Create a new restaurant instance
            const newRestaurant = new PostRestaurant({
            listId: existingList.listId, // Use the list ID to populate the reference
            restaurantName: req.body.name,
            cuisine: req.body.categories,
            phoneNumber: req.body.display_phone,
            address: req.body.display_address,
            pricePoint: req.body.price,
            restaurantId: generateShortUUID()
            });

        // Insert the restaurant instance into the restaurants collection
            let restaurantCollection = await db.collection("restaurants");
            let result = await restaurantCollection.insertOne(newRestaurant);

            // res.status(201).json({ message: 'Restaurant saved successfully' });
            //res.status(201).send(result);
            if (!result) {
                res.status(204).send("No content");
            } else {
                res.status(201).send(result);
            }
        }

        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while saving the restaurant' });
    }
});



export default router;