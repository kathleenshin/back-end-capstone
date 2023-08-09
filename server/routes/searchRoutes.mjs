import express from "express";
import db from "../db/conn.mjs";
import { ObjectId } from "mongodb";
import {v4 as uuidv4} from 'uuid';
import fetch from 'node-fetch';

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

export default router;