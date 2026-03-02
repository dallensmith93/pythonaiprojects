from fastapi import FastAPI

app = FastAPI(title="Walkthrough / Achievement Episode Planner API")


@app.get('/health')
async def health() -> dict[str, str]:
    return {'status': 'ok', 'app': 'walkthrough-episode-planner'}
