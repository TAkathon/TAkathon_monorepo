-- TAkathon Database Schema
-- PostgreSQL 14+

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- USERS & AUTHENTICATION
-- ============================================================================

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('student', 'organizer', 'sponsor')),
    avatar_url TEXT,
    bio TEXT,
    github_url TEXT,
    linkedin_url TEXT,
    portfolio_url TEXT,
    organization VARCHAR(255),
    organization_website TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_role ON users(role);

-- ============================================================================
-- PROFILES (Role specific details)
-- ============================================================================

CREATE TABLE student_profiles (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    university VARCHAR(255),
    degree VARCHAR(255),
    graduation_year INTEGER,
    resume_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE organizer_profiles (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    organization_name VARCHAR(255) NOT NULL,
    position VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE sponsor_profiles (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    company_name VARCHAR(255) NOT NULL,
    industry VARCHAR(100),
    website_url TEXT,
    logo_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- SKILLS
-- ============================================================================

CREATE TABLE skills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) UNIQUE NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN (
        'frontend', 'backend', 'design', 'data_science', 
        'mobile', 'devops', 'product_management', 'other'
    )),
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_skills_category ON skills(category);
CREATE INDEX idx_skills_name ON skills(name);

CREATE TABLE user_skills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    skill_id UUID NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
    proficiency_level VARCHAR(20) NOT NULL CHECK (proficiency_level IN (
        'beginner', 'intermediate', 'advanced', 'expert'
    )),
    years_of_experience INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, skill_id)
);

CREATE INDEX idx_user_skills_user_id ON user_skills(user_id);
CREATE INDEX idx_user_skills_skill_id ON user_skills(skill_id);

-- ============================================================================
-- HACKATHONS
-- ============================================================================

CREATE TABLE hackathons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    organizer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(30) NOT NULL DEFAULT 'draft' CHECK (status IN (
        'draft', 'registration_open', 'registration_closed', 
        'in_progress', 'completed', 'cancelled'
    )),
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    registration_deadline TIMESTAMP WITH TIME ZONE NOT NULL,
    location TEXT,
    is_virtual BOOLEAN NOT NULL DEFAULT false,
    max_participants INTEGER,
    max_team_size INTEGER NOT NULL DEFAULT 5,
    min_team_size INTEGER NOT NULL DEFAULT 2,
    required_skills TEXT[], -- Array of skill IDs as strings
    prize_pool TEXT,
    rules TEXT,
    banner_url TEXT,
    website_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT valid_dates CHECK (end_date > start_date),
    CONSTRAINT valid_registration CHECK (registration_deadline <= start_date),
    CONSTRAINT valid_team_size CHECK (max_team_size >= min_team_size)
);

CREATE INDEX idx_hackathons_organizer_id ON hackathons(organizer_id);
CREATE INDEX idx_hackathons_status ON hackathons(status);
CREATE INDEX idx_hackathons_start_date ON hackathons(start_date);

CREATE TABLE hackathon_participants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    hackathon_id UUID NOT NULL REFERENCES hackathons(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL DEFAULT 'registered' CHECK (status IN (
        'registered', 'in_team', 'withdrawn'
    )),
    team_id UUID,
    registered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(hackathon_id, user_id)
);

CREATE INDEX idx_hackathon_participants_hackathon_id ON hackathon_participants(hackathon_id);
CREATE INDEX idx_hackathon_participants_user_id ON hackathon_participants(user_id);
CREATE INDEX idx_hackathon_participants_status ON hackathon_participants(status);

-- ============================================================================
-- TEAMS
-- ============================================================================

CREATE TABLE teams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    hackathon_id UUID NOT NULL REFERENCES hackathons(id) ON DELETE CASCADE,
    creator_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    description TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'forming' CHECK (status IN (
        'forming', 'complete', 'disbanded'
    )),
    max_size INTEGER NOT NULL DEFAULT 5,
    current_size INTEGER NOT NULL DEFAULT 1,
    is_public BOOLEAN NOT NULL DEFAULT true,
    project_idea TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT valid_max_size CHECK (max_size > 0),
    CONSTRAINT valid_current_size CHECK (current_size >= 0 AND current_size <= max_size)
);

CREATE INDEX idx_teams_hackathon_id ON teams(hackathon_id);
CREATE INDEX idx_teams_creator_id ON teams(creator_id);
CREATE INDEX idx_teams_status ON teams(status);

CREATE TABLE team_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(20) NOT NULL CHECK (role IN ('captain', 'member')),
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(team_id, user_id)
);

CREATE INDEX idx_team_members_team_id ON team_members(team_id);
CREATE INDEX idx_team_members_user_id ON team_members(user_id);

CREATE TABLE team_invitations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    inviter_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    invitee_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN (
        'pending', 'accepted', 'rejected', 'expired'
    )),
    message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    responded_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_team_invitations_team_id ON team_invitations(team_id);
CREATE INDEX idx_team_invitations_invitee_id ON team_invitations(invitee_id);
CREATE INDEX idx_team_invitations_status ON team_invitations(status);

-- ============================================================================
-- APPLICATIONS & SPONSORSHIPS
-- ============================================================================

CREATE TABLE applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    hackathon_id UUID NOT NULL REFERENCES hackathons(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN (
        'pending', 'accepted', 'rejected', 'waitlisted'
    )),
    resume_url TEXT,
    motivation TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(hackathon_id, user_id)
);

CREATE INDEX idx_applications_hackathon_id ON applications(hackathon_id);
CREATE INDEX idx_applications_user_id ON applications(user_id);
CREATE INDEX idx_applications_status ON applications(status);

CREATE TABLE sponsorships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sponsor_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    hackathon_id UUID NOT NULL REFERENCES hackathons(id) ON DELETE CASCADE,
    tier VARCHAR(50) NOT NULL CHECK (tier IN (
        'platinum', 'gold', 'silver', 'bronze', 'other'
    )),
    amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN (
        'pending', 'approved', 'rejected', 'paid'
    )),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_sponsorships_sponsor_id ON sponsorships(sponsor_id);
CREATE INDEX idx_sponsorships_hackathon_id ON sponsorships(hackathon_id);
CREATE INDEX idx_sponsorships_status ON sponsorships(status);

-- ============================================================================
-- TRIGGERS & FUNCTIONS
-- ============================================================================

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_student_profiles_updated_at BEFORE UPDATE ON student_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_organizer_profiles_updated_at BEFORE UPDATE ON organizer_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sponsor_profiles_updated_at BEFORE UPDATE ON sponsor_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_hackathons_updated_at BEFORE UPDATE ON hackathons
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_teams_updated_at BEFORE UPDATE ON teams
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_applications_updated_at BEFORE UPDATE ON applications
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sponsorships_updated_at BEFORE UPDATE ON sponsorships
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Update team current_size when members join/leave
CREATE OR REPLACE FUNCTION update_team_size()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE teams SET current_size = current_size + 1 WHERE id = NEW.team_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE teams SET current_size = current_size - 1 WHERE id = OLD.team_id;
    END IF;
    RETURN NULL;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_team_size_on_member_change
AFTER INSERT OR DELETE ON team_members
FOR EACH ROW EXECUTE FUNCTION update_team_size();

-- Update participant status when joining team
CREATE OR REPLACE FUNCTION update_participant_status()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE hackathon_participants 
        SET status = 'in_team', team_id = NEW.team_id
        WHERE user_id = NEW.user_id 
        AND hackathon_id = (SELECT hackathon_id FROM teams WHERE id = NEW.team_id);
    END IF;
    RETURN NULL;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_participant_on_team_join
AFTER INSERT ON team_members
FOR EACH ROW EXECUTE FUNCTION update_participant_status();

-- ============================================================================
-- SEED DATA (Common Skills)
-- ============================================================================

INSERT INTO skills (name, category) VALUES
-- Frontend
('React', 'frontend'),
('Vue.js', 'frontend'),
('Angular', 'frontend'),
('Next.js', 'frontend'),
('TypeScript', 'frontend'),
('JavaScript', 'frontend'),
('HTML/CSS', 'frontend'),
('Tailwind CSS', 'frontend'),

-- Backend
('Node.js', 'backend'),
('Python', 'backend'),
('FastAPI', 'backend'),
('Django', 'backend'),
('Express.js', 'backend'),
('PostgreSQL', 'backend'),
('MongoDB', 'backend'),
('REST API', 'backend'),
('GraphQL', 'backend'),

-- Mobile
('React Native', 'mobile'),
('Flutter', 'mobile'),
('Swift', 'mobile'),
('Kotlin', 'mobile'),

-- Design
('UI/UX Design', 'design'),
('Figma', 'design'),
('Adobe XD', 'design'),
('Prototyping', 'design'),

-- Data Science
('Machine Learning', 'data_science'),
('TensorFlow', 'data_science'),
('PyTorch', 'data_science'),
('Data Analysis', 'data_science'),

-- DevOps
('Docker', 'devops'),
('Kubernetes', 'devops'),
('CI/CD', 'devops'),
('AWS', 'devops'),

-- Product Management
('Product Strategy', 'product_management'),
('User Research', 'product_management'),
('Agile/Scrum', 'product_management')
ON CONFLICT (name) DO NOTHING;
