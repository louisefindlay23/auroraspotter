// Run with: npm test  (node --test)
const test = require("node:test");
const assert = require("node:assert");
const { buildObservationsTable } = require("../server.js");

test("empty observations show the no-data message", () => {
    const html = buildObservationsTable([]);
    assert.match(html, /You have not recorded any Aurora observations yet/);
    assert.doesNotMatch(html, /<table/);
});

test("observations render a row per sighting with the photo path", () => {
    const html = buildObservationsTable([
        {
            date: "2020-03-01",
            time: "21:30",
            latitude: "57.1",
            longitude: "-2.1",
            observation_photo: "aurora-123.jpg",
        },
        {
            date: "2020-03-02",
            time: "22:00",
            latitude: "56.0",
            longitude: "-3.0",
            observation_photo: "aurora-default.jpg",
        },
    ]);
    assert.match(html, /<table id="diary-tbl">/);
    assert.strictEqual((html.match(/<tr>/g) || []).length, 3); // header + 2 rows
    assert.match(html, /aurora-123\.jpg/);
    assert.match(html, /2020-03-02/);
});
