function sanitizeEventData(eventData) {
  if (!eventData || typeof eventData !== "object") {
    return {};
  }

  const sensitiveFields = [
    "name",
    "first_name",
    "last_name",
    "email",
    "phone",
    "address",
    "password",
    "credit_card"
  ];

  const sanitizedData = {};

  for (const key in eventData) {
    if (!sensitiveFields.includes(key)) {
      sanitizedData[key] = eventData[key];
    }
  }

  return sanitizedData;
}

module.exports = sanitizeEventData;