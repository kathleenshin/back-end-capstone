import express from "express";
import db from "../db/conn.mjs";
import { ObjectId } from "mongodb";
import {v4 as uuidv4} from 'uuid';
import fetch from 'node-fetch';

const search = express.Router();

search.get('/search', async (req, res) => {
    const { name, latitude, longitude } = req.query;
    const url = `https://api.yelp.com/v3/businesses/search?latitude=${latitude}&longitude=${longitude}&name=${name}&sort_by=best_match&limit=20`;

    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${process.env.YELP_API_KEY}`
        }
    };

    try {
        const response = await fetch(url, options);
        const json = await response.json();
        res.json(json); // Return the Yelp API response as JSON
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'An error occurred' });
    }
});

export default search;