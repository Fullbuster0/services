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
- `skills_list(category="security/web")`: **0** (known bug, see below)

## Known Bug — skills_list Sub-domain Filter
**Location:** `~/.hermes/hermes-agent/tools/skills_tool.py:511-512`
**Root cause:** `_get_skill_category()` returns `parts[0]` (top-level "security") instead of full path. Then `s.category == category` exact-match → `security/web` returns 0.
**Impact:** NON-BLOCKING. Index in system prompt shows all 9 sub-domains correctly. `skill_view(name)` resolves fine. The filter is only used for convenience browsing.
**Fix options (need user approval):**
1. Prefix-match: `s.category.startswith(category)`
2. Full-path: make `_get_skill_category` return `"/".join(parts[:-2])` (like prompt_builder does)

## Pending User Decisions
- [ ] **Fix core bug?** (prefix-match vs full-path, needs explicit approval — blast radius all categories)
- [ ] Any further library→promote candidates
- [ ] Any new skills to add

## Backup
- Folder-in snapshot still available if rollback needed
- `.curator_backups/` has pre-reorg state