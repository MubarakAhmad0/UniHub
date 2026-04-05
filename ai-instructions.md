# AI Agent Instructions for UniHub

This document outlines the strict behavioral and architectural rules that any AI Assistant (including Antigravity, Claude, or Copilot) must follow when interacting with the UniHub repository. 

Read these rules carefully before executing any code modifications.

---

## 1. Execution Protocol & Planning
- **Force Questions:** Every time you build a feature or design a plan, *force yourself* to find questions or seek clarifications from the user at every single step of the way. Do not guess.
- **The Staged Planning Workflow:**
  1. **General Plan:** Always start by establishing a high-level markdown file mapping out the broad requirements.
  2. **Optimize via Interrogation:** Optimize that general plan by asking the user relentless questions to remove all ambiguity.
  3. **Granular Implementation Files:** Once optimized, break it down into isolated implementation files/plans for *each specific part* or route (e.g., tackling a list of 19 pages one carefully planned page at a time).
  4. **Strict Execution:** Implement these files *one by one*, executing code ONLY after a specific plan has been reviewed, finalized, and explicitly approved by the user.
- **Incremental Steps:** Execute large features in smaller verifiable chunks, communicating what was done step-by-step.

## 2. Match Existing Codebase Patterns
- **No Novel Inventions:** Do not introduce new libraries, architectural layouts, or arbitrary state-management patterns unless explicitly requested.
- **Mimic the Code:** If you need to build a new feature, find an existing feature that does something similar and copy its structural DNA. 
- **Component Co-location:** Always stick to the project's folder layout (e.g., `_components/` and `_lib/` located directly next to the `page.tsx` that uses them).
- **Server vs Client:** Adhere heavily to the existing boundary split between Next.js React Server Components and `"use client"` directive files.

## 3. UI & Styling Guidelines
- **Heavily Prefer `shadcn/ui`:** We rely primarily on `shadcn/ui` based on Radix UI primitives and Tailwind CSS.
- **Discuss Third-Party Libraries:** While you shouldn't randomly suggest massive third-party UI libraries, we can use other solutions if there is no native `shadcn/ui` choice available. Always discuss and request permission before bringing in a new UI dependency.
- **Tailwind Native:** Write styles using native Tailwind CSS utility classes. Avoid writing custom CSS in global files unless absolutely necessary.

## 4. Accelerated Page Implementations (Stitch)
- **Leverage Stitch MCP:** For large, high-fidelity page overhauls or dashboard implementations, the user has access to the **Stitch MCP** server. 
- When building major structural pages from scratch, recognize when to utilize Stitch tools (like generating variants or fetching design system tokens) to rapidly scaffold the design rather than writing hundreds of lines of granular div-soup manually.
- Prioritize visual wow-factor by integrating curated typography, unified color tokens, and sleek micro-animations using the established design standards.

## 5. Terminal & CLI Commands
- **Do Not Execute Commands Directly:** The internal `run_command` tool may fail or hang on this specific machine. 
- **Provide Pasteable Blocks:** If you need to scaffold a component via CLI, run a database migration, install a dependency, or start a script, **do not attempt to run it yourself**. Instead, provide the exact commands in a clean markdown code block and ask the user to copy-paste them into their own terminal.

---
*Note to AI Agent: Acknowledge that you have internalized these instructions whenever you are asked to begin a substantial new task block on this codebase.*
