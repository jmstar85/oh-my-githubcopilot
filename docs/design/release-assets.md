# Release assets: moving binaries out of git

- Status: **Accepted in part, not yet executed** (Phase 0 of [ADR-0001](../adr/0001-replatform.md)). The maintainer's decisions of 2026-11-11 are marked in §2. Nothing in §3 has been run; every step there needs the maintainer's GitHub access.
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

Existing GitHub Releases (public API, checked 2026-11-11):

| Release | Assets |
|---|---|
| `v1.4.1`, `v1.4.2`, `v1.4.3`, `v1.4.4` | The matching VSIX each, with the same SHA-256 as the tracked file |
| `v1.4.0`, `v1.3.1` | `oh-my-githubcopilot-1.4.0.vsix`, `oh-my-githubcopilot-1.3.1.vsix` (never tracked in the tree) |
| `v1.2.0`, `v1.1.8`, `v1.1.0` | None |

The tagged 1.4.x builds are therefore already downloadable. Only the four 1.2.x files and the deck exist nowhere but in git.

## 2. Proposal and decisions

1. **From 1.5.0 on, a VSIX is never committed.** It is built from the tag and attached to that tag's GitHub Release. The README install step downloads from the Releases page. — **Decided 2026-11-11.**
2. ~~Backfill Releases for `v1.4.1`–`v1.4.4`.~~ **Not needed:** those Releases already carry the identical files (§1).
3. **Attach the untagged historical builds (1.2.0–1.2.3) to one archive Release** rather than inventing tags after the fact. — **Decided 2026-11-11:** all four files go on the `v1.2.0` Release, with a note that 1.2.1–1.2.3 were untagged patch builds. That Release already exists (no assets), so this is an upload to it, not a new Release; retitling it "v1.2.x (archive)" is optional.
4. **Open — `omg-intro.pptx` and `omg-intro.html`.** Proposal: attach the deck to a Release and stop tracking it, keeping `docs/omg-intro.md` (the source). For `omg-intro.html` choose one: keep tracking it (it is the only rendered form a browser can open from the repository), or stop tracking it and regenerate on demand with Marp. Recommendation: stop tracking; it drifts from the source whenever the Markdown changes. Both files are currently behind `omg-intro.md`, so regenerate them before attaching either to the 1.5.0 Release. Does not block 1.5.0.
5. **Only after the assets are confirmed downloadable**, remove the files from the tree in one commit.
6. **Do not rewrite history.** The repository is public with forks and tags; purging ~5.7 MB from history would break every clone and fork for a small saving. The blobs stay in history; the working tree and future clones' checkout get smaller, and the repository stops growing by ~200 KB per release.

## 3. Steps

Run by the maintainer, in this order. The README on `main` links to `releases/latest`, so do steps 1–3 in one sitting.

```bash
# 1. Publish the release commit on main (fast-forward while main has not moved; otherwise merge a PR)
git switch main && git merge --ff-only feat/v1.5-context-diet && git push origin main

# 2. Build the 1.5.0 VSIX from that commit (not committed; *.vsix is ignored)
cd vscode-omg && npm ci && npm run sync-templates && npx vsce package && cd ..   # → vscode-omg/oh-my-githubcopilot-1.5.0.vsix
git status --short                                                               # must print nothing

# 3. Tag and publish 1.5.0 (v1.4.1, v1.4.2 and v1.4.4 are annotated tags)
git tag -a v1.5.0 -m "v1.5.0 — Context Diet" && git push origin v1.5.0
gh release create v1.5.0 vscode-omg/oh-my-githubcopilot-1.5.0.vsix \
  --title "v1.5.0 — Context Diet" --notes-file <release-notes.md>

# 4. Archive the untagged 1.2.x builds on the existing v1.2.0 Release
gh release upload v1.2.0 vscode-omg/oh-my-githubcopilot-1.2.{0,1,2,3}.vsix
#    then append to its notes: "1.2.1–1.2.3 were untagged patch builds; attached here for reference."

# 5. Verify every asset downloads, then untrack the VSIX files in a follow-up commit
git rm --cached vscode-omg/*.vsix
git commit -m "chore(repo): move release binaries to GitHub Releases"
```

Without the `gh` CLI, steps 3 and 4 work from the web UI. For 1.5.0: Releases → Draft a new release → type `v1.5.0` under "Choose a tag" (target `main`; publishing creates the tag, so skip `git tag`) → attach the VSIX → Publish. For 1.2.x: Releases → `v1.2.0` → Edit → attach the four files, add the note → Update release.

`*.vsix` under `vscode-omg/` is already ignored, so step 5 needs no `.gitignore` change. The deck (§2, item 4) is left tracked until that item is decided.

## 4. Follow-ups

- README (five languages) and `vscode-omg/README.md`: the 1.5.0 Quick Start already points to the Releases page. Older "What's New" entries keep naming their VSIX file; those names stay correct as Release asset names.
- Release checklist: the `/release` skill has no "commit the VSIX" step, so it needs no change; any personal checklist should say "attach the VSIX to the Release" instead.
- If the extension is also published to the Marketplace, the Marketplace remains the primary install path and the Release asset is the offline/manual one.

## 5. Risks

| Risk | Mitigation |
|---|---|
| README points to a Release that does not exist yet | Publish the Release in the same sitting as the push; the Quick Start links to `releases/latest`, which resolves as soon as one Release exists |
| A user on an old README follows `./vscode-omg/…1.4.4.vsix` after removal | Old READMEs live on old tags, where the file still exists; `main` only carries the new instruction |
| Forks or scripts that fetch a VSIX by raw path | Announce in the 1.5.0 notes; the files remain reachable at their tagged commits |
