# Deploying the backend to Vercel

This guide explains how to deploy the existing Express backend to Vercel and configure the MongoDB Atlas connection string.

## Key notes

- This backend has a Socket.IO implementation that requires a long-running server and is not fully supported in Vercel Serverless Functions; expect real-time features to not work on Vercel.
- For Socket.IO and WebSocket support, use a platform that supports persistent Node servers (Render, Railway, Fly, or a separate hosted socket service).

## How the server is built for Vercel

- A serverless handler is added in `api/index.js` that exports an Express app as a Vercel function and ensures the MongoDB connection is initialized.
- `vercel.json` routes all requests to `/api/index.js` so your API paths (e.g. `/api/users`) map correctly.

## Environment variables

Set the following variables in your Vercel project settings (Project → Settings → Environment Variables):

- `MONGODB_URI` — your MongoDB Atlas connection string (example: `mongodb+srv://<user>:<password>@cluster0.mongodb.net/wellnexus?retryWrites=true&w=majority`).
- `JWT_SECRET` — application JWT secret.
- `CLIENT_URL` — allowed CORS origin (e.g. https://your-frontend.vercel.app)
- Other variables (optional): `PROVIDER_API_KEY`, `MODEL`, `STRIPE_*`, etc.

Important tips:

- If you're using MongoDB Atlas with IP access list enabled, add `0.0.0.0/0` (during development) or add Vercel's static IPs (if available) to the IP Access List for the cluster — See Atlas docs for recommended approach.
- Make sure you never commit credentials to the repo; keep them only inside Vercel environment variables.

## Deploy steps

1. Ensure your repo is connected to Vercel (create a new Project and import the repo; if monorepo, choose `backendSE` as the project root).
2. Add the environment variables in Vercel Dashboard.
3. Vercel will use `vercel.json` build config and route traffic to `/api/index.js`.
4. Trigger a deployment from Vercel or push a commit to your Git branch.

## Local dev with Vercel-style handler

For local testing, you can still run the dev server:

```powershell
cd backendSE
npm install
npm run dev
```

Or run `node api/index.js` — this file will start a local HTTP server to mimic the serverless handler.

## Troubleshooting

- If you get `MONGODB_URI not set in environment`, make sure the `MONGODB_URI` is set in Vercel env vars. Do not rely on `.env` on Vercel.
- Socket.IO will not work on Vercel serverless functions: consider a different host for the real-time server.

### Check runtime logs & failed connection details

- If your deployment succeeded but endpoints respond with 500 or `Internal Server Error`, open the deployment on the Vercel dashboard and check the **Function logs** (or use the CLI `vercel logs <deployment-url>`).
- Look for log lines produced by `api/index.js` (we added logging for handler start and DB status). Typical lines:
  - `[api] handler start: GET /api/health NODE_ENV=production`
  - `[api] dbConnected= true|false`
- Common failures:
  - **Missing `MONGODB_URI`**: `Error: MONGODB_URI not set in environment` — add the env var and redeploy
  - **MongoDB connection refused**: Atlas IP access list blocked access — add appropriate network access or use private endpoint
  - **Auth failure**: `MongoServerError: authentication failed` — verify username/password and connection string

### Check your project root in Vercel

- If the project fails to route to your backend but the build succeeds, confirm your Vercel project uses `backendSE` as the Root Directory (unless you created a root-level backend project).
- If you accidentally created a project pointing to repo root and the frontend is at repo root, the backend vercel.json won't be used and deployments will build the other project.

### Using the Vercel CLI to see logs

Use these commands from your local machine after installing `vercel` CLI:

```powershell
# show recent logs for a deployment (substitute the project url)
vercel logs <your-project-name>.vercel.app --since 1h

# show function logs (if you have multiple builds) — replace `<deployment-id>` from the UI
vercel logs <deployment-id> --since 1h
```

### If DB never connects on serverless

- Vercel serverless cold starts sometimes collide with DB open/close behavior; our handler caches connections. If you keep seeing connection timeouts, consider using a longer connection pool or host backend on a persistent server.

## Using the Vercel CLI (optional)

You can also set environment variables and deploy using the Vercel CLI:

```powershell
# login
vercel login

# set env value for production
vercel env add MONGODB_URI production

# set env value for preview
vercel env add MONGODB_URI preview

# deploy
vercel --prod --confirm
```

## Validation

- Open `https://<your-backend-project>.vercel.app/api/health` and expect a JSON response `{ ok: true }`.
- If you see `MONGODB_URI not set in environment` or `MongoDB connection error`, confirm your Atlas URI and environment variable names.
