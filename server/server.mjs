import express from "express";
import cors from "cors";
import "./loadEnvironment.mjs";

import searchRoutes from "./routes/searchRoutes.mjs"
import listRoutes from "./routes/listRoutes.mjs"
import userRoutes from "./routes/userRoutes.mjs";

const PORT = process.env.PORT || 5000;
const app = express();


app.use(cors());
app.use(express.json());

app.use("/dashboard", listRoutes);
app.use("/",searchRoutes);
app.use("/dashboard/user", userRoutes)
// start the Express server
app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});

