#!/usr/bin/env pwsh
# Database setup and management script for TAkathon

param(
    [Parameter(Mandatory=$true)]
    [ValidateSet('start', 'stop', 'reset', 'seed', 'studio', 'migrate', 'push', 'status', 'backup', 'restore', 'logs', 'shell')]
    [string]$Action,
    
    [Parameter(Mandatory=$false)]
    [string]$File
)

$ErrorActionPreference = "Stop"

function Write-Info { Write-Host $args -ForegroundColor Cyan }
function Write-Success { Write-Host $args -ForegroundColor Green }
function Write-Error { Write-Host $args -ForegroundColor Red }
function Write-Warning { Write-Host $args -ForegroundColor Yellow }

switch ($Action) {
    'start' {
        Write-Info "🚀 Starting PostgreSQL database..."
        docker compose up postgres -d
        Start-Sleep -Seconds 3
        Write-Success "✅ Database started on port 5432"
        Write-Info "Connection URL: postgresql://postgres:postgrespassword@localhost:5432/takathon"
    }
    
    'stop' {
        Write-Info "🛑 Stopping PostgreSQL database..."
        docker compose stop postgres
        Write-Success "✅ Database stopped"
    }
    
    'reset' {
        Write-Warning "⚠️  This will delete ALL data in the database!"
        $confirm = Read-Host "Are you sure? (yes/no)"
        if ($confirm -eq 'yes') {
            Write-Info "🗑️  Resetting database..."
            docker compose down -v
            docker compose up postgres -d
            Start-Sleep -Seconds 5
            Write-Info "📤 Pushing schema..."
            npx prisma db push --force-reset
            Write-Info "🌱 Seeding database..."
            npx prisma db seed
            Write-Success "✅ Database reset complete"
        } else {
            Write-Warning "❌ Reset cancelled"
        }
    }
    
    'seed' {
        Write-Info "🌱 Seeding database with test data..."
        npx prisma db seed
        Write-Success "✅ Database seeded"
    }
    
    'studio' {
        Write-Info "🎨 Opening Prisma Studio..."
        npx prisma studio
    }
    
    'migrate' {
        Write-Info "📝 Creating new migration..."
        $name = Read-Host "Migration name"
        if ($name) {
            npx prisma migrate dev --name $name
            Write-Success "✅ Migration created: $name"
        } else {
            Write-Error "❌ Migration name required"
        }
    }
    
    'push' {
        Write-Info "📤 Pushing schema to database..."
        npx prisma db push
        Write-Success "✅ Schema pushed"
    }
    
    'status' {
        Write-Info "📊 Database Status:"
        Write-Host ""
        docker compose ps postgres
        Write-Host ""
        Write-Info "Prisma Migrations:"
        npx prisma migrate status
    }
    
    'backup' {
        $timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
        $backupFile = "database/backups/takathon_$timestamp.sql"
        Write-Info "💾 Creating backup: $backupFile"
        
        New-Item -ItemType Directory -Force -Path "database/backups" | Out-Null
        docker exec takathon-db pg_dump -U postgres takathon > $backupFile
        
        Write-Success "✅ Backup created: $backupFile"
    }
    
    'restore' {
        if (-not $File) {
            Write-Error "❌ Please specify backup file: -File <path>"
            exit 1
        }
        
        if (-not (Test-Path $File)) {
            Write-Error "❌ Backup file not found: $File"
            exit 1
        }
        
        Write-Warning "⚠️  This will restore the database from: $File"
        $confirm = Read-Host "Continue? (yes/no)"
        if ($confirm -eq 'yes') {
            Write-Info "📥 Restoring database..."
            Get-Content $File | docker exec -i takathon-db psql -U postgres -d takathon
            Write-Success "✅ Database restored"
        } else {
            Write-Warning "❌ Restore cancelled"
        }
    }
    
    'logs' {
        Write-Info "📋 Database logs:"
        docker compose logs postgres --follow
    }
    
    'shell' {
        Write-Info "🐘 Opening PostgreSQL shell..."
        Write-Info "Type '\q' to exit"
        docker exec -it takathon-db psql -U postgres -d takathon
    }
}
