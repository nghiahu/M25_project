# M25 Project Deployment Helper Script for Windows
# Usage: .\deploy.ps1 [command]

param(
    [Parameter(Position=0)]
    [string]$Command = "",
    
    [Parameter(Position=1)]
    [string]$Argument = ""
)

# Configuration
$ProjectRoot = $PSScriptRoot
$ComposeFile = "docker-compose.yml"
$EnvFile = ".env"

# Helper Functions
function Write-Header {
    param([string]$Message)
    Write-Host "`n=================================================" -ForegroundColor Green
    Write-Host $Message -ForegroundColor Green
    Write-Host "=================================================" -ForegroundColor Green
}

function Write-Success {
    param([string]$Message)
    Write-Host "✅ $Message" -ForegroundColor Green
}

function Write-Error-Custom {
    param([string]$Message)
    Write-Host "❌ Error: $Message" -ForegroundColor Red
}

function Write-Info {
    param([string]$Message)
    Write-Host "ℹ️  $Message" -ForegroundColor Yellow
}

# Check prerequisites
function Check-Prerequisites {
    Write-Header "Checking Prerequisites"
    
    # Check Docker
    try {
        $dockerVersion = docker --version
        Write-Success "Docker is installed: $dockerVersion"
    }
    catch {
        Write-Error-Custom "Docker is not installed"
        exit 1
    }
    
    # Check Docker Compose
    try {
        $composeVersion = docker-compose --version
        Write-Success "Docker Compose is installed: $composeVersion"
    }
    catch {
        Write-Error-Custom "Docker Compose is not installed"
        exit 1
    }
}

# Setup environment
function Setup-Environment {
    Write-Header "Setting Up Environment"
    
    if (-not (Test-Path $EnvFile)) {
        if (Test-Path ".env.example") {
            Copy-Item ".env.example" ".env"
            Write-Success "Created .env from .env.example"
            Write-Info "Please edit .env with your configuration"
        }
        else {
            Write-Error-Custom ".env.example not found"
            exit 1
        }
    }
    else {
        Write-Info ".env already exists"
    }
}

# Start services
function Start-Services {
    Write-Header "Starting Services"
    
    docker-compose up -d
    
    Write-Success "Services started"
    Write-Info "Waiting for services to be healthy..."
    Start-Sleep -Seconds 10
    
    docker-compose ps
}

# Check health
function Check-Health {
    Write-Header "Checking Health Status"
    
    # Check PostgreSQL
    try {
        $output = docker-compose exec -T postgres pg_isready -U rikkei 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-Success "PostgreSQL is healthy"
        }
        else {
            Write-Error-Custom "PostgreSQL health check failed"
        }
    }
    catch {
        Write-Error-Custom "PostgreSQL health check failed: $_"
    }
    
    # Check Frontend
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:3000/health" -UseBasicParsing -TimeoutSec 5 -ErrorAction Stop
        if ($response.StatusCode -eq 200) {
            Write-Success "Frontend is healthy"
        }
    }
    catch {
        Write-Error-Custom "Frontend health check failed"
    }
    
    # Check Nginx
    try {
        $response = Invoke-WebRequest -Uri "http://localhost/health" -UseBasicParsing -TimeoutSec 5 -ErrorAction Stop
        if ($response.StatusCode -eq 200) {
            Write-Success "Nginx is healthy"
        }
    }
    catch {
        Write-Error-Custom "Nginx health check failed"
    }
}

# View logs
function View-Logs {
    param([string]$Service = "")
    
    if ([string]::IsNullOrEmpty($Service)) {
        Write-Info "Showing logs from all services..."
        docker-compose logs -f
    }
    else {
        Write-Info "Showing logs from $Service..."
        docker-compose logs -f $Service
    }
}

# Stop services
function Stop-Services {
    Write-Header "Stopping Services"
    docker-compose down
    Write-Success "Services stopped"
}

# Restart services
function Restart-Services {
    Write-Header "Restarting Services"
    docker-compose restart
    Write-Success "Services restarted"
    Start-Sleep -Seconds 5
    docker-compose ps
}

# Database backup
function Backup-Database {
    Write-Header "Backing Up Database"
    
    $timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
    $backupFile = "backups\rikkei_prod_$timestamp.sql"
    
    if (-not (Test-Path "backups")) {
        New-Item -ItemType Directory -Path "backups" | Out-Null
    }
    
    docker exec rikkei-db pg_dump -U rikkei rikkei_prod | Out-File -Encoding UTF8 -FilePath $backupFile
    Write-Success "Database backed up to $backupFile"
}

# Database restore
function Restore-Database {
    param([string]$BackupFile)
    
    if ([string]::IsNullOrEmpty($BackupFile)) {
        Write-Error-Custom "Please provide backup file path"
        Write-Host "Usage: .\deploy.ps1 db:restore <backup_file>"
        exit 1
    }
    
    Write-Header "Restoring Database"
    
    if (-not (Test-Path $BackupFile)) {
        Write-Error-Custom "Backup file not found: $BackupFile"
        exit 1
    }
    
    Get-Content $BackupFile | docker exec -i rikkei-db psql -U rikkei rikkei_prod
    Write-Success "Database restored from $BackupFile"
}

# Database connect
function Connect-Database {
    Write-Header "Connecting to Database"
    docker exec -it rikkei-db psql -U rikkei -d rikkei_prod
}

# Cleanup
function Clean-Resources {
    Write-Header "Cleaning Up"
    
    Write-Info "Removing unused Docker images..."
    docker image prune -f --filter "dangling=true"
    
    Write-Info "Removing unused Docker volumes..."
    docker volume prune -f
    
    Write-Success "Cleanup completed"
}

# Usage
function Show-Usage {
    $usage = @"
M25 Project Deployment Helper for Windows

Usage: .\deploy.ps1 [COMMAND] [ARGUMENT]

Commands:
    check               - Check prerequisites
    setup               - Setup environment (.env)
    start               - Start all services
    stop                - Stop all services
    restart             - Restart all services
    status              - Check service health
    logs                - View all logs (live)
    logs:postgres       - View PostgreSQL logs
    logs:frontend       - View Frontend logs
    logs:nginx          - View Nginx logs
    db:backup           - Backup PostgreSQL database
    db:restore <file>   - Restore database from backup
    db:connect          - Connect to PostgreSQL shell
    clean               - Clean up unused Docker resources
    deploy              - Full deployment (setup + start + health check)

Examples:
    .\deploy.ps1 check
    .\deploy.ps1 deploy
    .\deploy.ps1 logs:frontend
    .\deploy.ps1 db:backup
    .\deploy.ps1 db:restore .\backups\rikkei_prod_20260309_120000.sql

"@
    Write-Host $usage
    exit 0
}

# Main logic
switch ($Command) {
    "check" {
        Check-Prerequisites
    }
    "setup" {
        Setup-Environment
    }
    "start" {
        Start-Services
    }
    "stop" {
        Stop-Services
    }
    "restart" {
        Restart-Services
    }
    "status" {
        Check-Health
    }
    "logs" {
        View-Logs $Argument
    }
    "logs:postgres" {
        View-Logs "postgres"
    }
    "logs:frontend" {
        View-Logs "frontend"
    }
    "logs:nginx" {
        View-Logs "nginx"
    }
    "db:backup" {
        Backup-Database
    }
    "db:restore" {
        Restore-Database $Argument
    }
    "db:connect" {
        Connect-Database
    }
    "clean" {
        Clean-Resources
    }
    "deploy" {
        Check-Prerequisites
        Setup-Environment
        Start-Services
        Start-Sleep -Seconds 10
        Check-Health
        Write-Success "Deployment completed successfully!"
        Write-Info "Application URL: http://localhost"
    }
    default {
        Show-Usage
    }
}
