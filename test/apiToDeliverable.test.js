import {
    getIdsFromCollection,
    getModIdsFromJsonObj,
    formatModListIntoDictionary,
} from "../src/apiToDeliverable.js";

test("able to get the ids from a steam collection", async () => {
    let output = JSON.parse(await getIdsFromCollection(2916244611));
    expect(
        output.response.collectiondetails[0].children.length
    ).toBeGreaterThan(0);
});

test("you can convert a json string into a mod id array", () => {
    // create a test json string based of real input, then check its created an array with more than 0 length
    const testJsonStringInput = JSON.stringify({
        response: {
            result: 1,
            resultcount: 1,
            collectiondetails: [
                {
                    publishedfileid: "2916244611",
                    result: 1,
                    children: [
                        {
                            publishedfileid: "1539281445",
                            sortorder: 0,
                            filetype: 0,
                        },
                        {
                            publishedfileid: "2297098490",
                            sortorder: 1,
                            filetype: 0,
                        },
                        {
                            publishedfileid: "2696986935",
                            sortorder: 2,
                            filetype: 0,
                        },
                        {
                            publishedfileid: "2313387159",
                            sortorder: 3,
                            filetype: 0,
                        },
                    ],
                },
            ],
        },
    });
    expect(
        getModIdsFromJsonObj(testJsonStringInput).length
    ).toBeGreaterThanOrEqual(1);
});

test("given an array with 4 values, create a dictionary with 4 items, each with a key with an index ", () => {
    const testArray = ["1539281445", "2297098490", "2696986935", "2313387159"];
    expect(Object.keys(formatModListIntoDictionary(testArray)).length).toBe(4);
    expect(Object.keys(formatModListIntoDictionary(testArray))).toContain(
        "publishedfileids[0]",
        "publishedfileids[1]",
        "publishedfileids[2]",
        "publishedfileids[3]"
    );
});
