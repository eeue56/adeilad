import { Maybe, Result } from "@eeue56/ts-core";
import { Ok, Err } from "@eeue56/ts-core/build/main/lib/result";
import { second } from "@eeue56/ts-core/build/main/lib/tuple";

/**
 * A decoder is something which takes JSON and returns a parsed result:
 * either a string error message, or a parsed value
 */
export type Decoder<a> = (value: any) => Result.Result<string, a>;

/**
 * A decoder that accepts any value
 */
export function any(): Decoder<any> {
    return function (value: any): Result.Result<string, any> {
        return Ok(value);
    };
}

/**
 * ```javascript
 * decode(string(), "hello")
 * Ok("hello")
 * ```
 */
export function string(): Decoder<string> {
    return function (value: any): Result.Result<string, string> {
        if (typeof value === "string") return Ok(value);
        return Err(`"${value}" is not a string`);
    };
}

/**
 * ```javascript
 * decode(bool(), true)
 * Ok(true)
 * ```
 */
export function bool(): Decoder<boolean> {
    return function (value: any): Result.Result<string, boolean> {
        if (typeof value === "boolean") return Ok(value);
        return Err(`"${value}" is not a boolean`);
    };
}

/**
 * ```javascript
 * decode(number(), 123)
 * Ok(123)
 *
 * decode(number(), 123.987)
 * Ok(123.987)
 * ```
 */
export function number(): Decoder<number> {
    return function (value: any): Result.Result<string, number> {
        if (typeof value === "number") return Ok(value);
        return Err(`"${value}" is not a number`);
    };
}

/**
 * A decoder that takes an inner decoder to be used on an array of elements
 * ```javascript
 * decode(array(number()), [1, 2, 3])
 * Ok([1, 2, 3])
 * ```
 */
export function array<a>(innerDecoder: Decoder<a>): Decoder<a[]> {
    return function (value: any): Result.Result<string, a[]> {
        if (!Array.isArray(value)) return Err(`${value} is not an array`);

        const outArray: a[] = [ ];

        for (var i = 0; i < value.length; i++) {
            const item = value[i];
            const res = decode(innerDecoder, item);
            if (res.kind === "err")
                return Result.mapError(
                    (err) =>
                        `Failed to decode list at index ${i} due to ${err}`,
                    res
                );
            if (res.kind === "ok") outArray.push(res.value);
        }

        return Ok(outArray);
    };
}

/**
 * A decoder that wraps parsed values as a maybe
 * ```javascript
 * decode(maybe(number()), "")
 * Ok(Nothing)
 *
 * decode(maybe(number()), 123)
 * Ok(Just(123))
 * ```
 */
export function maybe<a>(innerDecoder: Decoder<a>): Decoder<Maybe.Maybe<a>> {
    return function (value: any): Result.Result<string, Maybe.Maybe<a>> {
        return Result.Ok(Result.toMaybe(decode(innerDecoder, value)));
    };
}

/**
 * A decoder that tests a value against multiple values, left to right
 * ```javascript
 * decode(oneOf([number(), string()], 123)
 * Ok(123)
 *
 * decode(oneOf([number(), string()], "hello world")
 * Ok("hello world")
 *
 * decode(oneOf([number(), string()], true)
 * Err(...)
 * ```
 */
export function oneOf<a>(innerDecoders: Decoder<a>[]): Decoder<a> {
    return function (value: any): Result.Result<string, a> {
        const errors: string[] = [ ];

        for (var i = 0; i < innerDecoders.length; i++) {
            const innerDecoder = innerDecoders[i];

            const res = decode(innerDecoder, value);

            if (res.kind === "ok") return Ok(res.value);

            errors.push(res.error);
        }

        return Err(`Failed to match any decoders: ${errors.join("\n")}`);
    };
}

/**
 * A decoder for dict-like objects where all values pass a decoder
 * ```javascript
 * decode(record(number()), { a: 1, b: 2 })
 * Ok({ a: 1, b: 2 })
 *
 * decode(record(string()), { a: "hello", b: 2 })
 * Err(...)
 *
 *
 * decode(record(oneOf<number|string>([number(), string()])), { a: "hello", b: 2 })
 * Ok({ a: "hello", b: 2 })
 * ```
 */
export function record<a>(
    innerDecoder: Decoder<a>
): Decoder<Record<string, a>> {
    return function (value: any): Result.Result<string, Record<string, a>> {
        if (typeof value !== "object" || value === null || Array.isArray(value))
            return Err(`${value} is not a record`);

        const outRecord: Record<string, a> = {};
        const keys = Object.keys(value);

        for (var i = 0; i < keys.length; i++) {
            const key = keys[i];
            const item = value[key];
            const res = decode(innerDecoder, item);
            if (res.kind === "err")
                return Result.mapError(
                    (err) =>
                        `Failed to decode value at index ${i} due to ${err}`,
                    res
                );
            if (res.kind === "ok") outRecord[key] = res.value;
        }

        return Ok(outRecord);
    };
}

/**
 * Decodes a field from an object with the given decoder
 * ```javascript
 * decode(field("name", string()), { name: "Noah" })
 * Ok("Noah")
 *
 * decode(field("age", number()), { name: "Noah" })
 * Err(...)
 * ```
 */
export function field<a>(
    fieldName: string,
    innerDecoder: Decoder<a>
): Decoder<a> {
    return function (value: any): Result.Result<string, a> {
        if (typeof value !== "object" || value === null) {
            return Err(`${value} is not an object`);
        }

        const res = decode(innerDecoder, value[fieldName]);

        return Result.mapError(
            (innerError) => `Error parsing ${fieldName} due to ${innerError}`,
            res
        );
    };
}

/**
 * Decodes a nested field from the given path with the given dedcoder
 * ```javascript
 * decode(at(["pets", "count"], number()), { pets: { count: 0 }})
 * Ok(0)
 * ```
 */
export function at<a>(path: string[], innerDecoder: Decoder<a>): Decoder<a> {
    return function (value: any): Result.Result<string, a> {
        const pathCopy = path.slice();

        while (true) {
            if (pathCopy.length === 0) break;
            let fieldName = pathCopy.shift();

            if (typeof value !== "object" || value === null) {
                return Err(
                    `Value at index [${path
                        .slice(0, path.length - pathCopy.length)
                        .join(" > ")}] is not an object`
                );
            }

            fieldName = fieldName as string;
            value = value[fieldName];
        }

        const res = decode(innerDecoder, value);
        return Result.mapError(
            (innerError) =>
                `Error parsing [${path.join(" > ")}] due to ${innerError}`,
            res
        );
    };
}

/**
 * Wrap a decoded value with an inner function
 * ```javascript
 * decode(map((x) => new Person(x), string()), "Noah")
 * Ok({ name: "Noah" })
 * ```
 */
export function map<a, value>(
    mapper: (validArgument: a) => value,
    innerDecoder: Decoder<a>
): Decoder<value> {
    return function (value: any): Result.Result<string, value> {
        return Result.map(mapper, decode(innerDecoder, value));
    };
}

export function map2<a, b, value>(
    mapper: (firstArgument: a, secondArgument: b) => value,
    firstDecoder: Decoder<a>,
    secondDecoder: Decoder<b>
): Decoder<value> {
    return function (value: any): Result.Result<string, value> {
        return Result.map2(
            mapper,
            decode(firstDecoder, value),
            decode(secondDecoder, value)
        );
    };
}

export function map3<a, b, c, value>(
    mapper: (firstArgument: a, secondArgument: b, thirdArgument: c) => value,
    firstDecoder: Decoder<a>,
    secondDecoder: Decoder<b>,
    thirdDecoder: Decoder<c>
): Decoder<value> {
    return function (value: any): Result.Result<string, value> {
        return Result.map3(
            mapper,
            decode(firstDecoder, value),
            decode(secondDecoder, value),
            decode(thirdDecoder, value)
        );
    };
}

/**
 * An alias for `field`
 */
export function required<a>(key: string, innerDecoder: Decoder<a>): Decoder<a> {
    return field(key, innerDecoder);
}

/**
 * An alias for `at`
 */
export function requiredAt<a>(path: string[], decoder: Decoder<a>): Decoder<a> {
    return at(path, decoder);
}

export function optional<a, b>(
    key: string,
    innerDecoder: Decoder<a>,
    defaultValue: a
): Decoder<a> {
    return optionalDecoder(field(key, value()), innerDecoder, defaultValue);
}

export function optionalAt<a, b>(
    path: string[],
    innerDecoder: Decoder<a>,
    defaultValue: a
): Decoder<a> {
    return optionalDecoder(at(path, value()), innerDecoder, defaultValue);
}

function optionalDecoder<a>(
    pathDecoder: Decoder<any>,
    valDecoder: Decoder<a>,
    fallback: a
): Decoder<a> {
    const nullOrDecoder = oneOf([ valDecoder, fallbackIfNull(fallback) ]);

    function handleResult(input: any) {
        const res = decode(pathDecoder, input);
        if (res.kind === "err" || typeof res.value === "undefined") {
            return succeed(fallback);
        }

        const presentRes = decode(nullOrDecoder, res.value);
        if (presentRes.kind === "err") return fail(presentRes.error);

        return succeed(presentRes.value);
    }

    return andThen(handleResult, value());
}

/**
 * Alias for succeed
 */
export function hardcoded<a>(fallback: a): Decoder<a> {
    return succeed(fallback);
}

export function custom<a, b>(
    innerDecoder: Decoder<a>,
    wrappedDecoder: Decoder<(a: a) => b>
): Decoder<b> {
    const pipe = (x: a, fn: (a: a) => b) => fn(x);
    return map2(pipe, innerDecoder, wrappedDecoder);
}

/**
 * A decoder which always successed with the fallback
 */
export function succeed<a>(fallback: a) {
    return function (_value: any): Result.Result<string, a> {
        return Ok(fallback);
    };
}

/**
 * A decoder which always fails
 */
export function fail(str: string) {
    return function (_value: any): Result.Result<string, any> {
        return Err(str);
    };
}

/**
 * Decode any value
 */
export function value(): Decoder<any> {
    return function (givenValue: any): Result.Result<string, any> {
        return Ok(givenValue);
    };
}

/**
 * Succeeeds with a fallbck if a value is null
 */
export function fallbackIfNull<a>(fallback: a): Decoder<a> {
    return function (value: any): Result.Result<string, a> {
        if (value === null) return Ok(fallback);
        return Err(`Expected null but got ${value}`);
    };
}

/**
 * Apply an inner decoder, then if successful pass the result to the mapper decoder to produce a new decoder
 */
export function andThen<a, b>(
    mappedDecoder: (a: a) => Decoder<b>,
    innerDecoder: Decoder<a>
): Decoder<b> {
    return function (value: any): Result.Result<string, b> {
        const res = decode(innerDecoder, value);

        if (res.kind === "err") return res;

        return mappedDecoder(res.value)(value);
    };
}

/**
 * Takes a list of decoders and some constructor to turn the results into a value
 */
export function pipeline<a>(
    decoders: Decoder<any>[],
    constructor: (...args: any[]) => a
): Decoder<a> {
    return function (value: any): Result.Result<string, a> {
        const resultsToApply: any[] = [ ];

        for (var i = 0; i < decoders.length; i++) {
            const decoder = decoders[i];
            const res = decode(decoder, value);
            if (res.kind === "err") return res;

            resultsToApply.push(res.value);
        }

        return Ok(constructor.apply(null, resultsToApply));
    };
}

/**
 * Takes a decoder and runs it against given json.
 * ```javascript
 * decode(string(), "hello")
 * Ok("hello")
 * ```
 */
export function decode<a>(
    decoder: Decoder<a>,
    value: any
): Result.Result<string, a> {
    return decoder(value);
}

/**
 * Takes a decoder and runs it against given json string.
 * ```javascript
 * decodeString(number(), "123")
 * Ok(123)
 * ```
 */
export function decodeString<a>(
    decoder: Decoder<a>,
    value: string
): Result.Result<string, a> {
    const asJson = JSON.parse(value);
    return decoder(asJson);
}
