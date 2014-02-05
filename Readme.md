
# monquery

  Lucene-inspired string-based mongodb query language for humans (and ferrets).

## Installation

```
$ npm install monquery
```

## Example

```js
var compile = require('monquery');
var str = 'level:error OR type:upload';
var query = compile(str);
```

## Querying

### Fields

  Specify field names with optional values:

```js
level:error
```

yields

```js
{ level: 'error' }
```

### Booleans

  Omit value to imply __true__:

```js
failed
```

yields

```js
{ failed: true }
```

  Or specify a boolean-ish value (true, false, yes, no):

```js
failed: no
```

yields

```js
{ failed: false }
```

### Operators

  Currently supports __AND__ / __OR__, which may be nested:

```js
(level:error AND type:"upload failed") OR user.name.first:Tobi
```

yields

```js
{ '$or':
   [ { '$and': [ { level: 'error' }, { type: 'upload failed' } ] },
     { 'user.name.first': 'Tobi' } ] }
```

### Regular Expressions

  Regexps may be used with the `//` syntax:

```js
level:info AND name:/^To/
```

yields

```js
{ '$and': [ { level: 'info' }, { name: /^To/ } ] }
```

# License

  MIT