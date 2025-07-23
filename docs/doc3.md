# 🚀 `export` vs `export default` in Node.js – Hinglish (with "aap")

<!-- markdownlint-disable MD024 -->

## 🔹 1. `export` (Named Export)

### 📌 Matlab

Agar aap kisi file mein **multiple functions, variables ya classes** ko naam ke saath export karna chahte hain, to `export` ka use kiya jata hai.

### 📦 Example

```js
// mathUtils.js
export const add = (a, b) => a + b;
export const multiply = (a, b) => a * b;
```

```js
// index.js
import { add, multiply } from "./mathUtils.js";

console.log(add(2, 3)); // Output: 5
console.log(multiply(2, 3)); // Output: 6
```

> 🧠 **Note**: Jab aap `export` use karte hain, to import karte samay **naam same hona chahiye** ya phir `as` ke saath rename karna padta hai.

```js
import { add as addition } from "./mathUtils.js";
```

---

## 🔹 2. `export default` (Default Export)

### 📌 Matlab

Iska use tab kiya jata hai jab aap **sirf ek default value ya function ya class** ko export karna chahte hain.

### 📦 Example

```js
// greet.js
const greet = (name) => `Hello, ${name}`;
export default greet;
```

```js
// index.js
import greetFunction from "./greet.js";

console.log(greetFunction("Aaditya")); // Output: Hello, Aaditya
```

> 🧠 **Note**: Jab aap `export default` use karte hain, to import karte waqt **kisi bhi naam** ka use kiya ja sakta hai — braces `{}` ka use nahi hota.

---

## 🆚 Differences Summary Table

| Feature                 | `export` (named export)              | `export default`                 |
| ----------------------- | ------------------------------------ | -------------------------------- |
| Export ki sankhya       | Aap multiple cheezein kar sakte hain | Sirf ek hi cheez export hoti hai |
| Import syntax           | `import { name } from ...`           | `import anything from ...`       |
| Rename ka option        | `{ name as newName }`                | Direct `import myName` possible  |
| Braces (`{}`) required? | Haan                                 | Nahi                             |

---

## ✅ Kab kya use karein?

- 🔹 **`export`** – Jab aap ek hi file se multiple cheezein export karna chahte hain (e.g., multiple utility functions).
- 🔹 **`export default`** – Jab aapke paas ek main function/cheez ho jo default ka roop mein export honi chahiye.

---

## ⚠️ Agar aap CommonJS use kar rahe hain (`require()` waala system)

| CommonJS Syntax        | ES Module Equivalent      |
| ---------------------- | ------------------------- |
| `module.exports = ...` | `export default ...`      |
| `exports.name = ...`   | `export const name = ...` |

---

## My Summary

- exports for multiple and export default for single
- Jab exports use kar rahe ho toh import karte time import main name should match the exported name
- Jab export default use kar rahe ho toh import karte time import mein can use custom name for imported function or class or object.
