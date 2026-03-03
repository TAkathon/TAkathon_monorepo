"""Integration-style tests for the matching engine (suggest function)."""

import pytest
from app.matching.engine import suggest, WEIGHTS


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def make_candidate(user_id, skills):
    """Build a minimal candidate dict."""
    return {
        "userId": user_id,
        "username": f"user_{user_id[:4]}",
        "fullName": f"Test User {user_id[:4]}",
        "avatarUrl": None,
        "skills": [{"name": s, "proficiency": "intermediate"} for s in skills],
    }


# ---------------------------------------------------------------------------
# Basic functional tests
# ---------------------------------------------------------------------------


def test_suggest_returns_dict_with_expected_keys():
    team_skills = [{"name": "Python", "proficiency": "advanced"}]
    candidates = [make_candidate("uid-001", ["React", "TypeScript"])]

    result = suggest(team_skills, candidates, limit=5)

    assert "suggestions" in result
    assert "totalCandidates" in result
    assert result["totalCandidates"] == 1


def test_suggest_ranks_by_score_descending():
    team_skills = [{"name": "Python", "proficiency": "intermediate"}]
    # candidate A brings 3 new skills → better complementarity
    # candidate B brings 0 new skills
    candidates = [
        make_candidate("uid-b", ["Python"]),  # duplicate
        make_candidate("uid-a", ["React", "Docker", "Kubernetes"]),  # all new
    ]

    result = suggest(team_skills, candidates, limit=5)
    scores = [s["score"] for s in result["suggestions"]]

    assert scores == sorted(scores, reverse=True), "Suggestions must be sorted descending"


def test_suggest_respects_limit():
    team_skills = []
    candidates = [make_candidate(f"uid-{i:03d}", ["Skill" + str(i)]) for i in range(10)]

    result = suggest(team_skills, candidates, limit=3)
    assert len(result["suggestions"]) == 3


def test_suggest_empty_team_skills_still_works():
    """An empty team should not crash the engine."""
    candidates = [make_candidate("uid-001", ["Go", "Rust"])]
    result = suggest([], candidates, limit=5)
    assert len(result["suggestions"]) == 1


def test_suggestion_contains_complement_skills():
    team_skills = [{"name": "Python", "proficiency": "intermediate"}]
    candidates = [make_candidate("uid-001", ["Python", "TypeScript", "React"])]

    result = suggest(team_skills, candidates, limit=5)
    suggestion = result["suggestions"][0]

    assert "TypeScript" in suggestion["complementarySkills"]
    assert "React" in suggestion["complementarySkills"]
    assert "Python" not in suggestion["complementarySkills"]


def test_suggestion_score_in_valid_range():
    team_skills = [{"name": "Java", "proficiency": "expert"}]
    candidates = [
        make_candidate("uid-001", ["Python", "Go"]),
        make_candidate("uid-002", ["Java"]),
    ]

    result = suggest(team_skills, candidates, limit=5)
    for s in result["suggestions"]:
        assert 0.0 <= s["score"] <= 1.0, f"Score out of range: {s['score']}"


def test_suggestion_breakdown_keys_present():
    candidates = [make_candidate("uid-001", ["Rust"])]
    result = suggest([], candidates)

    breakdown = result["suggestions"][0]["scoreBreakdown"]
    assert set(breakdown.keys()) == {"skill", "experience", "availability"}


# ---------------------------------------------------------------------------
# Weights sanity
# ---------------------------------------------------------------------------


def test_weights_sum_to_one():
    total = sum(WEIGHTS.values())
    assert abs(total - 1.0) < 1e-9


# ---------------------------------------------------------------------------
# Candidate with no skills
# ---------------------------------------------------------------------------


def test_candidate_no_skills_gets_neutral_score():
    team_skills = [{"name": "Python", "proficiency": "intermediate"}]
    candidate = {
        "userId": "uid-empty",
        "username": "empty",
        "fullName": "Empty User",
        "avatarUrl": None,
        "skills": [],
    }
    result = suggest(team_skills, [candidate])
    s = result["suggestions"][0]
    # skill complementarity is 0.5 (neutral), not 0.0
    assert s["scoreBreakdown"]["skill"] == 0.5
