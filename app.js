import fetch from "node-fetch";

// Grabs the workshop ids of each mod in a collection - then returns it in a json string to be worked with later on in the script
const getIdsFromCollection = async (collectionId) => {
    const url = `https://api.steampowered.com/ISteamRemoteStorage/GetCollectionDetails/v1/`;
    const options = {
        method: "POST",
        // need to send the request as a x-www-form-urlencoded as steam web api is weird
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
            // key: "...",
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

const getWorkshopIds = async (modIdsArray) => {
    const url =
        "https://api.steampowered.com/ISteamRemoteStorage/GetPublishedFileDetails/v1/";
    console.log(modIdsArray.length);
    const options = {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
            itemcount: modIdsArray.length,
        }),
    };
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

const main = async () => {
    // main runner code
    let jsonString = await getIdsFromCollection(2916244611);
    let modIdsArray = getModIdsFromJsonObj(jsonString);
    getWorkshopIds(modIdsArray);
    console.log(modIdsArray);
};

main();
