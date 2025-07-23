- Public key can be used to encrypt data can be distributed to other users.
- The data that is encrypted using the public key will be decrypted using the private key of the recipient.
- Public key can be used to encrypt data can be distributed to other users.
- Private key is never shared with any other user.
- Stateless means that its state is never stored in any file or saved in the database.
- Stateful means that the state is stored in files or database

### ✅ 1. **JWT can be stateless**

- **What it means**: When a user logs in, the server gives them a token (JWT) that holds all the information needed to verify their identity.
- The **server doesn’t need to remember anything** (no session stored on the server).
- Whenever the user sends a request, they attach this token.
- If the token is valid, they get access.
- ✅ **Why it’s useful**: The server can scale better since it doesn’t have to track user sessions.

---

### ✅ 2. **No need to query database every time**

- If the **token includes useful information** like user ID, roles, etc., the server may not need to check the database on every request.
- But for more sensitive or changing data (like permissions), the server **might still need to check** the database.
- ✅ **Tip**: Don't over-stuff the token just to avoid DB calls.

---

### ⚠️ 3. **Header size limit (\~8KB)**

- JWT is sent in the **Authorization header** of an HTTP request.
- But headers have a size limit (around **8KB on most servers**).
- If your JWT is too big (e.g., you're putting **all permissions or settings** inside it), it might get **rejected**.
- ✅ **Best Practice**: Keep your tokens lean and efficient.

---

### ✅ 4. **JWT and CORS (Cross-Origin Resource Sharing)**

- If you're **sending JWT via the `Authorization` header**, **CORS issues are less likely**, because CORS problems mostly come from using **cookies** across domains.
- ✅ **Why it’s good**: JWT in headers works better in cross-origin setups (like frontend on port 5500 and backend on 3000).

---

### ✅ 5. **JWT is more compact than SAML**

- JWT uses **JSON**, SAML uses **XML**.
- JSON is **shorter**, **easier to read**, and **smaller in size**.
- Smaller size = faster to send, better for web/mobile.
- ✅ **Advantage**: JWTs are more lightweight and web-friendly.

---

### ✅ 6. **Signing: JWT vs SWT vs SAML**

- **SWT (Simple Web Token)**: Can only be signed with a **shared secret (HMAC)**.
- **JWT**: Can use **either shared secret or public/private key (RSA, ECDSA)**.
- **SAML**: Uses **XML Digital Signature**, but it’s **complicated and error-prone**.
- ✅ **Security win for JWT**: Easier to sign securely with modern crypto techniques.

---

### ✅ 7. **JSON is easier to work with than XML**

- Most programming languages handle **JSON easily** — it maps directly to variables/objects.
- XML needs **parsing and conversion** — it doesn’t map cleanly to data structures.
- ✅ **Developer-friendly**: JSON (and hence JWT) is easier and faster to use than XML-based SAML.

---

### 📌 Summary

| Topic        | JWT Advantage                                  |
| ------------ | ---------------------------------------------- |
| Stateless    | No server memory needed for sessions           |
| Compact      | JSON is shorter than XML                       |
| Scalable     | No DB query needed if token has needed data    |
| CORS         | No issue when using headers instead of cookies |
| Security     | Easy and modern signing methods                |
| Developer UX | JSON is easy to parse and use                  |

- JWT establishes claims - whether one can login or can access the resource