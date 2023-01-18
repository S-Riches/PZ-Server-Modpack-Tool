import fetch from "node-fetch";

// Grabs the collection id
const getIdsFromCollection = async (collectionId) => {
    const url = `https://api.steampowered.com/ISteamRemoteStorage/GetCollectionDetails/v1/`;
    const options = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: {
            key: "...",
            collectioncount: "1",
            "publishedfileids[0]": "2916244611",
        },
    };
    const response = await fetch(url, options);
    const data = await response;
    console.log(data);
};

const main = async () => {
    // main runner code
    getIdsFromCollection();
};

main();
