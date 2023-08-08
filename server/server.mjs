import express from "express";
import cors from "cors";
import "./loadEnvironment.mjs";
import router from "./routes/listRoutes.mjs";

const PORT = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json());

app.use("/dashboard", lists);
//app.use("/search", router);
// start the Express server
app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});