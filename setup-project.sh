#!/usr/bin/env bash
# ==============================================================================
# UNIVERSAL AGENTIC FRAMEWORK - BOOTSTRAP SCRIPT (Linux / macOS)
# ==============================================================================
# Usage:
#   chmod +x setup-project.sh
#   ./setup-project.sh [/path/to/my-new-project]
# ==============================================================================

set -euo pipefail

TARGET_DIR="${1:-.}"
SCRIPT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TARGET_FULL="$(cd "${TARGET_DIR}" && pwd)"

echo -e "\033[1;36m=================================================================\033[0m"
echo -e "\033[1;36m[*] Initializing Universal Agentic Framework in: ${TARGET_DIR}\033[0m"
echo -e "\033[1;36m=================================================================\033[0m"

# 1. Create Directory Hierarchy
mkdir -p "${TARGET_DIR}/.agents/rules"
mkdir -p "${TARGET_DIR}/.agents/skills/graphify"
mkdir -p "${TARGET_DIR}/.agents/skills/system-design"
mkdir -p "${TARGET_DIR}/.agents/workflows"
mkdir -p "${TARGET_DIR}/directives"
mkdir -p "${TARGET_DIR}/execution"
mkdir -p "${TARGET_DIR}/docs"
mkdir -p "${TARGET_DIR}/.tmp"
mkdir -p "${TARGET_DIR}/scratch"

# 2. Copy Core Constitutions (if target is different directory)
if [[ "${SCRIPT_ROOT}" != "${TARGET_FULL}" ]]; then
  for f in AGENTS.md GEMINI.md CLAUDE.md; do
    if [[ -f "${SCRIPT_ROOT}/${f}" ]]; then
      cp -f "${SCRIPT_ROOT}/${f}" "${TARGET_DIR}/${f}"
      echo -e "\033[0;33m  [OK] Mirrored: ${f}\033[0m"
    fi
  done

  # 3. Copy Rules & Skills
  cp -rf "${SCRIPT_ROOT}/.agents/"* "${TARGET_DIR}/.agents/"
  echo -e "\033[0;33m  [OK] Installed Rules, Skills, and Workflows\033[0m"

  # 4. Copy Directives and ADR Templates
  cp -rf "${SCRIPT_ROOT}/directives/"* "${TARGET_DIR}/directives/"
fi

if [[ ! -f "${TARGET_DIR}/docs/DECISIONS.md" ]]; then
  cp -f "${SCRIPT_ROOT}/docs/DECISIONS_TEMPLATE.md" "${TARGET_DIR}/docs/DECISIONS.md"
  echo -e "\033[0;33m  [OK] Initialized ADR Log: docs/DECISIONS.md\033[0m"
fi

# 5. Security in .gitignore
GITIGNORE="${TARGET_DIR}/.gitignore"
cat << 'EOF' >> "${GITIGNORE}"

# Universal Agentic Framework Ignored Paths
.env*
credentials.json
token.json
.tmp/
scratch/
*.log
EOF
echo -e "\033[0;33m  [OK] Secured .gitignore with secret protection\033[0m"

# 6. Check Graphify
echo -e "\n\033[1;36m[*] Checking Graphify Engine for Day-1 Knowledge Graph...\033[0m"
if command -v graphify &> /dev/null; then
  echo -e "\033[0;32m  [OK] Graphify detected in PATH\033[0m"
  (cd "${TARGET_DIR}" && graphify update . || true)
else
  echo -e "\033[0;33m  [i] Graphify is not yet in PATH. Install via:\033[0m"
  echo "      uv tool install graphifyy   OR   npm install -g graphifyy"
fi

echo -e "\n\033[1;32m=================================================================\033[0m"
echo -e "\033[1;32m[OK] Universal Agentic Setup Complete!\033[0m"
echo -e "\033[1;32m=================================================================\033[0m"
