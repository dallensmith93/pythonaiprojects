from fastapi import FastAPI

app = FastAPI(title="Personal Ops Dashboard API")


@app.get('/health')
async def health() -> dict[str, str]:
    return {'status': 'ok', 'app': 'ops-dashboard'}
