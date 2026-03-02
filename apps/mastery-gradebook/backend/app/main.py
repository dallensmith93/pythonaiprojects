from fastapi import FastAPI

app = FastAPI(title="Mastery-Based Gradebook + Skill Graph API")


@app.get('/health')
async def health() -> dict[str, str]:
    return {'status': 'ok', 'app': 'mastery-gradebook'}
