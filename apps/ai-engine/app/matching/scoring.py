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

# Canonical time-slot keys stored in DB / frontend
VALID_SLOTS: frozenset[str] = frozenset(
    [
        "weekday_morning",    # Mon–Fri  06:00–12:00
        "weekday_afternoon",  # Mon–Fri  12:00–18:00
        "weekday_evening",    # Mon–Fri  18:00–23:00
        "weekend_morning",    # Sat–Sun  06:00–12:00
        "weekend_afternoon",  # Sat–Sun  12:00–18:00
        "weekend_evening",    # Sat–Sun  18:00–23:00
    ]
)


def availability_overlap(
    team_availability: list[dict],
    candidate_availability: list[dict],
) -> float:
    """Score how well the candidate's availability aligns with the team's.

    Uses the structure produced by the student-portal settings form:
    ``{"timezone": str, "hoursPerWeek": int, "preferredSlots": list[str]}``

    Two sub-scores are combined:
    - **Slot score (70 %)** — Jaccard similarity between the candidate's
      preferred slots and the *union* of all team members' slots.
    - **Hours score (30 %)** — how close the candidate's weekly hours
      commitment is to the team average (capped at 1.0 when equal or higher).

    Returns 0.5 (neutral) when either side has no data so candidates without
    availability set are not unfairly penalised.
    """
    if not candidate_availability or not team_availability:
        return 0.5

    cand_data = candidate_availability[0] if candidate_availability else {}
    cand_slots: set[str] = set(cand_data.get("preferredSlots", [])) & VALID_SLOTS
    cand_hours: float = float(cand_data.get("hoursPerWeek", 0) or 0)

    if not cand_slots and cand_hours == 0:
        return 0.5  # no data from candidate — neutral

    # Aggregate team slots (union) and average hours
    team_slots: set[str] = set()
    team_hours_list: list[float] = []
    for member in team_availability:
        team_slots.update(set(member.get("preferredSlots", [])) & VALID_SLOTS)
        h = float(member.get("hoursPerWeek", 0) or 0)
        if h > 0:
            team_hours_list.append(h)

    if not team_slots and not team_hours_list:
        return 0.5  # no data from team — neutral

    # Jaccard slot similarity
    if team_slots and cand_slots:
        intersection = cand_slots & team_slots
        union = cand_slots | team_slots
        slot_score = len(intersection) / len(union)
    elif not team_slots or not cand_slots:
        slot_score = 0.5  # one side has no slots — neutral
    else:
        slot_score = 0.0

    # Hours commitment compatibility
    if team_hours_list and cand_hours > 0:
        team_avg_hours = sum(team_hours_list) / len(team_hours_list)
        if cand_hours >= team_avg_hours:
            hours_score = 1.0
        else:
            hours_score = cand_hours / team_avg_hours
    else:
        hours_score = 0.5  # one side has no data — neutral

    return round(0.7 * slot_score + 0.3 * hours_score, 4)
