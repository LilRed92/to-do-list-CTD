---
name: sm
description: Stage all project files with `git add .` and generate a commit message following .agents/.ai-commit-rules.txt for user approval before committing.
---

# sm: Stage & Message Workflow

"sm" = **S**tage + **M**essage.

## Steps

1. **Stage** — Run `git add .`. ONLY this command. Never enumerate individual file paths.
2. **Read commit rules** from `.agents/.ai-commit-rules.txt`.
3. **Run `git status`** and `git diff --cached` to inspect everything now staged.
4. **Draft a commit message** strictly following all rules in `.ai-commit-rules.txt`:
   - Subject ≤ 50 characters
   - One emoji at the start of the subject
   - Bulleted body if the diff has sufficient context
   - Professional, technical tone
   - Ignore tooling/env files unless they are the only change
5. **Present the draft commit message** to the user for approval. Do NOT commit yet.

## Notes

- **ONLY use `git add .`** for staging. This is non-negotiable. Never enumerate individual file paths.
- `.gitignore` handles exclusions automatically. Do not attempt to replicate or override its logic by listing files manually.
- Never wrap the commit message in markdown code fences when passing it to `git commit -m`.
- After presenting the message, prompt the user to type `cp` to commit and push.
