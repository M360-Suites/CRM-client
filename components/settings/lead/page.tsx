"use client";

import { useState } from "react";
import { CustomButton } from "@/components/custom/common/customButton";
import {
  useGetAvailableKeys,
  useGeneratePublicKey,
  useRevokePublicKey,
} from "@/hooks/user/generate_keys";

type Platform = "html" | "nextjs";

const SCRIPT_SRC = "https://app.crm360online.com/capture.js";
const ENDPOINT =
  "https://crm-vertical-saas.onrender.com/api/v1/public/leads/inbound";

function buildHtmlSnippet(apiKey: string, selector: string) {
  return `<script
  src="${SCRIPT_SRC}"
  data-endpoint="${ENDPOINT}"
  data-key="${apiKey}"
  data-selector="${selector}">
</script>`;
}

function buildNextSnippet(apiKey: string, selector: string) {
  return `import Script from "next/script";

<Script
  src="${SCRIPT_SRC}"
  data-endpoint="${ENDPOINT}"
  data-key="${apiKey}"
  data-selector="${selector}"
  strategy="afterInteractive"
/>`;
}

export default function LeadCaptureSettings() {
  const { mutate: generateKey, isPending: loadingKey } = useGeneratePublicKey();
  const { data: getKeys, isPending: loadingKeys } = useGetAvailableKeys();
  const { mutate: revokeKey, isPending: loadingRevoke } = useRevokePublicKey();
  const generatedPublicKey = getKeys?.data?.publicKey;

  // TODO: swap for useOrganizationApiKey() once the endpoint exists
  // const [apiKey, setApiKey] = useState<string | null>(null);

  const [platform, setPlatform] = useState<Platform>("html");
  const [selector, setSelector] = useState("#contact-form");
  const [copied, setCopied] = useState(false);

  async function handleCopy(snippet: string) {
    await navigator.clipboard.writeText(snippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  if (loadingKeys) {
    return (
      <div className="flex items-center justify-center rounded-xl border bg-white p-8 min-h-80">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#4a0f0a] border-t-transparent" />
      </div>
    );
  }

  if (!generatedPublicKey) {
    return (
      <div className="rounded-xl border bg-white p-8 text-center">
        <div className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-[#FFD9C0]">
          <span className="text-[#4a0f0a]">＋</span>
        </div>
        <p className="mb-1 text-base font-medium">Connect your website</p>
        <p className="mx-auto mb-5 max-w-[34ch] text-sm text-muted-foreground">
          Generate a key to get a script tag that sends form submissions from
          any site straight into this CRM.
        </p>
        <CustomButton
          variant={"default"}
          onClick={() => generateKey()}
          disabled={loadingKey && !generatedPublicKey}
          className="px-5"
        >
          {loadingKey ? "Generating..." : "Generate key"}
        </CustomButton>
      </div>
    );
  }

  const snippet =
    platform === "html"
      ? buildHtmlSnippet(generatedPublicKey, selector)
      : buildNextSnippet(generatedPublicKey, selector);

  return (
    <div className="rounded-xl border bg-white p-6">
      <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
        <span className="h-2 w-2 rounded-full bg-green-500" />
        Connected · no leads received yet
      </div>

      <label className="mb-4 block text-sm">
        <span className="mb-1 block text-muted-foreground">Form selector</span>
        <input
          value={selector}
          onChange={(e) => setSelector(e.target.value)}
          className="w-full rounded-md border px-3 py-1.5 text-sm"
          placeholder="#contact-form"
        />
      </label>

      <div className="mb-3 flex gap-2">
        <CustomButton
          variant={platform === "html" ? "default" : "outline"}
          onClick={() => setPlatform("html")}
          className="px-3  text-xs"
        >
          Plain HTML site
        </CustomButton>
        <CustomButton
          variant={platform === "nextjs" ? "default" : "outline"}
          onClick={() => setPlatform("nextjs")}
          className="px-3 py-0 text-xs"
        >
          Next.js site
        </CustomButton>
      </div>

      <div className="relative rounded-lg bg-[#4a0f0a] p-4">
        <button
          onClick={() => handleCopy(snippet)}
          className="absolute right-3 top-3 rounded-md border border-white/20 px-2 py-1 text-xs text-white/80 hover:border-[#C95C47]"
        >
          {copied ? "Copied" : "Copy"}
        </button>
        <pre className="whitespace-pre-wrap wrap-break-words font-mono text-xs leading-relaxed text-[#F0D9C8]">
          {snippet}
        </pre>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          {platform === "html"
            ? "Paste this before the closing </body> tag on your site."
            : "Add this inside your root layout.tsx, next to your other <Script> tags."}
        </p>
        <CustomButton
          variant="destructive"
          onClick={() => {
            revokeKey("public");
          }}
          className="text-xs"
        >
          {loadingRevoke ? "Revoking..." : "Revoke key"}
        </CustomButton>
      </div>
    </div>
  );
}
