-- TAkathon Database Initialization
-- This script is run automatically when PostgreSQL container starts up
-- It creates the database, extensions, and basic schema

-- Create database if not exists (handled by Docker environment)
-- POSTGRES_DB environment variable creates the database

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Log initialization
DO $$ 
BEGIN 
  RAISE NOTICE 'TAkathon Database initialized successfully!';
  RAISE NOTICE 'Database: takathon';
  RAISE NOTICE 'Extensions: uuid-ossp, pgcrypto';
END $$;
