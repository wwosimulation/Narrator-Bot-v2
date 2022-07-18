# i18n Module
The i18n module is used to translate strings for Narrator Bot v2.

## Head
Every json file in this folder is seen as a language file and should have some `_meta` data:
```json
{
    "_meta": {
        "name": "",
        "emoji": "",
        "author": "",
        "version": "",
    }
}
```
The `name` is the name of the language (native preferred) and the `emoji` is the emoji which is used to represent the language in the language selection menu. The `emoji` can be a string or a Discord emoji resolvable.

Optional are properties like `author` and `version`. While the `author` is/are the translator/s of the language file and the `version` is the version of the language file/version of the bot when it was updated.

The name of the file is important as it is used to identify the language. If it is a real language that also has a [`Locale`](https://discord.com/developers/docs/reference#locales) in the Discord API, then the name of the file should be the same as the name of the locale, so the language can be detected automatically.

## Usage
The i18n module is implemented in `ExtendedInteraction` and other classes that are used to communicate with the user.
```ts
something.i18n(key: string, replaceData?: object, language?: string): string;
```
The `key` is the key of the string in the language file. The `replaceData` is an object which is used to replace placeholders in the string. The `language` is the language to use. If not set, the language of the DBUser is used. 
Example:
```ts
interaction.i18n("ping", {latency: client.ws.ping});
```

Point notation is used to access nested objects. For example:
```ts
something.i18n("key.subkey.subsubkey"); 
```
will get you this value:
```json
{
    "key": {
        "subkey": {
            "subsubkey": "value"
        }
    }
}
```