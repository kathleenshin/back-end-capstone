import express from "express";
import db from "../db/conn.mjs";
import { ObjectId } from "mongodb";
import {v4 as uuidv4} from 'uuid';
import fetch from 'node-fetch';
import PostFavoritesList from "../models/Restaurant.mjs";
import User from "../models/User.mjs";

const router = express.Router();

function generateShortUUID() {
    const fullUUID = uuidv4();
    const shortUUID = fullUUID.substring(0, 12); // Extract the first 12 characters
    return shortUUID;
}

const listName = "Favorites"; // Name of the list you want to associate with

router.get('/search', async (req, res) => {
    //const { term, latitude, longitude } = req.query;
    const { term, location } = req.query
    const { name } = req.body;
    // const url = `https://api.yelp.com/v3/businesses/search?latitude=${latitude}&longitude=${longitude}&term=${term}&sort_by=best_match&limit=5`;
    //const url = `https://api.yelp.com/v3/autocomplete/search?term=${term}&location=${location}&sort_by=best_match&limit=5`;
    const url = `https://api.yelp.com/v3/businesses/search?term=${term}&location=${location}&sort_by=best_match&limit=5`;
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


// // This section will help you add a new restaurant to a list.
router.post('/search/save-favorite', async (req, res) => {
    console.log("Received data: ", req.body);
    
    try {
        //const { subID, yelpId, listId, restaurantName, cuisine, phoneNumber, address, pricePoint } = req.body;
        
    // Create a new restaurant instance
    const newRestaurant = {
        subId: req.body.subId,
        yelpId: req.body.id,
        name: req.body.name,
        listId: req.body.listId,
        restaurantName: req.body.name, // Access the restaurant name from the request body
        cuisine: req.body.categories.map(category => category.title).join(', '), // Access categories from the request body
        phoneNumber: req.body.display_phone,
        address: req.body.location.display_address.join(', '), // Access display address from the request body
        pricePoint: req.body.price, // Access price from the request body
        restaurantId: generateShortUUID(), // Assuming you have a function to generate UUID
        subId: req.body.subId
        };

        // Check if the "Favorites" list exists
        let listCollection = await db.collection("lists");
        const existingList = await listCollection.findOne({ name: listName });

        if (!existingList) {
            // If the list doesn't exist, create a new one
            const newList = new PostFavoritesList({
                listId: generateShortUUID(),
                // name: listName // Set the name for the new list
                name: req.body.name
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