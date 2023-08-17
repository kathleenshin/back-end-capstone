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
        // const { yelpId, name, categories, phoneNumber, address, pricePoint } = req.body;
        
    // // Create a new restaurant instance
    // const newRestaurant = {
    //     yelpId: req.body.id,
    //     listId: "42bef239-dc7",
    //     listName: "Favorites",
    //     name: req.body.name, // Access the restaurant name from the request body
    //     // categories: req.body.categories.map(category => category.title).join(', '), // Access categories from the request body
    //     categories: req.body.categories.map(category => `${category.alias}- ${category.title}`).join(', '),
    //     display_categories: req.body.categories.map(category => category.title).join(', '), 
    //     display_phone: req.body.display_phone,
    //     location: req.body.location.map(address => `${address.address1} ${address.address2} ${address.address3} ${address.city} ${address.country}`),
    //     address1: req.body.location.address1,
    //     address2: req.body.location.address2,
    //     address3: req.body.location.address3,
    //     city: req.body.location.city,
    //     country: req.body.location.country,
    //     display_address: req.body.location.display_address.join(', '), // Access display address from the request body
    //     state: req.body.location.state,
    //     zip_code: req.body.location.zip_code,
    //     price: req.body.price, // Access price from the request body
    //     restaurantId: generateShortUUID() // Assuming you have a function to generate UUID
    //     };
    const newRestaurant = {
        listId: "42bef239-dc7",
        listName: "Favorites",
        categories: req.body.categories.map(category => ({
            alias: category.alias,
            title: category.title
        })),
        // display_categories: req.body.categories.map(category => category.title).join(', '), 
        coordinates: req.body.coordinates.map(coordinate => ({
            latitude: coordinate.latitude,
            longitude: coordinate.longitude
        })),
        display_phone: req.body.display_phone,
        distance: req.body.distance,
        yelpId: req.body.id,
        image_url: req.body.image_url,
        location: req.body.categories.map(address => ({
            address1: address.address1,
            address2: address.address2,
            address3: address.address3,
            city: address.city,
            country: address.country,
            display_address: req.body.location.display_address.join(', '),
            state: address.state,
            zip_code: address.zip_code,
        })),
        name: req.body.name,
        phone: req.body.phone,
        rating: req.body.rating,
        transactions: req.body.transactions,
        url: req.body.url,
        price: req.body.price,
        restaurantId: generateShortUUID()
    };

        // Check if the "Favorites" list exists
        let listCollection = await db.collection("lists");
        const existingList = await listCollection.findOne({ listId: "42bef239-dc7" });

        if (!existingList) {
            // If the list doesn't exist, create a new one
            const newList = new PostFavoritesList({
                listId: generateShortUUID(),
                listName: req.body.listName // Set the name for the new list
                // name: req.body.name
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



