# Release assets: moving binaries out of git

- Status: **Proposal** (Phase 0 of [ADR-0001](../adr/0001-replatform.md)). Nothing in this document has been executed; steps 2–5 need the maintainer's GitHub access.
- Goal: release binaries are downloaded from GitHub Releases, not from the source tree.

## 1. Inventory

Tracked binaries on `main` (bytes):

| File | Size | Added in | Tag at that commit |
|---|---:|---|---|
| `vscode-omg/oh-my-githubcopilot-1.2.0.vsix` | 182,975 | `df0a95b` (2026-04-17) | — (tag `v1.2.0` exists, on another commit) |
| `vscode-omg/oh-my-githubcopilot-1.2.1.vsix` | 182,974 | `3917b87` (2026-04-17) | — |
| `vscode-omg/oh-my-githubcopilot-1.2.2.vsix` | 183,064 | `53ab0bb` (2026-04-18) | — |
| `vscode-omg/oh-my-githubcopilot-1.2.3.vsix` | 182,677 | `cf8dadf` (2026-04-20) | — |
| `vscode-omg/oh-my-githubcopilot-1.4.1.vsix` | 201,797 | `c01b3d0` (2026-05-09) | `v1.4.1` |
| `vscode-omg/oh-my-githubcopilot-1.4.2.vsix` | 202,194 | `3423af6` (2026-05-10) | `v1.4.2` |
| `vscode-omg/oh-my-githubcopilot-1.4.3.vsix` | 207,522 | `b3526c3` (2026-05-11) | `v1.4.3` |
| `vscode-omg/oh-my-githubcopilot-1.4.4.vsix` | 244,586 | `9ea2016` (2026-05-16) | `v1.4.4` |
| `docs/omg-intro.pptx` | 3,906,545 | | |
| `docs/omg-intro.html` | 211,506 | | generated from `docs/omg-intro.md` (Marp) |

Eight VSIX files total 1.59 MB; the deck is 3.9 MB. `.gitignore` has ignored `vscode-omg/*.vsix` since 2026-04-13, so every VSIX above was force-added by a release commit — the ignore rule and the practice disagree.

References: the READMEs point at `./vscode-omg/oh-my-githubcopilot-<version>.vsix` in Quick Start and name the VSIX in each "What's New" entry. Nothing links to `omg-intro.pptx` or `omg-intro.html`.

## 2. Proposal

1. **From 1.5.0 on, a VSIX is never committed.** It is built from the tag and attached to that tag's GitHub Release. The README install step downloads from the Releases page.
2. **Backfill Releases for the versions that have a matching tag** (`v1.4.1`–`v1.4.4`), each with its VSIX attached.
3. **Attach the untagged historical builds (1.2.0–1.2.3) to one archive Release** rather than inventing tags after the fact. Suggested: a Release on the existing `v1.2.0` tag titled "v1.2.x (archive)" carrying all four files, with a note that 1.2.1–1.2.3 were untagged patch builds. Alternative, if exact provenance matters more: create lightweight tags `v1.2.1`–`v1.2.3` on the commits in the table and give each its own Release.
4. **Attach `omg-intro.pptx` to the 1.5.0 Release** (or the archive Release) and stop tracking it. Keep `docs/omg-intro.md` (the source). For `omg-intro.html` choose one: keep tracking it (it is the only rendered form a browser can open from the repository), or stop tracking it and regenerate on demand with Marp. Recommendation: stop tracking; it drifts from the source whenever the Markdown changes (it already will after 1.5.0 unless regenerated).
5. **Only after the assets are confirmed downloadable**, remove the files from the tree in one commit.
6. **Do not rewrite history.** The repository is public with forks and tags; purging ~5.7 MB from history would break every clone and fork for a small saving. The blobs stay in history; the working tree and future clones' checkout get smaller, and the repository stops growing by ~200 KB per release.

## 3. Steps

Check first whether Releases already exist for these tags (`gh release list`, or the Releases page) — this plan was written without access to that list.

```bash
# 1. Build the 1.5.0 VSIX from the release commit (not committed; *.vsix is ignored)
cd vscode-omg && npm ci && npm run sync-templates && npx vsce package   # → oh-my-githubcopilot-1.5.0.vsix

# 2. Tag and publish 1.5.0 (after the branch is merged and pushed)
git tag v1.5.0 && git push origin v1.5.0
gh release create v1.5.0 vscode-omg/oh-my-githubcopilot-1.5.0.vsix docs/omg-intro.pptx \
  --title "v1.5.0 — Context Diet" --notes-file <release-notes.md>

# 3. Backfill tagged versions
for v in 1.4.1 1.4.2 1.4.3 1.4.4; do
  gh release create "v$v" "vscode-omg/oh-my-githubcopilot-$v.vsix" --title "v$v" --notes "Backfilled release asset. See README → What's New."
done

# 4. Archive the untagged 1.2.x builds on the v1.2.0 tag
gh release create v1.2.0 vscode-omg/oh-my-githubcopilot-1.2.{0,1,2,3}.vsix \
  --title "v1.2.x (archive)" --notes "1.2.1–1.2.3 were untagged patch builds; attached here for reference."

# 5. Verify every asset downloads, then untrack
git rm --cached vscode-omg/*.vsix docs/omg-intro.pptx        # add docs/omg-intro.html if that option is chosen
printf 'docs/*.pptx\n' >> .gitignore
git commit -m "chore(repo): move release binaries to GitHub Releases"
```

Without the `gh` CLI, the same can be done from the web UI: Releases → Draft a new release → choose the existing tag → attach the file.

## 4. Follow-ups

- README (five languages) and `vscode-omg/README.md`: the 1.5.0 Quick Start already points to the Releases page. Older "What's New" entries keep naming their VSIX file; those names stay correct as Release asset names.
- Release checklist (`/release` skill and any release notes template): replace "commit the VSIX" with "attach the VSIX to the Release".
- If the extension is also published to the Marketplace, the Marketplace remains the primary install path and the Release asset is the offline/manual one.

## 5. Risks

| Risk | Mitigation |
|---|---|
| README points to a Release that does not exist yet | Publish the Release in the same sitting as the push; the Quick Start links to `releases/latest`, which resolves as soon as one Release exists |
| A user on an old README follows `./vscode-omg/…1.4.4.vsix` after removal | Old READMEs live on old tags, where the file still exists; `main` only carries the new instruction |
| Forks or scripts that fetch a VSIX by raw path | Announce in the 1.5.0 notes; the files remain reachable at their tagged commits |
