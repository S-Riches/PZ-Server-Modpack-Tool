// imports the functions from the separate script
import {
    createReturnData,
    getIdsFromCollection,
    getModIdsFromJsonObj,
    getWorkshopIds,
    formatModListIntoDictionary,
} from "./apiToDeliverable.js";

// used for turning the return data into the lists for the user.
const createDataForServerConfig = (returnDataArray, separator) => {
    let modIdString = "";
    let workshopIdString = "";
    for (let i = 0; i < returnDataArray.length; i++) {
        modIdString += `${String(returnDataArray[i][0]).slice(8)}${separator}`;
        workshopIdString += `${String(returnDataArray[i][1]).slice(
            13
        )}${separator}`;
    }

    // cleanup of newline characters using regex and the replace method to get rid of \r\n, \r, \n chars
    modIdString = modIdString.replace(/\r?\n|\r/gm, "");
    workshopIdString = workshopIdString.replace(/\r?\n|\r/gm, "");
    let modAndWorkshopIds = [modIdString, workshopIdString];
    return modAndWorkshopIds;
};

const main = async () => {
    // main runner code
    let jsonString = await getIdsFromCollection(2917252112);
    let modIdsArray = getModIdsFromJsonObj(jsonString);
    const modDictionary = formatModListIntoDictionary(modIdsArray);
    let jsonResponse = await getWorkshopIds(modDictionary);
    // main deliverable for the user
    let returnDataArray = createReturnData(jsonResponse);
    // can be customized based on the separator needed, will only be one character and needs to be sanitized before putting into sql db, defaults to ; as this is what PZ uses by default.
    createDataForServerConfig(returnDataArray, ";");
};

// run the script
main();
