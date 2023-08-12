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
});


router.get('/search', async (req, res) => {
    //const { term, latitude, longitude } = req.query;
    const { term } = req.query
    //const { name } = req.body;
    // const url = `https://api.yelp.com/v3/businesses/search?latitude=${latitude}&longitude=${longitude}&term=${term}&sort_by=best_match&limit=5`;
    // const url = `https://api.yelp.com/v3/autocomplete/search?term=${term}&location=${location}&sort_by=best_match&limit=5`;
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
        const json = await response.json(req.body);
        res.json(json); // Return the Yelp API response as JSON
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'An error occurred' });
    }
});


// This section will help you add a new restaurant to a list.
router.post('/', async (req, res) => {
    const listName = "Favorites"; // Name of the list you want to associate with

    try {
        let listCollection = await db.collection("lists");
        const existingList = await listCollection.findOne({ name: listName });

        if (!existingList) {
            // If the list doesn't exist, create a new one
            const newList = new PostFavoritesList({
                listId: generateShortUUID(),
                name: req.body.name,
            });
            
            await listCollection.insertOne(newList);
            
            // Associate the new list's ID with the restaurant data
            req.body.listId = newList.listId;
        } else {
            // If the list exists, associate its ID with the restaurant data
            req.body.listId = existingList.listId;
        }

        // Create a new restaurant instance


    
        const newRestaurant = new PostRestaurant({
            listId: req.body.listId, // Use the list ID to populate the reference
            restaurantName: req.body.name,
            cuisine: req.body.cuisine,
            phoneNumber: req.body.phoneNumber,
            address: req.body.address,
            pricePoint: req.body.pricePoint,
            restaurantId: generateShortUUID()
        });

        // Insert the restaurant instance into the restaurants collection
        let restaurantCollection = await db.collection("restaurants");
        let result = await restaurantCollection.insertOne(newRestaurant);

        if (!result) {
            res.status(204).send("No content");
            return;
        } else {
            res.status(201).send(result);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while saving the restaurant' });
    }
});


export default router;