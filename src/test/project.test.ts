import { JSONOutput, splitUnquotedString } from "../index.js";
import Assert from "assert";
import { JSON_SCHEMA_VERSION } from "../lib/models/ProjectReflection.js";

describe("Project", function () {
    describe("splitUnquotedString", () => {
        let result: string[] | undefined;

        it("unquoted string", function () {
            result = splitUnquotedString("foo.bar", ".");
            Assert.strictEqual(result.length, 2, "Wrong length");
            Assert.strictEqual(result[0], "foo", "Wrong split");
            Assert.strictEqual(result[1], "bar", "Wrong split");
        });

        it("quoted string", function () {
            result = splitUnquotedString('"foo.bar"', ".");
            Assert.strictEqual(result.length, 1, "Wrong length");
            Assert.strictEqual(result[0], '"foo.bar"', "Wrong split");
        });

        it("quoted start, unquoted end", function () {
            result = splitUnquotedString('"foo.d".bar', ".");
            Assert.strictEqual(result.length, 2, "Wrong length");
            Assert.strictEqual(result[0], '"foo.d"', "Wrong split");
            Assert.strictEqual(result[1], "bar", "Wrong split");
        });

        it("unmatched quotes", function () {
            result = splitUnquotedString('"foo.d', ".");
            Assert.strictEqual(result.length, 2, "Wrong length");
            Assert.strictEqual(result[0], '"foo', "Wrong split");
            Assert.strictEqual(result[1], "d", "Wrong split");
        });
    });

    describe("JSON schema version", () => {
        Assert.strictEqual(JSON_SCHEMA_VERSION, JSONOutput.SCHEMA_VERSION);
    });
});
