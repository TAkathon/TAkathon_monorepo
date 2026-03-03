"""
Pure scoring functions for the AI teammate matching engine.

Each function returns a float in [0.0, 1.0] where 1.0 is a perfect match
for that dimension. Functions are stateless and side-effect free so they
can be unit-tested in isolation and swapped for ML-based alternatives later.
"""

from __future__ import annotations


# ---------------------------------------------------------------------------
# Proficiency helpers
# ---------------------------------------------------------------------------

PROFICIENCY_MAP: dict[str, int] = {
    "beginner": 1,
    "intermediate": 2,
    "advanced": 3,
    "expert": 4,
}


def proficiency_to_int(level: str) -> int:
    """Map a proficiency string to a numeric value (1–4)."""
    return PROFICIENCY_MAP.get(level.lower(), 2)


# ---------------------------------------------------------------------------
# Scorer 1 — Skill Complementarity  (weight 0.40)
# ---------------------------------------------------------------------------


def skill_complementarity(
    team_skill_names: set[str],
    candidate_skill_names: set[str],
) -> float:
    """Score how many unique skills the candidate brings that the team lacks.

    Args:
        team_skill_names: Set of skill names already present in the team.
        candidate_skill_names: Set of skill names the candidate has.

    Returns:
        0.0 → all skills are duplicates of existing team skills.
        1.0 → every candidate skill is new to the team.
        0.5 → returned when the candidate has no skills (neutral).
    """
    if not candidate_skill_names:
        return 0.5  # no data, neutral

    new_skills = candidate_skill_names - team_skill_names
    return len(new_skills) / len(candidate_skill_names)


# ---------------------------------------------------------------------------
# Scorer 2 — Experience Balance  (weight 0.30)
# ---------------------------------------------------------------------------


def experience_balance(
    team_proficiencies: list[int],
    candidate_proficiency: float,
) -> float:
    """Score how well the candidate balances the team's experience level.

    The ideal average proficiency for a balanced team is 2.5 (mid-point of
    the 1–4 scale).  A candidate who moves the team average closer to 2.5
    scores higher.

    Args:
        team_proficiencies: Numeric proficiency values (1–4) of current members.
            Pass an empty list when the team has no members yet.
        candidate_proficiency: Numeric proficiency for the candidate (may be a
            float when averaged across multiple skills).

    Returns:
        Float in [0.0, 1.0].  0.5 is neutral (no change to balance).
    """
    IDEAL: float = 2.5
    MAX_DIST: float = 1.5  # max possible distance from ideal on the 1–4 scale

    if not team_proficiencies:
        # Empty team — any proficiency is equally welcome
        return 0.5

    team_avg = sum(team_proficiencies) / len(team_proficiencies)
    current_dist = abs(team_avg - IDEAL)

    new_avg = (sum(team_proficiencies) + candidate_proficiency) / (len(team_proficiencies) + 1)
    new_dist = abs(new_avg - IDEAL)

    # Improvement is positive when the candidate moves the mean toward ideal
    improvement = current_dist - new_dist

    # Normalise: max improvement ≈ MAX_DIST; scale to [0, 1] around 0.5
    score = 0.5 + improvement / (MAX_DIST * 2)
    return max(0.0, min(1.0, score))


# ---------------------------------------------------------------------------
# Scorer 3 — Availability Overlap  (weight 0.30)
# ---------------------------------------------------------------------------


def availability_overlap(
    team_availability: list[dict],
    candidate_availability: list[dict],
) -> float:
    """Score the overlap between the candidate's availability and the team's.

    NOTE: The current data model does not persist availability windows.
    Until the student profile is extended with an ``availability`` field this
    function returns 0.5 (a neutral score that does not advantage or
    disadvantage any candidate).  The interface is intentionally preserved so
    the scorer can be upgraded without touching the engine or the gateway.

    Args:
        team_availability: List of availability window dicts for team members.
        candidate_availability: Availability window dicts for the candidate.

    Returns:
        0.5 (neutral) until availability data is available in the schema.
    """
    # Future implementation — compute jaccard overlap of time windows.
    # For now all candidates receive the same neutral score so the ranking
    # is driven purely by skill complementarity and experience balance.
    _ = team_availability, candidate_availability
    return 0.5
