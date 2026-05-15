# Tracking Plan

This project demonstrates consent-aware server-side event tracking for a fictional e-commerce demo store.

## Events

| Event Name | Trigger | Consent Required | Purpose |
|---|---|---|---|
| `consent_update` | User accepts or rejects analytics | No | Records the user's consent choice |
| `page_view` | Page loads after consent is granted | Yes | Tracks website traffic |
| `view_item` | User clicks View Product | Yes | Tracks product interest |
| `add_to_cart` | User clicks Add to Cart | Yes | Tracks shopping intent |
| `begin_checkout` | User clicks Begin Checkout | Yes | Tracks funnel progression |
| `purchase` | User completes purchase | Yes | Tracks conversion |
| `generate_lead` | User submits the lead form | Yes | Tracks lead generation |

## Consent Rules

The backend uses the following rule:

- `consent_update` events are always allowed.
- All other events require `analytics_storage: "granted"`.
- If analytics consent is denied, the event is logged as blocked and event data is not stored.

## Sanitization Rules

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

This simulates a privacy-first tracking workflow where personal data is not stored in raw form.