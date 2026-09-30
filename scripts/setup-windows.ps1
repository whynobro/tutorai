[CmdletBinding()]
param()

$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest

$projectRoot = Split-Path -Parent $PSScriptRoot
Set-Location -LiteralPath $projectRoot

function Write-Step([string]$message) {
    Write-Host "`n==> $message" -ForegroundColor Cyan
}

function Stop-Setup([string]$message) {
    Write-Host "`nSetup stopped: $message" -ForegroundColor Red
    exit 1
}

Write-Host "TutorAI Windows Setup" -ForegroundColor White
Write-Host "Project folder: $projectRoot"

Write-Step "Checking Node.js and npm"
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Stop-Setup "Node.js is not installed or is not available in PATH. Install the LTS release from https://nodejs.org/en/download, then run this script again."
}

if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
    Stop-Setup "npm was not found. Reinstall Node.js from https://nodejs.org/en/download with the default options."
}

$nodeVersion = (& node --version).Trim()
$nodeVersionParsed = [version]$nodeVersion.TrimStart("v")
if ($nodeVersionParsed -lt [version]"22.13.0") {
    Stop-Setup "TutorAI requires Node.js 22.13.0 or newer. Installed version: $nodeVersion"
}

Write-Host "Node.js $nodeVersion"
Write-Host "npm $((& npm --version).Trim())"

Write-Step "Installing the locked project dependencies"
& npm ci
if ($LASTEXITCODE -ne 0) {
    Stop-Setup "npm ci failed. Review the error above and see docs\TROUBLESHOOTING_WINDOWS.md."
}

$envPath = Join-Path $projectRoot ".env"
$exampleEnvPath = Join-Path $projectRoot ".env.example"
if (-not (Test-Path -LiteralPath $envPath)) {
    Write-Step "Creating the private local settings file"
    Copy-Item -LiteralPath $exampleEnvPath -Destination $envPath
    Write-Host "Created .env. Add your own OpenAI API key before starting TutorAI." -ForegroundColor Yellow
} else {
    Write-Host "`nKeeping the existing private .env file." -ForegroundColor Green
}

Write-Step "Checking the code"
& npm run typecheck
if ($LASTEXITCODE -ne 0) {
    Stop-Setup "The TypeScript check failed."
}

Write-Step "Building the API and browser extension"
& npm run build
if ($LASTEXITCODE -ne 0) {
    Stop-Setup "The production build failed."
}

$manifestPath = Join-Path $projectRoot "apps\extension\dist\manifest.json"
$serverPath = Join-Path $projectRoot "apps\api\dist\server.js"
if (-not (Test-Path -LiteralPath $manifestPath)) {
    Stop-Setup "The extension manifest was not created at $manifestPath"
}
if (-not (Test-Path -LiteralPath $serverPath)) {
    Stop-Setup "The API server was not created at $serverPath"
}

Write-Host "`nSetup complete." -ForegroundColor Green
Write-Host "1. Open .env in Notepad and replace OPENAI_API_KEY=replace_me with your private key."
Write-Host "2. Double-click start-tutorai.cmd and leave its window open."
Write-Host "3. Load this unpacked extension folder in Chrome or Edge:"
Write-Host "   $($manifestPath | Split-Path -Parent)" -ForegroundColor White
Write-Host "`nFull guide: docs\WINDOWS_SETUP.md"

