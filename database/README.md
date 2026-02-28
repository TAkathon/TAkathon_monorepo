# TAkathon Database Setup

## Overview
TAkathon uses PostgreSQL 16 as the primary database with Prisma ORM for schema management and type-safe queries.

## Architecture
- **PostgreSQL 16**: Primary database
- **Prisma ORM**: Schema definition, migrations, and queries
- **Docker**: Containerized database for development
- **SQL Schema**: `database/schema.sql` (raw SQL reference)
- **Prisma Schema**: `prisma/schema.prisma` (source of truth)

## Quick Start

### 1. Start Database with Docker
```bash
# Start PostgreSQL container
docker compose up postgres -d

# Verify database is running
docker compose ps postgres
```

### 2. Run Prisma Migrations
```bash
# Generate Prisma Client
npx prisma generate

# Push schema to database (dev environment)
npx prisma db push

# Or run migrations (production-ready)
npx prisma migrate dev --name init
```

### 3. Seed Database
```bash
# Seed with test data
npx prisma db seed
```

## Database Connection

### Environment Variables
```env
DATABASE_URL="postgresql://postgres:postgrespassword@localhost:5432/takathon?schema=public"
```

### Connection Details
- **Host**: localhost
- **Port**: 5432
- **Database**: takathon
- **User**: postgres
- **Password**: postgrespassword (dev only)

## Schema Management

### Prisma Workflow (Recommended)
```bash
# 1. Modify prisma/schema.prisma

# 2. Create migration
npx prisma migrate dev --name <migration_name>

# 3. Generate client
npx prisma generate

# 4. Apply to production
npx prisma migrate deploy
```

### Direct SQL (Advanced)
```bash
# Connect to database
docker exec -it takathon-db psql -U postgres -d takathon

# Run SQL file
docker exec -i takathon-db psql -U postgres -d takathon < database/schema.sql
```

## Database Operations

### View Database
```bash
# Open Prisma Studio (GUI)
npx prisma studio

# Or use psql
docker exec -it takathon-db psql -U postgres -d takathon
```

### Reset Database
```bash
# Reset and reseed
npx prisma migrate reset

# Or manually
docker compose down -v
docker compose up postgres -d
npx prisma db push
npx prisma db seed
```

### Backup Database
```bash
# Backup to file
docker exec takathon-db pg_dump -U postgres takathon > backup.sql

# Restore from file
docker exec -i takathon-db psql -U postgres -d takathon < backup.sql
```

## Schema Overview

### Core Tables
- **users**: All user accounts (students, organizers, sponsors)
- **student_profiles**: Student-specific data
- **organizer_profiles**: Organizer-specific data
- **sponsor_profiles**: Sponsor-specific data

### Hackathon Management
- **hackathons**: Event definitions
- **hackathon_participants**: Registration tracking
- **teams**: Team information
- **team_members**: Team membership
- **team_invitations**: Pending invitations

### Skills & Matching
- **skills**: Skill taxonomy (pre-seeded)
- **user_skills**: User skill proficiency levels

### Sponsorships
- **sponsorships**: Sponsor contributions
- **applications**: Sponsor applications to hackathons

## Triggers & Automation

The database includes several triggers for automatic updates:
- **updated_at**: Auto-updates on record changes
- **team size**: Auto-calculates team member count
- **participant status**: Auto-updates when joining teams

## Migrations

### Creating Migrations
```bash
# Development
npx prisma migrate dev --name <descriptive_name>

# Examples:
npx prisma migrate dev --name add_user_bio
npx prisma migrate dev --name create_teams_table
```

### Applying Migrations
```bash
# Development (auto-apply)
npx prisma migrate dev

# Production (manual apply)
npx prisma migrate deploy
```

### Migration History
```bash
# View migration status
npx prisma migrate status

# View migration history
docker exec takathon-db psql -U postgres -d takathon -c "SELECT * FROM _prisma_migrations;"
```

## Troubleshooting

### Connection Issues
```bash
# Check if PostgreSQL is running
docker compose ps postgres

# Check logs
docker compose logs postgres

# Restart database
docker compose restart postgres
```

### Schema Sync Issues
```bash
# Reset Prisma state
rm -rf node_modules/.prisma
npx prisma generate

# Force schema sync
npx prisma db push --force-reset
```

### Port Conflicts
If port 5432 is already in use:
```yaml
# In docker-compose.yml, change:
ports:
  - "5433:5432"  # Use different host port

# Update DATABASE_URL
DATABASE_URL="postgresql://postgres:postgrespassword@localhost:5433/takathon?schema=public"
```

## Testing

### Run Tests Against Database
```bash
# Start test database
docker compose -f docker-compose.test.yml up -d

# Run tests
npm test

# Cleanup
docker compose -f docker-compose.test.yml down -v
```

## Production Considerations

### Security
- ⚠️ Change default passwords
- ⚠️ Use environment variables for credentials
- ⚠️ Enable SSL connections
- ⚠️ Restrict network access

### Performance
- Enable connection pooling (Prisma default)
- Add indexes for frequent queries
- Monitor query performance
- Consider read replicas for scale

### Backups
- Implement automated backups
- Test restore procedures
- Store backups securely
- Maintain backup retention policy

## Resources
- [Prisma Documentation](https://www.prisma.io/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/16/)
- [Docker PostgreSQL](https://hub.docker.com/_/postgres)
