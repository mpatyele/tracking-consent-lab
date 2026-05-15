const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Location of our JSON file where events will be saved
const eventsFilePath = path.join(__dirname, "events.json");

// Test route
app.get("/", (req, res) => {
  res.send("Tracking Consent Lab server is running.");
});

// Tracking endpoint
app.post("/track", (req, res) => {
  const incomingEvent = req.body;

  const processedEvent = {
    event_name: incomingEvent.event_name,
    event_time: new Date().toISOString(),
    source: "server",
    consent: incomingEvent.consent || {},
    event_data: incomingEvent.event_data || {},
    status: "received"
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

  console.log("Event received:", processedEvent);

  res.status(200).json({
    message: "Event received successfully",
    event: processedEvent
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});