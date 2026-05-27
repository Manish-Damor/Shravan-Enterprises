$env:MONGODB_URI = 'mongodb://127.0.0.1:27017/website-weaver-kit'
Write-Output "Starting built server with MONGODB_URI=$env:MONGODB_URI"
# Redirect stdout/stderr to server.log for diagnosis
node dist/server/index.js --port 8082 2>&1 | Out-File -FilePath server.log -Encoding utf8
Write-Output "server process exited; see server.log for details"
