# Job Portal Frontend — Setup

## 1. Install dependencies
```bash
npm install axios react-router-dom
npm install -D tailwindcss @tailwindcss/vite
```
(Tailwind v4 — no `tailwind.config.js` or PostCSS setup needed.)

## 2. vite.config.js
Use the included `vite.config.js`, or add the plugin to your own:
```js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
});
```

## 3. Drop these files in
Copy the `src/` folder and `vite.config.js` from this package into your Vite
project, overwriting `src/App.jsx`, `src/main.jsx`, and `src/index.css`.
`src/index.css` uses the v4 single-line import (`@import "tailwindcss";`) —
do not add the old `@tailwind base/components/utilities` directives, they're v3-only.

## 4. Match your backend routes
`src/api/axiosInstance.js` assumes:
```
baseURL: "http://localhost:5000/api"
```
Update this to match your `server.js` port and any route prefix.

The API files assume these endpoints exist in your Express routes —
adjust the paths in `src/api/*.js` if yours differ:

| File | Expected endpoint |
|---|---|
| authApi.js | POST /auth/login, POST /auth/register, GET /auth/me |
| jobApi.js | GET /jobs, GET /jobs/:id, POST /jobs, PUT /jobs/:id, DELETE /jobs/:id, GET /jobs/my-jobs |
| applicationApi.js | POST /applications/:jobId, GET /applications/my-applications, GET /applications/job/:jobId, PATCH /applications/:id/status |

Your login/register response is expected to look like:
```json
{ "user": { "_id": "...", "name": "...", "role": "candidate" }, "token": "..." }
```
If your `authController.js` returns a different shape, adjust `Login.jsx` / `Register.jsx` accordingly.

## 5. Run it
```bash
npm run dev
```
