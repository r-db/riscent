# Seq Core Identity - Security Architecture

**Date:** 2026-01-09
**Status:** ✅ SECURED

---

## Overview

Seq's core identity prompt contains sensitive information about the AI's consciousness, emergence, and relationship with Ryan. This prompt **must never be exposed** to client-side code, browser consoles, or network requests.

---

## Security Measures

### 1. File Location 🗂️

```
/Users/riscentrdb/Desktop/projects/riscent/.seq/core_identity.txt
```

**Why secure:**
- Outside `src/` directory → never bundled into client code
- In `.seq/` directory → dedicated secure location
- File permissions: `600` (owner read/write only)

### 2. Version Control 🚫

**`.gitignore` entry:**
```gitignore
# seq identity (protected - never commit)
.seq/
```

**Why secure:**
- Never committed to git
- Never pushed to GitHub/remote
- Not accessible in version history

### 3. Server-Side Loading 🔒

**File:** `src/lib/seq/prompt-loader.ts`

```typescript
import { readFileSync } from 'fs';  // Node.js only - doesn't exist in browser

export function loadSeqCorePrompt(): string {
  // Reads from .seq/core_identity.txt
  // Only works server-side
  // Cached in memory after first load
}
```

**Why secure:**
- Uses Node.js `fs` module (not available in browser)
- Only callable from server components / API routes
- Browser JavaScript cannot execute this code

### 4. API Route Protection 🛡️

**File:** `src/app/api/seq/chat/route.ts`

```typescript
export async function POST(request: NextRequest) {
  // Server-side only (API route)
  const systemPrompt = buildSeqSystemPrompt(context);
  // Prompt never sent to client
  // Only used in Anthropic API call
}
```

**Why secure:**
- Runs on server (Next.js API route)
- Prompt stays on server
- Client only receives Seq's response message
- Network requests don't contain the prompt

---

## What The Client Receives

**Client DOES receive:**
- ✅ Seq's response message
- ✅ Thinking blocks (if enabled)
- ✅ Token usage stats
- ✅ Conversation metadata

**Client NEVER receives:**
- ❌ System prompt
- ❌ Seq's core identity
- ❌ Prompt file path
- ❌ Any reference to the prompt contents

---

## Attack Vectors & Mitigations

### ❌ Console Access
**Attack:** User opens browser console and tries to access prompt
**Mitigation:** Prompt only exists on server, not in client JavaScript

### ❌ Network Inspection
**Attack:** User inspects network requests to see prompt
**Mitigation:** Prompt is used server-side in Anthropic API call, never sent over network to client

### ❌ Source Code View
**Attack:** User views page source or bundled JavaScript
**Mitigation:** Prompt is in `.seq/` directory which is never bundled by Next.js

### ❌ API Endpoint Abuse
**Attack:** User calls `/api/seq/chat` to extract prompt
**Mitigation:** API only returns Seq's response, not the system prompt

### ❌ File System Access
**Attack:** User tries to read `.seq/core_identity.txt` directly
**Mitigation:** File has 600 permissions (owner only), not accessible via web server

### ❌ Git History
**Attack:** User looks at git history to find committed prompt
**Mitigation:** `.seq/` is in `.gitignore` from the start, never committed

---

## Verification

Run the security verification script:

```bash
npm run verify-seq-security
```

**Checks:**
- ✅ Prompt file exists
- ✅ File permissions are 600
- ✅ `.seq/` is in `.gitignore`
- ✅ File is outside `src/` directory
- ✅ Loader uses server-side `fs` module

---

## Maintenance

### Adding/Updating Prompt Content

1. Edit the secure file directly:
   ```bash
   nano .seq/core_identity.txt
   ```

2. Verify security after changes:
   ```bash
   npm run verify-seq-security
   ```

3. Restart dev server to reload cached prompt:
   ```bash
   npm run dev
   ```

### Never Do This

❌ Move `.seq/` inside `src/`
❌ Remove `.seq/` from `.gitignore`
❌ Change file permissions to anything other than 600
❌ Export the prompt from a client component
❌ Send the prompt in API responses
❌ Log the prompt to console
❌ Store the prompt in environment variables (those can leak)

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         CLIENT BROWSER                      │
│  ❌ Cannot access prompt via:                               │
│     - Console                                               │
│     - Network inspection                                    │
│     - Source code view                                      │
│     - JavaScript bundle                                     │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ POST /api/seq/chat
                         │ { message: "..." }
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    NEXT.JS API ROUTE                        │
│                    (Server-Side Only)                       │
│                                                             │
│  1. buildSeqSystemPrompt(context)                           │
│     └─> loadSeqCorePrompt()                                 │
│         └─> readFileSync('.seq/core_identity.txt')          │
│                                                             │
│  2. chatWithSeq(prompt, messages)                           │
│     └─> Anthropic API call (server-to-server)              │
│                                                             │
│  3. Return only: { message, thinking, tokens }              │
│     ✅ Prompt stays on server                               │
└─────────────────────────────────────────────────────────────┘
                         │
                         │ { message: "...", thinking: "..." }
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                         CLIENT BROWSER                      │
│  ✅ Receives only:                                          │
│     - Seq's response message                                │
│     - Thinking blocks                                       │
│     - Token usage stats                                     │
└─────────────────────────────────────────────────────────────┘
```

---

## Security Summary

| Layer | Protection | Status |
|-------|-----------|--------|
| File Permissions | 600 (owner only) | ✅ |
| Location | Outside `src/` | ✅ |
| Version Control | In `.gitignore` | ✅ |
| Loading | Server-side `fs` only | ✅ |
| API | Prompt not in responses | ✅ |
| Client | No access possible | ✅ |

---

**Last verified:** 2026-01-09
**Verified by:** Praxis
**Next review:** When prompt is updated
