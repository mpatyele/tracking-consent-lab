const API_URL = "http://localhost:3000/track";

let consentState = {
  analytics_storage: "unset",
  ad_storage: "denied"
};

document.addEventListener("DOMContentLoaded", function () {
  const trackingStatus = document.getElementById("trackingStatus");
  const debugOutput = document.getElementById("debugOutput");
  const consentBanner = document.getElementById("consentBanner");
  const leadForm = document.getElementById("leadForm");
  const resetConsentButton = document.getElementById("resetConsentButton");

  function updateTrackingStatus() {
    if (consentState.analytics_storage === "granted") {
      trackingStatus.textContent = "Analytics consent granted";
      trackingStatus.className = "status granted";
      return;
    }

    if (consentState.analytics_storage === "denied") {
      trackingStatus.textContent = "Analytics consent denied";
      trackingStatus.className = "status denied";
      return;
    }

    trackingStatus.textContent = "Analytics consent not set";
    trackingStatus.className = "status denied";
  }

  function showDebugResponse(data) {
    debugOutput.textContent = JSON.stringify(data, null, 2);
  }

  async function sendTrackingEvent(eventName, eventData = {}) {
    const payload = {
      event_name: eventName,
      consent: consentState,
      event_data: {
        ...eventData,
        page_title: document.title,
        page_location: window.location.href
      }
    };

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      showDebugResponse(data);
    } catch (error) {
      showDebugResponse({
        error: "Unable to send event to server.",
        details: error.message
      });
    }
  }

  function acceptAnalytics() {
    consentState = {
      analytics_storage: "granted",
      ad_storage: "denied"
    };

    localStorage.setItem("trackingConsent", JSON.stringify(consentState));

    updateTrackingStatus();
    consentBanner.classList.add("hidden");

    sendTrackingEvent("consent_update", {
      consent_choice: "accepted"
    });

    sendTrackingEvent("page_view", {
      page_type: "demo_store"
    });
  }

  function rejectAnalytics() {
    consentState = {
      analytics_storage: "denied",
      ad_storage: "denied"
    };

    localStorage.setItem("trackingConsent", JSON.stringify(consentState));

    updateTrackingStatus();
    consentBanner.classList.add("hidden");

    sendTrackingEvent("consent_update", {
      consent_choice: "rejected"
    });
  }

  function resetConsent() {
    console.log("Reset Consent button clicked");

    localStorage.removeItem("trackingConsent");

    consentState = {
      analytics_storage: "unset",
      ad_storage: "denied"
    };

    updateTrackingStatus();
    consentBanner.classList.remove("hidden");

    showDebugResponse({
      message: "Consent has been reset. Choose Accept Analytics or Reject Analytics to continue testing.",
      consent: consentState
    });
  }

  function trackViewItem() {
    sendTrackingEvent("view_item", {
      item_id: "hoodie_001",
      item_name: "SignalWear Performance Hoodie",
      item_category: "Apparel",
      price: 49.99,
      currency: "USD"
    });
  }

  function trackAddToCart() {
    sendTrackingEvent("add_to_cart", {
      item_id: "hoodie_001",
      item_name: "SignalWear Performance Hoodie",
      item_category: "Apparel",
      price: 49.99,
      currency: "USD",
      quantity: 1
    });
  }

  function trackBeginCheckout() {
    sendTrackingEvent("begin_checkout", {
      cart_id: "cart_demo_001",
      value: 49.99,
      currency: "USD",
      items_count: 1
    });
  }

  function trackPurchase() {
    sendTrackingEvent("purchase", {
      transaction_id: `order_${Date.now()}`,
      value: 49.99,
      currency: "USD",
      items_count: 1,
      payment_type: "demo_card"
    });
  }

  function loadSavedConsent() {
    const savedConsent = localStorage.getItem("trackingConsent");

    if (!savedConsent) {
      updateTrackingStatus();
      consentBanner.classList.remove("hidden");
      return;
    }

    consentState = JSON.parse(savedConsent);
    updateTrackingStatus();
    consentBanner.classList.add("hidden");

    if (consentState.analytics_storage === "granted") {
      sendTrackingEvent("page_view", {
        page_type: "demo_store",
        page_view_source: "saved_consent"
      });
    }
  }

  resetConsentButton.addEventListener("click", resetConsent);

  leadForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const name = document.getElementById("leadName").value;
    const email = document.getElementById("leadEmail").value;

    sendTrackingEvent("generate_lead", {
      name: name,
      email: email,
      lead_type: "demo_request",
      form_location: "homepage"
    });

    leadForm.reset();
  });

  window.acceptAnalytics = acceptAnalytics;
  window.rejectAnalytics = rejectAnalytics;
  window.trackViewItem = trackViewItem;
  window.trackAddToCart = trackAddToCart;
  window.trackBeginCheckout = trackBeginCheckout;
  window.trackPurchase = trackPurchase;

  loadSavedConsent();
});