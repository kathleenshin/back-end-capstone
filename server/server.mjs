import express from "express";
import cors from "cors";
import "./loadEnvironment.mjs";
import router from "./routes/listRoutes.mjs";
import search from "./routes/searchRoutes.mjs"

const PORT = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json());

app.use("/dashboard", router);
app.use("/", search);
// start the Express server
app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});

