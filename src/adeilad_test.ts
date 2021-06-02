import { Result } from "@eeue56/ts-core";
import { Err, Ok } from "@eeue56/ts-core/build/main/lib/result";
import * as assert from "assert";
import * as adeilad from "./adeilad";

export function testAny() {
    const thingsThatShouldPass = [
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
        [ ],
        { name: "noah" },
        { name: "noah", pets: { total: 0 } },
        {},
    ];

    thingsThatShouldPass.forEach((thing) => {
        const result = adeilad.decode(adeilad.any(), thing);
        try {
            assert.deepStrictEqual(result.kind, "ok");
        } catch (e) {
            console.error(thing, result);
            throw e;
        }
    });
}

export function testString() {
    const thingsThatShouldPass = [
        "",
        "hello",
        "hello world",
        "123",
        "-123",
        "0",
        "null",
    ];

    const thingsThatShouldNotPass = [ 123, -123, 0, true, false, null, [ ] ];

    thingsThatShouldPass.forEach((thing) => {
        const result = adeilad.decode(adeilad.string(), thing);
        try {
            assert.deepStrictEqual(result.kind, "ok");
        } catch (e) {
            console.error(thing, result);
            throw e;
        }
    });

    thingsThatShouldNotPass.forEach((thing) => {
        const result = adeilad.decode(adeilad.string(), thing);
        try {
            assert.deepStrictEqual(result.kind, "err");
        } catch (e) {
            console.error(thing, result);
            throw e;
        }
    });
}

export function testBool() {
    const thingsThatShouldPass = [ true, false ];

    const thingsThatShouldNotPass = [ "", "hello", 123, -123, 0, null, [ ] ];

    thingsThatShouldPass.forEach((thing) => {
        const result = adeilad.decode(adeilad.bool(), thing);
        try {
            assert.deepStrictEqual(result.kind, "ok");
        } catch (e) {
            console.error(thing, result);
            throw e;
        }
    });

    thingsThatShouldNotPass.forEach((thing) => {
        const result = adeilad.decode(adeilad.bool(), thing);
        try {
            assert.deepStrictEqual(result.kind, "err");
        } catch (e) {
            console.error(thing, result);
            throw e;
        }
    });
}

export function testNumber() {
    const thingsThatShouldPass = [ 0, 123, -123, 123.987, -123.987 ];

    const thingsThatShouldNotPass = [ "", "hello", true, false, null, [ ] ];

    thingsThatShouldPass.forEach((thing) => {
        const result = adeilad.decode(adeilad.number(), thing);
        assert.deepStrictEqual(result.kind, "ok");
    });

    thingsThatShouldNotPass.forEach((thing) => {
        const result = adeilad.decode(adeilad.number(), thing);
        assert.deepStrictEqual(result.kind, "err");
    });
}

export function testArray() {
    const thingsThatShouldPass = [ [ ], [ 123 ], [ -123, 123.987 ] ];

    const thingsThatShouldNotPass = [
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

    thingsThatShouldPass.forEach((thing) => {
        const result = adeilad.decode(adeilad.array(adeilad.number()), thing);
        try {
            assert.deepStrictEqual(result.kind, "ok");
        } catch (e) {
            console.error(thing, result);
            throw e;
        }
    });

    thingsThatShouldNotPass.forEach((thing) => {
        const result = adeilad.decode(adeilad.array(adeilad.number()), thing);
        try {
            assert.deepStrictEqual(result.kind, "err");
        } catch (e) {
            console.error(thing, result);
            throw e;
        }
    });
}

export function testRecord() {
    const thingsThatShouldPass = [
        {},
        { name: "noah" },
        { name: "noah", username: "eeue56" },
    ];

    const mixedThingsThatShouldPass = [
        {},
        { name: "noah" },
        { name: "noah", age: 28 },
    ];

    const thingsThatShouldNotPass = [
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
        [ ],
    ];

    thingsThatShouldPass.forEach((thing) => {
        const result = adeilad.decode(adeilad.record(adeilad.string()), thing);
        try {
            assert.deepStrictEqual(result.kind, "ok");
        } catch (e) {
            console.error(thing, result);
            throw e;
        }
    });

    mixedThingsThatShouldPass.forEach((thing) => {
        const result = adeilad.decode(
            adeilad.record(
                adeilad.oneOf<string | number>([
                    adeilad.string(),
                    adeilad.number(),
                ])
            ),
            thing
        );
        try {
            assert.deepStrictEqual(result.kind, "ok");
        } catch (e) {
            console.error(thing, result);
            throw e;
        }
    });

    thingsThatShouldNotPass.forEach((thing) => {
        const result = adeilad.decode(adeilad.record(adeilad.string()), thing);
        try {
            assert.deepStrictEqual(result.kind, "err");
        } catch (e) {
            console.error(thing, result);
            throw e;
        }
    });
}

export function testField() {
    const thingsThatShouldPass = [
        { name: "noah" },
        { name: "noah", pets: { total: 0 } },
    ];

    const thingsThatShouldNotPass = [
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
        [ ],
    ];

    assert.deepStrictEqual(
        adeilad.decode(
            adeilad.field("name", adeilad.string()),
            thingsThatShouldPass[0]
        ),
        Ok("noah")
    );

    assert.deepStrictEqual(
        adeilad.decode(
            adeilad.field("name", adeilad.string()),
            thingsThatShouldPass[1]
        ),
        Ok("noah")
    );

    assert.deepStrictEqual(
        adeilad.decode(
            adeilad.field("pets", adeilad.field("total", adeilad.number())),
            thingsThatShouldPass[1]
        ),
        Ok(0)
    );

    thingsThatShouldNotPass.forEach((thing) => {
        const result = adeilad.decode(
            adeilad.field("name", adeilad.string()),
            thing
        );
        try {
            assert.deepStrictEqual(result.kind, "err");
        } catch (e) {
            console.error(thing, result);
            throw e;
        }
    });
}

export function testAt() {
    const thingsThatShouldPass = [
        { name: "noah" },
        { name: "noah", pets: { total: 0 } },
    ];

    const thingsThatShouldNotPass = [
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
        [ ],
    ];

    assert.deepStrictEqual(
        adeilad.decode(
            adeilad.at([ "name" ], adeilad.string()),
            thingsThatShouldPass[0]
        ),
        Ok("noah")
    );

    assert.deepStrictEqual(
        adeilad.decode(
            adeilad.at([ "name" ], adeilad.string()),
            thingsThatShouldPass[1]
        ),
        Ok("noah")
    );

    assert.deepStrictEqual(
        adeilad.decode(
            adeilad.at([ "pets", "total" ], adeilad.number()),
            thingsThatShouldPass[1]
        ),
        Ok(0)
    );

    thingsThatShouldNotPass.forEach((thing) => {
        const result = adeilad.decode(
            adeilad.at([ "name" ], adeilad.string()),
            thing
        );
        try {
            assert.deepStrictEqual(result.kind, "err");
        } catch (e) {
            console.error(thing, result);
            throw e;
        }
    });

    assert.deepStrictEqual(
        adeilad.decode(adeilad.at([ "pets", "total" ], adeilad.number()), {
            pets: { total: "zero" },
        }),
        Err(`Error parsing [pets > total] due to "zero" is not a number`)
    );

    assert.deepStrictEqual(
        adeilad.decode(adeilad.at([ "pets", "total" ], adeilad.number()), {}),
        Err(`Value at index [pets > total] is not an object`)
    );
}

export function testOneOf() {
    const thingsThatShouldPass = [
        [ "string", 123 ],
        [ 123 ],
        [ -123, 123.987 ],
        [ "string" ],
    ];

    const thingsThatShouldNotPass = [
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
        [ "hello", 123, null ],
    ];

    const mixedStringAndNumberArrayDecoder = adeilad.array(
        adeilad.oneOf<string | number>([ adeilad.number(), adeilad.string() ])
    );

    thingsThatShouldPass.forEach((thing) => {
        const result = adeilad.decode(mixedStringAndNumberArrayDecoder, thing);
        try {
            assert.deepStrictEqual(result.kind, "ok");
        } catch (e) {
            console.error(thing, result);
            throw e;
        }
    });

    thingsThatShouldNotPass.forEach((thing) => {
        const result = adeilad.decode(mixedStringAndNumberArrayDecoder, thing);
        try {
            assert.deepStrictEqual(result.kind, "err");
        } catch (e) {
            console.error(thing, result);
            throw e;
        }
    });
}

export function testMap() {
    const thingsThatShouldPass = [
        { name: "noah" },
        { name: "noah", pets: { total: 0 } },
    ];

    class Person {
        name: string;

        constructor(name: string) {
            this.name = name;
        }
    }

    const thingsThatShouldNotPass = [
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
        [ "hello", 123, null ],
    ];

    const personDecoder = adeilad.map(
        (x: string) => new Person(x),
        adeilad.field("name", adeilad.string())
    );

    thingsThatShouldPass.forEach((thing) => {
        const result = adeilad.decode(personDecoder, thing);
        try {
            assert.deepStrictEqual(result.kind, "ok");
        } catch (e) {
            console.error(thing, result);
            throw e;
        }
    });

    thingsThatShouldNotPass.forEach((thing) => {
        const result = adeilad.decode(personDecoder, thing);
        try {
            assert.deepStrictEqual(result.kind, "err");
        } catch (e) {
            console.error(thing, result);
            throw e;
        }
    });
}

export function testMap2() {
    const thingsThatShouldPass = [
        { name: "noah", age: 28 },
        { name: "noah", age: 28, pets: { total: 0 } },
    ];

    class Person {
        name: string;
        age: number;

        constructor(name: string, age: number) {
            this.name = name;
            this.age = age;
        }
    }

    const thingsThatShouldNotPass = [
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
        [ "hello", 123, null ],
    ];

    const personDecoder = adeilad.map2(
        (x: string, y: number) => new Person(x, y),
        adeilad.field("name", adeilad.string()),
        adeilad.field("age", adeilad.number())
    );

    thingsThatShouldPass.forEach((thing) => {
        const result = adeilad.decode(personDecoder, thing);
        try {
            assert.deepStrictEqual(result.kind, "ok");
        } catch (e) {
            console.error(thing, result);
            throw e;
        }
    });

    thingsThatShouldNotPass.forEach((thing) => {
        const result = adeilad.decode(personDecoder, thing);
        try {
            assert.deepStrictEqual(result.kind, "err");
        } catch (e) {
            console.error(thing, result);
            throw e;
        }
    });
}

export function testMap3() {
    const thingsThatShouldPass = [
        { name: "noah", age: 28, pets: { total: 0 } },
    ];

    class Person {
        name: string;
        age: number;
        pets: {
            total: number;
        };

        constructor(name: string, age: number, numberOfPets: number) {
            this.name = name;
            this.age = age;
            this.pets = {
                total: numberOfPets,
            };
        }
    }

    const thingsThatShouldNotPass = [
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
        [ "hello", 123, null ],
    ];

    const personDecoder = adeilad.map3(
        (x: string, y: number, z: number) => new Person(x, y, z),
        adeilad.field("name", adeilad.string()),
        adeilad.field("age", adeilad.number()),
        adeilad.at([ "pets", "total" ], adeilad.number())
    );

    thingsThatShouldPass.forEach((thing) => {
        const result = adeilad.decode(personDecoder, thing);
        try {
            assert.deepStrictEqual(result.kind, "ok");
        } catch (e) {
            console.error(thing, result);
            throw e;
        }
    });

    thingsThatShouldNotPass.forEach((thing) => {
        const result = adeilad.decode(personDecoder, thing);
        try {
            assert.deepStrictEqual(result.kind, "err");
        } catch (e) {
            console.error(thing, result);
            throw e;
        }
    });
}

export function testSucceed() {
    const thingsThatShouldPass = [
        [ "string", 123 ],
        [ 123 ],
        [ -123, 123.987 ],
        [ "string" ],
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
        [ "hello", 123, null ],
    ];

    const successDecoder = adeilad.succeed("Yay!");

    thingsThatShouldPass.forEach((thing) => {
        const result = adeilad.decode(successDecoder, thing);
        try {
            assert.deepStrictEqual(result.kind, "ok");
        } catch (e) {
            console.error(thing, result);
            throw e;
        }
    });
}

export function testFail() {
    const thingsThatShouldNotPass = [
        [ "string", 123 ],
        [ 123 ],
        [ -123, 123.987 ],
        [ "string" ],
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
        [ "hello", 123, null ],
    ];

    const failureDecoder = adeilad.fail("Yay!");

    thingsThatShouldNotPass.forEach((thing) => {
        const result = adeilad.decode(failureDecoder, thing);
        try {
            assert.deepStrictEqual(result.kind, "err");
        } catch (e) {
            console.error(thing, result);
            throw e;
        }
    });
}

export function testAndThen() {
    const thingsThatShouldNotPass = [
        { name: "Noah", age: 29 },
        { name: "James", age: 0 },
        [ "string", 123 ],
        [ 123 ],
        [ -123, 123.987 ],
        [ "string" ],
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
        [ "hello", 123, null ],
    ];

    type Person = {
        name: string;
    };

    function personHelp(age: number): adeilad.Decoder<Person> {
        if (age !== 28) return adeilad.fail("You must be 28 to pass!");

        return adeilad.map((name: string) => {
            return { name };
        }, adeilad.field("name", adeilad.string()));
    }

    const decoder = adeilad.andThen(
        personHelp,
        adeilad.field("age", adeilad.number())
    );

    const thingThatShouldPass = {
        name: "Noah",
        age: 28,
    };

    const resultThatShouldPass = adeilad.decode(decoder, thingThatShouldPass);
    try {
        assert.deepStrictEqual(
            resultThatShouldPass,
            Ok({
                name: "Noah",
            })
        );
    } catch (e) {
        console.error(thingThatShouldPass, resultThatShouldPass);
        throw e;
    }

    thingsThatShouldNotPass.forEach((thing) => {
        const result = adeilad.decode(decoder, thing);
        try {
            assert.deepStrictEqual(result.kind, "err");
        } catch (e) {
            console.error(thing, result);
            throw e;
        }
    });
}

export function testPipeline() {
    const thingsThatShouldNotPass = [
        { name: "Noah", age: 29 },
        { name: "James", age: 0 },
        [ "string", 123 ],
        [ 123 ],
        [ -123, 123.987 ],
        [ "string" ],
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
        [ "hello", 123, null ],
    ];

    type Person = {
        name: string;
        age: number;
        pets: {
            total: number;
        };
        isAlive: boolean;
        hasFeet: boolean;
        doesNotHaveFeet: boolean;
        somethingDeepAndNested: string;
    };

    const makePerson = (
        name: string,
        age: number,
        totalNumberOfPets: number,
        isAlive: boolean,
        hasFeet: boolean,
        doesNotHaveFeet: boolean,
        somethingDeepAndNested: string
    ): Person => {
        return {
            name,
            age,
            pets: {
                total: totalNumberOfPets,
            },
            isAlive,
            hasFeet,
            doesNotHaveFeet,
            somethingDeepAndNested,
        };
    };

    const decoder = adeilad.pipeline(
        [
            adeilad.required("name", adeilad.string()),
            adeilad.required("age", adeilad.number()),
            adeilad.requiredAt([ "pets", "total" ], adeilad.number()),
            adeilad.hardcoded(true),
            adeilad.optional("hasFeet", adeilad.bool(), true),
            adeilad.optional("doesNotHaveFeet", adeilad.bool(), true),
            adeilad.optionalAt(
                [ "something", "deep" ],
                adeilad.string(),
                "a default"
            ),
        ],
        makePerson
    );

    const thingThatShouldPass = {
        name: "Noah",
        age: 28,
        pets: {
            total: 0,
        },
        doesNotHaveFeet: false,
    };

    const resultThatShouldPass = adeilad.decode(decoder, thingThatShouldPass);
    try {
        assert.deepStrictEqual(
            resultThatShouldPass,
            Ok({
                name: "Noah",
                age: 28,
                pets: {
                    total: 0,
                },
                isAlive: true,
                hasFeet: true,
                doesNotHaveFeet: false,
                somethingDeepAndNested: "a default",
            })
        );
    } catch (e) {
        console.error(thingThatShouldPass, resultThatShouldPass);
        throw e;
    }

    const otherThingThatShouldPass = {
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

    const otherResultThatShouldPass = adeilad.decode(
        decoder,
        otherThingThatShouldPass
    );
    try {
        assert.deepStrictEqual(
            otherResultThatShouldPass,
            Ok({
                name: "Noah",
                age: 28,
                pets: {
                    total: 0,
                },
                isAlive: true,
                hasFeet: true,
                doesNotHaveFeet: false,
                somethingDeepAndNested: "not a default",
            })
        );
    } catch (e) {
        console.error(otherThingThatShouldPass, otherResultThatShouldPass);
        throw e;
    }

    thingsThatShouldNotPass.forEach((thing) => {
        const result = adeilad.decode(decoder, thing);
        try {
            assert.deepStrictEqual(result.kind, "err");
        } catch (e) {
            console.error(thing, result);
            throw e;
        }
    });
}

export function testNestedPipeline() {
    const thingsThatShouldNotPass = [
        { name: "Noah", age: 29 },
        { name: "James", age: 0 },
        [ "string", 123 ],
        [ 123 ],
        [ -123, 123.987 ],
        [ "string" ],
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
        [ "hello", 123, null ],
    ];

    type Pet = {
        name: string;
        age: number;
    };

    type Person = {
        name: string;
        age: number;
        pets: Pet[];
    };

    const makePet = (name: string, age: number): Pet => {
        return {
            name,
            age,
        };
    };

    const makePerson = (name: string, age: number, pets: Pet[]): Person => {
        return {
            name,
            age,
            pets,
        };
    };

    const decoder = adeilad.pipeline(
        [
            adeilad.required("name", adeilad.string()),
            adeilad.required("age", adeilad.number()),
            adeilad.required(
                "pets",
                adeilad.array(
                    adeilad.pipeline(
                        [
                            adeilad.required("name", adeilad.string()),
                            adeilad.required("age", adeilad.number()),
                        ],
                        makePet
                    )
                )
            ),
        ],
        makePerson
    );

    const thingThatShouldPass = {
        name: "Noah",
        age: 28,
        pets: [
            { name: "Frodo", age: 8 },
            { name: "Fiver", age: 3 },
        ],
    };

    const resultThatShouldPass = adeilad.decode(decoder, thingThatShouldPass);
    try {
        assert.deepStrictEqual(
            resultThatShouldPass,
            Ok({
                name: "Noah",
                age: 28,
                pets: [
                    { name: "Frodo", age: 8 },
                    { name: "Fiver", age: 3 },
                ],
            })
        );
    } catch (e) {
        console.error(thingThatShouldPass, resultThatShouldPass);
        throw e;
    }

    thingsThatShouldNotPass.forEach((thing) => {
        const result = adeilad.decode(decoder, thing);
        try {
            assert.deepStrictEqual(result.kind, "err");
        } catch (e) {
            console.error(thing, result);
            throw e;
        }
    });
}
