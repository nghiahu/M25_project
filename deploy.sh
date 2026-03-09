#!/bin/bash

# M25 Project Deployment Helper Script

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Functions
print_header() {
    echo -e "${GREEN}===================================================${NC}"
    echo -e "${GREEN}$1${NC}"
    echo -e "${GREEN}===================================================${NC}"
}

print_error() {
    echo -e "${RED}❌ Error: $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}ℹ️  $1${NC}"
}

# Check prerequisites
check_prereqs() {
    print_header "Checking Prerequisites"
    
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed"
        exit 1
    fi
    print_success "Docker is installed: $(docker --version)"
    
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed"
        exit 1
    fi
    print_success "Docker Compose is installed: $(docker-compose --version)"
}

# Setup environment
setup_env() {
    print_header "Setting Up Environment"
    
    if [ ! -f .env ]; then
        if [ -f .env.example ]; then
            cp .env.example .env
            print_success "Created .env from .env.example"
            print_info "Please edit .env with your configuration"
        else
            print_error ".env.example not found"
            exit 1
        fi
    else
        print_info ".env already exists"
    fi
}

# Build and start containers
start_services() {
    print_header "Starting Services"
    
    docker-compose up -d
    
    print_success "Services started"
    print_info "Waiting for services to be healthy..."
    sleep 10
    
    docker-compose ps
}

# Check health
check_health() {
    print_header "Checking Health Status"
    
    # Check PostgreSQL
    if docker-compose exec -T postgres pg_isready -U rikkei &> /dev/null; then
        print_success "PostgreSQL is healthy"
    else
        print_error "PostgreSQL health check failed"
    fi
    
    # Check Frontend
    if curl -f http://localhost:3000/health &> /dev/null; then
        print_success "Frontend is healthy"
    else
        print_error "Frontend health check failed"
    fi
    
    # Check Nginx
    if curl -f http://localhost/health &> /dev/null; then
        print_success "Nginx is healthy"
    else
        print_error "Nginx health check failed"
    fi
}

# View logs
view_logs() {
    service=$1
    if [ -z "$service" ]; then
        print_info "Showing logs from all services..."
        docker-compose logs -f
    else
        print_info "Showing logs from $service..."
        docker-compose logs -f "$service"
    fi
}

# Stop services
stop_services() {
    print_header "Stopping Services"
    docker-compose down
    print_success "Services stopped"
}

# Restart services
restart_services() {
    print_header "Restarting Services"
    docker-compose restart
    print_success "Services restarted"
    sleep 5
    docker-compose ps
}

# Database operations
db_backup() {
    print_header "Backing Up Database"
    
    BACKUP_FILE="backups/rikkei_prod_$(date +%Y%m%d_%H%M%S).sql"
    mkdir -p backups
    
    docker exec rikkei-db pg_dump -U rikkei rikkei_prod > "$BACKUP_FILE"
    print_success "Database backed up to $BACKUP_FILE"
}

db_restore() {
    backup_file=$1
    if [ -z "$backup_file" ]; then
        print_error "Please provide backup file path"
        echo "Usage: ./deploy.sh db:restore <backup_file>"
        exit 1
    fi
    
    print_header "Restoring Database"
    docker exec -i rikkei-db psql -U rikkei rikkei_prod < "$backup_file"
    print_success "Database restored from $backup_file"
}

db_connect() {
    print_header "Connecting to Database"
    docker exec -it rikkei-db psql -U rikkei -d rikkei_prod
}

# Clean up
cleanup() {
    print_header "Cleaning Up"
    
    print_info "Removing unused Docker images..."
    docker image prune -f --filter "dangling=true"
    
    print_info "Removing unused Docker volumes..."
    docker volume prune -f
    
    print_success "Cleanup completed"
}

# Usage
usage() {
    cat << EOF
M25 Project Deployment Helper

Usage: ./deploy.sh [COMMAND]

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
    ./deploy.sh check
    ./deploy.sh deploy
    ./deploy.sh logs:frontend
    ./deploy.sh db:backup
    ./deploy.sh db:restore backups/rikkei_prod_20260309_120000.sql

EOF
    exit 0
}

# Main
main() {
    command=$1
    arg=$2
    
    case "$command" in
        check)
            check_prereqs
            ;;
        setup)
            setup_env
            ;;
        start)
            start_services
            ;;
        stop)
            stop_services
            ;;
        restart)
            restart_services
            ;;
        status)
            check_health
            ;;
        logs)
            view_logs "$arg"
            ;;
        logs:postgres)
            view_logs "postgres"
            ;;
        logs:frontend)
            view_logs "frontend"
            ;;
        logs:nginx)
            view_logs "nginx"
            ;;
        db:backup)
            db_backup
            ;;
        db:restore)
            db_restore "$arg"
            ;;
        db:connect)
            db_connect
            ;;
        clean)
            cleanup
            ;;
        deploy)
            check_prereqs
            setup_env
            start_services
            check_health
            print_success "Deployment completed successfully!"
            print_info "Application URL: http://localhost"
            ;;
        *)
            usage
            ;;
    esac
}

# Run main
main "$@"
