# Move Validation Report — Two Floating OPSEC Skills

**Generated:** 2026-08-31 (session: security arsenal wiring)
**Scope:** validate (NOT yet execute) relocating two skills that float outside a sub-domain.
**Doctrine followed:** `security-arsenal/references/arsenal-maintenance.md` → "Physically moving …
validation gate" + "Cross-link breakage" + "Deep content validation BEFORE folder-in".

## The anomaly

| Skill | Current home | Category `skills_list` assigns | Problem |
|---|---|---|---|
| `pentest-egress-routing` | `skills/pentest-egress-routing/` | **(root of skills/)** | not even under `security/` |
| `online-anonymity-opsec` | `skills/security/online-anonymity-opsec/` | **`security`** (floats at umbrella root) | not in any sub-domain → renders as a bogus 1-skill `security` category |

Both are functionally discoverable already (wired into `security-arsenal` + bidirectional
`related_skills` this session). The move is **cosmetic taxonomy cleanup only** — it removes the
stray root-level `security: 1` category and pulls egress-routing under the umbrella.

## Proposed destinations

| Skill | → Destination | Rationale |
|---|---|---|
| `pentest-egress-routing` | `security/recon/pentest-egress-routing` | Network plumbing for the recon tools (web2-recon/osint/subdomain-probe) that live in `recon`. |
| `online-anonymity-opsec` | `security/_core/online-anonymity-opsec` | UNIVERSAL/domain-neutral (multi-account farming, persona, research, pentest — not just recon). `_core` is never-demoted → its description stays full-text visible in every domain, matching how broadly it's used. |

(Alternative: both → `recon` to keep the pair together. Folder ≠ access boundary either way.)

## Validation gates — ALL PASS

| Gate | Result |
|---|---|
| 1. Code/import graph | **pure-markdown** (0 .py, 0 .sh both) → no import to break |
| 2. Global name-collision at destination | none — target dirs don't exist yet |
| 3. External refs (cron/config/AGENTS.md/systemd) | none pin the path |
| 4. Path-style `](…/skill/…)` links to these | none — every ref is a **bare name** |
| 5. Internal `references/` links | same-dir relative → survive a whole-dir move |
| 6. Absolute tool paths inside egress skill (`~/.hermes/tools/security/tor/…`) | independent of skill location → move-safe |
| 7. Prompt snapshot cache | none present → cold-scan every prompt, no stale index |
| 8. by-NAME refs (`security-arsenal` table + flow, `web2-recon` prose, cross `related_skills`) | all resolve by name, path-independent → survive move |

## References that will keep working WITHOUT edits (name-based)
- `security-arsenal` specialist table rows + flow step-0 (bold names, not links)
- `web2-recon/references/local-recon-arsenal-paths.md` prose "see pentest-egress-routing"
- `pentest-egress-routing.related_skills` ↔ `online-anonymity-opsec.related_skills`

## What the move touches
- `shutil.move` two dirs. Nothing else — no link rewrites needed (no path-style refs exist).
- Post-move: re-run `validate_skill_tree.py --subtree security` → expect CLEAN, `security` root
  category gone, `recon` +1, `_core` +1 (or `recon` +2 if both go to recon).

## Rollback
Trivial — `shutil.move` back, or restore from a pre-move `tar`. No reference graph to unwind.

## Verdict
**SAFE to move.** Zero path-based references, zero collisions, pure-markdown, absolute tool paths
unaffected. This is a low-risk cosmetic relocation; the functional wiring is already done.
Awaiting operator go/no-go on destination choice.

---

## EXECUTED (2026-08-31) — option 1

Backup: `~/.hermes/skills-backup/opsec_preMove_20260831_200717.tar.gz` (2 SKILL.md, 7 files, verified).

Moves performed (`shutil.move`, no link rewrites needed):
- `pentest-egress-routing` → `security/recon/pentest-egress-routing` ✓
- `security/online-anonymity-opsec` → `security/_core/online-anonymity-opsec` ✓

Post-move verification battery — ALL PASS:
- `validate_skill_tree.py --subtree security`: **VERDICT CLEAN**, 150 skills, YAML/name 0, global collisions 0, links resolved 340, **REAL broken links 0**.
- Stray root category `security: 1` **GONE**; `recon` 7→8, `_core` 17→18.
- Both load by name via `skill_view` from new paths; frontmatter name == dir name.
- All 5 `online-anonymity-opsec` reference files survived the move.
- Global name-uniqueness across all 278 skills: no duplicates.
- `pentest-egress-routing` no longer floats at `skills/` root.
- Arsenal table rows + flow step-0 unchanged (name-based, path-independent) — still resolve.

