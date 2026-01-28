# Run HRMS Lite Backend
# Execute this in PowerShell from the project root, or run the commands below manually.

Set-Location $PSScriptRoot\backend

# Install dependencies if needed (requires network)
# Ensure MongoDB is running locally or set MONGODB_URI (e.g. MongoDB Atlas)
if (-not (python -c "import pymongo" 2>$null)) {
    python -m pip install -r requirements.txt --user
}

# Start the API server
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
