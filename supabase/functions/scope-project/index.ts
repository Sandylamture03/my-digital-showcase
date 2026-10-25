import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { createClient } from "npm:@supabase/supabase-js@2";
import { createOpenAI } from "npm:@ai-sdk/openai";
import { streamText } from "npm:ai";
import { z } from "npm:zod@3";
import {
  createLovableAiGatewayRunIdFetch,
  getLovableAiGatewayRunId,
  withLovableAiGatewayRunIdHeader,
} from "./run-id.ts";

const MAX_PER_HOUR = 5;

const Body = z.object({
  goal: z.string().trim().min(10).max(1500),
  audience: z.string().trim().max(500).optional().default(""),
  features: z.string().trim().max(1500).optional().default(""),
  timeline: z.string().trim().max(200).optional().default(""),
  budget: z.string().trim().max(200).optional().default(""),
});

const INSTRUCTIONS = `You are a project-scoping assistant on the portfolio of Sandeep Lamture, a React & AI full stack developer (React, TypeScript, Tailwind, Supabase-style backends, LLM features).
Only scope software/web/AI projects. If the request is unrelated, say briefly that you can only help scope software projects.
Write in plain text (no markdown symbols like #, *, or tables). Use these section headings on their own lines, in this order:
PROJECT SUMMARY
VERSION 1 FEATURES
LATER FEATURES
SUGGESTED TECH APPROACH
ROUGH TIMELINE (PHASES)
RISKS AND OPEN QUESTIONS
RECOMMENDED NEXT STEPS
Use "- " for list items. Keep it under 450 words. Never quote prices or promise dates; describe phases in relative terms and say a short call with Sandeep will confirm cost and timing. The last next step should be to send this scope to Sandeep.`;

const json = (status: number, error: string) =>
  new Response(JSON.stringify({ error }), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json(405, "Method not allowed");

  let raw: unknown;
  try { raw = await req.json(); } catch { return json(400, "Invalid request body"); }
  const parsed = Body.safeParse(raw);
  if (!parsed.success) return json(400, "Please describe your project in at least 10 characters and keep fields short.");
  const b = parsed.data;

  // Rate limit by hashed IP
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode("scope:" + ip));
  const ipHash = Array.from(new Uint8Array(digest)).map((x) => x.toString(16).padStart(2, "0")).join("");
  const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
  const since = new Date(Date.now() - 3600_000).toISOString();
  const { count } = await admin.from("scope_requests").select("id", { count: "exact", head: true })
    .eq("ip_hash", ipHash).gte("created_at", since);
  if ((count ?? 0) >= MAX_PER_HOUR) return json(429, "You've reached the hourly limit. Please try again later or contact Sandeep directly.");
  await admin.from("scope_requests").insert({ ip_hash: ipHash });

  const apiKey = Deno.env.get("LOVABLE_API_KEY");
  if (!apiKey) return json(500, "AI is not configured.");

  const runIdFetch = createLovableAiGatewayRunIdFetch(getLovableAiGatewayRunId(req));
  const provider = createOpenAI({
    baseURL: "https://ai.gateway.lovable.dev/v1",
    apiKey,
    headers: { "Lovable-API-Key": apiKey, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
    fetch: runIdFetch.fetch,
  });

  const prompt = `Project goal: ${b.goal}
Target users: ${b.audience || "not specified"}
Must-have features: ${b.features || "not specified"}
Desired timeline: ${b.timeline || "not specified"}
Budget range: ${b.budget || "not specified"}`;

  let upstreamError: { status: number; message: string } | null = null;
  const result = streamText({
    model: provider.responses("openai/gpt-6-astra"),
    system: INSTRUCTIONS,
    messages: [{ role: "user", content: prompt }],
    abortSignal: req.signal,
    maxRetries: 0,
    providerOptions: {
      openai: {
        store: false,
        forceReasoning: true,
        reasoningEffort: "low",
        reasoningSummary: "auto",
        include: ["reasoning.encrypted_content"],
      },
    },
    onError: ({ error }) => {
      const e = error as { statusCode?: number; message?: string };
      upstreamError = { status: e.statusCode ?? 500, message: e.message ?? "AI error" };
      console.error("scope-project AI error", upstreamError);
    },
  } as Parameters<typeof streamText>[0]);

  // Wait for the first piece of output so gateway errors become real HTTP statuses.
  const reader = result.textStream[Symbol.asyncIterator]();
  let first: IteratorResult<string>;
  try {
    first = await reader.next();
  } catch (_e) {
    first = { done: true, value: undefined } as IteratorResult<string>;
  }
  if (first.done && upstreamError) {
    const st = (upstreamError as { status: number }).status;
    if (st === 429) return json(429, "The AI is busy right now. Please try again in a minute.");
    if (st === 402) return json(402, "The AI scoping tool is temporarily unavailable. Please contact Sandeep directly.");
    if (st === 403) return json(403, "The AI scoping tool is temporarily unavailable. Please contact Sandeep directly.");
    return json(502, "Something went wrong generating your scope. Please try again later.");
  }
  const enc = new TextEncoder();
  const body = new ReadableStream({
    async start(controller) {
      try {
        if (!first.done) controller.enqueue(enc.encode(first.value));
        while (true) {
          const n = await reader.next();
          if (n.done) break;
          controller.enqueue(enc.encode(n.value));
        }
      } catch (_e) { /* stream ended early */ }
      controller.close();
    },
  });
  return withLovableAiGatewayRunIdHeader(
    new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } }),
    runIdFetch,
    corsHeaders,
  );
});
