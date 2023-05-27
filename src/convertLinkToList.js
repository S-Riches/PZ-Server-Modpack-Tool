import fetch from "node-fetch";

// Grabs the workshop ids of each mod in a collection - then returns it in a json string to be worked with later on in the script
const getIdsFromCollection = async (link) => {
    const collectionId = String(link).match(/[0-9]+/g);
    const url = `https://api.steampowered.com/ISteamRemoteStorage/GetCollectionDetails/v1/`;
    const options = {
        method: "POST",
        // need to send the request as a x-www-form-urlencoded as steam web api is weird
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
            collectioncount: "1",
            "publishedfileids[0]": collectionId,
        }),
    };
    // get the response, then convert to json format response
    let response = await (await fetch(url, options)).json();
    // makes the JSON response actually human readable instead of being hidden in [ Object ]
    let jsonResponse = await JSON.stringify(response, null, 2);
    // return it here to work with it outside of the function (.then just gives me promises)
    return await jsonResponse;
};

const formatModListIntoDictionary = (modIdArray) => {
    let modDictionary = {};
    for (let i in modIdArray) {
        let num = i;
        modDictionary[`publishedfileids[${num}]`] = parseInt(modIdArray[i]);
    }
    return modDictionary;
};

// bit of a messy piece of code - will be refactored, however its very delicate at the moment
const getWorkshopIds = async (modIdsArray) => {
    const url =
        "https://api.steampowered.com/ISteamRemoteStorage/GetPublishedFileDetails/v1/";
    // create a form data to be passed into the fetch request with the length of the collection
    let body = new URLSearchParams({
        itemcount: Object.keys(modIdsArray).length,
    });
    // for each key in the list, add to the form data the key and value pair as a new line
    for (let i = 0; i < Object.keys(modIdsArray).length; i++) {
        body.append(Object.keys(modIdsArray)[i], Object.values(modIdsArray)[i]);
    }
    // set options to be sent to the api request
    const options = {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body,
    };
    // get the response, then convert to json format response
    let jsonResponse = await (await fetch(url, options)).json();
    // log it to the console as a json string
    return jsonResponse;
};

// converts the json object into a easy to manage array of mod ids, ready to be passed into the main API call that returns all of the workshop ids
const getModIdsFromJsonObj = (jsonString) => {
    let modIdsArray = [];
    // definition of the variable
    let jsonObj;
    try {
        // attempt to parse the string as a JSON obj
        jsonObj = JSON.parse(jsonString);
    } catch {
        console.log("ERROR : Invalid data type given for getModIdsFromJsonObj");
        return "Invalid data type given";
    }
    // goes through the json object and slims it down to just the info we need
    let modsList;
    try {
        modsList = jsonObj.response.collectiondetails[0].children;
    } catch {
        console.log("ERROR : incorrect JSON format for function");
        return "Invalid data type given";
    }
    for (let i in modsList) {
        // for reference if i need the sort order than it can be included here by removing the publishedfileid
        modIdsArray.push(modsList[i].publishedfileid);
    }
    return modIdsArray;
};

// format the data into [workshopId, modId, title, imageCDNLink], return it as an array with arrays inside it
const createReturnData = (jsonResponse) => {
    // filter out what only what is needed
    jsonResponse = jsonResponse.response.publishedfiledetails;
    let returnDataArray = [];
    // RegEx to get the modId and workshop Id from the description
    const modIdRegEx = new RegExp(/.*Mod ID: .*\n?/g);
    const workshopIdRegEx = new RegExp(/.*Workshop ID: .*\n?/g);

    // loop over the response, grabbing each object in the list
    // for the regex, get the data back which is the first response, instead of all the return data
    for (let i = 0; i < jsonResponse.length; i++) {
        // get all of the mod ids and workshop ids present in each workshop page
        let modIds = String(jsonResponse[i].description).match(modIdRegEx);
        let workshopIds = String(jsonResponse[i].description).match(
            workshopIdRegEx
        );
        // this is normally to do with people putting ModID instead of Mod ID
        if (modIds === null) {
            modIds = String(jsonResponse[i].description).match(
                new RegExp(/.*ModID: .*\n?/g)
            );
        }
        // if no mod id or workshop id was found, or workshop id chances are someone forgot to add them or there is an edge case, either way ask the user to raise this issue and give them the mod page link
        if (modIds === null || workshopIds === null) {
            console.log(
                `Error : the mod '${jsonResponse[i].title}' is missing the mod id and/or workshop id, please manually look for it, if its there, raise an issue on the github page!`
            );
            // skip iteration
            continue;
        }
        // remove new line chars and trailing white spaces
        for (let i = 0; i < modIds.length; i++) {
            modIds[i] = modIds[i].trim();
        }
        for (let i = 0; i < workshopIds.length; i++) {
            workshopIds[i] = workshopIds[i].trim();
        }
        // convert to sets to avoid duplicates
        modIds = new Set(modIds);
        workshopIds = new Set(workshopIds);
        // then convert them back to arrays
        modIds = [...modIds];
        workshopIds = [...workshopIds];
        let internalDataArr = [
            modIds,
            workshopIds,
            jsonResponse[i].title,
            jsonResponse[i].preview_url,
        ];
        returnDataArray.push(internalDataArr);
    }
    return returnDataArray;
};

// used for turning the return data into the lists for the user.
const createDataForServerConfig = (returnDataArray, separator) => {
    let modIdString = "";
    let workshopIdString = "";
    for (let i = 0; i < returnDataArray.length; i++) {
        // TODO need to check for duplicate mod ids and workshop ids on the page
        modIdString +=
            String(returnDataArray[i][0]).replace("Mod ID: ", "") +
            `${separator}`;
        workshopIdString +=
            String(returnDataArray[i][1]).replace("Workshop ID: ", "") +
            `${separator}`;
    }
    // cleanup of newline characters using regex and the replace method to get rid of \r\n, \r, \n chars
    modIdString = modIdString.replace(/\r?\n|\r/gm, "");
    workshopIdString = workshopIdString.replace(/\r?\n|\r/gm, "");
    let modAndWorkshopIds = [modIdString, workshopIdString];
    return modAndWorkshopIds;
};

// main bundled function to handle link -> return data
const convertLinkToList = async () => {
    let jsonString = await getIdsFromCollection(id);
    let modIdsArray = getModIdsFromJsonObj(jsonString);
    const modDictionary = formatModListIntoDictionary(modIdsArray);
    let jsonResponse = await getWorkshopIds(modDictionary);
    return createReturnData(jsonResponse);
};

// export these to be used in the main runner / unit tests(app.js)
export {
    convertLinkToList,
    createReturnData,
    getIdsFromCollection,
    getModIdsFromJsonObj,
    getWorkshopIds,
    formatModListIntoDictionary,
    createDataForServerConfig,
};
