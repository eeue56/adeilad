# adeilad

Ensure JSON has the correct structure at runtime, inspired by Elm's [decoders](https://package.elm-lang.org/packages/elm/json/latest/Json-Decode) and the [pipeline decoder](https://package.elm-lang.org/packages/NoRedInk/elm-json-decode-pipeline/latest) package.

These functions are best used at the surface points where JSON comes into your program: either via an API call, user input, or some untyped library.

Part of the [Hiraeth](https://github.com/eeue56/hiraeth) collection.

## Installation

```
npm install --save @eeue56/adeilad
```

## Example usage

Imagine you have some API that gives you JSON, for example:

```javascript
// fetched via a http request
const someExampleData = {
    name: "Noah",
    age: 28,
    pets: [
        { name: "Frodo", age: 8 },
        { name: "Fiver", age: 3 },
    ]
};

type Pet = {
    name: string;
    age: number;
}

function Pet(name: string, age: number) {
    return {
        name,
        age
    }
}

type Person = {
    name: string;
    age: number;
    pets: Pet[]
}

function Person(name: string, age: number, pets: Pet[]){
    return {
        name,
        age,
        pets
    }
}

const petDecoder = pipeline([
    required("name", string()),
    required("age", number())
])

const personDecoder = pipeline([
    required("name", string()),
    required("age", number()),
    required(pets, array(petDecoder))
]))

const result = decode(personDecoder, person);

switch (result.kind) {
    "ok": {
        console.log("Got a valid person:", result.value);
    },
    "err": {
        console.error("Invalid person:", res.error);
    }
}
```

## Docs

See [docs](./docs/adeilad.md)

You may also want to see the Result type from [coed](https://github.com/eeue56/coed)

## Name

Adeilad is the Welsh word for buildings. For English speakers it'd be pronounced similar to "ah-dey-lad".
