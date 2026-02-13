// Hackathon domain types

export enum HackathonStatus {
  DRAFT = 'draft',
  REGISTRATION_OPEN = 'registration_open',
  REGISTRATION_CLOSED = 'registration_closed',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export interface Hackathon {
  id: string;
  title: string;
  description: string;
  organizerId: string;
  status: HackathonStatus;
  startDate: Date;
  endDate: Date;
  registrationDeadline: Date;
  location?: string;
  isVirtual: boolean;
  maxParticipants?: number;
  maxTeamSize: number;
  minTeamSize: number;
  requiredSkills?: string[];
  prizePool?: string;
  rules?: string;
  bannerUrl?: string;
  websiteUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface HackathonParticipant {
  id: string;
  hackathonId: string;
  userId: string;
  registeredAt: Date;
  status: ParticipantStatus;
  teamId?: string;
}

export enum ParticipantStatus {
  REGISTERED = 'registered',
  IN_TEAM = 'in_team',
  WITHDRAWN = 'withdrawn',
}

export interface HackathonStats {
  totalParticipants: number;
  totalTeams: number;
  participantsWithoutTeam: number;
  averageTeamSize: number;
  skillDistribution: Record<string, number>;
}
