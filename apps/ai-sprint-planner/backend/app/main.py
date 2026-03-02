from fastapi import FastAPI

app = FastAPI(title="AI Sprint Planner API")


@app.get('/health')
async def health() -> dict[str, str]:
    return {'status': 'ok', 'app': 'ai-sprint-planner'}
