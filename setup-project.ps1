# ==============================================================================
# UNIVERSAL AGENTIC FRAMEWORK - BOOTSTRAP SCRIPT (Windows PowerShell)
# ==============================================================================
# Usage:
#   .\setup-project.ps1 [-TargetDir "C:\path\to\my-new-project"]
# ==============================================================================

param (
    [string]$TargetDir = "."
)

Write-Host "=================================================================" -ForegroundColor Cyan
Write-Host "[*] Initializing Universal Agentic Framework in: $TargetDir" -ForegroundColor Cyan
Write-Host "=================================================================" -ForegroundColor Cyan

$ScriptRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$resolvedRoot = (Resolve-Path $ScriptRoot).Path
$resolvedTarget = if (Test-Path $TargetDir) { (Resolve-Path $TargetDir).Path } else { $TargetDir }

# 1. Create Directory Hierarchy
$dirs = @(
    "$TargetDir\.agents\rules",
    "$TargetDir\.agents\skills\graphify",
    "$TargetDir\.agents\skills\system-design",
    "$TargetDir\.agents\workflows",
    "$TargetDir\directives",
    "$TargetDir\execution",
    "$TargetDir\docs",
    "$TargetDir\.tmp",
    "$TargetDir\scratch"
)

foreach ($d in $dirs) {
    if (-not (Test-Path $d)) {
        New-Item -ItemType Directory -Path $d -Force | Out-Null
        Write-Host "  [+] Created directory: $d" -ForegroundColor Green
    }
}

# 2. Copy Core Constitutions (if target is a different directory)
$isSelf = ($resolvedRoot -eq $resolvedTarget)
if (-not $isSelf) {
    $coreFiles = @("AGENTS.md", "GEMINI.md", "CLAUDE.md")
    foreach ($f in $coreFiles) {
        $src = Join-Path $ScriptRoot $f
        $dst = Join-Path $TargetDir $f
        if (Test-Path $src) {
            Copy-Item -Path $src -Destination $dst -Force
            Write-Host "  [OK] Mirrored: $f" -ForegroundColor Yellow
        }
    }

    # 3. Copy Rules & Skills
    Copy-Item -Path "$ScriptRoot\.agents\*" -Destination "$TargetDir\.agents" -Recurse -Force
    Write-Host "  [OK] Installed Rules, Skills, and Workflows" -ForegroundColor Yellow

    # 4. Copy Directives and ADR Templates
    Copy-Item -Path "$ScriptRoot\directives\*" -Destination "$TargetDir\directives" -Recurse -Force
}

if (-not (Test-Path "$TargetDir\docs\DECISIONS.md")) {
    Copy-Item -Path "$ScriptRoot\docs\DECISIONS_TEMPLATE.md" -Destination "$TargetDir\docs\DECISIONS.md" -Force
    Write-Host "  [OK] Initialized ADR Log: docs\DECISIONS.md" -ForegroundColor Yellow
}

# 5. Create or Append to .gitignore
$gitignorePath = Join-Path $TargetDir ".gitignore"
$ignorePatterns = @"

# Universal Agentic Framework Ignored Paths
.env*
credentials.json
token.json
.tmp/
scratch/
*.log
"@

if (-not (Test-Path $gitignorePath)) {
    Set-Content -Path $gitignorePath -Value $ignorePatterns.Trim()
    Write-Host "  [OK] Created .gitignore with secret and scratch protection" -ForegroundColor Yellow
} else {
    Add-Content -Path $gitignorePath -Value $ignorePatterns
    Write-Host "  [OK] Appended security rules to existing .gitignore" -ForegroundColor Yellow
}

# 6. Day-1 Graphify Knowledge Graph Check
Write-Host "`n[*] Checking Graphify Engine for Day-1 Knowledge Graph..." -ForegroundColor Cyan
$graphifyCmd = Get-Command graphify -ErrorAction SilentlyContinue

if ($graphifyCmd) {
    Write-Host "  [OK] Graphify detected: $($graphifyCmd.Source)" -ForegroundColor Green
    Write-Host "  [*] Building initial Day-1 knowledge graph..." -ForegroundColor Cyan
    Push-Location $TargetDir
    try {
        & graphify update .
        Write-Host "  [OK] Knowledge graph created at graphify-out/" -ForegroundColor Green
    } catch {
        Write-Host "  [!] Graphify update can be executed once source files are added." -ForegroundColor Gray
    }
    Pop-Location
} else {
    Write-Host "  [i] Graphify is not yet in PATH. You can install it via:" -ForegroundColor Yellow
    Write-Host "      uv tool install graphifyy   OR   npm install -g graphifyy" -ForegroundColor White
    Write-Host "      Then run: graphify update ." -ForegroundColor White
}

Write-Host "`n=================================================================" -ForegroundColor Green
Write-Host "[OK] Universal Agentic Setup Complete!" -ForegroundColor Green
Write-Host "   - Zero-Hallucination & Anti-Decorative Guardrails: ACTIVE" -ForegroundColor White
Write-Host "   - 3-Layer Architecture (Directives/Orchestration/Execution): ACTIVE" -ForegroundColor White
Write-Host "   - ADR Decision Log: docs/DECISIONS.md" -ForegroundColor White
Write-Host "=================================================================" -ForegroundColor Green
