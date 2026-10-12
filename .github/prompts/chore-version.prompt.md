---
name: chore-version
description: "Prepare a semantic version upgrade, update changelog.md, validate the release metadata, and create an isolated chore commit."
argument-hint: "Bump type (patch, minor, or major) and optional release summary"
agent: "agent"
---

Prepare a version upgrade for this repository and create one Conventional Commit with type `chore`.

1. Inspect `package.json`, `changelog.md`, the lockfiles, recent Git history, and the complete working-tree and index status before changing anything. Treat staged and unstaged user changes as user-owned. Never discard, overwrite, or include unrelated changes in the release commit.
2. Review the changes that are intended for this release. Use the requested bump type (`patch`, `minor`, or `major`) if provided. Otherwise infer the smallest appropriate semantic version increment from the actual changes and explain the choice. If the release scope or intended changes are ambiguous, ask before editing.
3. Calculate the next version from the current `package.json` version. Do not change dependency versions, application behavior, or release configuration as part of this task.
4. Update the root version in `package.json` and update only lockfile metadata that records that root package version. Preserve dependency resolutions and do not delete either lockfile just because both npm and Yarn lockfiles exist.
5. Add a dated version section to [changelog.md](../../changelog.md) above older entries. Summarize only verified changes from the release scope, grouped under the relevant Keep a Changelog headings (`Added`, `Changed`, `Deprecated`, `Removed`, `Fixed`, `Security`). Do not invent changes; if there are no user-facing or technical changes to describe, state that briefly.
6. Check the diffs for every release file, verify the package and lockfile versions are consistent where applicable, and run the narrowest available validation. Do not claim validation passed unless it ran successfully.
7. Stage and commit only the version and changelog files changed for this operation, plus a lockfile only if its root version metadata needed updating. If any of those files already contain user changes, stop and ask before modifying them. Leave unrelated staged and unstaged changes untouched and out of the commit.
8. Create exactly one commit with message `chore: bump version to X.Y.Z`, using the calculated version. Do not create a Git tag, push, publish, or deploy.

Report the old and new versions, the changelog summary, checks run, and the resulting commit hash. If any step cannot be completed safely, stop before committing and explain the blocker.
