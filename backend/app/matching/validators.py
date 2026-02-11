"""
Validation logic for matching engine inputs/outputs.
"""

from typing import Dict, Any


def validate_team_constraints(
    team_size: int,
    max_team_size: int,
    min_team_size: int = 2
) -> bool:
    """
    Validate team size constraints.
    
    Args:
        team_size: Current size of the team
        max_team_size: Maximum allowed team size for hackathon
        min_team_size: Minimum team size (default 2)
        
    Returns:
        True if team size is valid
    """
    return min_team_size <= team_size <= max_team_size


def validate_participant_eligibility(
    participant: Dict[str, Any],
    hackathon_id: str
) -> bool:
    """
    Check if participant is eligible for matching.
    
    Args:
        participant: Participant data
        hackathon_id: ID of the hackathon
        
    Returns:
        True if participant can be matched
    """
    # TODO: Check if participant:
    # - Is registered for the hackathon
    # - Is not already on a team
    # - Has completed profile
    return True
