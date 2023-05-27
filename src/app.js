// imports the functions from the separate script
import { convertLinkToList } from "./convertLinkToList.js";
import express from "express";
import cors from "cors";

// basic express config options
const app = express();
const port = 9999;
// parse the body as a JSON object
const corsOption = {
    origin: ["http://localhost:3000"],
};
app.use(express.json());
app.use(cors(corsOption));

//  default path should return something, will guide the user in the future
app.get("/", (req, res) => {
    res.send("based");
});

app.post("/collection", async (req, res) => {
    console.time("mainCall");
    try {
        // main deliverable for the user
        let returnDataArray = convertLinkToList(await req.body.link);
        console.log("return data array : \n\n" + returnDataArray);
        res.send(returnDataArray);
    } catch {
        res.status(500).send("Internal server error occurred");
    }
    console.timeEnd("mainCall");
});

app.listen(port);
console.log("Server started at http://localhost:" + port);
