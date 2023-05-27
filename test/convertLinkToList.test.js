import {
    getIdsFromCollection,
    getModIdsFromJsonObj,
    formatModListIntoDictionary,
    getWorkshopIds,
    createReturnData,
} from "../src/convertLinkToList.js";

describe("able to get the ids from a steam collection", () => {
    // positive testing
    test("when a real collection id is given", async () => {
        let output = JSON.parse(await getIdsFromCollection(2916244611));
        // check if there is a [ ] in the response, meaning an array with workshop ids
        expect(JSON.stringify(output.response.collectiondetails[0])).toContain(
            "[" && "]"
        );
    });
    // negative testing
    test("when a fake collection id is given", async () => {
        let output = JSON.parse(
            await getIdsFromCollection(2132142134214214124)
        );
        expect(
            JSON.stringify(output.response.collectiondetails[0])
        ).not.toContain("[" && "]");
    });
    // null testing
    test("when a no collection id is given", async () => {
        let output = await getIdsFromCollection();
        // only returns this as its a null json string, and
        expect(output).toBe("{}");
    });
    // given alpha characters when expecting numbers
    test("when a string is given instead of a number", async () => {
        let output = await getIdsFromCollection("testString");
        expect(output).toBe("{}");
    });
});

describe("you can convert a json string into a mod id array", () => {
    test("When a valid Json string is given", () => {
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
    // negative testing
    test("When a invalid Json string is given", () => {
        const invalidStringInput = "Test";
        expect(getModIdsFromJsonObj(invalidStringInput)).toBe(
            "Invalid data type given"
        );
    });
    // number input
    test("When a number is given", () => {
        const numberInput = 123124124124;
        expect(getModIdsFromJsonObj(numberInput)).toBe(
            "Invalid data type given"
        );
    });
    test("when no value is given", () => {
        expect(getModIdsFromJsonObj()).toBe("Invalid data type given");
    });
});

describe("Testing the formatting list into dictionary ", () => {
    // postitive testing
    test("Given 4 array elements, check there are 4 key/value pairs in the outputted dictionary", () => {
        const testArray = [
            "1539281445",
            "2297098490",
            "2696986935",
            "2313387159",
        ];
        expect(Object.keys(formatModListIntoDictionary(testArray)).length).toBe(
            4
        );
    });
    // postitive testing
    test("Check that the formatted mod list has the correct key names", () => {
        const testArray = [
            "1539281445",
            "2297098490",
            "2696986935",
            "2313387159",
        ];
        expect(Object.keys(formatModListIntoDictionary(testArray))).toContain(
            "publishedfileids[0]",
            "publishedfileids[1]",
            "publishedfileids[2]",
            "publishedfileids[3]"
        );
    });
});

describe("Trying to break the methods", () => {
    test("when we give a workshop item with multiple mod ids", async () => {
        let testDict = { "publishedfileids[0]": "2651128766" };
        let res = createReturnData(await getWorkshopIds(testDict));
        console.log(res[0][0]);
        // need to have all options for mod ids, to allow for user selection
        expect(res[0][0]).toEqual([
            "Mod ID: AkyFingersFem",
            "Mod ID: AkyFingers",
        ]);
    });

    test("When working with a huge mod pack", async () => {
        // get the json object from steam
        let jsonString = await getIdsFromCollection(2942023507);
        let modIdsArr = getModIdsFromJsonObj(jsonString);
        let modDict = formatModListIntoDictionary(modIdsArr);
        let jsonResponse = await getWorkshopIds(modDict);
        let returnDataArray = createReturnData(jsonResponse);
    });
});
