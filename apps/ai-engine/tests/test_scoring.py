"""Unit tests for every pure scoring function in scoring.py."""

import pytest
from app.matching.scoring import (
    availability_overlap,
    experience_balance,
    proficiency_to_int,
    skill_complementarity,
)


# ---------------------------------------------------------------------------
# proficiency_to_int
# ---------------------------------------------------------------------------


@pytest.mark.parametrize(
    "level,expected",
    [
        ("beginner", 1),
        ("intermediate", 2),
        ("advanced", 3),
        ("expert", 4),
        ("BEGINNER", 1),
        ("Advanced", 3),
        ("unknown_value", 2),  # falls back to intermediate
    ],
)
def test_proficiency_to_int(level, expected):
    assert proficiency_to_int(level) == expected


# ---------------------------------------------------------------------------
# skill_complementarity
# ---------------------------------------------------------------------------


def test_skill_complementarity_all_new():
    team = {"Python", "Django"}
    candidate = {"React", "TypeScript", "CSS"}
    score = skill_complementarity(team, candidate)
    assert score == 1.0


def test_skill_complementarity_all_duplicate():
    team = {"Python", "Django", "React"}
    candidate = {"Python", "Django"}
    score = skill_complementarity(team, candidate)
    assert score == 0.0


def test_skill_complementarity_partial():
    team = {"Python"}
    candidate = {"Python", "React", "Docker"}  # 2 of 3 are new
    score = skill_complementarity(team, candidate)
    assert abs(score - 2 / 3) < 1e-9


def test_skill_complementarity_empty_team():
    team: set[str] = set()
    candidate = {"Go", "Rust"}
    score = skill_complementarity(team, candidate)
    assert score == 1.0  # every skill is new when team has none


def test_skill_complementarity_empty_candidate():
    team = {"Python"}
    candidate: set[str] = set()
    score = skill_complementarity(team, candidate)
    assert score == 0.5  # neutral when no candidate skills


def test_skill_complementarity_returns_float_in_range():
    team = {"A", "B", "C"}
    candidate = {"B", "D", "E"}
    score = skill_complementarity(team, candidate)
    assert 0.0 <= score <= 1.0


# ---------------------------------------------------------------------------
# experience_balance
# ---------------------------------------------------------------------------


def test_experience_balance_empty_team():
    score = experience_balance([], 2)
    assert score == 0.5


def test_experience_balance_improves_when_senior_adds_junior():
    # All-senior team (avg 4.0); adding a beginner (1) moves mean toward 2.5
    team = [4, 4, 4]
    score_with_junior = experience_balance(team, 1)
    score_with_senior = experience_balance(team, 4)
    assert score_with_junior > score_with_senior


def test_experience_balance_improves_when_junior_adds_senior():
    team = [1, 1, 1]
    score_with_senior = experience_balance(team, 4)
    score_with_junior = experience_balance(team, 1)
    assert score_with_senior > score_with_junior


def test_experience_balance_output_range():
    for team_prof in ([1, 1], [2, 3], [4, 4], []):
        for cand_prof in [1, 2, 3, 4]:
            s = experience_balance(team_prof, cand_prof)
            assert 0.0 <= s <= 1.0, f"Out of range: team={team_prof}, cand={cand_prof}, score={s}"


def test_experience_balance_neutral_when_already_balanced():
    # Team perfectly balanced around 2.5 → any addition deviates slightly
    team = [2, 3]  # avg = 2.5
    # Adding 2.5 (or nearest integer) should give score near 0.5
    score = experience_balance(team, 2)
    assert 0.4 <= score <= 0.6


# ---------------------------------------------------------------------------
# availability_overlap
# ---------------------------------------------------------------------------


def test_availability_overlap_returns_neutral():
    score = availability_overlap([], [])
    assert score == 0.5


def test_availability_overlap_ignores_input():
    """Until data is available, any input returns 0.5."""
    dummy = [{"day": "Monday", "slots": ["18:00-22:00"]}]
    assert availability_overlap(dummy, dummy) == 0.5
    assert availability_overlap(dummy, []) == 0.5
    assert availability_overlap([], dummy) == 0.5
