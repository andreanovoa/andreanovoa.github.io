# Project Conventions

## Git & GitHub Rules

- **Author:** All commits, pull requests, and branch names must attribute work to `andreanovoa` only. Never include references to Claude, AI, or any AI assistant in commit messages, PR titles, PR descriptions, or branch names.
- **Branch naming:** Use `feature/<short-description>` — never `claude/...` or any AI-named prefix.
- **Commit style:** Concise, present-tense messages describing what changed and why. No AI attribution footers.
- **PR descriptions:** Written as if authored by andreanovoa. No AI-generated disclaimers or tool references.

## Coding Conventions: Ponytail

Apply the **ponytail** approach to every coding task (writing, adding, refactoring, fixing, reviewing, choosing dependencies). Default intensity: **full**.

**The ladder — stop at the first rung that holds:**
1. Does this need to exist at all? Speculative need → skip it, say so in one line (YAGNI).
2. Already in this codebase? Reuse existing helpers/patterns before writing new ones.
3. Does the standard library do it?
4. Does a native platform feature cover it? (HTML/CSS over JS, Hugo built-ins over custom code)
5. Does an already-installed dependency solve it? Never add a new one for what a few lines can do.
6. Can it be one line?
7. Only then: the minimum code that works.

Read the task and trace the real flow before picking a rung — the ladder shortens the solution, never the understanding.

**Rules:**
- No unrequested abstractions, boilerplate, or scaffolding "for later."
- Deletion over addition; boring over clever.
- Bug fix = fix the root cause (all callers), not just the symptom the ticket names.
- Fewest files, shortest working diff — but only once the problem is understood.
- Mark deliberate simplifications with a `ponytail:` comment naming the known ceiling and upgrade path.

**Never simplify away:** input validation at trust boundaries, error handling that prevents data loss, security measures, accessibility basics, or anything explicitly requested.

**Output style:** code first, then at most three short lines on what was skipped and when to add it. No essays.

Full reference: https://github.com/DietrichGebert/ponytail/blob/main/skills/ponytail/SKILL.md

## Site Structure

This is a Hugo-based GitHub Pages site.

- `content/` — site content (Markdown)
- `data/` — structured data files
- `layouts/` — Hugo template overrides
- `assets/` — processed assets (CSS, JS)
- `static/` — unprocessed static files
- `hugo.yml` — Hugo configuration
