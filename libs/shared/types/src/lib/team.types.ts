// Team domain types

export enum TeamStatus {
  FORMING = 'forming',
  COMPLETE = 'complete',
  DISBANDED = 'disbanded',
}

export enum InvitationStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  EXPIRED = 'expired',
}

export enum MemberRole {
  CAPTAIN = 'captain',
  MEMBER = 'member',
}

export interface Team {
  id: string;
  name: string;
  hackathonId: string;
  creatorId: string;
  description?: string;
  status: TeamStatus;
  maxSize: number;
  currentSize: number;
  isPublic: boolean;
  projectIdea?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TeamMember {
  id: string;
  teamId: string;
  userId: string;
  role: MemberRole;
  joinedAt: Date;
}

export interface TeamInvitation {
  id: string;
  teamId: string;
  inviterId: string;
  inviteeId: string;
  status: InvitationStatus;
  message?: string;
  createdAt: Date;
  expiresAt: Date;
  respondedAt?: Date;
}

export interface TeamMatchSuggestion {
  candidateId: string;
  score: number;
  reasons: string[];
  skillGaps: string[];
  commonSkills: string[];
}

export interface TeamDetails extends Team {
  members: (TeamMember & { user: { id: string; username: string; avatarUrl?: string } })[];
  skillCoverage: Record<string, number>;
  openSpots: number;
}
