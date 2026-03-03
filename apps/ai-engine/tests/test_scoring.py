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

AVAIL_EVENING = {"timezone": "UTC", "hoursPerWeek": 20, "preferredSlots": ["weekday_evening", "weekend_afternoon"]}
AVAIL_MORNING = {"timezone": "UTC", "hoursPerWeek": 15, "preferredSlots": ["weekday_morning", "weekend_morning"]}
AVAIL_ALL     = {"timezone": "UTC", "hoursPerWeek": 30, "preferredSlots": ["weekday_evening", "weekend_afternoon", "weekday_morning"]}


def test_availability_overlap_no_data_returns_neutral():
    score = availability_overlap([], [])
    assert score == 0.5


def test_availability_overlap_no_candidate_data_returns_neutral():
    team = [AVAIL_EVENING]
    assert availability_overlap(team, []) == 0.5


def test_availability_overlap_no_team_data_returns_neutral():
    cand = [AVAIL_EVENING]
    assert availability_overlap([], cand) == 0.5


def test_availability_overlap_perfect_slot_match():
    team = [AVAIL_EVENING]
    cand = [AVAIL_EVENING]
    score = availability_overlap(team, cand)
    # Jaccard = 1.0, hours >= team avg (equal) → hours_score = 1.0 → final = 1.0
    assert score == 1.0


def test_availability_overlap_zero_slot_match():
    team = [AVAIL_EVENING]   # weekday_evening, weekend_afternoon
    cand = [AVAIL_MORNING]   # weekday_morning, weekend_morning — no overlap
    score = availability_overlap(team, cand)
    # slot_score = 0 / 4 = 0.0; hours_score = 15/20 = 0.75 → 0.7*0 + 0.3*0.75
    assert score < 0.4


def test_availability_overlap_partial_slot_match():
    team = [AVAIL_EVENING]   # 2 slots
    cand = [AVAIL_ALL]       # 3 slots, 2 overlap
    score = availability_overlap(team, cand)
    # intersection={weekday_evening, weekend_afternoon}, union=3 slots → jaccard=2/3
    assert 0.4 < score < 1.0


def test_availability_overlap_candidate_low_hours_penalised():
    team = [{"timezone": "UTC", "hoursPerWeek": 40, "preferredSlots": ["weekday_evening"]}]
    cand_high = [{"timezone": "UTC", "hoursPerWeek": 40, "preferredSlots": ["weekday_evening"]}]
    cand_low  = [{"timezone": "UTC", "hoursPerWeek": 10, "preferredSlots": ["weekday_evening"]}]
    assert availability_overlap(team, cand_high) > availability_overlap(team, cand_low)


def test_availability_overlap_output_in_range():
    import itertools
    slots_options = [["weekday_morning"], ["weekday_evening", "weekend_afternoon"], []]
    hours_options = [5, 20, 40]
    for t_slots, c_slots, t_h, c_h in itertools.product(
        slots_options, slots_options, hours_options, hours_options
    ):
        team = [{"timezone": "UTC", "hoursPerWeek": t_h, "preferredSlots": t_slots}] if t_slots else []
        cand = [{"timezone": "UTC", "hoursPerWeek": c_h, "preferredSlots": c_slots}] if c_slots else []
        s = availability_overlap(team, cand)
        assert 0.0 <= s <= 1.0, f"score={s} out of range"
