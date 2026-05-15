# Troubleshooting

## Server keeps restarting

Cause:

Nodemon watches JSON files by default. Since this project writes events to `server/events.json`, the server may restart every time an event is saved.

Fix:

Update the `dev` script in `package.json`:

```json
"dev": "nodemon --ignore server/events.json server/server.js"