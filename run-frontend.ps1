# Run HRMS Lite Frontend
# Execute this in PowerShell from the project root. Open a second terminal for the backend.

Set-Location $PSScriptRoot\frontend

# Install dependencies if needed (requires network)
if (-not (Test-Path node_modules)) {
    npm install
}

# Start the dev server (proxies /api to http://127.0.0.1:8000)
npm run dev
