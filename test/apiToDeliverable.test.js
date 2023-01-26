const functions = require("../src/apiToDeliverable.js");

test("able to get the ids from a steam collection", () => {
    expect(functions.getIdsFromCollection(2774358064)).toBe();
});
