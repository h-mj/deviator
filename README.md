# deviator

Value transformation and validation library that leverages TypeScript's type system to provide correct types during deviation creation and for deviation results.

## Installation

`$ npm install deviator` or `$ yarn add deviator`

## Usage

```typescript
import { deviate } from "deviator";

// Value transformation

const transform = deviate<string>()
  .trim()
  .notEmpty()
  .replace(",", ".")
  .toNumber();

console.log(transform(" 12,3")); //=> { kind: 'Next', value: 12.3 }
console.log(transform(" 12;3")); //=> { kind: 'Err', value: 'not_a_number' }

// Object validation

const validate = deviate()
  .object()
  .shape({
    email: deviate()
      .string()
      .notEmpty(),
    pin: deviate().number()
  });

console.log(validate(12));
//=> { kind: 'Err', value: 'not_object' }

console.log(validate({ email: 12 }));
//=> { kind: 'Err', value: { email: 'not_string', pin: 'not_number' } }

console.log(validate({ email: "a string", pin: 1234 }));
//=> { kind: 'Next', value: { email: 'a string', pin: 1234 } }
```
