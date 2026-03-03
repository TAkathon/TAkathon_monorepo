"""
Pydantic request/response models for the AI matching endpoint.

Using Pydantic v2 (bundled with FastAPI ≥ 0.109).
"""

from __future__ import annotations

from typing import Optional

from pydantic import BaseModel, field_validator, model_validator


# ---------------------------------------------------------------------------
# Shared sub-models
# ---------------------------------------------------------------------------


class SkillEntry(BaseModel):
    name: str
    category: Optional[str] = None
    proficiency: str = "intermediate"

    @field_validator("name")
    @classmethod
    def name_not_blank(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("Skill name must not be blank")
        return v.strip()

    @field_validator("proficiency")
    @classmethod
    def valid_proficiency(cls, v: str) -> str:
        allowed = {"beginner", "intermediate", "advanced", "expert"}
        if v.lower() not in allowed:
            raise ValueError(f"proficiency must be one of {sorted(allowed)}")
        return v.lower()


class CandidateProfile(BaseModel):
    userId: str
    username: Optional[str] = ""
    fullName: Optional[str] = ""
    avatarUrl: Optional[str] = None
    skills: list[SkillEntry] = []

    @field_validator("userId")
    @classmethod
    def user_id_not_blank(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("candidateId must not be blank")
        return v.strip()


# ---------------------------------------------------------------------------
# Request model
# ---------------------------------------------------------------------------


class MatchRequest(BaseModel):
    teamSkills: list[SkillEntry] = []
    candidates: list[CandidateProfile]
    openSpots: int = 1
    limit: int = 5

    @field_validator("candidates")
    @classmethod
    def candidates_not_empty(cls, v: list[CandidateProfile]) -> list[CandidateProfile]:
        if len(v) == 0:
            raise ValueError("candidates list must not be empty")
        return v

    @field_validator("limit")
    @classmethod
    def limit_range(cls, v: int) -> int:
        if not (1 <= v <= 50):
            raise ValueError("limit must be between 1 and 50")
        return v

    @field_validator("openSpots")
    @classmethod
    def open_spots_positive(cls, v: int) -> int:
        if v < 1:
            raise ValueError("openSpots must be at least 1")
        return v


# ---------------------------------------------------------------------------
# Response models
# ---------------------------------------------------------------------------


class ScoreBreakdown(BaseModel):
    skill: float
    experience: float
    availability: float


class MatchSuggestion(BaseModel):
    candidateId: str
    username: str
    fullName: str
    avatarUrl: Optional[str]
    score: float
    scoreBreakdown: ScoreBreakdown
    explanation: str
    skills: list[dict]
    complementarySkills: list[str]


class MatchResponse(BaseModel):
    suggestions: list[MatchSuggestion]
    totalCandidates: int
