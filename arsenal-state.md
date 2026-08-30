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

## Pending User Decisions
- [x] ~~Fix core bug?~~ DONE (narrow full-path + boundary-prefix, no snapshot tests)
- [ ] Any further library→promote candidates
- [ ] Any new skills to add
- [ ] Upstream the skills_tool.py fix as a PR to hermes-agent? (bug affects all
      nested-category installs, not just this host)

## Backup
- Folder-in snapshot still available if rollback needed
- `.curator_backups/` has pre-reorg state