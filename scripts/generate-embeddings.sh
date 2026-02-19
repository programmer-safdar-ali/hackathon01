#!/usr/bin/env bash
# Re-embed all textbook content to Qdrant.
# Alias for ingest-content.sh — re-runs the full pipeline.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
exec "${SCRIPT_DIR}/ingest-content.sh" "$@"
