#!/usr/bin/env python3
"""
Bootstrap script for Universal Agentic Framework.
Initializes Graphify knowledge graph, verifies environment, and creates ADR baselines.
"""

import os
import sys
import subprocess
from pathlib import Path

def main():
    root = Path(__file__).resolve().parent.parent
    print(f"[*] Bootstrapping project at: {root}")

    # Check or initialize Graphify
    print("[*] Inspecting Graphify knowledge graph engine...")
    try:
        res = subprocess.run(["graphify", "--version"], capture_output=True, text=True)
        if res.returncode == 0:
            print(f"[OK] Graphify available: {res.stdout.strip()}")
            print("[*] Generating Day-1 AST knowledge graph...")
            subprocess.run(["graphify", "update", str(root)])
        else:
            print("[i] Graphify is installed but returned non-zero. Run 'graphify update .' manually.")
    except FileNotFoundError:
        print("[!] Graphify CLI not found in PATH.")
        print("    Install it via: uv tool install graphifyy  or  npm install -g graphifyy")

    # Verify ADR file exists
    adr_file = root / "docs" / "DECISIONS.md"
    if not adr_file.exists():
        template = root / "docs" / "DECISIONS_TEMPLATE.md"
        if template.exists():
            adr_file.write_text(template.read_text(encoding="utf-8"), encoding="utf-8")
            print("[OK] Initialized docs/DECISIONS.md from template")

    print("[OK] Universal Agentic Framework bootstrap finished successfully.")

if __name__ == "__main__":
    main()
