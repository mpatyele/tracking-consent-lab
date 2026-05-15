# Troubleshooting

## Page keeps reloading or sending repeated page_view events

Cause:

The frontend was opened with VS Code Live Server at `http://127.0.0.1:5500`. Live Server watches project files and may reload the browser every time `server/data/events.json` changes.

Fix:

Do not use Live Server for this project.

Start the Express server:

```bash
npm run dev
```

Then open:

```text
http://localhost:3000
```

Expected behavior:

The page should load normally and should not repeatedly send `page_view` events.


## Server keeps restarting

Cause:

Nodemon watches JSON files by default. Since this project writes events to `server/events.json`, the server may restart every time an event is saved.

Fix:

Update the `dev` script in `package.json`:

```json
"dev": "nodemon --ignore server/events.json server/server.js"