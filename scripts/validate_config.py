"""Validate bridge_config.json against a comprehensive JSON schema.

Checks performed:
  - JSON syntax / parseability
  - Top-level structure (must be an object containing a "chains" object)
  - Per-chain required fields and types
  - rest_endpoints must be a non-empty list of strings
  - URLs (rest_endpoints, explorer_url) must be valid http(s) URLs
  - chain_id must follow the <name>-<number> convention (e.g. cosmoshub-4)
  - type must be one of: mainnet, testnet, devnet
  - node_version should look like vMAJOR.MINOR.PATCH (warning if not)
  - No duplicate chain entries, no duplicate rest_endpoints within a chain
  - No internal/private network IPs in rest_endpoints (CRITICAL)

Exits 0 on success, 1 on any validation failure. Uses jsonschema when
available, falls back to manual structural validation otherwise.
"""

from __future__ import annotations

import json
import os
import re
import sys
from typing import Any, Dict, List, Tuple

try:
    import jsonschema
    from jsonschema import Draft7Validator
    _HAS_JSONSCHEMA = True
except ImportError:  # pragma: no cover - graceful degradation
    Draft7Validator = None  # type: ignore[assignment]
    _HAS_JSONSCHEMA = False


CONFIG_PATH = "/home/hermes/services/bridge_config.json"
SCHEMA_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "bridge_config_schema.json")

VALID_TYPES = {"mainnet", "testnet", "devnet"}
CHAIN_ID_RE = re.compile(r"^[a-zA-Z][a-zA-Z0-9_-]*-\d+$")
NODE_VERSION_RE = re.compile(r"^v\d+\.\d+\.\d+")
URL_RE = re.compile(r"^https?://[^\s/$.?#].[^\s]*$", re.IGNORECASE)
PRIVATE_IP_PREFIXES = ("192.168.", "10.", "172.16.", "172.17.", "172.18.",
                       "172.19.", "172.20.", "172.21.", "172.22.", "172.23.",
                       "172.24.", "172.25.", "172.26.", "172.27.", "172.28.",
                       "172.29.", "172.30.", "172.31.", "127.", "localhost",
                       "0.0.0.0")


class ValidationError:
    """A single validation finding."""
    __slots__ = ("severity", "path", "message")

    def __init__(self, severity: str, path: str, message: str) -> None:
        self.severity = severity  # "error" | "warning" | "critical"
        self.path = path
        self.message = message

    def __str__(self) -> str:
        return f"[{self.severity.upper()}] {self.path}: {self.message}"


def load_json(path: str) -> Tuple[Any, List[ValidationError]]:
    """Load and parse a JSON file, returning (data, errors)."""
    errors: List[ValidationError] = []
    try:
        with open(path, "r", encoding="utf-8") as fh:
            return json.load(fh), errors
    except FileNotFoundError:
        errors.append(ValidationError("critical", path, f"File not found: {path}"))
    except json.JSONDecodeError as exc:
        errors.append(ValidationError(
            "critical", path, f"Invalid JSON at line {exc.lineno} col {exc.colno}: {exc.msg}"))
    except OSError as exc:
        errors.append(ValidationError("critical", path, f"Could not read file: {exc}"))
    return None, errors


def validate_with_jsonschema(config: Any, schema: Dict[str, Any]) -> List[ValidationError]:
    """Run schema validation via the jsonschema library, if installed."""
    if not _HAS_JSONSCHEMA:
        return []
    errors: List[ValidationError] = []
    validator = Draft7Validator(schema)
    for err in sorted(validator.iter_errors(config), key=lambda e: list(e.absolute_path)):
        path = "/".join(str(p) for p in err.absolute_path) or "<root>"
        errors.append(ValidationError("error", path, err.message))
    return errors


def validate_semantics(config: Any) -> List[ValidationError]:
    """Semantic checks beyond pure schema validation."""
    errors: List[ValidationError] = []
    if not isinstance(config, dict):
        errors.append(ValidationError("critical", "<root>", "Top level must be an object"))
        return errors

    chains = config.get("chains")
    if not isinstance(chains, dict):
        errors.append(ValidationError("error", "chains", "Missing or not an object"))
        return errors
    if not chains:
        errors.append(ValidationError("warning", "chains", "No chains configured"))

    seen_chain_ids: Dict[str, str] = {}

    for chain_key, cfg in chains.items():
        base = f"chains.{chain_key}"
        if not isinstance(cfg, dict):
            errors.append(ValidationError("error", base, "Chain entry must be an object"))
            continue

        # chain_id format
        chain_id = cfg.get("chain_id", "")
        if isinstance(chain_id, str) and chain_id:
            if not CHAIN_ID_RE.match(chain_id):
                errors.append(ValidationError(
                    "warning", f"{base}.chain_id",
                    f"chain_id '{chain_id}' does not match expected '<name>-<number>' pattern"))
            if chain_id in seen_chain_ids:
                errors.append(ValidationError(
                    "error", f"{base}.chain_id",
                    f"duplicate chain_id '{chain_id}' (also used by "
                    f"{seen_chain_ids[chain_id]})"))
            else:
                seen_chain_ids[chain_id] = chain_key

        # type enum
        ctype = cfg.get("type")
        if ctype not in VALID_TYPES:
            errors.append(ValidationError(
                "error", f"{base}.type",
                f"type '{ctype}' not in allowed values {sorted(VALID_TYPES)}"))

        # rest_endpoints
        endpoints = cfg.get("rest_endpoints", [])
        if not isinstance(endpoints, list):
            errors.append(ValidationError(
                "error", f"{base}.rest_endpoints", "must be an array"))
            endpoints = []
        if not endpoints:
            errors.append(ValidationError(
                "error", f"{base}.rest_endpoints", "must contain at least one endpoint"))
        seen_eps = set()
        for i, ep in enumerate(endpoints):
            epath = f"{base}.rest_endpoints[{i}]"
            if not isinstance(ep, str) or not ep:
                errors.append(ValidationError("error", epath, "endpoint must be a non-empty string"))
                continue
            if not URL_RE.match(ep):
                errors.append(ValidationError("error", epath, f"not a valid http(s) URL: {ep}"))
            if any(ep.startswith(pfx) for pfx in PRIVATE_IP_PREFIXES):
                errors.append(ValidationError(
                    "critical", epath, f"internal/private endpoint detected: {ep}"))
            if ep in seen_eps:
                errors.append(ValidationError(
                    "warning", epath, f"duplicate endpoint within chain: {ep}"))
            seen_eps.add(ep)

        # explorer_url
        explorer = cfg.get("explorer_url", "")
        if isinstance(explorer, str) and explorer and not URL_RE.match(explorer):
            errors.append(ValidationError(
                "error", f"{base}.explorer_url",
                f"not a valid http(s) URL: {explorer}"))

        # node_version shape
        node_version = cfg.get("node_version", "")
        if isinstance(node_version, str) and node_version:
            if not NODE_VERSION_RE.match(node_version):
                errors.append(ValidationError(
                    "warning", f"{base}.node_version",
                    f"version '{node_version}' does not match expected vMAJOR.MINOR.PATCH"))

        # manual_upgrade should not be the placeholder
        manual = cfg.get("manual_upgrade", "")
        if isinstance(manual, str) and manual.strip().lower() in (
                "", "# manual upgrade not configured"):
            errors.append(ValidationError(
                "warning", f"{base}.manual_upgrade",
                "manual upgrade procedure is empty or placeholder"))

        # path-like fields should look like relative paths
        for field in ("doc_path", "json_path"):
            val = cfg.get(field, "")
            if isinstance(val, str) and val and (val.startswith("/") or "\\" in val):
                errors.append(ValidationError(
                    "warning", f"{base}.{field}",
                    f"value '{val}' should be a relative POSIX-style path"))

    return errors


def main() -> int:
    print(f"Validating {CONFIG_PATH}")

    config, load_errors = load_json(CONFIG_PATH)
    if load_errors:
        for err in load_errors:
            print(err)
        return 1
    if config is None:
        print("critical: failed to load config (no data returned)")
        return 1

    schema: Dict[str, Any] = {}
    if os.path.isfile(SCHEMA_PATH):
        schema_data, schema_errors = load_json(SCHEMA_PATH)
        if schema_errors:
            for err in schema_errors:
                print(err)
            return 1
        if isinstance(schema_data, dict):
            schema = schema_data

    findings: List[ValidationError] = []

    if _HAS_JSONSCHEMA:
        findings.extend(validate_with_jsonschema(config, schema))
    else:
        # Minimal manual structural check using the schema's "required"
        # and "properties.type" entries so the script still works without
        # the jsonschema dependency installed.
        findings.extend(_fallback_schema_check(config, schema))

    findings.extend(validate_semantics(config))

    # Group by severity for clearer output.
    by_sev: Dict[str, List[ValidationError]] = {"critical": [], "error": [], "warning": []}
    for f in findings:
        by_sev.setdefault(f.severity, []).append(f)

    for sev in ("critical", "error", "warning"):
        for f in by_sev.get(sev, []):
            print(f)

    summary = (f"Validation complete: "
               f"{len(by_sev['critical'])} critical, "
               f"{len(by_sev['error'])} error(s), "
               f"{len(by_sev['warning'])} warning(s)")
    print(summary)

    # Critical or error-level findings fail the run.
    return 1 if by_sev["critical"] or by_sev["error"] else 0


def _fallback_schema_check(config: Any, schema: Dict[str, Any]) -> List[ValidationError]:
    """Light-weight structural check when jsonschema isn't importable."""
    errors: List[ValidationError] = []
    if schema.get("type") == "object" and not isinstance(config, dict):
        errors.append(ValidationError("error", "<root>", "must be an object"))
        return errors
    for req in schema.get("required", []):
        if req not in config:
            errors.append(ValidationError("error", req, "required property missing"))
    chains_prop = schema.get("properties", {}).get("chains", {})
    if chains_prop.get("type") == "object" and not isinstance(config.get("chains"), dict):
        errors.append(ValidationError("error", "chains", "must be an object"))
    chain_pattern = chains_prop.get("additionalProperties", {}) if isinstance(chains_prop, dict) else {}
    if isinstance(chain_pattern, dict):
        required_chain_fields = chain_pattern.get("required", [])
        prop_types = chain_pattern.get("properties", {})
        for chain_key, cfg in (config.get("chains") or {}).items():
            base = f"chains.{chain_key}"
            if not isinstance(cfg, dict):
                errors.append(ValidationError("error", base, "must be an object"))
                continue
            for req in required_chain_fields:
                if req not in cfg:
                    errors.append(ValidationError("error", f"{base}.{req}", "required field missing"))
            for fname, fdef in prop_types.items():
                if fname not in cfg or not isinstance(fdef, dict):
                    continue
                expected_type = fdef.get("type")
                value = cfg[fname]
                if expected_type == "string" and not isinstance(value, str):
                    errors.append(ValidationError("error", f"{base}.{fname}", "must be a string"))
                elif expected_type == "array" and not isinstance(value, list):
                    errors.append(ValidationError("error", f"{base}.{fname}", "must be an array"))
                elif expected_type == "object" and not isinstance(value, dict):
                    errors.append(ValidationError("error", f"{base}.{fname}", "must be an object"))
    return errors


if __name__ == "__main__":
    sys.exit(main())
