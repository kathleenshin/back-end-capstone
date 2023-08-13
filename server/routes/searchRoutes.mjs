import express from "express";
import db from "../db/conn.mjs";
import { ObjectId } from "mongodb";
import {v4 as uuidv4} from 'uuid';
import fetch from 'node-fetch';
import PostFavoritesList from "../models/Restaurant.mjs";

const router = express.Router();

function generateShortUUID() {
    const fullUUID = uuidv4();
    const shortUUID = fullUUID.substring(0, 12); // Extract the first 12 characters
    return shortUUID;
}

// const listName = "Favorites"; // Name of the list you want to associate with
const listName = "testfavorites";

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

// CODE ON MAIN
// // This section will help you add a new restaurant to a list.
// router.post('/', async (req, res) => {
//     const listName = "Favorites"; // Name of the list you want to associate with

//     try {
//         let listCollection = await db.collection("lists");
//         const existingList = await listCollection.findOne({ name: listName });

//         if (!existingList) {
//             // If the list doesn't exist, create a new one
//             const newList = new PostFavoritesList({
//                 listId: generateShortUUID(),
//                 name: req.body.name,
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
//             cuisine: req.body.cuisine,
//             phoneNumber: req.body.phoneNumber,
//             address: req.body.address,
//             pricePoint: req.body.pricePoint,
//             restaurantId: generateShortUUID()
//         });

//         // Insert the restaurant instance into the restaurants collection
//         let restaurantCollection = await db.collection("restaurants");
//         let result = await restaurantCollection.insertOne(newRestaurant);

//         if (!result) {
//             res.status(204).send("No content");
//             return;
//         } else {
//             res.status(201).send(result);
//         }
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'An error occurred while saving the restaurant' });
//     }
// });


// // experiment code 1
// // This section will help you add a new restaurant to a list.
// router.post('/search', async (req, res) => {
    // const listName = "Favorites"; // Name of the list you want to associate with

    // try {
    //     let listCollection = await db.collection("lists");
    //     const existingList = await listCollection.findOne({ name: listName });

    //     if (!existingList) {
    //         // If the list doesn't exist, create a new one
    //         const newList = new PostFavoritesList({
    //             listId: generateShortUUID()
    //         });

    //         await listCollection.insertOne(newList);

    //         // Associate the new list's ID with the restaurant data
    //         req.body.listId = newList.listId;
    //     } else {
    //         // If the list exists, associate its ID with the restaurant data
    //         req.body.listId = existingList.listId;
    //     }

//         // Make a Yelp API call to fetch restaurant data
//         const { term } = req.body;

//         const url = `https://api.yelp.com/v3/businesses/search?term=${term}&location=Seattle&sort_by=best_match&limit=5`;

//         const yelpResponse = await fetch(url, {
//             method: 'GET',
//             headers: {
//                 accept: 'application/json',
//                 Authorization: `Bearer ${process.env.YELP_API_KEY}`
//             }
//         });

//         if (!yelpResponse.ok) {
//             throw new Error('Yelp API request failed');
//         }

//         const yelpData = await yelpResponse.json();

//         // Assuming yelpData.businesses is an array of businesses
//         const firstBusiness = yelpData.businesses[0];

//         // Create a new restaurant instance using Yelp data
//         const newRestaurant = new PostRestaurant({
//             listId: req.body.listId,
//             restaurantName: firstBusiness.name,
//             // Assuming cuisines are in the "categories" array
//             cuisine: firstBusiness.categories.map(category => category.title).join(', '),
//             phoneNumber: firstBusiness.display_phone,
//             address: firstBusiness.location.display_address[0],
//             pricePoint: firstBusiness.price,
//             restaurantId: generateShortUUID()
//         });

//         // Insert the restaurant instance into the restaurants collection
//         let restaurantCollection = await db.collection("restaurants");
//         let result = await restaurantCollection.insertOne(newRestaurant);

//         if (!result) {
//             res.status(204).send("No content");
//             return;
//         } else {
//             res.status(201).send(result);
//         }
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'An error occurred while saving the restaurant' });
//     }
// });

// // experiment code 2
// router.post('/search/save-favorite', async (req, res) => {
//     console.log("Received data: ", req.body);

//     try {
//         const { listId, restaurantName, cuisine, phoneNumber, address, pricePoint } = req.body;

//       // Create a new restaurant instance
//         const newRestaurant = {
//             listId,
//             restaurantName,
//             cuisine,
//             phoneNumber,
//             address,
//             pricePoint,
//             restaurantId: generateShortUUID() // Assuming you have a function to generate UUID
//         };

//         // Insert the restaurant instance into the restaurants collection
//         const restaurantCollection = db.collection("restaurants");
//         const result = await restaurantCollection.insertOne(newRestaurant);

//         if (!result) {
//             res.status(204).send("No content");
//         } else {
//             res.status(201).json({ message: "Restaurant saved to favorites", restaurant: newRestaurant });
//         }
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'An error occurred while saving the restaurant' });
//     }
//     });


// experiment code 3
router.post('/search/save-favorite', async (req, res) => {
    console.log("Received data: ", req.body);
    
    try {
        const { listId, restaurantName, cuisine, phoneNumber, address, pricePoint } = req.body;
        
        // Create a new restaurant instance
    const newRestaurant = {
        listId: req.body.listId,
        restaurantName: req.body.name, // Access the restaurant name from the request body
        cuisine: req.body.categories.map(category => category.title).join(', '), // Access categories from the request body
        phoneNumber: req.body.display_phone,
        address: req.body.location.display_address.join(', '), // Access display address from the request body
        pricePoint: req.body.price, // Access price from the request body
        restaurantId: generateShortUUID() // Assuming you have a function to generate UUID
        };

        // Check if the "Favorites" list exists
        let listCollection = await db.collection("lists");
        const existingList = await listCollection.findOne({ name: listName });

        if (!existingList) {
            // If the list doesn't exist, create a new one
            const newList = new PostFavoritesList({
                listId: generateShortUUID(),
                name: listName // Set the name for the new list
            });

            await listCollection.insertOne(newList);

            // Associate the new list's ID with the restaurant data
            newRestaurant.listId = newList.listId;
        } else {
            // If the list exists, associate its ID with the restaurant data
            newRestaurant.listId = existingList.listId;
        }

        // Insert the restaurant instance into the restaurants collection
        const restaurantCollection = db.collection("restaurants");
        const result = await restaurantCollection.insertOne(newRestaurant);

        if (!result) {
            res.status(204).send("No content");
        } else {
            res.status(201).json({ message: "Restaurant saved to favorites", restaurant: newRestaurant });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while saving the restaurant' });
    }
});



export default router;