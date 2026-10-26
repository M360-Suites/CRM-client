"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { CustomButton } from "@/components/custom/common/customButton";
import { ConfirmRevokeModal } from "@/components/custom/common/confirm_revoke_modal";
import {
	useGetAvailableKeys,
	useGeneratePublicKey,
	useRevokePublicKey,
} from "@/hooks/user/generate_keys";

type Platform = "html" | "nextjs";

const SCRIPT_SRC = "https://app.crm360online.com/capture.js";
const ENDPOINT =
	"https://crm-vertical-saas.onrender.com/api/v1/public/leads/inbound";

function buildHtmlSnippet(
	apiKey: string,
	selector: string,
	tags: string,
	debug: boolean,
) {
	return `<script
	src="${SCRIPT_SRC}"
	data-endpoint="${ENDPOINT}"
	data-key="${apiKey}"
	data-selector="${selector}"
	data-tags="${tags}"
	data-debug="${debug ? "true" : "false"}">
</script>`;
}

function buildNextSnippet(
	apiKey: string,
	selector: string,
	tags: string,
	debug: boolean,
) {
	return `import Script from "next/script";

<Script
  src="${SCRIPT_SRC}"
  data-key="${apiKey}"
  data-selector="${selector}"
  data-tags="${tags}"
  data-debug="${debug ? "true" : "false"}"
  strategy="afterInteractive"
/>`;
}
export default function LeadCaptureSettings() {
	const { mutate: generateKey, isPending: loadingKey } =
		useGeneratePublicKey();
	const { data: getKeys, isPending: loadingKeys } = useGetAvailableKeys();
	const { mutate: revokeKey, isPending: loadingRevoke } =
		useRevokePublicKey();
	const generatedPublicKey = getKeys?.data?.publicKey;

	const [platform, setPlatform] = useState<Platform>("html");
	const [selector, setSelector] = useState("#contact-form");
	const [tags, setTags] = useState("");
	const [debug, setDebug] = useState(false);
	const [copied, setCopied] = useState(false);
	async function handleCopy(snippet: string) {
		await navigator.clipboard.writeText(snippet);
		setCopied(true);
		setTimeout(() => setCopied(false), 1500);
	}

	if (loadingKeys) {
		return (
			<div className="flex items-center justify-center rounded-xl border bg-white p-8 min-h-80">
				<div className="h-6 w-6 animate-spin rounded-full border-2 border-[#00B3A6] border-t-transparent" />
			</div>
		);
	}

	if (!generatedPublicKey) {
		return (
			<div className="rounded-xl border bg-white sm:p-8 p-5 text-center">
				<div className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-[#D8F3F1]">
					<span className="text-[#2F9E94]">＋</span>
				</div>
				<p className="mb-1 text-base font-medium">
					Connect your website
				</p>
				<p className="mx-auto mb-5 max-w-[34ch] wrap-break-word text-sm text-muted-foreground">
					Generate a key to get a script tag that sends form
					submissions from any site straight into this CRM.
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
			? buildHtmlSnippet(generatedPublicKey, selector, tags, debug)
			: buildNextSnippet(generatedPublicKey, selector, tags, debug);

	return (
		<div className="rounded-xl border bg-white sm:p-6 p-4">
			<div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
				<span className="h-2 w-2 rounded-full bg-green-500" />
				Connected · no leads received yet
			</div>

			<label className="mb-4 block text-sm">
				<span className="mb-1 block text-muted-foreground">
					Form selector
				</span>
				<input
					value={selector}
					onChange={(e) => setSelector(e.target.value)}
					className="w-full rounded-md border px-3 py-2 text-sm"
					placeholder="#contact-form"
				/>
			</label>

			<label className="mb-4 block text-sm">
				<span className="mb-1 block text-muted-foreground">Tags</span>
				<input
					value={tags}
					onChange={(e) => setTags(e.target.value)}
					className="w-full rounded-md border px-3 py-2 text-sm"
					placeholder="lead,marketing"
				/>
			</label>

			<div className="mb-3 flex gap-2">
				<CustomButton
					variant={platform === "html" ? "default" : "outline"}
					onClick={() => setPlatform("html")}
					className={`max-sm:flex-1 px-3 text-sm ${platform !== "html" && "text-foreground"}`}
				>
					Plain HTML site
				</CustomButton>
				<CustomButton
					variant={platform === "nextjs" ? "default" : "outline"}
					onClick={() => setPlatform("nextjs")}
					className={`max-sm:flex-1 px-3 text-sm ${platform !== "nextjs" && "text-foreground"}`}
				>
					Next.js site
				</CustomButton>
			</div>

			<div className="rounded-lg bg-[#E6F2FF] overflow-hidden">
				<div className="flex items-center justify-between gap-2 border-b border-b-[#D9E1E8] px-4 py-2">
					<span className="text-xs font-medium text-foreground">
						{platform === "html" ? "index.html" : "layout.tsx"}
					</span>
					<button
						type="button"
						onClick={() => handleCopy(snippet)}
						aria-label="Copy snippet"
						className="flex items-center gap-1 rounded-md border bg-white px-2.5 py-1.5 text-xs text-foreground hover:border-[#00B3A6] cursor-pointer"
					>
						{copied ? (
							<Check className="h-3.5 w-3.5 text-green-600" />
						) : (
							<Copy className="h-3.5 w-3.5" />
						)}
						{copied ? "Copied" : "Copy"}
					</button>
				</div>
				<pre className="whitespace-pre-wrap wrap-anywhere p-4 font-mono text-xs leading-relaxed text-foreground">
					{snippet}
				</pre>
			</div>

			<div className="mt-3 flex sm:flex-row flex-col sm:items-center justify-between sm:gap-4 gap-3">
				<p className="min-w-0 wrap-anywhere text-xs text-foreground">
					{platform === "html"
						? "Paste this before the closing </body> tag on your site."
						: "Add this inside your root layout.tsx, next to your other <Script> tags."}
				</p>
				<ConfirmRevokeModal
					title="Remove access?"
					description="Are you sure you want to remove access? Your website will stop sending leads to this CRM until you generate a new key and update the script on your site."
					confirmationText="I WANT TO REVOKE"
					confirmLabel="Revoke key"
					pendingLabel="Revoking..."
					isPending={loadingRevoke}
					onConfirm={(close) =>
						revokeKey("public", {
							onSuccess: (data) => {
								if (data.status) close();
							},
						})
					}
					trigger={
						<CustomButton
							variant="destructive"
							className="shrink-0 max-sm:w-full text-sm"
						>
							Revoke key
						</CustomButton>
					}
				/>
			</div>
		</div>
	);
}
