// imports the functions from the separate script
import {
    createReturnData,
    getIdsFromCollection,
    getModIdsFromJsonObj,
    getWorkshopIds,
    formatModListIntoDictionary,
    createDataForServerConfig,
} from "./apiToDeliverable.js";

const main = async () => {
    // main runner code
    let jsonString = await getIdsFromCollection(2942023507);
    let modIdsArray = getModIdsFromJsonObj(jsonString);
    const modDictionary = formatModListIntoDictionary(modIdsArray);
    let jsonResponse = await getWorkshopIds(modDictionary);
    // main deliverable for the user
    let returnDataArray = createReturnData(jsonResponse);
    // can be customized based on the separator needed, will only be one character, defaults to ; as this is what PZ uses by default.
    // TODO needs to be sanitized before putting into sql db
    let out = createDataForServerConfig(returnDataArray, ";");
    console.log(out);
};

// run the script
main();
