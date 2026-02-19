#!/usr/bin/env bash
# Ingest textbook content from website/docs/ into Qdrant.
# Usage: ./scripts/ingest-content.sh [--docs-path PATH]
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DOCS_PATH="${REPO_ROOT}/website/docs"

# Parse optional --docs-path argument
while [[ $# -gt 0 ]]; do
  case "$1" in
    --docs-path)
      DOCS_PATH="$2"
      shift 2
      ;;
    *)
      echo "Unknown argument: $1" >&2
      exit 1
      ;;
  esac
done

BACKEND_DIR="${REPO_ROOT}/backend"
VENV_DIR="${BACKEND_DIR}/.venv"

echo "=== Content Ingestion Pipeline ==="
echo "Docs path: ${DOCS_PATH}"
echo "Backend: ${BACKEND_DIR}"

# Ensure virtual environment exists
if [[ ! -d "${VENV_DIR}" ]]; then
  echo "Creating virtual environment..."
  python3 -m venv "${VENV_DIR}"
fi

# Install dependencies
echo "Installing dependencies..."
"${VENV_DIR}/bin/pip" install -r "${BACKEND_DIR}/requirements.txt" -q

# Run the ingestion script
echo "Running ingestion..."
cd "${BACKEND_DIR}"
"${VENV_DIR}/bin/python" -m app.scripts.ingest_content --docs-path "${DOCS_PATH}"

echo "=== Ingestion complete ==="
