from fastapi import FastAPI

app = FastAPI(title="Takathon AI Engine")

@app.get("/")
async def root():
    return {"message": "AI Engine is running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
