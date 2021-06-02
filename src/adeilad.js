"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeString = exports.decode = exports.pipeline = exports.andThen = exports.fallbackIfNull = exports.value = exports.fail = exports.succeed = exports.custom = exports.hardcoded = exports.optionalAt = exports.optional = exports.requiredAt = exports.required = exports.map3 = exports.map2 = exports.map = exports.at = exports.field = exports.record = exports.oneOf = exports.maybe = exports.array = exports.number = exports.bool = exports.string = exports.any = void 0;
var ts_core_1 = require("@eeue56/ts-core");
var result_1 = require("@eeue56/ts-core/build/main/lib/result");
/**
 * A decoder that accepts any value
 */
function any() {
    return function (value) {
        return result_1.Ok(value);
    };
}
exports.any = any;
/**
 * ```javascript
 * decode(string(), "hello")
 * Ok("hello")
 * ```
 */
function string() {
    return function (value) {
        if (typeof value === "string")
            return result_1.Ok(value);
        return result_1.Err("\"" + value + "\" is not a string");
    };
}
exports.string = string;
/**
 * ```javascript
 * decode(bool(), true)
 * Ok(true)
 * ```
 */
function bool() {
    return function (value) {
        if (typeof value === "boolean")
            return result_1.Ok(value);
        return result_1.Err("\"" + value + "\" is not a boolean");
    };
}
exports.bool = bool;
/**
 * ```javascript
 * decode(number(), 123)
 * Ok(123)
 *
 * decode(number(), 123.987)
 * Ok(123.987)
 * ```
 */
function number() {
    return function (value) {
        if (typeof value === "number")
            return result_1.Ok(value);
        return result_1.Err("\"" + value + "\" is not a number");
    };
}
exports.number = number;
/**
 * A decoder that takes an inner decoder to be used on an array of elements
 * ```javascript
 * decode(array(number()), [1, 2, 3])
 * Ok([1, 2, 3])
 * ```
 */
function array(innerDecoder) {
    return function (value) {
        if (!Array.isArray(value))
            return result_1.Err(value + " is not an array");
        var outArray = [];
        for (var i = 0; i < value.length; i++) {
            var item = value[i];
            var res = decode(innerDecoder, item);
            if (res.kind === "err")
                return ts_core_1.Result.mapError(function (err) {
                    return "Failed to decode list at index " + i + " due to " + err;
                }, res);
            if (res.kind === "ok")
                outArray.push(res.value);
        }
        return result_1.Ok(outArray);
    };
}
exports.array = array;
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
function maybe(innerDecoder) {
    return function (value) {
        return ts_core_1.Result.Ok(ts_core_1.Result.toMaybe(decode(innerDecoder, value)));
    };
}
exports.maybe = maybe;
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
function oneOf(innerDecoders) {
    return function (value) {
        var errors = [];
        for (var i = 0; i < innerDecoders.length; i++) {
            var innerDecoder = innerDecoders[i];
            var res = decode(innerDecoder, value);
            if (res.kind === "ok")
                return result_1.Ok(res.value);
            errors.push(res.error);
        }
        return result_1.Err("Failed to match any decoders: " + errors.join("\n"));
    };
}
exports.oneOf = oneOf;
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
function record(innerDecoder) {
    return function (value) {
        if (typeof value !== "object" || value === null || Array.isArray(value))
            return result_1.Err(value + " is not a record");
        var outRecord = {};
        var keys = Object.keys(value);
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            var item = value[key];
            var res = decode(innerDecoder, item);
            if (res.kind === "err")
                return ts_core_1.Result.mapError(function (err) {
                    return "Failed to decode value at index " + i + " due to " + err;
                }, res);
            if (res.kind === "ok")
                outRecord[key] = res.value;
        }
        return result_1.Ok(outRecord);
    };
}
exports.record = record;
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
function field(fieldName, innerDecoder) {
    return function (value) {
        if (typeof value !== "object" || value === null) {
            return result_1.Err(value + " is not an object");
        }
        var res = decode(innerDecoder, value[fieldName]);
        return ts_core_1.Result.mapError(function (innerError) { return "Error parsing " + fieldName + " due to " + innerError; }, res);
    };
}
exports.field = field;
/**
 * Decodes a nested field from the given path with the given dedcoder
 * ```javascript
 * decode(at(["pets", "count"], number()), { pets: { count: 0 }})
 * Ok(0)
 * ```
 */
function at(path, innerDecoder) {
    return function (value) {
        var pathCopy = path.slice();
        while (true) {
            if (pathCopy.length === 0)
                break;
            var fieldName = pathCopy.shift();
            if (typeof value !== "object" || value === null) {
                return result_1.Err("Value at index [" + path
                    .slice(0, path.length - pathCopy.length)
                    .join(" > ") + "] is not an object");
            }
            fieldName = fieldName;
            value = value[fieldName];
        }
        var res = decode(innerDecoder, value);
        return ts_core_1.Result.mapError(function (innerError) {
            return "Error parsing [" + path.join(" > ") + "] due to " + innerError;
        }, res);
    };
}
exports.at = at;
/**
 * Wrap a decoded value with an inner function
 * ```javascript
 * decode(map((x) => new Person(x), string()), "Noah")
 * Ok({ name: "Noah" })
 * ```
 */
function map(mapper, innerDecoder) {
    return function (value) {
        return ts_core_1.Result.map(mapper, decode(innerDecoder, value));
    };
}
exports.map = map;
function map2(mapper, firstDecoder, secondDecoder) {
    return function (value) {
        return ts_core_1.Result.map2(mapper, decode(firstDecoder, value), decode(secondDecoder, value));
    };
}
exports.map2 = map2;
function map3(mapper, firstDecoder, secondDecoder, thirdDecoder) {
    return function (value) {
        return ts_core_1.Result.map3(mapper, decode(firstDecoder, value), decode(secondDecoder, value), decode(thirdDecoder, value));
    };
}
exports.map3 = map3;
/**
 * An alias for `field`
 */
function required(key, innerDecoder) {
    return field(key, innerDecoder);
}
exports.required = required;
/**
 * An alias for `at`
 */
function requiredAt(path, decoder) {
    return at(path, decoder);
}
exports.requiredAt = requiredAt;
function optional(key, innerDecoder, defaultValue) {
    return optionalDecoder(field(key, value()), innerDecoder, defaultValue);
}
exports.optional = optional;
function optionalAt(path, innerDecoder, defaultValue) {
    return optionalDecoder(at(path, value()), innerDecoder, defaultValue);
}
exports.optionalAt = optionalAt;
function optionalDecoder(pathDecoder, valDecoder, fallback) {
    var nullOrDecoder = oneOf([valDecoder, fallbackIfNull(fallback)]);
    function handleResult(input) {
        var res = decode(pathDecoder, input);
        if (res.kind === "err" || typeof res.value === "undefined") {
            return succeed(fallback);
        }
        var presentRes = decode(nullOrDecoder, res.value);
        if (presentRes.kind === "err")
            return fail(presentRes.error);
        return succeed(presentRes.value);
    }
    return andThen(handleResult, value());
}
/**
 * Alias for succeed
 */
function hardcoded(fallback) {
    return succeed(fallback);
}
exports.hardcoded = hardcoded;
function custom(innerDecoder, wrappedDecoder) {
    var pipe = function (x, fn) { return fn(x); };
    return map2(pipe, innerDecoder, wrappedDecoder);
}
exports.custom = custom;
/**
 * A decoder which always successed with the fallback
 */
function succeed(fallback) {
    return function (_value) {
        return result_1.Ok(fallback);
    };
}
exports.succeed = succeed;
/**
 * A decoder which always fails
 */
function fail(str) {
    return function (_value) {
        return result_1.Err(str);
    };
}
exports.fail = fail;
/**
 * Decode any value
 */
function value() {
    return function (givenValue) {
        return result_1.Ok(givenValue);
    };
}
exports.value = value;
/**
 * Succeeeds with a fallbck if a value is null
 */
function fallbackIfNull(fallback) {
    return function (value) {
        if (value === null)
            return result_1.Ok(fallback);
        return result_1.Err("Expected null but got " + value);
    };
}
exports.fallbackIfNull = fallbackIfNull;
/**
 * Apply an inner decoder, then if successful pass the result to the mapper decoder to produce a new decoder
 */
function andThen(mappedDecoder, innerDecoder) {
    return function (value) {
        var res = decode(innerDecoder, value);
        if (res.kind === "err")
            return res;
        return mappedDecoder(res.value)(value);
    };
}
exports.andThen = andThen;
/**
 * Takes a list of decoders and some constructor to turn the results into a value
 */
function pipeline(decoders, constructor) {
    return function (value) {
        var resultsToApply = [];
        for (var i = 0; i < decoders.length; i++) {
            var decoder = decoders[i];
            var res = decode(decoder, value);
            if (res.kind === "err")
                return res;
            resultsToApply.push(res.value);
        }
        return result_1.Ok(constructor.apply(null, resultsToApply));
    };
}
exports.pipeline = pipeline;
/**
 * Takes a decoder and runs it against given json.
 * ```javascript
 * decode(string(), "hello")
 * Ok("hello")
 * ```
 */
function decode(decoder, value) {
    return decoder(value);
}
exports.decode = decode;
/**
 * Takes a decoder and runs it against given json string.
 * ```javascript
 * decodeString(number(), "123")
 * Ok(123)
 * ```
 */
function decodeString(decoder, value) {
    var asJson = JSON.parse(value);
    return decoder(asJson);
}
exports.decodeString = decodeString;
