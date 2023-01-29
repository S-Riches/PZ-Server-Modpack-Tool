import fetch from "node-fetch";

// Grabs the workshop ids of each mod in a collection - then returns it in a json string to be worked with later on in the script
const getIdsFromCollection = async (collectionId) => {
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
    let jsonObj = JSON.parse(jsonString);
    // goes through the json object and slims it down to just the info we need
    const modsList = jsonObj.response.collectiondetails[0].children;
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
    const modIdRegEx = new RegExp(/.*Mod ID: .*\n?/);
    const workshopIdRegEx = new RegExp(/.*Workshop ID: .*\n?/);

    // loop over the response, grabbing each object in the list
    // for the regex, get the data back which is the first response, instead of all the return data
    for (let i = 0; i < jsonResponse.length; i++) {
        let internalDataArr = [
            modIdRegEx.exec(jsonResponse[i].description)[0],
            workshopIdRegEx.exec(jsonResponse[i].description)[0],
            jsonResponse[i].title,
            jsonResponse[i].preview_url,
        ];
        returnDataArray.push(internalDataArr);
    }
    console.log(returnDataArray);
    return returnDataArray;
};

// export these to be used in the main runner (app.js)
export {
    createReturnData,
    getIdsFromCollection,
    getModIdsFromJsonObj,
    getWorkshopIds,
    formatModListIntoDictionary,
};
