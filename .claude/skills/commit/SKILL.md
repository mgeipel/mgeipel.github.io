---
name: commit
description: Stage and commit current changes with an auto-generated commit message
allowed-tools: Bash(git *)
---

# Git Commit

## Current status

```!
git status
```

## Staged and unstaged diff

```!
git diff HEAD
```

## Instructions

1. Review the diff and status above.
2. If there are no changes, say so and stop.
3. Do NOT stage or commit files that look like secrets (`.env`, credentials, private keys).
4. Stage only the files relevant to the changes shown. Prefer naming files explicitly over `git add -A`.
5. Write a concise commit message (imperative mood, under 72 chars for the subject line) that focuses on _why_, not just _what_. Add a blank line and a short body if the change needs more context.
6. Create the commit using a HEREDOC so formatting is preserved:

```
git commit -m "$(cat <<'EOF'
<subject line>

<optional body>
EOF
)"
```

7. Run `git status` after the commit to confirm success.
8. Report what was committed in one sentence.

If `$ARGUMENTS` is non-empty, treat it as additional guidance or a hint for the commit message.
