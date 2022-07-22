import {
    andThen,
    at,
    decode,
    Decoder,
    fail,
    fallbackIfNull,
    field,
    map2,
    oneOf,
    succeed,
    value,
} from "./adeilad";

export function required<a, b>(
    key: string,
    innerDecoder: Decoder<a>,
    wrappedDecoder: Decoder<(a: a) => b>
): Decoder<b> {
    return custom(field(key, innerDecoder), wrappedDecoder);
}

export function requiredAt<a, b>(
    path: string[],
    innerDecoder: Decoder<a>,
    wrappedDecoder: Decoder<(a: a) => b>
): Decoder<b> {
    return custom(at(path, innerDecoder), wrappedDecoder);
}

export function optional<a, b>(
    key: string,
    innerDecoder: Decoder<a>,
    defaultValue: a,
    wrappedDecoder: Decoder<(a: a) => b>
): Decoder<b> {
    return custom(
        optionalDecoder(field(key, value()), innerDecoder, defaultValue),
        wrappedDecoder
    );
}

export function optionalAt<a, b>(
    path: string[],
    innerDecoder: Decoder<a>,
    defaultValue: a,
    wrappedDecoder: Decoder<(a: a) => b>
): Decoder<b> {
    return custom(
        optionalDecoder(at(path, value()), innerDecoder, defaultValue),
        wrappedDecoder
    );
}

function optionalDecoder<a>(
    pathDecoder: Decoder<any>,
    valDecoder: Decoder<a>,
    fallback: a
): Decoder<a> {
    const nullOrDecoder = oneOf([ valDecoder, fallbackIfNull(fallback) ]);

    function handleResult(input: any) {
        const res = decode(pathDecoder, input);

        if (res.kind === "Err") return succeed(fallback);

        const presentRes = decode(nullOrDecoder, input);
        if (presentRes.kind === "Err") return fail(presentRes.error);

        return succeed(presentRes.value);
    }

    return andThen(handleResult, value());
}

export function hardcoded<a, b>(
    fallback: a,
    decoder: Decoder<(a: a) => b>
): Decoder<b> {
    return custom(succeed(fallback), decoder);
}

export function custom<a, b>(
    innerDecoder: Decoder<a>,
    wrappedDecoder: Decoder<(a: a) => b>
): Decoder<b> {
    const pipe = (x: a, fn: (a: a) => b) => fn(x);
    return map2(pipe, innerDecoder, wrappedDecoder);
}
