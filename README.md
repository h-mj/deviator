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

### Examples

### Basic value transformation

```typescript
import { deviate } from "deviator";

const toInteger = deviate<string>()
  .trim()
  .notEmpty()
  .replace(",", ".")
  .toNumber()
  .round(0);

console.log(toInteger("  Hello  ")); // { kind: 'Err', ok: false, value: 'not_a_number' }
console.log(toInteger("   12,5  ")); // { kind: 'Ok', ok: true, value: 13 }
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
  password: deviate<string>().notEmpty()
});

console.log(validate({ email: "raw input", password: "" }));
// { kind: 'Err', ok: false, value: { email: 'not_email', password: 'empty' } }

console.log(validate({ email: " Hello@There.com ", password: "secret" }));
// { kind: 'Ok', ok: true, value: { email: 'hello@there.com', password: 'secret' } }
```

### Object validation

```typescript
import { deviate } from "deviator";

const validate = deviate().object().shape({
  id: deviate().string().guid(),
  amount: deviate().number().round(2)
});

console.log(validate("A random string"));
// { kind: 'Err', ok: false, value: 'not_object' }

console.log(validate({ id: undefined, amount: 12 }));
// { kind: 'Err', ok: false, value: { id: 'not_string' } }

console.log(validate({ id: "80ceadad-f9ab-44b4-b11e-940cc1cd85aa", amount: 20 }));
// { kind: 'Ok', ok: true, value: { id: '80ceadad-f9ab-44b4-b11e-940cc1cd85aa', amount: 20 } }
```

### Custom deviations

```typescript
import { deviate, ok } from "deviator";

const squareAndReverse = deviate<number>()
  .append(input => ok(input * input))
  .append(input => ok(input.toString()))
  .append(input => ok(input.split("").reverse().join("")));

console.log(squareAndReverse(10)); // { kind: 'Ok', ok: true, value: '001' }
```
