$ErrorActionPreference = "Stop"

$rootDir = Split-Path -Parent $PSScriptRoot
$logsDir = Join-Path $rootDir "logs"

New-Item -ItemType Directory -Force -Path $logsDir | Out-Null

function Get-PortListener {
  param(
    [Parameter(Mandatory = $true)]
    [int]$Port
  )

  return Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue | Select-Object -First 1
}

function Test-PortListening {
  param(
    [Parameter(Mandatory = $true)]
    [int]$Port
  )

  return $null -ne (Get-PortListener -Port $Port)
}

function Get-ProcessCommandLine {
  param(
    [Parameter(Mandatory = $true)]
    [int]$ProcessId
  )

  $process = Get-CimInstance Win32_Process -Filter "ProcessId = $ProcessId" -ErrorAction SilentlyContinue
  return $process.CommandLine
}

function Ensure-MongoDb {
  $mongoService = Get-Service -Name "MongoDB" -ErrorAction SilentlyContinue
  if ($null -eq $mongoService) {
    Write-Warning "MongoDB Windows service was not found. Start MongoDB manually before using the admin panel."
    return
  }

  if ($mongoService.Status -eq "Running") {
    Write-Output "MongoDB service is already running."
    return
  }

  Write-Output "Starting MongoDB service..."
  Start-Service -Name "MongoDB"
  $mongoService.WaitForStatus("Running", [TimeSpan]::FromSeconds(20))
  Write-Output "MongoDB service started."
}

function Start-App {
  param(
    [Parameter(Mandatory = $true)]
    [string]$Name,
    [Parameter(Mandatory = $true)]
    [string]$RelativeDir,
    [Parameter(Mandatory = $true)]
    [int]$Port,
    [Parameter(Mandatory = $true)]
    [string]$ExpectedCommandFragment
  )

  $listener = Get-PortListener -Port $Port
  if ($null -ne $listener) {
    $commandLine = Get-ProcessCommandLine -ProcessId $listener.OwningProcess
    if ($commandLine -and $commandLine.Contains($ExpectedCommandFragment)) {
      Write-Output "$Name is already running on http://localhost:$Port"
      return
    }

    throw "Port $Port is already in use by another process. Free that port before starting $Name. Current owner: $commandLine"
  }

  $appDir = Join-Path $rootDir $RelativeDir
  $logPath = Join-Path $logsDir "$Name.log"
  $startCommand = "Set-Location -LiteralPath '$appDir'; npm run dev *> '$logPath'"

  Write-Output "Starting $Name on http://localhost:$Port ..."
  Start-Process -FilePath "powershell.exe" -WindowStyle Hidden -ArgumentList @(
    "-NoProfile",
    "-ExecutionPolicy",
    "Bypass",
    "-Command",
    $startCommand
  ) | Out-Null

  for ($attempt = 0; $attempt -lt 30; $attempt += 1) {
    Start-Sleep -Seconds 1
    $listener = Get-PortListener -Port $Port
    if ($null -eq $listener) {
      continue
    }

    $commandLine = Get-ProcessCommandLine -ProcessId $listener.OwningProcess
    if ($commandLine -and $commandLine.Contains($ExpectedCommandFragment)) {
      Write-Output "$Name is ready on http://localhost:$Port"
      return
    }
  }

  throw "$Name did not start on port $Port. Check $logPath for details."
}

Ensure-MongoDb

Start-App -Name "backend" -RelativeDir "Shravan_Backend" -Port 8082 -ExpectedCommandFragment "\Shravan_Backend\"
Start-App -Name "frontend" -RelativeDir "Shravan_FrontEnd" -Port 8094 -ExpectedCommandFragment "\Shravan_FrontEnd\"
Start-App -Name "admin-panel" -RelativeDir "Admin_Panel" -Port 8095 -ExpectedCommandFragment "\Admin_Panel\"

Write-Output ""
Write-Output "Local stack is ready:"
Write-Output "  Backend:      http://localhost:8082"
Write-Output "  Frontend:     http://localhost:8094"
Write-Output "  Admin panel:  http://localhost:8095"
Write-Output ""
Write-Output "If one service fails, check the logs in $logsDir"
