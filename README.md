# deviator

Value transformation and validation library.

## Example

```typescript
import { deviate } from "deviator";

// Single value transformation
const deviation = deviate<string>()
  .trim()
  .toNumber();

console.log(deviation("    17     ").value); // prints 17

// Object validation
const notEmptyValidator = deviate<string>().notEmpty();

const shape = {
  email: notEmptyValidator,
  password: notEmptyValidator
};

const credentials = {
  email: "example@email.com",
  password: ""
};

const validator = deviate<typeof credentials>().shape(shape);

const result = validator(credentials);

console.log(result.kind); // prints Err
console.log(result.value); // prints { password: 'empty' }
```
