# Plan: AI project scoping for freelance clients

## What visitors get
- In the "Work With Me" section, under the founders card, a new **"Scope your project with AI"** box.
- The visitor fills in: what they want to build, who it's for, must-have features, timeline, and budget range (optional).
- They click **Generate scope**. The answer appears word by word and includes:
  - Project summary
  - Suggested features, split into "Version 1" and "Later"
  - Suggested tech approach (React, AI, backend)
  - Rough timeline in phases
  - Risks and open questions
  - Recommended next steps
- Below the answer: **"Send this to Sandeep"**. It fills the contact form with Reason "Freelance project" and the scope as the message, so the visitor only adds their name and email.
- A note says this is an AI estimate, not a quote.

## Guardrails
- Inputs have length limits, and each visitor can request a limited number of scopes per hour, which keeps AI costs down.
- The AI is told to stay on software project scoping, never promise prices or dates, and point to a call with you for anything firm.
- Clear messages appear if the AI is busy (try again shortly) or out of credits.

## Technical details
- Enable Lovable AI. A new backend function `scope-project` uses the AI SDK (`@ai-sdk/openai` `.responses`) with model `openai/gpt-6-astra` and reasoning effort `low`. It sends `store:false`, streams the answer and forwards the gateway run ID.
- Inputs are checked on the server (zod). A basic rate limit uses an IP-hash table `scope_requests`, which only the server can access (service role grants and RLS, no public access).
- Gateway 429/402/403 errors are passed through to the visitor with safe messages. There are no automatic retries.
- Frontend: `ProjectScoper` component streams the answer, renders it as markdown, and fills the contact form through a small shared store or event.
- One live test of the function before finishing.
