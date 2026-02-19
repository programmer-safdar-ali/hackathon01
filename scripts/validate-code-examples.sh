#!/usr/bin/env bash
# Extract and syntax-check all Python code blocks from MDX files.
# Usage: ./scripts/validate-code-examples.sh
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DOCS_DIR="${REPO_ROOT}/website/docs"
TMPDIR="$(mktemp -d)"
PASS=0
FAIL=0
ERRORS=()

cleanup() { rm -rf "${TMPDIR}"; }
trap cleanup EXIT

echo "=== Code Example Validation ==="
echo "Scanning: ${DOCS_DIR}"

# Extract all ```python ... ``` blocks from MDX files
while IFS= read -r -d '' mdx_file; do
  relative="${mdx_file#"${DOCS_DIR}/"}"
  block_index=0
  in_block=false
  block_content=""

  while IFS= read -r line; do
    if [[ "$line" =~ ^\`\`\`python ]]; then
      in_block=true
      block_content=""
    elif [[ "$line" =~ ^\`\`\` ]] && $in_block; then
      in_block=false
      # Write block to temp file and syntax-check it
      block_file="${TMPDIR}/block_${block_index}.py"
      printf '%s\n' "$block_content" > "$block_file"
      if python3 -m py_compile "$block_file" 2>/dev/null; then
        PASS=$((PASS + 1))
      else
        FAIL=$((FAIL + 1))
        ERRORS+=("${relative} block ${block_index}")
      fi
      block_index=$((block_index + 1))
    elif $in_block; then
      block_content+="$line"$'\n'
    fi
  done < "$mdx_file"
done < <(find "${DOCS_DIR}" -name "*.mdx" -print0)

echo ""
echo "Results: ${PASS} passed, ${FAIL} failed"

if [[ ${FAIL} -gt 0 ]]; then
  echo ""
  echo "Failed blocks:"
  for err in "${ERRORS[@]}"; do
    echo "  - ${err}"
  done
  exit 1
else
  echo "All Python code examples pass syntax check."
fi
