const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const validateConsent = require("./utils/consentValidator");
const sanitizeEventData = require("./utils/sanitizeEvent");


const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "client")));

// Location of our JSON file where events will be saved
const eventsFilePath = path.join(__dirname, "data", "events.json");

// Test route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "client", "index.html"));
});

// Tracking endpoint
app.post("/track", (req, res) => {
  const incomingEvent = req.body;

  const eventName = incomingEvent.event_name;
  const consent = incomingEvent.consent || {};

  const consentResult = validateConsent(eventName, consent);

  const processedEvent = {
  event_name: eventName,
  event_time: new Date().toISOString(),
  source: "server",
  consent: consent,
  event_data: consentResult.allowed ? sanitizeEventData(incomingEvent.event_data) : {},
  status: consentResult.allowed ? "processed" : "blocked_due_to_consent",
  reason: consentResult.reason
};

  let existingEvents = [];

  try {
    const fileData = fs.readFileSync(eventsFilePath, "utf-8");
    existingEvents = JSON.parse(fileData);
  } catch (error) {
    existingEvents = [];
  }

  existingEvents.push(processedEvent);

  fs.writeFileSync(eventsFilePath, JSON.stringify(existingEvents, null, 2));

  console.log("Event handled:", processedEvent);

  res.status(200).json({
    message: consentResult.allowed
      ? "Event processed successfully"
      : "Event blocked due to consent",
    event: processedEvent
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});