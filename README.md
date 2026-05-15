# Tracking Consent Lab

A privacy-first server-side tracking demo that shows how user interaction events can be collected through a backend endpoint, validated against consent preferences, sanitized, and logged for analytics or advertising measurement use cases.

## Project Overview

Tracking Consent Lab simulates a modern analytics implementation workflow for a fictional e-commerce store called **SignalWear Analytics Demo Store**.

The project demonstrates how a website can collect user interactions, send those events to a backend server, and allow the server to decide whether each event should be processed or blocked based on the user's consent choice.

## Why This Project Matters

Digital advertising and analytics teams often need to collect user interaction signals while respecting privacy and consent requirements.

This project demonstrates a simple version of that workflow:

1. The user chooses whether to accept or reject analytics tracking.
2. The frontend sends tracking events to a backend endpoint.
3. The backend validates the consent state.
4. The backend sanitizes event data before saving it.
5. Events are logged as either processed or blocked.

## Tech Stack

- HTML
- CSS
- JavaScript
- Node.js
- Express
- JSON file storage

## Features

- Consent banner with Accept Analytics and Reject Analytics options
- Consent state saved in browser localStorage
- Reset Consent button for testing
- Server-side event collection endpoint
- Consent validation before event processing
- Event data sanitization
- E-commerce event tracking
- Lead form tracking
- Frontend debug panel showing server responses
- JSON-based event log

## Events Implemented

| Event Name | Trigger | Purpose |
|---|---|---|
| `consent_update` | User accepts or rejects analytics | Records the user's consent choice |
| `page_view` | Page loads after analytics consent is granted | Tracks website traffic |
| `view_item` | User clicks View Product | Tracks product interest |
| `add_to_cart` | User clicks Add to Cart | Tracks shopping intent |
| `begin_checkout` | User clicks Begin Checkout | Tracks checkout activity |
| `purchase` | User clicks Complete Purchase | Tracks conversion activity |
| `generate_lead` | User submits the lead form | Tracks lead generation |

## Consent Logic

The backend uses the following rule:

- `consent_update` events are always allowed.
- All other events require `analytics_storage: "granted"`.
- If analytics consent is denied, the event is blocked.
- If an event is blocked, the backend does not store event data.

Example accepted consent state:

```json
{
  "analytics_storage": "granted",
  "ad_storage": "denied"
}
```

Example rejected consent state:

```json
{
  "analytics_storage": "denied",
  "ad_storage": "denied"
}
```

## Privacy and Sanitization

The backend removes sensitive fields before saving event data.

Removed fields include:

- `name`
- `first_name`
- `last_name`
- `email`
- `phone`
- `address`
- `password`
- `credit_card`

For example, the frontend may send this lead form event:

```json
{
  "event_name": "generate_lead",
  "event_data": {
    "name": "Mariana",
    "email": "mariana@example.com",
    "lead_type": "demo_request",
    "form_location": "homepage"
  }
}
```

The backend saves only the safe fields:

```json
{
  "lead_type": "demo_request",
  "form_location": "homepage"
}
```

## Project Structure

```text
tracking-consent-lab/
│
├── client/
│   ├── index.html
│   ├── styles.css
│   └── app.js
│
├── server/
│   ├── server.js
│   ├── data/
│   │   └── events.json
│   └── utils/
│       ├── consentValidator.js
│       └── sanitizeEvent.js
│
├── docs/
│   ├── tracking-plan.md
│   ├── consent-flow.md
│   └── troubleshooting.md
│
├── package.json
├── README.md
└── .gitignore
```

## How to Run Locally

Install dependencies:

```bash
npm install
```

Start the backend server:

```bash
npm run dev
```

The app runs on:

```text
http://localhost:3000
```

Open the app in your browser at:

```text
http://localhost:3000
```

Important: Do not use VS Code Live Server for this project. Opening the app with Live Server, such as `http://127.0.0.1:5500/client/index.html`, may cause an infinite reload loop because the project writes events to a local JSON file.

## How to Test the Demo

### Test Accepted Consent

1. Open `client/index.html`.
2. Click **Reset Consent** if needed.
3. Click **Accept Analytics**.
4. Click **View Product**.
5. Click **Add to Cart**.
6. Click **Begin Checkout**.
7. Click **Complete Purchase**.
8. Submit the lead form.
9. Check the debug panel on the page.
10. Check `server/events.json`.

Expected result:

```json
{
  "status": "processed",
  "reason": "Analytics consent granted."
}
```

### Test Rejected Consent

1. Click **Reset Consent**.
2. Click **Reject Analytics**.
3. Click **Add to Cart**.
4. Check the debug panel.
5. Check `server/events.json`.

Expected result:

```json
{
  "status": "blocked_due_to_consent",
  "event_data": {}
}
```

## Example Processed Event

```json
{
  "event_name": "add_to_cart",
  "event_time": "2026-05-15T16:27:04.193Z",
  "source": "server",
  "consent": {
    "analytics_storage": "granted",
    "ad_storage": "denied"
  },
  "event_data": {
    "item_id": "hoodie_001",
    "item_name": "SignalWear Performance Hoodie",
    "item_category": "Apparel",
    "price": 49.99,
    "currency": "USD",
    "quantity": 1
  },
  "status": "processed",
  "reason": "Analytics consent granted."
}
```

## Example Blocked Event

```json
{
  "event_name": "add_to_cart",
  "event_time": "2026-05-15T16:28:10.193Z",
  "source": "server",
  "consent": {
    "analytics_storage": "denied",
    "ad_storage": "denied"
  },
  "event_data": {},
  "status": "blocked_due_to_consent",
  "reason": "Event blocked because analytics consent was not granted."
}
```

## Documentation

Additional documentation is available in the `docs` folder:

- `tracking-plan.md` explains the events, triggers, consent rules, and sanitization rules.
- `consent-flow.md` explains how consent is collected, stored, reset, and enforced.
- `troubleshooting.md` explains common testing issues and fixes.

## Portfolio Relevance

This project demonstrates practical experience with:

- Front-end development
- Server-side event tracking
- Signal collection
- Consent-based measurement
- Privacy-first analytics implementation
- E-commerce conversion events
- Lead generation tracking
- Event debugging workflows
- Advertising and analytics implementation concepts

## Future Improvements

Possible future additions:

- Add a dashboard to visualize processed and blocked events
- Add hashed email support instead of removing email completely
- Simulate forwarding events to Google Analytics 4 or Meta Conversions API
- Add database storage instead of JSON file storage
- Deploy frontend and backend separately
