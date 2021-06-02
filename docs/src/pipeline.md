## required
```javascript
export function required<a, b>(
    key: string,
    innerDecoder: Decoder<a>,
    wrappedDecoder: Decoder<(a: a) => b>
): Decoder<b> {
```

[View source](https://github.com/eeue56/adeilad/blob/main/src/pipeline.ts#L14-L18)
## requiredAt
```javascript
export function requiredAt<a, b>(
    path: string[],
    innerDecoder: Decoder<a>,
    wrappedDecoder: Decoder<(a: a) => b>
): Decoder<b> {
```

[View source](https://github.com/eeue56/adeilad/blob/main/src/pipeline.ts#L22-L26)
## optional
```javascript
export function optional<a, b>(
    key: string,
    innerDecoder: Decoder<a>,
    defaultValue: a,
    wrappedDecoder: Decoder<(a: a) => b>
): Decoder<b> {
```

[View source](https://github.com/eeue56/adeilad/blob/main/src/pipeline.ts#L30-L35)
## optionalAt
```javascript
export function optionalAt<a, b>(
    path: string[],
    innerDecoder: Decoder<a>,
    defaultValue: a,
    wrappedDecoder: Decoder<(a: a) => b>
): Decoder<b> {
```

[View source](https://github.com/eeue56/adeilad/blob/main/src/pipeline.ts#L42-L47)
## hardcoded
```javascript
export function hardcoded<a, b>(
    fallback: a,
    decoder: Decoder<(a: a) => b>
): Decoder<b> {
```

[View source](https://github.com/eeue56/adeilad/blob/main/src/pipeline.ts#L75-L78)
## custom
```javascript
export function custom<a, b>(
    innerDecoder: Decoder<a>,
    wrappedDecoder: Decoder<(a: a) => b>
): Decoder<b> {
```

[View source](https://github.com/eeue56/adeilad/blob/main/src/pipeline.ts#L82-L85)