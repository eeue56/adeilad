"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.custom = exports.hardcoded = exports.optionalAt = exports.optional = exports.requiredAt = exports.required = void 0;
var adeilad_1 = require("./adeilad");
function required(key, innerDecoder, wrappedDecoder) {
    return custom(adeilad_1.field(key, innerDecoder), wrappedDecoder);
}
exports.required = required;
function requiredAt(path, innerDecoder, wrappedDecoder) {
    return custom(adeilad_1.at(path, innerDecoder), wrappedDecoder);
}
exports.requiredAt = requiredAt;
function optional(key, innerDecoder, defaultValue, wrappedDecoder) {
    return custom(optionalDecoder(adeilad_1.field(key, adeilad_1.value()), innerDecoder, defaultValue), wrappedDecoder);
}
exports.optional = optional;
function optionalAt(path, innerDecoder, defaultValue, wrappedDecoder) {
    return custom(optionalDecoder(adeilad_1.at(path, adeilad_1.value()), innerDecoder, defaultValue), wrappedDecoder);
}
exports.optionalAt = optionalAt;
function optionalDecoder(pathDecoder, valDecoder, fallback) {
    var nullOrDecoder = adeilad_1.oneOf([valDecoder, adeilad_1.fallbackIfNull(fallback)]);
    function handleResult(input) {
        var res = adeilad_1.decode(pathDecoder, input);
        if (res.kind === "err")
            return adeilad_1.succeed(fallback);
        var presentRes = adeilad_1.decode(nullOrDecoder, input);
        if (presentRes.kind === "err")
            return adeilad_1.fail(presentRes.error);
        return adeilad_1.succeed(presentRes.value);
    }
    return adeilad_1.andThen(handleResult, adeilad_1.value());
}
function hardcoded(fallback, decoder) {
    return custom(adeilad_1.succeed(fallback), decoder);
}
exports.hardcoded = hardcoded;
function custom(innerDecoder, wrappedDecoder) {
    var pipe = function (x, fn) { return fn(x); };
    return adeilad_1.map2(pipe, innerDecoder, wrappedDecoder);
}
exports.custom = custom;
