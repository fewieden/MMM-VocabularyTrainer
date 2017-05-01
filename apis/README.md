# Documentation for API integration

## Import

The API provider gets imported in the node_helper.js.

## Word Sets

To display the data of the word sets in the UI, a single word set has to be in the following format:

```
{
    "native": "foo", // String
    "foreign": "bar" // String
}
```

## getData

The API provider needs to implement the function `getData`, which gets a callback as parameter.
The callback has to have the following format:

```
callback(null, wordSets);
```

If an error occurs in the process you can return it as the first parameter of the callback.

wordSets has to be an array of word sets described above.

```
[
    {
        "native": "foo", // String
        "foreign": "bar" // String
    },
    {
        "native": "lorem", // String
        "foreign": "ipsum" // String
    },
]
```
