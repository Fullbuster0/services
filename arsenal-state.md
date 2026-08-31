# ARSENAL STATE — Session Reset Checkpoint
**Saved:** 2026-07-xx | **Next session:** Load this to resume

## What's Done

### Reorganization: 131 skills → 9 sub-domains
All under `~/.hermes/skills/security/`:

| Sub-domain | Count | Key skills |
|---|---|---|
| `_core` | 15 | bb-methodology, exploit-to-confirm, triage-validation, verifier-agent |
| `ai` | 2 | ai-ml-security, llm-prompt-injection |
| `binary` | 8 | kernel-exploitation (PROMOTED), heap-exploitation, rop, format-string |
| `infra` | 18 | linux-lateral-movement (PROMOTED), AD-kerberos, AV-evasion, tunneling, pivoting |
| `mobile` | 4 | android-pentesting, ios-pentesting, mssl-pinning |
| `recon` | 6 | web2-recon, shodan, spring-boot-recon |
| `tooling` | 5 | burp-suite, godmode, whitehat-audit-toolkit |
| `web` | 50 | sqli, xss, ssrf, race-condition, graphql, jwt, waf-bypass, prototype-pollution |
| `web3` | 23 | alpenglow-audit, solana, sui, cosmwasm, consensus, meme-coin-audit |

### Dead Links: 40 fixed
- 8 GONE → repointed to active equivalents
- 9 PROMOTED (library→active)
- 3 CTF-crypto + SAML → clean-ref pointers
- 7 library-only refs (AD-CS, ntlm-relay, pcap) → clean-ref pointers

### Promoted Skills (9)
- `kernel-exploitation` → `security/binary/`
- `linux-security-bypass` → `security/infra/`
- `linux-lateral-movement` → `security/infra/`
- `windows-av-evasion` → `security/infra/`
- `active-directory-kerberos-attacks` → `security/infra/`
- `tunneling-and-pivoting` → `security/infra/`
- `windows-lateral-movement` → `security/infra/`
- `active-directory-acl-abuse` → `security/infra/`
- `network-protocol-attacks` → `security/infra/`

All cross-links rewritten (`../../`), YAML flattened, glued-fence fixed.

### Verification Gates: ALL PASSED
- Broken .md links: 0
- YAML parse errors: 0
- Glued-fence: 0
- Empty desc: 0
- name≠dir: 0
- Global name collision: 0
- `skills_list`: 131 readable
- `skill_view` by-name: resolves across all sub-domains ✅
- Subagent index: shows all 9 sub-domains ✅
- `skills_list(category="security/web")`: **50** — FIXED (was 0)

## Core Bug — skills_list Sub-domain Filter — FIXED
**Location:** `~/.hermes/hermes-agent/tools/skills_tool.py`
**Was:** `_get_category_from_path()` returned `parts[0]` (top-level only) → nested
sub-domains collapsed to "security", so `skills_list(category="security/web")`
exact-matched nothing → 0. This disagreed with `prompt_builder._build_snapshot_entry`
(which already used `parts[:-2]` → nested path in the system-prompt index).
**Fix (2 parts, both narrow):**
1. `_get_category_from_path` now returns `"/".join(parts[:-2])` → full nested
   category ("security/web", "mlops/evaluation"). Mirrors prompt_builder exactly.
2. `skills_list` category filter is now boundary-prefix aware: matches exact
   category OR any descendant under `category + "/"`. So:
   - `security` → 131 (all sub-domains)
   - `security/web` → 50 (NOT the sibling security/web3)
   - `security/web3` → 23
   - `mlops/evaluation` → 2
**Blast radius checked:** only 2 consumers of the returned category —
`skills_list` filter (fixed) and the `categories` set it exposes (now nested,
correct). `_create_skill` write-path validation is independent (rejects `/`,
unchanged). Website `_guess_category` is tag-based, unrelated.
**Verification:** full test suite green — 282 skill/category tests pass,
incl. 5 new regression tests (nested path, deep nest, sub-domain filter,
boundary-not-prefix, parent-returns-all). Fresh-subprocess E2E confirms all
counts above. Live in-process `skills_list` tool reflects after next gateway
restart (Python module cache); source + subprocess already correct.

## Outliers — 16 audit/security skills OUTSIDE the security/ umbrella
**Found:** 2026-08-30 review. `security/` umbrella = 131, but 16 more
audit/security skills live in OTHER top-level categories → real
security-related total = **147**, not 131.

| Origin folder | Count | Skills |
|---|---|---|
| `defensive-security/` | 12 | manual-review-engine, manual-review-training, audit-finding-patterns, audit-completion-protocol, openzeppelin-audit-patterns, smart-contract-audit-tooling, solidity-invariant-verification, formal-verification-tooling, standalone-audit-project, onchain-contract-verification, wallet-drainer-analysis, bug-bounty-submission |
| `defi/` | 3 | onchain-security-toolkit, solidity-audit-toolchain, flash-loan-arb |
| `smart-contract-audit-techniques/` | 1 | smart-contract-audit-techniques (uncategorized — SKILL.md at folder root, not `<cat>/<name>/`) |

**Move-safety validated (fresh):**
- Name collision vs the 131 umbrella skills: **NONE**.
- Cross-ref / broken-link risk: only 1 mention in `security/web3/audit-tooling-pitfalls`
  (`related_skills:` by-name + a prose LIGHT-ZIP note) — both by-name, do NOT
  break on a folder move.

**Nature of the 16 (NOT pentest — these are code/contract AUDIT):**
- **13 = smart-contract / Solidity audit** → candidate for a new `security/audit`
  sub-domain (methodology + tooling + formal verification).
- **1 = generic bounty workflow** (bug-bounty-submission) → fits `security/_core`.
- **1 = web3 drainer defense** (wallet-drainer-analysis) → `security/web3` or audit.
- **1 = offensive DeFi/MEV, NOT security** (flash-loan-arb) → leave in `defi/`
  (revenue/offensive, not defensive audit).

## Opti B done — disclosure skill merge (2026-08-30)
User-shared `bug-bounty-disclosure.zip` was ~60-70% duplicate of existing
`security/_core/responsible-disclosure-off-program`. Merged only the net-new
value (no duplicate skill created):
- `templates/first-contact-email.md` — bilingual ID/EN first-contact email (existing had EN-only full letter)
- `references/contact-discovery.md` — WHOIS/DNS-SOA/pkg-registry/on-chain/CERT-CC + ID-SIRTII/CSIRT + disclose.io
- SKILL.md patched to point at both. `skill_view` resolves: 2 templates + 2 refs + 1 script. ✅

## Pending User Decisions
- [x] ~~Fix core bug?~~ DONE (narrow full-path + boundary-prefix, no snapshot tests)
- [ ] **Consolidate 16 outliers into security/ umbrella?** Recommend new
      `security/audit` sub-domain for the 13 SC-audit skills; route bug-bounty-submission
      → `_core`, wallet-drainer-analysis → web3, leave flash-loan-arb in defi/.
      Validated safe (0 collision, 0 broken links). Awaiting go/no-go on naming.
- [ ] Audit-tooling overlap: 5 skills tumpang-tindih (smart-contract-audit-tooling,
      solidity-audit-toolchain, whitehat-audit-toolkit, sc-audit-toolkit-ext,
      smart-contract-audit-techniques) — consolidate later?
- [ ] Upstream the skills_tool.py fix as a PR to hermes-agent? (user said: NO)

## Backup
- Folder-in snapshot still available if rollback needed
- `.curator_backups/` has pre-reorg state