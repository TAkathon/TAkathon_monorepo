#!/bin/bash
# Database setup and management script for TAkathon

set -e

# Colors
CYAN='\033[0;36m'
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

info() { echo -e "${CYAN}$1${NC}"; }
success() { echo -e "${GREEN}$1${NC}"; }
error() { echo -e "${RED}$1${NC}"; }
warning() { echo -e "${YELLOW}$1${NC}"; }

ACTION=$1
FILE=$2

case "$ACTION" in
    start)
        info "🚀 Starting PostgreSQL database..."
        docker compose up postgres -d
        sleep 3
        success "✅ Database started on port 5432"
        info "Connection URL: postgresql://postgres:postgrespassword@localhost:5432/takathon"
        ;;
    
    stop)
        info "🛑 Stopping PostgreSQL database..."
        docker compose stop postgres
        success "✅ Database stopped"
        ;;
    
    reset)
        warning "⚠️  This will delete ALL data in the database!"
        read -p "Are you sure? (yes/no): " confirm
        if [ "$confirm" = "yes" ]; then
            info "🗑️  Resetting database..."
            docker compose down -v
            docker compose up postgres -d
            sleep 5
            info "📤 Pushing schema..."
            npx prisma db push --force-reset
            info "🌱 Seeding database..."
            npx prisma db seed
            success "✅ Database reset complete"
        else
            warning "❌ Reset cancelled"
        fi
        ;;
    
    seed)
        info "🌱 Seeding database with test data..."
        npx prisma db seed
        success "✅ Database seeded"
        ;;
    
    studio)
        info "🎨 Opening Prisma Studio..."
        npx prisma studio
        ;;
    
    migrate)
        info "📝 Creating new migration..."
        read -p "Migration name: " name
        if [ -n "$name" ]; then
            npx prisma migrate dev --name "$name"
            success "✅ Migration created: $name"
        else
            error "❌ Migration name required"
            exit 1
        fi
        ;;
    
    push)
        info "📤 Pushing schema to database..."
        npx prisma db push
        success "✅ Schema pushed"
        ;;
    
    status)
        info "📊 Database Status:"
        echo ""
        docker compose ps postgres
        echo ""
        info "Prisma Migrations:"
        npx prisma migrate status
        ;;
    
    backup)
        timestamp=$(date +%Y%m%d_%H%M%S)
        backupFile="database/backups/takathon_$timestamp.sql"
        info "💾 Creating backup: $backupFile"
        
        mkdir -p database/backups
        docker exec takathon-db pg_dump -U postgres takathon > "$backupFile"
        
        success "✅ Backup created: $backupFile"
        ;;
    
    restore)
        if [ -z "$FILE" ]; then
            error "❌ Please specify backup file: ./tools/scripts/db.sh restore <file>"
            exit 1
        fi
        
        if [ ! -f "$FILE" ]; then
            error "❌ Backup file not found: $FILE"
            exit 1
        fi
        
        warning "⚠️  This will restore the database from: $FILE"
        read -p "Continue? (yes/no): " confirm
        if [ "$confirm" = "yes" ]; then
            info "📥 Restoring database..."
            docker exec -i takathon-db psql -U postgres -d takathon < "$FILE"
            success "✅ Database restored"
        else
            warning "❌ Restore cancelled"
        fi
        ;;
    
    logs)
        info "📋 Database logs:"
        docker compose logs postgres --follow
        ;;
    
    shell)
        info "🐘 Opening PostgreSQL shell..."
        info "Type '\q' to exit"
        docker exec -it takathon-db psql -U postgres -d takathon
        ;;
    
    *)
        echo "TAkathon Database Management"
        echo ""
        echo "Usage: ./tools/scripts/db.sh <action> [options]"
        echo ""
        echo "Actions:"
        echo "  start      - Start PostgreSQL container"        echo "  stop       - Stop PostgreSQL container"
        echo "  reset      - Reset and reseed database (deletes all data!)"
        echo "  seed       - Seed database with test data"
        echo "  studio     - Open Prisma Studio GUI"
        echo "  migrate    - Create new migration"
        echo "  push       - Push schema to database"
        echo "  status     - Show database and migration status"
        echo "  backup     - Create database backup"
        echo "  restore    - Restore database from backup"
        echo "  logs       - Show database logs"
        echo "  shell      - Open PostgreSQL shell"
        echo ""
        echo "Examples:"
        echo "  ./tools/scripts/db.sh start"
        echo "  ./tools/scripts/db.sh reset"
        echo "  ./tools/scripts/db.sh backup"
        echo "  ./tools/scripts/db.sh restore database/backups/takathon_20260227_120000.sql"
        exit 1
        ;;
esac
