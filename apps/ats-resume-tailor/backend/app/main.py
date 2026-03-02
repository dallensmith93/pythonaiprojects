from fastapi import FastAPI

app = FastAPI(title="Resume + JD Tailor (ATS + Human) API")


@app.get('/health')
async def health() -> dict[str, str]:
    return {'status': 'ok', 'app': 'ats-resume-tailor'}
