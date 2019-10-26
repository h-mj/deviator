# Deviator

TypeScript value transformation and validation library that leverages the type system to provide correct types during deviation creation and for deviation results.

## Installation

### npm

```
$ npm install deviator
```

### Yarn

```
$ yarn add deviator
```

## Examples

### Basic value transformation

```typescript
import { deviate } from "deviator";

const toInteger = deviate<string>()
  .trim()
  .nonempty()
  .replace(",", ".")
  .toNumber()
  .round(0);

console.log(toInteger("  Hello  ")); // { ok: false, continue: false, value: 'toNumber' }
console.log(toInteger("   12,5  ")); // { ok: true, continue: true, value: 13 }
```

### Object value transformation

```typescript
import { deviate } from "deviator";

interface Credentials {
  email: string;
  password: string;
}

const validate = deviate<Credentials>().shape({
  email: deviate<string>().trim().lowercase().email(),
  password: deviate<string>().nonempty()
});

console.log(validate({ email: "raw input", password: "" }));
// { ok: false, continue: false, value: { email: 'email', password: 'nonempty' } }

console.log(validate({ email: " Hello@There.com ", password: "secret" }));
// { ok: true, continue: true, value: { email: 'hello@there.com', password: 'secret' } }
```

### Object validation

```typescript
import { deviate } from "deviator";

const validate = deviate().object().shape({
  id: deviate().string().guid(),
  amount: deviate().number().round(2)
});

console.log(validate("A random string"));
// { ok: false, continue: false, value: 'object' }

console.log(validate({ id: undefined, amount: 12 }));
// { ok: false, continue: false, value: { id: 'string' } }

console.log(validate({ id: "80ceadad-f9ab-44b4-b11e-940cc1cd85aa", amount: 20 }));
// { ok: true, continue: true, value: { id: '80ceadad-f9ab-44b4-b11e-940cc1cd85aa', amount: 20 } }
```

### Custom deviations

```typescript
import { deviate, ok } from "deviator";

const squareAndReverse = deviate<number>()
  .then(input => ok(input * input))
  .then(input => ok(input.toString()))
  .then(input => ok(input.split("").reverse().join("")));

console.log(squareAndReverse(10)); // { ok: true, continue: true, value: '001' }
```
