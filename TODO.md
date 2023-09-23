# Todo

## v5

- do not set default value for array (schema L370)
- rename `max` to `maximum`
- rename `min` to `minimum`

## Checking

- Add option `contains: { type: 'number' }`
  - https://json-schema.org/understanding-json-schema/reference/array.html#id10
- Add option `minContains: number` and `maxContains: number`
- Check every type in array passed to option `type` (ex: `['string', 'number']`)
