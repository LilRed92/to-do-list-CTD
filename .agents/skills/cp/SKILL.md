---
name: cp
description: Triggered when the user approves a pending commit message. Commits with the approved message and pushes to the remote.
---

# cp: Commit & Push Workflow

"cp" = **C**ommit + **P**ush.

This skill is triggered after the user approves a commit message drafted by the `sm` skill. Files are already staged — do NOT run `git add .` again.

## Steps

1. **Commit** — Run `git commit -m "<approved message>"` using the exact message the user approved. Never alter the message. Never wrap it in markdown code fences.
2. **Push** — Run `git push` to send the commit to the configured remote and branch.
3. **Confirm** — Report the output of both commands so the user can verify the push succeeded (remote URL, branch, and commit SHA).

## Notes

- Do NOT run `git add .` — files are already staged from the `sm` step.
- Do not modify, rephrase, or truncate the approved commit message in any way.
- If `git push` fails (e.g., no upstream set), run `git push --set-upstream origin <current-branch>` and report the result.
