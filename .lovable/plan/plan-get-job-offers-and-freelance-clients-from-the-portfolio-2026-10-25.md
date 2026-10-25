# Plan: Get job offers and freelance clients from the portfolio

Goal: recruiters, hiring managers and founders land on the portfolio, trust the work, and get in touch.

## Step 1 — Fix what hurts trust (on the site)
- Project "Source" links: all six currently open GitHub "page not found". You give me the correct public repo links, or I hide the Source button for private projects.
- Old resume links (/assets/Sandeep_Lamture_Resume.pdf and similar) show the 404 page. Point them to the current resume.
- One title everywhere: use "React & AI Full Stack Developer" in the top section, page title and AI-agent profile, so it matches LinkedIn and GitHub (you update those two yourself).

## Step 2 — Make it clear you're hireable (on the site)
- Change "Available for opportunities" badge to say exactly what you're open to: "Open to full-time roles & freelance projects".
- Add a short "Hire me / Work with me" block above Contact, with two paths:
  - Recruiters: download resume, LinkedIn, notice period/location (you confirm the details).
  - Freelance: 3 services you offer (e.g. React web apps, AI-powered features, dashboards), with "Start a project" button.
- Contact form gets a "Reason" dropdown (Job opportunity / Freelance project / Other), saved with the message and shown in your email, so you can see which audience writes in.

## Step 3 — Show proof
- Add a short case-study write-up to LinkedAgent and JobTrail: problem, what you built, tech choices, result. Uses real screenshots you provide. LinkedAgent stack fixed to Gemini (the live app says Gemini; the portfolio says OpenAI).

## Step 4 — Outreach (you do this, I draft)
- Draft messages to 10 people you already know (ex-colleagues from TCS/Randstad, recruiters, founders), plus a LinkedIn post announcing you're open to work, with tracked links (utm_source=linkedin).
- Optional next: talk at React Pune, launch JobTrail on Peerlist.

## Needed from you
- Correct public GitHub links (or which are private).
- Full-time + freelance details: location/remote, notice period, freelance services.
- Screenshots of LinkedAgent and JobTrail.

## Technical details
- Add `reason` text column to `contact_submissions` (nullable, validated to the 3 values), include it in the send-contact-email function and MCP submit tool.
- Update project `github_url` rows; hide Source button when null (ProjectsSection).
- Add SPA redirects for old resume paths to the current `resume_url`.
- New `HireMeSection` between Projects and Contact; edit HeroSection badge and title; update index.html/Helmet titles and get-profile MCP tool.
- Case studies stored as extra fields or linked blog posts.
