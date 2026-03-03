/**
 * Typed API functions for Team Invitation operations (student role).
 */

import api from "./client";
import type { ApiResponse } from "@takathon/shared/types";

// ─── Response types ───────────────────────────────────────────────────────────

export interface Invitation {
  id: string;
  teamId: string;
  inviterId: string;
  inviteeId: string;
  status: "pending" | "accepted" | "rejected" | "expired";
  message?: string;
  createdAt: string;
  expiresAt: string;
  respondedAt?: string;
  team?: {
    id: string;
    name: string;
    currentSize: number;
    maxSize: number;
    hackathon?: { id: string; title: string };
  };
  inviter?: { id: string; fullName: string; email: string };
}

// ─── Exported API functions ───────────────────────────────────────────────────

/** List all pending invitations for the authenticated student */
export async function getMyInvitations(): Promise<Invitation[]> {
  const res = await api.get<ApiResponse<Invitation[]>>(
    "/api/v1/students/teams/invitations"
  );
  return res.data.data ?? [];
}

/** Accept an invitation */
export async function acceptInvitation(invitationId: string): Promise<void> {
  await api.post(
    `/api/v1/students/teams/invitations/${invitationId}/respond`,
    { accept: true }
  );
}

/** Reject an invitation */
export async function rejectInvitation(invitationId: string): Promise<void> {
  await api.post(
    `/api/v1/students/teams/invitations/${invitationId}/respond`,
    { accept: false }
  );
}
