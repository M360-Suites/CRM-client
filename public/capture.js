// (function () {
//   const script = document.querySelector('script[src*="capture.js"]');
//   if (!script) {
//     console.error("[lead-capture] couldn't find its own script tag");
//     return;
//   }

//   const endpoint =
//     script.dataset.endpoint ||
//     "https://crm-vertical-saas.onrender.com/api/v1/public/leads/inbound";
//   const source = script.dataset.source || window.location.hostname;
//   const selector = script.dataset.selector || "form";
//   const debug = script.dataset.debug === "true";

//   document.addEventListener(
//     "submit",
//     function (e) {
//       const form = e.target;
//       if (!form.matches(selector)) return;

//       const data = Object.fromEntries(new FormData(form));
//       const payload = { source, ...data };

//       if (debug) console.log("[lead-capture] sending →", payload);

//       fetch(endpoint, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//         keepalive: true,
//       })
//         .then((res) =>
//           res.json().then((body) => ({ status: res.status, body })),
//         )
//         .then(({ status, body }) => {
//           if (debug) console.log("[lead-capture] response ←", status, body);
//         })
//         .catch((err) => {
//           if (debug) console.error("[lead-capture] failed", err);
//         });
//     },
//     true,
//   );
// })();

(function () {
  const script =
    document.currentScript ||
    document.querySelector('script[src*="capture.js"]');

  if (!script) {
    console.error("[lead-capture] couldn't find its own script tag");
    return;
  }

  // Coerce "true", "1", or empty attribute boolean (data-debug) to true
  const debug =
    script.dataset.debug === "true" ||
    script.dataset.debug === "1" ||
    script.hasAttribute("data-debug");

  const endpoint =
    script.dataset.endpoint ||
    "https://crm-vertical-saas.onrender.com/api/v1/public/leads/inbound";
  const source = script.dataset.source || window.location.hostname;
  const selector = script.dataset.selector || "form";

  if (debug) {
    console.log("[lead-capture] initialized", { endpoint, source, selector });
  }

  document.addEventListener(
    "submit",
    function (e) {
      e.preventDefault();
      const form = e.target;
      if (!form.matches(selector)) return;

      const data = Object.fromEntries(new FormData(form));
      const payload = { source, ...data };

      if (debug) console.log("[lead-capture] sending →", payload);

      fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
          console.error("[lead-capture] fetch error:", err);
        });
    },
    true,
  );
})();
