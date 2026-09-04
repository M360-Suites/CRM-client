(function () {
  const script =
    document.currentScript ||
    document.querySelector('script[src*="capture.js"]');

  if (!script) {
    console.error("[lead-capture] couldn't find its own script tag");
    return;
  }

  const endpoint =
    script.dataset.endpoint ||
    "https://crm-vertical-saas.onrender.com/api/v1/public/leads/inbound";
  const key = script.dataset.key; // Reads data-key from the script tag
  const source = script.dataset.source || window.location.hostname;
  const selector = script.dataset.selector || "form";
  const debug =
    script.dataset.debug === "true" ||
    script.dataset.debug === "1" ||
    script.hasAttribute("data-debug");

  if (debug) {
    console.log("[lead-capture] initialized", {
      endpoint,
      key,
      source,
      selector,
    });
  }

  document.addEventListener(
    "submit",
    function (e) {
      const form = e.target;
      if (!form.matches(selector)) return;

      // Extract form field values
      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());

      // Prepare payload matching the backend schema
      const payload = {
        key: key, // Injects the API key directly into the body
        source: source,
        ...data,
      };

      if (debug) console.log("[lead-capture] sending →", payload);

      fetch(endpoint, {
        method: "POST",
        headers: {
          Accept: "*/*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        keepalive: true,
      })
        .then(async (res) => {
          let body;
          try {
            body = await res.json();
          } catch {
            body = null;
          }
          if (debug) console.log("[lead-capture] response ←", res.status, body);
        })
        .catch((err) => {
          if (debug) console.error("[lead-capture] request failed", err);
        });
    },
    true,
  );
})();
