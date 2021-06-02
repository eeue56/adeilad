"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.testNestedPipeline = exports.testPipeline = exports.testAndThen = exports.testFail = exports.testSucceed = exports.testMap3 = exports.testMap2 = exports.testMap = exports.testOneOf = exports.testAt = exports.testField = exports.testRecord = exports.testArray = exports.testNumber = exports.testBool = exports.testString = exports.testAny = void 0;
var result_1 = require("@eeue56/ts-core/build/main/lib/result");
var assert = __importStar(require("assert"));
var adeilad = __importStar(require("./adeilad"));
function testAny() {
    var thingsThatShouldPass = [
        "",
        "hello",
        "hello world",
        "123",
        "-123",
        "0",
        "null",
        123,
        -123,
        0,
        true,
        false,
        null,
        [],
        { name: "noah" },
        { name: "noah", pets: { total: 0 } },
        {},
    ];
    thingsThatShouldPass.forEach(function (thing) {
        var result = adeilad.decode(adeilad.any(), thing);
        try {
            assert.deepStrictEqual(result.kind, "ok");
        }
        catch (e) {
            console.error(thing, result);
            throw e;
        }
    });
}
exports.testAny = testAny;
function testString() {
    var thingsThatShouldPass = [
        "",
        "hello",
        "hello world",
        "123",
        "-123",
        "0",
        "null",
    ];
    var thingsThatShouldNotPass = [123, -123, 0, true, false, null, []];
    thingsThatShouldPass.forEach(function (thing) {
        var result = adeilad.decode(adeilad.string(), thing);
        try {
            assert.deepStrictEqual(result.kind, "ok");
        }
        catch (e) {
            console.error(thing, result);
            throw e;
        }
    });
    thingsThatShouldNotPass.forEach(function (thing) {
        var result = adeilad.decode(adeilad.string(), thing);
        try {
            assert.deepStrictEqual(result.kind, "err");
        }
        catch (e) {
            console.error(thing, result);
            throw e;
        }
    });
}
exports.testString = testString;
function testBool() {
    var thingsThatShouldPass = [true, false];
    var thingsThatShouldNotPass = ["", "hello", 123, -123, 0, null, []];
    thingsThatShouldPass.forEach(function (thing) {
        var result = adeilad.decode(adeilad.bool(), thing);
        try {
            assert.deepStrictEqual(result.kind, "ok");
        }
        catch (e) {
            console.error(thing, result);
            throw e;
        }
    });
    thingsThatShouldNotPass.forEach(function (thing) {
        var result = adeilad.decode(adeilad.bool(), thing);
        try {
            assert.deepStrictEqual(result.kind, "err");
        }
        catch (e) {
            console.error(thing, result);
            throw e;
        }
    });
}
exports.testBool = testBool;
function testNumber() {
    var thingsThatShouldPass = [0, 123, -123, 123.987, -123.987];
    var thingsThatShouldNotPass = ["", "hello", true, false, null, []];
    thingsThatShouldPass.forEach(function (thing) {
        var result = adeilad.decode(adeilad.number(), thing);
        assert.deepStrictEqual(result.kind, "ok");
    });
    thingsThatShouldNotPass.forEach(function (thing) {
        var result = adeilad.decode(adeilad.number(), thing);
        assert.deepStrictEqual(result.kind, "err");
    });
}
exports.testNumber = testNumber;
function testArray() {
    var thingsThatShouldPass = [[], [123], [-123, 123.987]];
    var thingsThatShouldNotPass = [
        "",
        "hello",
        true,
        false,
        null,
        0,
        123,
        -123,
        123.987,
        -123.987,
    ];
    thingsThatShouldPass.forEach(function (thing) {
        var result = adeilad.decode(adeilad.array(adeilad.number()), thing);
        try {
            assert.deepStrictEqual(result.kind, "ok");
        }
        catch (e) {
            console.error(thing, result);
            throw e;
        }
    });
    thingsThatShouldNotPass.forEach(function (thing) {
        var result = adeilad.decode(adeilad.array(adeilad.number()), thing);
        try {
            assert.deepStrictEqual(result.kind, "err");
        }
        catch (e) {
            console.error(thing, result);
            throw e;
        }
    });
}
exports.testArray = testArray;
function testRecord() {
    var thingsThatShouldPass = [
        {},
        { name: "noah" },
        { name: "noah", username: "eeue56" },
    ];
    var mixedThingsThatShouldPass = [
        {},
        { name: "noah" },
        { name: "noah", age: 28 },
    ];
    var thingsThatShouldNotPass = [
        "",
        "hello",
        true,
        false,
        null,
        0,
        123,
        -123,
        123.987,
        -123.987,
        [],
    ];
    thingsThatShouldPass.forEach(function (thing) {
        var result = adeilad.decode(adeilad.record(adeilad.string()), thing);
        try {
            assert.deepStrictEqual(result.kind, "ok");
        }
        catch (e) {
            console.error(thing, result);
            throw e;
        }
    });
    mixedThingsThatShouldPass.forEach(function (thing) {
        var result = adeilad.decode(adeilad.record(adeilad.oneOf([
            adeilad.string(),
            adeilad.number(),
        ])), thing);
        try {
            assert.deepStrictEqual(result.kind, "ok");
        }
        catch (e) {
            console.error(thing, result);
            throw e;
        }
    });
    thingsThatShouldNotPass.forEach(function (thing) {
        var result = adeilad.decode(adeilad.record(adeilad.string()), thing);
        try {
            assert.deepStrictEqual(result.kind, "err");
        }
        catch (e) {
            console.error(thing, result);
            throw e;
        }
    });
}
exports.testRecord = testRecord;
function testField() {
    var thingsThatShouldPass = [
        { name: "noah" },
        { name: "noah", pets: { total: 0 } },
    ];
    var thingsThatShouldNotPass = [
        {},
        "",
        "hello",
        true,
        false,
        null,
        0,
        123,
        -123,
        123.987,
        -123.987,
        [],
    ];
    assert.deepStrictEqual(adeilad.decode(adeilad.field("name", adeilad.string()), thingsThatShouldPass[0]), result_1.Ok("noah"));
    assert.deepStrictEqual(adeilad.decode(adeilad.field("name", adeilad.string()), thingsThatShouldPass[1]), result_1.Ok("noah"));
    assert.deepStrictEqual(adeilad.decode(adeilad.field("pets", adeilad.field("total", adeilad.number())), thingsThatShouldPass[1]), result_1.Ok(0));
    thingsThatShouldNotPass.forEach(function (thing) {
        var result = adeilad.decode(adeilad.field("name", adeilad.string()), thing);
        try {
            assert.deepStrictEqual(result.kind, "err");
        }
        catch (e) {
            console.error(thing, result);
            throw e;
        }
    });
}
exports.testField = testField;
function testAt() {
    var thingsThatShouldPass = [
        { name: "noah" },
        { name: "noah", pets: { total: 0 } },
    ];
    var thingsThatShouldNotPass = [
        {},
        "",
        "hello",
        true,
        false,
        null,
        0,
        123,
        -123,
        123.987,
        -123.987,
        [],
    ];
    assert.deepStrictEqual(adeilad.decode(adeilad.at(["name"], adeilad.string()), thingsThatShouldPass[0]), result_1.Ok("noah"));
    assert.deepStrictEqual(adeilad.decode(adeilad.at(["name"], adeilad.string()), thingsThatShouldPass[1]), result_1.Ok("noah"));
    assert.deepStrictEqual(adeilad.decode(adeilad.at(["pets", "total"], adeilad.number()), thingsThatShouldPass[1]), result_1.Ok(0));
    thingsThatShouldNotPass.forEach(function (thing) {
        var result = adeilad.decode(adeilad.at(["name"], adeilad.string()), thing);
        try {
            assert.deepStrictEqual(result.kind, "err");
        }
        catch (e) {
            console.error(thing, result);
            throw e;
        }
    });
    assert.deepStrictEqual(adeilad.decode(adeilad.at(["pets", "total"], adeilad.number()), {
        pets: { total: "zero" },
    }), result_1.Err("Error parsing [pets > total] due to \"zero\" is not a number"));
    assert.deepStrictEqual(adeilad.decode(adeilad.at(["pets", "total"], adeilad.number()), {}), result_1.Err("Value at index [pets > total] is not an object"));
}
exports.testAt = testAt;
function testOneOf() {
    var thingsThatShouldPass = [
        ["string", 123],
        [123],
        [-123, 123.987],
        ["string"],
    ];
    var thingsThatShouldNotPass = [
        "",
        "hello",
        true,
        false,
        null,
        0,
        123,
        -123,
        123.987,
        -123.987,
        ["hello", 123, null],
    ];
    var mixedStringAndNumberArrayDecoder = adeilad.array(adeilad.oneOf([adeilad.number(), adeilad.string()]));
    thingsThatShouldPass.forEach(function (thing) {
        var result = adeilad.decode(mixedStringAndNumberArrayDecoder, thing);
        try {
            assert.deepStrictEqual(result.kind, "ok");
        }
        catch (e) {
            console.error(thing, result);
            throw e;
        }
    });
    thingsThatShouldNotPass.forEach(function (thing) {
        var result = adeilad.decode(mixedStringAndNumberArrayDecoder, thing);
        try {
            assert.deepStrictEqual(result.kind, "err");
        }
        catch (e) {
            console.error(thing, result);
            throw e;
        }
    });
}
exports.testOneOf = testOneOf;
function testMap() {
    var thingsThatShouldPass = [
        { name: "noah" },
        { name: "noah", pets: { total: 0 } },
    ];
    var Person = /** @class */ (function () {
        function Person(name) {
            this.name = name;
        }
        return Person;
    }());
    var thingsThatShouldNotPass = [
        {},
        "",
        "hello",
        true,
        false,
        null,
        0,
        123,
        -123,
        123.987,
        -123.987,
        ["hello", 123, null],
    ];
    var personDecoder = adeilad.map(function (x) { return new Person(x); }, adeilad.field("name", adeilad.string()));
    thingsThatShouldPass.forEach(function (thing) {
        var result = adeilad.decode(personDecoder, thing);
        try {
            assert.deepStrictEqual(result.kind, "ok");
        }
        catch (e) {
            console.error(thing, result);
            throw e;
        }
    });
    thingsThatShouldNotPass.forEach(function (thing) {
        var result = adeilad.decode(personDecoder, thing);
        try {
            assert.deepStrictEqual(result.kind, "err");
        }
        catch (e) {
            console.error(thing, result);
            throw e;
        }
    });
}
exports.testMap = testMap;
function testMap2() {
    var thingsThatShouldPass = [
        { name: "noah", age: 28 },
        { name: "noah", age: 28, pets: { total: 0 } },
    ];
    var Person = /** @class */ (function () {
        function Person(name, age) {
            this.name = name;
            this.age = age;
        }
        return Person;
    }());
    var thingsThatShouldNotPass = [
        {},
        { name: "noah" },
        "",
        "hello",
        true,
        false,
        null,
        0,
        123,
        -123,
        123.987,
        -123.987,
        ["hello", 123, null],
    ];
    var personDecoder = adeilad.map2(function (x, y) { return new Person(x, y); }, adeilad.field("name", adeilad.string()), adeilad.field("age", adeilad.number()));
    thingsThatShouldPass.forEach(function (thing) {
        var result = adeilad.decode(personDecoder, thing);
        try {
            assert.deepStrictEqual(result.kind, "ok");
        }
        catch (e) {
            console.error(thing, result);
            throw e;
        }
    });
    thingsThatShouldNotPass.forEach(function (thing) {
        var result = adeilad.decode(personDecoder, thing);
        try {
            assert.deepStrictEqual(result.kind, "err");
        }
        catch (e) {
            console.error(thing, result);
            throw e;
        }
    });
}
exports.testMap2 = testMap2;
function testMap3() {
    var thingsThatShouldPass = [
        { name: "noah", age: 28, pets: { total: 0 } },
    ];
    var Person = /** @class */ (function () {
        function Person(name, age, numberOfPets) {
            this.name = name;
            this.age = age;
            this.pets = {
                total: numberOfPets,
            };
        }
        return Person;
    }());
    var thingsThatShouldNotPass = [
        {},
        { name: "noah" },
        { name: "noah", age: 28 },
        "",
        "hello",
        true,
        false,
        null,
        0,
        123,
        -123,
        123.987,
        -123.987,
        ["hello", 123, null],
    ];
    var personDecoder = adeilad.map3(function (x, y, z) { return new Person(x, y, z); }, adeilad.field("name", adeilad.string()), adeilad.field("age", adeilad.number()), adeilad.at(["pets", "total"], adeilad.number()));
    thingsThatShouldPass.forEach(function (thing) {
        var result = adeilad.decode(personDecoder, thing);
        try {
            assert.deepStrictEqual(result.kind, "ok");
        }
        catch (e) {
            console.error(thing, result);
            throw e;
        }
    });
    thingsThatShouldNotPass.forEach(function (thing) {
        var result = adeilad.decode(personDecoder, thing);
        try {
            assert.deepStrictEqual(result.kind, "err");
        }
        catch (e) {
            console.error(thing, result);
            throw e;
        }
    });
}
exports.testMap3 = testMap3;
function testSucceed() {
    var thingsThatShouldPass = [
        ["string", 123],
        [123],
        [-123, 123.987],
        ["string"],
        "",
        "hello",
        true,
        false,
        null,
        0,
        123,
        -123,
        123.987,
        -123.987,
        ["hello", 123, null],
    ];
    var successDecoder = adeilad.succeed("Yay!");
    thingsThatShouldPass.forEach(function (thing) {
        var result = adeilad.decode(successDecoder, thing);
        try {
            assert.deepStrictEqual(result.kind, "ok");
        }
        catch (e) {
            console.error(thing, result);
            throw e;
        }
    });
}
exports.testSucceed = testSucceed;
function testFail() {
    var thingsThatShouldNotPass = [
        ["string", 123],
        [123],
        [-123, 123.987],
        ["string"],
        "",
        "hello",
        true,
        false,
        null,
        0,
        123,
        -123,
        123.987,
        -123.987,
        ["hello", 123, null],
    ];
    var failureDecoder = adeilad.fail("Yay!");
    thingsThatShouldNotPass.forEach(function (thing) {
        var result = adeilad.decode(failureDecoder, thing);
        try {
            assert.deepStrictEqual(result.kind, "err");
        }
        catch (e) {
            console.error(thing, result);
            throw e;
        }
    });
}
exports.testFail = testFail;
function testAndThen() {
    var thingsThatShouldNotPass = [
        { name: "Noah", age: 29 },
        { name: "James", age: 0 },
        ["string", 123],
        [123],
        [-123, 123.987],
        ["string"],
        "",
        "hello",
        true,
        false,
        null,
        0,
        123,
        -123,
        123.987,
        -123.987,
        ["hello", 123, null],
    ];
    function personHelp(age) {
        if (age !== 28)
            return adeilad.fail("You must be 28 to pass!");
        return adeilad.map(function (name) {
            return { name: name };
        }, adeilad.field("name", adeilad.string()));
    }
    var decoder = adeilad.andThen(personHelp, adeilad.field("age", adeilad.number()));
    var thingThatShouldPass = {
        name: "Noah",
        age: 28,
    };
    var resultThatShouldPass = adeilad.decode(decoder, thingThatShouldPass);
    try {
        assert.deepStrictEqual(resultThatShouldPass, result_1.Ok({
            name: "Noah",
        }));
    }
    catch (e) {
        console.error(thingThatShouldPass, resultThatShouldPass);
        throw e;
    }
    thingsThatShouldNotPass.forEach(function (thing) {
        var result = adeilad.decode(decoder, thing);
        try {
            assert.deepStrictEqual(result.kind, "err");
        }
        catch (e) {
            console.error(thing, result);
            throw e;
        }
    });
}
exports.testAndThen = testAndThen;
function testPipeline() {
    var thingsThatShouldNotPass = [
        { name: "Noah", age: 29 },
        { name: "James", age: 0 },
        ["string", 123],
        [123],
        [-123, 123.987],
        ["string"],
        "",
        "hello",
        true,
        false,
        null,
        0,
        123,
        -123,
        123.987,
        -123.987,
        ["hello", 123, null],
    ];
    var makePerson = function (name, age, totalNumberOfPets, isAlive, hasFeet, doesNotHaveFeet, somethingDeepAndNested) {
        return {
            name: name,
            age: age,
            pets: {
                total: totalNumberOfPets,
            },
            isAlive: isAlive,
            hasFeet: hasFeet,
            doesNotHaveFeet: doesNotHaveFeet,
            somethingDeepAndNested: somethingDeepAndNested,
        };
    };
    var decoder = adeilad.pipeline([
        adeilad.required("name", adeilad.string()),
        adeilad.required("age", adeilad.number()),
        adeilad.requiredAt(["pets", "total"], adeilad.number()),
        adeilad.hardcoded(true),
        adeilad.optional("hasFeet", adeilad.bool(), true),
        adeilad.optional("doesNotHaveFeet", adeilad.bool(), true),
        adeilad.optionalAt(["something", "deep"], adeilad.string(), "a default"),
    ], makePerson);
    var thingThatShouldPass = {
        name: "Noah",
        age: 28,
        pets: {
            total: 0,
        },
        doesNotHaveFeet: false,
    };
    var resultThatShouldPass = adeilad.decode(decoder, thingThatShouldPass);
    try {
        assert.deepStrictEqual(resultThatShouldPass, result_1.Ok({
            name: "Noah",
            age: 28,
            pets: {
                total: 0,
            },
            isAlive: true,
            hasFeet: true,
            doesNotHaveFeet: false,
            somethingDeepAndNested: "a default",
        }));
    }
    catch (e) {
        console.error(thingThatShouldPass, resultThatShouldPass);
        throw e;
    }
    var otherThingThatShouldPass = {
        name: "Noah",
        age: 28,
        pets: {
            total: 0,
        },
        doesNotHaveFeet: false,
        something: {
            deep: "not a default",
        },
    };
    var otherResultThatShouldPass = adeilad.decode(decoder, otherThingThatShouldPass);
    try {
        assert.deepStrictEqual(otherResultThatShouldPass, result_1.Ok({
            name: "Noah",
            age: 28,
            pets: {
                total: 0,
            },
            isAlive: true,
            hasFeet: true,
            doesNotHaveFeet: false,
            somethingDeepAndNested: "not a default",
        }));
    }
    catch (e) {
        console.error(otherThingThatShouldPass, otherResultThatShouldPass);
        throw e;
    }
    thingsThatShouldNotPass.forEach(function (thing) {
        var result = adeilad.decode(decoder, thing);
        try {
            assert.deepStrictEqual(result.kind, "err");
        }
        catch (e) {
            console.error(thing, result);
            throw e;
        }
    });
}
exports.testPipeline = testPipeline;
function testNestedPipeline() {
    var thingsThatShouldNotPass = [
        { name: "Noah", age: 29 },
        { name: "James", age: 0 },
        ["string", 123],
        [123],
        [-123, 123.987],
        ["string"],
        "",
        "hello",
        true,
        false,
        null,
        0,
        123,
        -123,
        123.987,
        -123.987,
        ["hello", 123, null],
    ];
    var makePet = function (name, age) {
        return {
            name: name,
            age: age,
        };
    };
    var makePerson = function (name, age, pets) {
        return {
            name: name,
            age: age,
            pets: pets,
        };
    };
    var decoder = adeilad.pipeline([
        adeilad.required("name", adeilad.string()),
        adeilad.required("age", adeilad.number()),
        adeilad.required("pets", adeilad.array(adeilad.pipeline([
            adeilad.required("name", adeilad.string()),
            adeilad.required("age", adeilad.number()),
        ], makePet))),
    ], makePerson);
    var thingThatShouldPass = {
        name: "Noah",
        age: 28,
        pets: [
            { name: "Frodo", age: 8 },
            { name: "Fiver", age: 3 },
        ],
    };
    var resultThatShouldPass = adeilad.decode(decoder, thingThatShouldPass);
    try {
        assert.deepStrictEqual(resultThatShouldPass, result_1.Ok({
            name: "Noah",
            age: 28,
            pets: [
                { name: "Frodo", age: 8 },
                { name: "Fiver", age: 3 },
            ],
        }));
    }
    catch (e) {
        console.error(thingThatShouldPass, resultThatShouldPass);
        throw e;
    }
    thingsThatShouldNotPass.forEach(function (thing) {
        var result = adeilad.decode(decoder, thing);
        try {
            assert.deepStrictEqual(result.kind, "err");
        }
        catch (e) {
            console.error(thing, result);
            throw e;
        }
    });
}
exports.testNestedPipeline = testNestedPipeline;
