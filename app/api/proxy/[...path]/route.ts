/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";

const API_BASE = process.env.API_BASE_URL ?? process.env.NEXT_PUBLIC_BASE_URL;

const HOP_BY_HOP_HEADERS = [
	"connection",
	"keep-alive",
	"proxy-authenticate",
	"proxy-authorization",
	"te",
	"trailer",
	"transfer-encoding",
	"upgrade",
	"host",
	"content-length",
];

function buildForwardHeaders(req: NextRequest) {
	const headers = new Headers(req.headers);

	for (const header of HOP_BY_HOP_HEADERS) {
		headers.delete(header);
	}

	return headers;
}

// change helper from an exported symbol to a local helper so Next.js doesn't treat it as a route export
async function proxyHandler(req: NextRequest, path: string[]) {
	console.log("Proxying API BASE:", API_BASE);
	console.log("Incoming Cookie header:", req.headers.get("cookie"));
	if (!API_BASE) {
		return NextResponse.json(
			{
				status: false,
				message: "Server misconfiguration: API base URL not set",
			},
			{ status: 500 },
		);
	}

	const origin = req.headers.get("origin") || "";

	// OPTIONS preflight
	if (req.method === "OPTIONS") {
		const preflightHeaders = new Headers();
		preflightHeaders.set("Access-Control-Allow-Origin", origin || "");
		preflightHeaders.set("Vary", "Origin");
		preflightHeaders.set("Access-Control-Allow-Credentials", "true");
		preflightHeaders.set(
			"Access-Control-Allow-Methods",
			"GET,POST,PUT,DELETE,PATCH,OPTIONS",
		);
		preflightHeaders.set(
			"Access-Control-Allow-Headers",
			req.headers.get("access-control-request-headers") ||
				"Content-Type, Authorization",
		);
		return new NextResponse(null, {
			status: 204,
			headers: preflightHeaders,
		});
	}

	// preserve query string
	const search = req.nextUrl?.search || "";
	// normalize URL construction (avoid double slashes)
	const pathPart = path.join("/").replace(/^\/+/, "");
	const targetUrl = `${API_BASE.replace(/\/+$/, "")}/${pathPart}${search}`;

	const headers = buildForwardHeaders(req);

	// Handle body (formdata, json, text, binary)
	let body: BodyInit | null = null;

	if (req.method !== "GET" && req.method !== "HEAD") {
		const contentType = req.headers.get("content-type") || "";

		if (contentType.includes("multipart/form-data")) {
			// Let fetch set the proper multipart boundary header
			const formData = await req.formData();
			body = formData;
			headers.delete("content-type");
			headers.delete("content-length"); // Delete so fetch can recalculate
		} else if (
			contentType.includes("image/") ||
			contentType.includes("application/octet-stream") ||
			contentType.includes("application/pdf") ||
			contentType.includes("video/") ||
			contentType.includes("audio/")
		) {
			// Handle binary content (images, PDFs, etc.)
			body = await req.blob();
		} else if (contentType.includes("application/json")) {
			// Clone the request to handle potential JSON parse errors
			const clonedReq = req.clone();
			try {
				const json = await req.json();
				body = JSON.stringify(json);
				headers.set("content-type", "application/json");
			} catch (error) {
				// If JSON parsing fails (e.g., binary data sent with wrong content-type),
				// fall back to blob using the cloned request
				console.warn(
					"Failed to parse as JSON despite content-type, treating as binary:",
					error,
				);
				body = await clonedReq.blob();
			}
		} else if (contentType.includes("application/x-www-form-urlencoded")) {
			// Handle form-urlencoded
			body = await req.text();
		} else if (contentType) {
			// For any other content-type, treat as text
			body = await req.text();
		} else {
			// No content-type specified, treat as blob
			body = await req.blob();
		}
	}

	try {
		const requestInit: RequestInit = {
			method: req.method,
			headers,
			body,
			redirect: "manual",
			credentials: "include",
			cache: "no-store",
		};

		const fetchWithRetry = async () => {
			try {
				return await fetch(targetUrl, {
					...requestInit,
					signal: AbortSignal.timeout(15000),
				});
			} catch (error) {
				console.warn("Proxy fetch failed, retrying once:", error);
				return fetch(targetUrl, {
					...requestInit,
					signal: AbortSignal.timeout(15000),
				});
			}
		};

		const response = await fetchWithRetry();

		const resHeaders = new Headers(response.headers);
		resHeaders.delete("content-length");
		resHeaders.delete("content-encoding");
		resHeaders.set("Access-Control-Allow-Origin", origin || "");
		resHeaders.set("Vary", "Origin");
		resHeaders.set("Access-Control-Allow-Credentials", "true");
		resHeaders.set(
			"Access-Control-Allow-Methods",
			"GET,POST,PUT,DELETE,PATCH,OPTIONS",
		);
		resHeaders.set(
			"Access-Control-Allow-Headers",
			req.headers.get("access-control-request-headers") ||
				"Content-Type, Authorization",
		);

		return new NextResponse(response.body, {
			status: response.status,
			headers: resHeaders,
		});
	} catch (error) {
		console.error("Proxy fetch error:", error);
		console.error("Target URL was:", targetUrl);
		return NextResponse.json(
			{
				status: false,
				message: "Proxy error",
				targetUrl,
				error:
					error instanceof Error
						? `${error.name}: ${error.message}`
						: String(error),
			},
			{ status: 500 },
		);
	}
}

export async function GET(req: NextRequest, context: any) {
	// context.params can be an async getter in Next.js — await it before accessing properties
	const params = await context.params;
	const path = Array.isArray(params?.path) ? params.path : [];
	return proxyHandler(req, path);
}

export async function POST(req: NextRequest, context: any) {
	const params = await context.params;
	const path = Array.isArray(params?.path) ? params.path : [];
	return proxyHandler(req, path);
}

export async function PUT(req: NextRequest, context: any) {
	const params = await context.params;
	const path = Array.isArray(params?.path) ? params.path : [];
	return proxyHandler(req, path);
}

export async function PATCH(req: NextRequest, context: any) {
	const params = await context.params;
	const path = Array.isArray(params?.path) ? params.path : [];
	return proxyHandler(req, path);
}

export async function DELETE(req: NextRequest, context: any) {
	const params = await context.params;
	const path = Array.isArray(params?.path) ? params.path : [];
	return proxyHandler(req, path);
}
