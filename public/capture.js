(function () {
  // 1. Next.js safe script detection
  const script =
    document.currentScript ||
    document.querySelector("script[data-key]") ||
    document.querySelector('script[src*="capture.js"]') ||
    document.querySelector('script[src*="crm360online"]');

  if (!script) {
    console.error("[lead-capture] Failed to locate configuration script tag");
    return;
  }

  const endpoint =
    script.dataset.endpoint ||
    "https://crm-vertical-saas.onrender.com/api/v1/public/leads/inbound";
  const key = script.dataset.key;
  const source = script.dataset.source || window.location.hostname;
  const selector =
    (script.dataset.selector && script.dataset.selector.trim()) || "form";
  const debug =
    script.dataset.debug === "true" ||
    script.dataset.debug === "1" ||
    script.hasAttribute("data-debug");

  if (debug) {
    console.log("[lead-capture] Initialized successfully", {
      endpoint,
      key,
      source,
      selector,
    });
  }

  // Helper to extract fields even if name attributes are slightly mismatched
  function serializeForm(form) {
    const data = {};
    const elements = form.querySelectorAll("input, textarea, select");

    elements.forEach((el) => {
      const fieldName = el.name || el.id;
      if (!fieldName || el.type === "submit" || el.type === "button") return;
      data[fieldName] = el.value;
    });

    return data;
  }

  // 2. Use capture phase so React cannot swallow the event before this runs
  window.addEventListener(
    "submit",
    function (e) {
      const form = e.target;
      if (!(form instanceof HTMLFormElement)) return;
      if (selector !== "form" && !form.matches(selector)) return;

      // Extract form data (prefers native FormData, falls back to DOM query)
      let data = {};
      try {
        data = Object.fromEntries(new FormData(form).entries());
      } catch (_) {}

      if (Object.keys(data).length === 0) {
        data = serializeForm(form);
      }

      const payload = {
        key: key,
        source: source,
        ...data,
      };

      if (debug) console.log("[lead-capture] Sending inbound lead →", payload);

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
          } catch (_) {
            body = null;
          }
          if (debug) console.log("[lead-capture] Response ←", res.status, body);
        })
        .catch((err) => {
          if (debug) console.error("[lead-capture] Network error", err);
        });
    },
    true, // Capture phase: runs before React's SyntheticEvent onSubmit
  );
})();
