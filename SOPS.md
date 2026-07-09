# Riscent — Standard Operating Procedures

Run these every time. Each item has a **check** (how you know it's done), and a tag:
`[CODE]` I can do in the repo · `[YOU]` needs a Google/Bing/etc. account only you control ·
`[VERIFY]` a test to run. No item is "done" without its check passing (Law IV: machine proof, not vibes).

Honest scope up front:
- **"Registered with Google"** = I ship the sitemap + the verification hook; **you** click verify in Search
  Console and submit the sitemap. I can't log into your Google account.
- **"Backlinks"** = earned, never manufactured. Link schemes get you penalized and don't move LLM answers.
  The playbook below is legit acquisition only. No PBNs, no paid link farms.
- **"#1 in search"** = your **brand name** is winnable and we'll own that SERP. Competitive **terms** are
  earned over months via content + citations + consensus — not guaranteed by anyone honest.

---

## SOP-1 · Ship (run on every deploy)

Technical SEO + GEO + security that must be true before `git push` to `main`.

1. **[VERIFY] Build is clean.** `npm run build` compiles + typechecks with no errors of *ours*
   (the `/docs/*` Clerk-prerender error is env-only and passes on Vercel).
   → check: "✓ Compiled successfully" + "Running TypeScript" with no type errors.
2. **[CODE] Every page has unique `<title>` + meta description** via the Next `metadata` export.
   → check: `curl -s <url> | grep -o '<title>.*</title>'` differs per route.
3. **[CODE] Canonical URL** set per page (`alternates.canonical`). → check: one `rel=canonical` per page.
4. **[CODE] OpenGraph + Twitter card** present with a real 1200×630 OG image.
   → check: paste the URL into opengraph.xyz — card renders with image. *(Gap today: confirm an OG image exists.)*
5. **[CODE] Structured data (JSON-LD)** on every meaningful page: `Organization` sitewide; `Service`/
   `Article`/`FAQPage`/`BreadcrumbList` where they apply.
   → check: Google Rich Results Test (search.google.com/test/rich-results) = 0 errors.
6. **[CODE] Sitemap covers exactly the live, indexable routes** (`src/app/sitemap.ts`).
   → check: every URL in `/sitemap.xml` returns **200** (no 404s, no redirects). Currently includes
   `/research` and `/thoughts` — confirm those exist or remove them.
7. **[CODE] robots.txt** allows the answer bots and points to the sitemap. *(Already correct — GPTBot,
   OAI-SearchBot, ClaudeBot, Claude-SearchBot, PerplexityBot, Google-Extended, Googlebot.)*
   → check: `/robots.txt` lists them + `Sitemap:` line.
8. **[CODE] Security headers present** (see SOP-3). → check: `curl -sI <url>` shows HSTS, X-Content-Type-Options,
   X-Frame-Options, Referrer-Policy, Permissions-Policy.
9. **[VERIFY] Core Web Vitals not regressed.** Lighthouse (or PageSpeed Insights) Performance ≥ 90 mobile.
   → check: LCP < 2.5s, CLS < 0.1, INP < 200ms on the homepage.
10. **[VERIFY] Above-the-fold fits + renders in light and dark, mobile + desktop.** → check: screenshot at
    390px and 1366px; hero statement visible without scroll.

## SOP-2 · Search & LLM visibility (once per site, then monthly)

Getting found by Google **and** by the models. Ordered; each step compounds the next (see the field guide).

**One-time setup**
1. **[YOU] Google Search Console** — add `riscent.com` as a *Domain* property, verify via DNS TXT (best) or
   the `verification.google` meta tag I already stubbed in `layout.tsx`. Then **submit `/sitemap.xml`**.
   → check: property shows "Ownership verified" + sitemap status "Success".
2. **[CODE] Replace the verification placeholders** in `src/app/layout.tsx` (`REPLACE_WITH_GOOGLE_...`,
   `REPLACE_WITH_BING_...`) with the real codes you get in step 1. → check: view-source shows the real code.
3. **[YOU] Bing Webmaster Tools** — add + verify (feeds Copilot). Import from Search Console in one click.
   → check: verified + sitemap submitted.
4. **[YOU] Entity establishment** — the highest-leverage, most durable move (Wikipedia is ~0.6% of tokens
   but weighted 3–5× in training). Create/claim: **Wikidata** item, **Google Business Profile**,
   **Crunchbase**, **LinkedIn company page**, and the 2–3 authoritative directories in AI/consulting.
   Consistent name, founder, category, URL everywhere. → check: a Knowledge Panel renders on a brand search;
   you have a Wikidata Q-id.

**GEO content (the tactics that measurably move AI citations — Princeton GEO, KDD 2024, up to +40%)**
5. **[CODE] Lead every key page with a direct 40–60-word answer** to its core question, right under the H1
   (44% of AI citations come from the first third of a page). → check: paste the question into a browsing
   model — it quotes your opening.
6. **[CODE] Cite sources, add statistics, add quotations, attribute claims to named experts with credentials**
   (expert attribution was the single highest-impact tactic, +40.9%). → check: each key claim has a stat or a
   named source.
7. **[CODE] Ship `llms.txt` for the docs** (already present) — this wins *coding-agent* readership, not
   search. Don't sell it as a ranking lever (97% of llms.txt files are never fetched by any AI bot).

**Earned consensus (this is what actually decides which company a model names)**
8. **[YOU] Multi-source corroboration.** Models infer authority from agreement across the *whole* web, not your
   own page. Earn mentions/citations from: industry publications (digital PR / HARO / podcasts), review
   platforms (G2, Clutch, Trustpilot), Reddit/YouTube where models retrieve, and reputable directories.
   → check: you're named on ≥5 independent authoritative domains you don't control.
9. **[YOU] Rank in Google *and* Bing for the buyer's questions** (both feed AI Overviews / Copilot / ChatGPT &
   Claude browsing). → check: page one on both for your top 3 terms.

**Measure (monthly)**
10. **[VERIFY] Ask ChatGPT, Gemini, Claude (browsing on) your buyer's question** — are you named + cited?
    With browsing **off**, re-test on each new model release — an unprompted mention from a fresh cutoff is the
    real "you're in the training data" signal. Track brand-mention share over time.

## SOP-3 · Security (every deploy + monthly)

1. **[CODE] Security headers** on all routes (`next.config.ts`): HSTS (preload), `X-Content-Type-Options:
   nosniff`, `X-Frame-Options: SAMEORIGIN`, `Referrer-Policy`, `Permissions-Policy`, `poweredByHeader:false`.
   → check: `curl -sI https://riscent.com | grep -iE 'strict-transport|x-content-type|x-frame|referrer|permissions'`.
2. **[VERIFY] Score the headers.** → check: securityheaders.com grade **A** (or A+ once CSP lands);
   Mozilla Observatory pass.
3. **[CODE] Content-Security-Policy — staged.** Add CSP **Report-Only** first (won't break anything),
   allowlisting Clerk + Vercel + framer/inline, collect violations for a week, then flip to enforce.
   → check: Report-Only header present with a report endpoint; 0 unexpected violations before enforcing.
4. **[VERIFY] No secrets in the repo or client bundle.** → check: `git grep -iE 'sk_live|api[_-]?key|secret|
   password' -- ':!*.md'` returns nothing real; env vars only in Vercel, never `NEXT_PUBLIC_*` for secrets.
5. **[VERIFY] Dependencies clean.** → check: `npm audit --production` has no high/critical; Dependabot on.
6. **[CODE] Auth routes protected** (`src/middleware.ts` / Clerk) — no unauthenticated access to gated pages.
   → check: hit a protected route logged-out → redirect, not data.
7. **[VERIFY] HTTPS-only, HSTS, valid cert.** → check: SSL Labs grade A; http → https redirect.
8. **[VERIFY] No PII/PHI or verbose stack traces in logs or error pages.** → check: 404/500 pages are clean;
   server logs scrubbed.

---

**Definition of done:** a deploy is "done" only when SOP-1 + SOP-3 checks pass and are captured (log the
command output). SOP-2 human steps are tracked separately and reviewed monthly. Update this file when the
process changes — it's the source of truth, and it's meant to be executed, not admired.
