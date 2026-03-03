"""
Matching engine — orchestrates scorers, applies weights, generates explanations.

Weights (must sum to 1.0):
  Skill complementarity  40 %
  Experience balance     30 %
  Availability overlap   30 %
"""

from __future__ import annotations

from .scoring import (
    availability_overlap,
    experience_balance,
    proficiency_to_int,
    skill_complementarity,
)

# ---------------------------------------------------------------------------
# Scorer weights
# ---------------------------------------------------------------------------

WEIGHTS: dict[str, float] = {
    "skill": 0.40,
    "experience": 0.30,
    "availability": 0.30,
}

assert abs(sum(WEIGHTS.values()) - 1.0) < 1e-9, "Weights must sum to 1.0"


# ---------------------------------------------------------------------------
# Explanation generator
# ---------------------------------------------------------------------------


def _generate_explanation(
    skill_score: float,
    exp_score: float,
    avail_score: float,
    new_skills: set[str],
    candidate_avg_prof: float,
    team_avg_prof: float,
) -> str:
    """Produce a short human-readable explanation for the overall score."""
    parts: list[str] = []

    if new_skills:
        sample = sorted(new_skills)[:3]
        label = ", ".join(sample)
        suffix = " and more" if len(new_skills) > 3 else ""
        parts.append(f"brings new skills: {label}{suffix}")
    elif skill_score == 0.0:
        parts.append("skill set overlaps entirely with the team")

    if exp_score >= 0.65:
        parts.append("helps balance team experience level")
    elif exp_score <= 0.35:
        parts.append("experience level similar to existing members")

    if not parts:
        parts.append("complements the team moderately")

    return "; ".join(parts).capitalize() + "."


# ---------------------------------------------------------------------------
# Public API
# ---------------------------------------------------------------------------


def suggest(
    team_skills: list[dict],
    candidates: list[dict],
    open_spots: int = 1,
    limit: int = 5,
) -> dict:
    """Rank candidates by composite match score.

    Args:
        team_skills: List of ``{"name": str, "proficiency": str}`` dicts for
            all current team members' skills (may be empty for a new team).
        candidates: List of candidate profile dicts, each containing at least
            ``userId`` and ``skills`` (list of skill dicts).
        open_spots: Number of open roster spots (unused in scoring but passed
            through so future algorithms can weight it).
        limit: Maximum number of suggestions to return.

    Returns:
        ``{"suggestions": [...], "totalCandidates": int}``
    """
    # Build team context once
    team_skill_names: set[str] = {s["name"] for s in team_skills}
    team_proficiencies: list[int] = [
        proficiency_to_int(s.get("proficiency", "intermediate")) for s in team_skills
    ]
    team_avg_prof = (
        sum(team_proficiencies) / len(team_proficiencies) if team_proficiencies else 2.5
    )

    results: list[dict] = []

    for candidate in candidates:
        cand_skills: list[dict] = candidate.get("skills", [])
        cand_skill_names: set[str] = {s["name"] for s in cand_skills}
        cand_proficiencies: list[int] = [
            proficiency_to_int(s.get("proficiency", "intermediate")) for s in cand_skills
        ]
        cand_avg_prof = (
            sum(cand_proficiencies) / len(cand_proficiencies) if cand_proficiencies else 2.0
        )

        # --- individual scores ---
        s_skill = skill_complementarity(team_skill_names, cand_skill_names)
        s_exp = experience_balance(team_proficiencies, cand_avg_prof)
        s_avail = availability_overlap([], [])  # neutral until data is available

        # --- composite score ---
        final = (
            WEIGHTS["skill"] * s_skill
            + WEIGHTS["experience"] * s_exp
            + WEIGHTS["availability"] * s_avail
        )

        new_skills = cand_skill_names - team_skill_names
        explanation = _generate_explanation(
            s_skill, s_exp, s_avail, new_skills, cand_avg_prof, team_avg_prof
        )

        results.append(
            {
                "candidateId": candidate.get("userId", ""),
                "username": candidate.get("username", ""),
                "fullName": candidate.get("fullName", ""),
                "avatarUrl": candidate.get("avatarUrl"),
                "score": round(final, 4),
                "scoreBreakdown": {
                    "skill": round(s_skill, 4),
                    "experience": round(s_exp, 4),
                    "availability": round(s_avail, 4),
                },
                "explanation": explanation,
                "skills": [
                    {
                        "name": s["name"],
                        "proficiency": s.get("proficiency", "intermediate"),
                    }
                    for s in cand_skills
                ],
                "complementarySkills": sorted(new_skills),
            }
        )

    results.sort(key=lambda x: x["score"], reverse=True)

    return {
        "suggestions": results[:limit],
        "totalCandidates": len(candidates),
    }
