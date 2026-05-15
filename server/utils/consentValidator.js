function validateConsent(eventName, consent) {
  
  if (eventName === "consent_update") {
    return {
      allowed: true,
      reason: "Consent update events are always allowed."
    };
  }

  // If the consent object is missing, block the event.
  if (!consent) {
    return {
      allowed: false,
      reason: "Event blocked because consent information is missing."
    };
  }

  // Check if the user granted analytics consent.
  const analyticsConsent = consent.analytics_storage;

  if (analyticsConsent === "granted") {
    return {
      allowed: true,
      reason: "Analytics consent granted."
    };
  }

  return {
    allowed: false,
    reason: "Event blocked because analytics consent was not granted."
  };
}

module.exports = validateConsent;