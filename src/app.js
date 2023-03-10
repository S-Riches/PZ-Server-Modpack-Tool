// imports the functions from the separate script
import {
    createReturnData,
    getIdsFromCollection,
    getModIdsFromJsonObj,
    getWorkshopIds,
    formatModListIntoDictionary,
    createDataForServerConfig,
} from "./apiToDeliverable.js";
import express from "express";
import bodyParser from "body-parser";

// basic express config options
const app = express();
const port = 9999;
// parse the body as a JSON object
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//  default path should return something, will guide the user in the future
app.get("/", (req, res) => {
    res.send("based");
});

app.post("/collection", async (req, res) => {
    const collectionPage = req.body;
    console.log(collectionPage);
    // get the workshop Id from the string using regex
    const id = String(collectionPage.link).match(/[0-9]+/g);
    console.log(id);
    let jsonString = await getIdsFromCollection(id);
    let modIdsArray = getModIdsFromJsonObj(jsonString);
    const modDictionary = formatModListIntoDictionary(modIdsArray);
    let jsonResponse = await getWorkshopIds(modDictionary);
    // main deliverable for the user
    let returnDataArray = createReturnData(jsonResponse);
    res.send(returnDataArray);
});
/* 
get a steam webpage
strip it to the id
return a list with all the mod ids and workshop ids
provide another way to convert that to the data list
*/

app.post("/modpackData", async (req, res) => {
    res.send("this does nothing yet, just planning out the structure");
});

app.listen(port);
console.log("Server started at http://localhost:" + port);
