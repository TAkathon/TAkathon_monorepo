// User domain types

export enum UserRole {
  STUDENT = 'student',
  ORGANIZER = 'organizer',
}

export enum ProficiencyLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
  EXPERT = 'expert',
}

export interface User {
  id: string;
  email: string;
  username: string;
  fullName: string;
  role: UserRole;
  avatarUrl?: string;
  bio?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  description?: string;
}

export enum SkillCategory {
  FRONTEND = 'frontend',
  BACKEND = 'backend',
  DESIGN = 'design',
  DATA_SCIENCE = 'data_science',
  MOBILE = 'mobile',
  DEVOPS = 'devops',
  PM = 'product_management',
  OTHER = 'other',
}

export interface UserSkill {
  userId: string;
  skillId: string;
  proficiencyLevel: ProficiencyLevel;
  yearsOfExperience?: number;
}

export interface StudentProfile extends User {
  role: UserRole.STUDENT;
  skills: UserSkill[];
  preferences?: {
    teamSize?: number;
    preferredRoles?: string[];
    availableHours?: number;
  };
}

export interface OrganizerProfile extends User {
  role: UserRole.ORGANIZER;
  organization?: string;
  organizationWebsite?: string;
}
