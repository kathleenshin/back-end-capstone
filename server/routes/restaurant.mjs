// import express from "express";
// import db from "../db/conn.mjs";
// import { ObjectId } from "mongodb";
// import list from ".routes/list.mjs"


// const router = express.Router();

// // This section will help you get a single record by id
// router.get("/list/:listId/:restaurantId", async (req, res) => {
//     let collection = await db.collection("restaurants");
//     let restaurantId = {_id: new ObjectId(req.params.restaurantId)};
//     let result = await collection.findOne(restaurantId);

//     if (!result) res.send("Not found").status(404);
//     else res.send(result).status(200);
// });

// // This section will help you add a new restaurant to a list.
// router.post("/list/:listId", async (req, res) => {
//     // Check if the 'name' field is present in the request body and not empty
//     if (!req.body.restaurantName || req.body.restaurantName.trim() === "") {
//         res.status(400).send("Name is required");
//         return;
//     }

//     let newDocument = {
//         restaurantName: req.body.restaurantName,
//     };
//     let collection = await db.collection("restaurants");
//     let result = await collection.insertOne(newDocument);

//     if (!result) {
//         res.status(204).send("No content");
//     } else {
//         res.status(201).send(result);
//     }
// });


// // This section will help you delete a list.
// router.delete("/:id", async (req, res) => {
//     const query = { _id: new ObjectId(req.params.id) };

//     const collection = db.collection("restaurants");
//     let result = await collection.deleteOne(query);

//     res.send(result).status(200);
// });

// export default router;