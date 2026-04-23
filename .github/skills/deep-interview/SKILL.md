---
name: deep-interview
description: >
  Socratic deep interview with mathematical ambiguity gating.
  Activate when user says: deep interview, interview me, ask me everything,
  don't assume, make sure you understand, ouroboros, socratic,
  I have a vague idea, not sure exactly what I want.
argument-hint: "[--quick|--standard|--deep] <idea or vague description>"
---

# Deep Interview

Ouroboros-inspired Socratic questioning with mathematical ambiguity scoring. Replaces vague ideas with crystal-clear specifications by asking targeted questions that expose hidden assumptions.

## Pipeline
`deep-interview` → `ralplan` (consensus refinement) → `omg-autopilot` (execution)

## When to Use
- User has a vague idea and wants thorough requirements gathering
- Task is complex enough that jumping to code would waste cycles
- User wants mathematically-validated clarity before execution

## When NOT to Use
- Detailed specific request with file paths → execute directly
- Quick fix → delegate to @executor or `/ralph`
- User says "just do it" → respect their intent

## Interactive Hook Protocol

**MANDATORY**: Use `vscode_askQuestions` for ALL user-facing questions in this skill (when available).
If `vscode_askQuestions` is NOT available (e.g., Copilot CLI), present numbered options in markdown and ask the user to respond with a number or freeform text.
This ensures structured input collection with selectable options, consistent UX, and clear decision tracking.

### When to Fire Hooks
| Trigger Point | Question Type | Options Required |
|---------------|---------------|------------------|
| Phase 2 each round | Ambiguity-targeted question | 3-5 options + freeform |
| Phase 3 challenges | Assumption validation | Yes/No + "It depends..." |
| Phase 4 spec review | Confirm crystallized spec | Approve / Revise / Add constraints |
| Phase 5 execution bridge | Choose next workflow | 5 predefined options |

### Hook Format Rules
- **header**: Short unique ID, e.g. `"interview-round-3"`, `"spec-approval"`
- **question**: The Socratic question targeting the weakest clarity dimension
- **options**: Provide 3-5 selectable answers that represent likely user intents
  - First option: most common/expected answer (mark as `recommended`)
  - Last option: always include an "Other / Let me explain..." escape hatch
- **allowFreeformInput**: Always `true` — user can override any option with their own words
- After receiving the answer, score ambiguity immediately and report progress

### Example Hook Call
```
vscode_askQuestions([{
  header: "goal-scope",
  question: "What's the primary output you expect? (Ambiguity: 72% → targeting Goal Clarity)",
  options: [
    { label: "A working CLI tool", recommended: true },
    { label: "A library/SDK for other developers" },
    { label: "A web application with UI" },
    { label: "A background service/daemon" },
    { label: "Other / Let me explain..." }
  ],
  allowFreeformInput: true
}])
```

## Phases

### Phase 1: Initialize
1. Parse the user's idea
2. Detect brownfield vs greenfield (use @explore to check codebase)
3. For brownfield: map relevant codebase areas
4. Initialize ambiguity score at 100%

### Phase 2: Interview Loop
Repeat until ambiguity <= 20% or user exits early:

1. **Generate question** targeting the WEAKEST clarity dimension
2. **HOOK: Ask ONE question via `vscode_askQuestions`** with:
   - Current ambiguity score in the question text
   - 3-5 contextual options derived from codebase analysis and prior answers
   - `allowFreeformInput: true` always
3. **Score ambiguity** across dimensions after receiving answer:
   - Goal Clarity (40% weight for greenfield, 35% brownfield)
   - Constraint Clarity (30% / 25%)
   - Success Criteria (30% / 25%)
   - Context Clarity (N/A / 15% for brownfield)
4. **Report progress** with dimension scores and gaps
5. **Track ontology** (key entities, stability ratio)

### Phase 3: Challenge Agents
- Round 4+: **Contrarian** - challenge core assumptions
  - **HOOK**: Present assumption + counter-argument, ask user to confirm/revise via `vscode_askQuestions`
- Round 6+: **Simplifier** - probe for complexity removal
  - **HOOK**: Present simplification options, ask user which can be dropped
- Round 8+: **Ontologist** - find the essence (if ambiguity > 30%)

### Phase 4: Crystallize Spec
When ambiguity <= threshold, generate spec to `.omg/specs/deep-interview-{slug}.md`:
- Goal, Constraints, Non-Goals, Acceptance Criteria
- Assumptions Exposed & Resolved
- Ontology (Key Entities) with convergence tracking
- Interview Transcript
- **HOOK: Spec approval** — present spec summary via `vscode_askQuestions`:
  ```
  header: "spec-approval"
  question: "Review the crystallized spec. Ready to proceed?"
  options: [Approve & continue, Revise specific sections, Add more constraints, Restart interview]
  ```

### Phase 5: Execution Bridge
**HOOK: Present execution options** via `vscode_askQuestions`:
```
header: "execution-bridge"
question: "Spec is complete (ambiguity: X%). Choose execution path:"
options: [
  { label: "Ralplan → OMG Autopilot", description: "Consensus-refine then execute", recommended: true },
  { label: "Execute with omg-autopilot", description: "Skip ralplan, direct execution" },
  { label: "Execute with ralph", description: "Persistence loop" },
  { label: "Execute with team", description: "Parallel agents" },
  { label: "Refine further", description: "Continue interviewing" }
]
```

## Rules
- Ask ONE question at a time
- **Use `vscode_askQuestions` for user-facing questions** when available; in CLI, present numbered markdown options
- Target the WEAKEST clarity dimension each round
- Gather codebase facts via @explore BEFORE asking user
- Score ambiguity after every answer
- Do not proceed until ambiguity <= threshold (default 20%)
- Hard cap at 20 rounds, soft warning at 10
- Include ambiguity % in every question's text so user sees progress
