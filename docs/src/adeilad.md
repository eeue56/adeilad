## type Decoder<a> 
```javascript
export type Decoder<a> = (value: any) => Result.Result<string, a>;

```

A decoder is something which takes JSON and returns a parsed result:
either a string error message, or a parsed value
[View source](https://github.com/eeue56/adeilad/blob/main/src/adeilad.ts#L8-L9)
## any(): Decoder
```javascript
export function any(): Decoder<any> {
```

A decoder that accepts any value
[View source](https://github.com/eeue56/adeilad/blob/main/src/adeilad.ts#L13-L13)
## string(): Decoder
```javascript
export function string(): Decoder<string> {
```

```javascript
decode(string(), "hello")
Ok("hello")
```
[View source](https://github.com/eeue56/adeilad/blob/main/src/adeilad.ts#L25-L25)
## bool(): Decoder
```javascript
export function bool(): Decoder<boolean> {
```

```javascript
decode(bool(), true)
Ok(true)
```
[View source](https://github.com/eeue56/adeilad/blob/main/src/adeilad.ts#L38-L38)
## number(): Decoder
```javascript
export function number(): Decoder<number> {
```

```javascript
decode(number(), 123)
Ok(123)

decode(number(), 123.987)
Ok(123.987)
```
[View source](https://github.com/eeue56/adeilad/blob/main/src/adeilad.ts#L54-L54)
## array
```javascript
export function array<a>(innerDecoder: Decoder<a>): Decoder<a[]> {
```

A decoder that takes an inner decoder to be used on an array of elements
```javascript
decode(array(number()), [1, 2, 3])
Ok([1, 2, 3])
```
[View source](https://github.com/eeue56/adeilad/blob/main/src/adeilad.ts#L68-L68)
## maybe
```javascript
export function maybe<a>(innerDecoder: Decoder<a>): Decoder<Maybe.Maybe<a>> {
```

A decoder that wraps parsed values as a maybe
```javascript
decode(maybe(number()), "")
Ok(Nothing)

decode(maybe(number()), 123)
Ok(Just(123))
```
[View source](https://github.com/eeue56/adeilad/blob/main/src/adeilad.ts#L100-L100)
## oneOf
```javascript
export function oneOf<a>(innerDecoders: Decoder<a>[]): Decoder<a> {
```

A decoder that tests a value against multiple values, left to right
```javascript
decode(oneOf([number(), string()], 123)
Ok(123)

decode(oneOf([number(), string()], "hello world")
Ok("hello world")

decode(oneOf([number(), string()], true)
Err(...)
```
[View source](https://github.com/eeue56/adeilad/blob/main/src/adeilad.ts#L119-L119)
## record
```javascript
export function record<a>(
    innerDecoder: Decoder<a>
): Decoder<Record<string, a>> {
```

A decoder for dict-like objects where all values pass a decoder
```javascript
decode(record(number()), { a: 1, b: 2 })
Ok({ a: 1, b: 2 })

decode(record(string()), { a: "hello", b: 2 })
Err(...)


decode(record(oneOf<number|string>([number(), string()])), { a: "hello", b: 2 })
Ok({ a: "hello", b: 2 })
```
[View source](https://github.com/eeue56/adeilad/blob/main/src/adeilad.ts#L151-L153)
## field
```javascript
export function field<a>(
    fieldName: string,
    innerDecoder: Decoder<a>
): Decoder<a> {
```

Decodes a field from an object with the given decoder
```javascript
decode(field("name", string()), { name: "Noah" })
Ok("Noah")

decode(field("age", number()), { name: "Noah" })
Err(...)
```
[View source](https://github.com/eeue56/adeilad/blob/main/src/adeilad.ts#L188-L191)
## at
```javascript
export function at<a>(path: string[], innerDecoder: Decoder<a>): Decoder<a> {
```

Decodes a nested field from the given path with the given dedcoder
```javascript
decode(at(["pets", "count"], number()), { pets: { count: 0 }})
Ok(0)
```
[View source](https://github.com/eeue56/adeilad/blob/main/src/adeilad.ts#L213-L213)
## map
```javascript
export function map<a, value>(
    mapper: (validArgument: a) => value,
    innerDecoder: Decoder<a>
): Decoder<value> {
```

Wrap a decoded value with an inner function
```javascript
decode(map((x) => new Person(x), string()), "Noah")
Ok({ name: "Noah" })
```
[View source](https://github.com/eeue56/adeilad/blob/main/src/adeilad.ts#L249-L252)
## map2
```javascript
export function map2<a, b, value>(
    mapper: (firstArgument: a, secondArgument: b) => value,
    firstDecoder: Decoder<a>,
    secondDecoder: Decoder<b>
): Decoder<value> {
```

[View source](https://github.com/eeue56/adeilad/blob/main/src/adeilad.ts#L258-L262)
## map3
```javascript
export function map3<a, b, c, value>(
    mapper: (firstArgument: a, secondArgument: b, thirdArgument: c) => value,
    firstDecoder: Decoder<a>,
    secondDecoder: Decoder<b>,
    thirdDecoder: Decoder<c>
): Decoder<value> {
```

[View source](https://github.com/eeue56/adeilad/blob/main/src/adeilad.ts#L272-L277)
## required
```javascript
export function required<a>(key: string, innerDecoder: Decoder<a>): Decoder<a> {
```

An alias for `field`
[View source](https://github.com/eeue56/adeilad/blob/main/src/adeilad.ts#L291-L291)
## requiredAt
```javascript
export function requiredAt<a>(path: string[], decoder: Decoder<a>): Decoder<a> {
```

An alias for `at`
[View source](https://github.com/eeue56/adeilad/blob/main/src/adeilad.ts#L298-L298)
## optional
```javascript
export function optional<a, b>(
    key: string,
    innerDecoder: Decoder<a>,
    defaultValue: a
): Decoder<a> {
```

[View source](https://github.com/eeue56/adeilad/blob/main/src/adeilad.ts#L302-L306)
## optionalAt
```javascript
export function optionalAt<a, b>(
    path: string[],
    innerDecoder: Decoder<a>,
    defaultValue: a
): Decoder<a> {
```

[View source](https://github.com/eeue56/adeilad/blob/main/src/adeilad.ts#L310-L314)
## hardcoded
```javascript
export function hardcoded<a>(fallback: a): Decoder<a> {
```

Alias for succeed
[View source](https://github.com/eeue56/adeilad/blob/main/src/adeilad.ts#L343-L343)
## custom
```javascript
export function custom<a, b>(
    innerDecoder: Decoder<a>,
    wrappedDecoder: Decoder<(a: a) => b>
): Decoder<b> {
```

[View source](https://github.com/eeue56/adeilad/blob/main/src/adeilad.ts#L347-L350)
## succeed
```javascript
export function succeed<a>(fallback: a) {
```

A decoder which always successed with the fallback
[View source](https://github.com/eeue56/adeilad/blob/main/src/adeilad.ts#L358-L358)
## fail
```javascript
export function fail(str: string) {
```

A decoder which always fails
[View source](https://github.com/eeue56/adeilad/blob/main/src/adeilad.ts#L367-L367)
## value(): Decoder
```javascript
export function value(): Decoder<any> {
```

Decode any value
[View source](https://github.com/eeue56/adeilad/blob/main/src/adeilad.ts#L376-L376)
## fallbackIfNull
```javascript
export function fallbackIfNull<a>(fallback: a): Decoder<a> {
```

Succeeeds with a fallbck if a value is null
[View source](https://github.com/eeue56/adeilad/blob/main/src/adeilad.ts#L385-L385)
## andThen
```javascript
export function andThen<a, b>(
    mappedDecoder: (a: a) => Decoder<b>,
    innerDecoder: Decoder<a>
): Decoder<b> {
```

Apply an inner decoder, then if successful pass the result to the mapper decoder to produce a new decoder
[View source](https://github.com/eeue56/adeilad/blob/main/src/adeilad.ts#L395-L398)
## pipeline
```javascript
export function pipeline<a>(
    decoders: Decoder<any>[],
    constructor: (...args: any[]) => a
): Decoder<a> {
```

Takes a list of decoders and some constructor to turn the results into a value
[View source](https://github.com/eeue56/adeilad/blob/main/src/adeilad.ts#L411-L414)
## decode
```javascript
export function decode<a>(
    decoder: Decoder<a>,
    value: any
): Result.Result<string, a> {
```

Takes a decoder and runs it against given json.
```javascript
decode(string(), "hello")
Ok("hello")
```
[View source](https://github.com/eeue56/adeilad/blob/main/src/adeilad.ts#L437-L440)
## decodeString
```javascript
export function decodeString<a>(
    decoder: Decoder<a>,
    value: string
): Result.Result<string, a> {
```

Takes a decoder and runs it against given json string.
```javascript
decodeString(number(), "123")
Ok(123)
```
[View source](https://github.com/eeue56/adeilad/blob/main/src/adeilad.ts#L451-L454)