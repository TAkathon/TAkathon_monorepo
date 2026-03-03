from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import JSONResponse

from .matching.engine import suggest
from .matching.validators import MatchRequest, MatchResponse

app = FastAPI(title="Takathon AI Engine", version="1.0.0")


# ---------------------------------------------------------------------------
# Health / root
# ---------------------------------------------------------------------------


@app.get("/")
async def root():
    return {"message": "AI Engine is running"}


@app.get("/health")
async def health_check():
    """
    Real health check: runs a minimal dummy scoring call to verify the
    engine is functional, not just reachable.

    Scoring a single candidate against an empty team exercises the full
    skill_complementarity → experience_balance → availability_overlap
    pipeline. If suggest() raises, the container is marked unhealthy.
    """
    try:
        result = suggest(
            team_skills=[],
            candidates=[
                {
                    "userId": "__health_check__",
                    "skills": [
                        {"name": "Python", "proficiency": "intermediate"}
                    ],
                    "availability": {"preferredSlots": ["weekday_evening"], "hoursPerWeek": 10},
                }
            ],
            open_spots=1,
            limit=1,
            team_availability=[],
        )
        suggestions = result.get("suggestions", [])
        return {
            "status": "healthy",
            "engine": "ok",
            "scored": len(suggestions),
        }
    except Exception as exc:  # pragma: no cover
        raise HTTPException(
            status_code=503, detail=f"Engine scoring pipeline unhealthy: {exc}"
        ) from exc


# ---------------------------------------------------------------------------
# Matching endpoint
# ---------------------------------------------------------------------------


@app.post(
    "/api/v1/matching/recommend",
    response_model=MatchResponse,
    summary="Suggest teammate candidates for a team",
)
async def recommend_teammates(payload: MatchRequest):
    """Rank candidates by composite score (skill complementarity 40 %,
    experience balance 30 %, availability overlap 30 %).

    Called by the Core Gateway — never directly by frontend clients.
    """
    try:
        result = suggest(
            team_skills=[s.model_dump() for s in payload.teamSkills],
            candidates=[c.model_dump() for c in payload.candidates],
            open_spots=payload.openSpots,
            limit=payload.limit,
            team_availability=[a.model_dump() for a in payload.teamAvailability],
        )
        return result
    except Exception as exc:  # pragma: no cover
        raise HTTPException(status_code=500, detail=str(exc)) from exc


# ---------------------------------------------------------------------------
# Global validation error handler (Pydantic v2 / FastAPI)
# ---------------------------------------------------------------------------


@app.exception_handler(422)
async def validation_exception_handler(request: Request, exc):
    return JSONResponse(
        status_code=422,
        content={"detail": "Invalid request payload", "errors": str(exc)},
    )
