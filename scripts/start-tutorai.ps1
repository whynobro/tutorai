[CmdletBinding()]
param()

$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest

$projectRoot = Split-Path -Parent $PSScriptRoot
Set-Location -LiteralPath $projectRoot

function Stop-Start([string]$message) {
    Write-Host "`nTutorAI could not start: $message" -ForegroundColor Red
    exit 1
}

Write-Host "TutorAI Answer Checker" -ForegroundColor White

if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Stop-Start "Node.js was not found. Run setup-windows.cmd first."
}

$envPath = Join-Path $projectRoot ".env"
if (-not (Test-Path -LiteralPath $envPath)) {
    Stop-Start ".env is missing. Run setup-windows.cmd first."
}

$keyLine = Get-Content -LiteralPath $envPath | Where-Object { $_ -match '^OPENAI_API_KEY=' } | Select-Object -First 1
if (-not $keyLine -or $keyLine -match '^OPENAI_API_KEY=(replace_me|\s*)$') {
    Stop-Start "Add your private OpenAI API key to .env, save it, and try again."
}

$serverPath = Join-Path $projectRoot "apps\api\dist\server.js"
if (-not (Test-Path -LiteralPath $serverPath)) {
    Stop-Start "The API has not been built. Run setup-windows.cmd first."
}

$portInUse = Get-NetTCPConnection -LocalAddress 127.0.0.1 -LocalPort 8787 -State Listen -ErrorAction SilentlyContinue
if ($portInUse) {
    Write-Host "TutorAI already appears to be running on http://127.0.0.1:8787" -ForegroundColor Yellow
    Write-Host "Open http://127.0.0.1:8787/health to confirm."
    exit 0
}

Write-Host "Starting the local API at http://127.0.0.1:8787" -ForegroundColor Green
Write-Host "Leave this window open while using TutorAI. Press Ctrl+C to stop it.`n"

# npm runs the API with apps\api as its working directory. Point dotenv back
# to the project-root file that this launcher validated above.
$env:DOTENV_CONFIG_PATH = $envPath

& npm run start:api
if ($LASTEXITCODE -ne 0) {
    Stop-Start "The API exited with an error. Read the message above and see docs\TROUBLESHOOTING_WINDOWS.md."
}

