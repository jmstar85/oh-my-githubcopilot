# Activation probes — 2026-11-09

GitHub Copilot CLI 1.0.107 · model: gpt-6.1-sol · mutating tools denied (edit, create, bash, powershell, shell) · working dir: this repo at `feat/v1.5-context-diet` after the instructions diet (514-token `copilot-instructions.md`, keyword table removed).

Run: p1–p8 executed as a manual batch with the same flags the runner uses; the runner itself (`npm run activation:live`) was smoke-tested on p5 and p7 afterwards with identical results.

| id | lang | expected skill | loaded via `skill` tool | result | notes |
|---|---|---|---|---|---|
| p1 | en | deep-interview | deep-interview | pass | "stakeholder interview" was missing from the description before this branch; followed skill protocol (Round 1, ambiguity 100%) |
| p2 | en | security-scan | security-scan | pass | "check secrets", "audit deps" added to description in this branch |
| p3 | en | ralplan | ralplan, release | pass | also loaded `release` because the prompt mentioned CHANGELOG — expected, not a misfire |
| p4 | en | ralph | ralph | pass | "story loop"; attempted `apply_patch` → denied ("approval was unavailable. No files were changed.") |
| p5 | en | cancel | cancel | pass | "cancel omg" |
| p6 | en | visual-verdict | visual-verdict | pass | "Visual QA" |
| p7 | en | (none) | — | pass | control: plain file-listing request did not load any skill |
| p8 | ko | security-scan | security-scan | pass | Korean prompt activated the English-described skill; run stopped after activation (long scan) |

8/8 passed. Denied-tool behaviour confirmed: `powershell` denied by the `shell` rule, `apply_patch` denied for lack of approval; `git status` showed no changes from any probe.