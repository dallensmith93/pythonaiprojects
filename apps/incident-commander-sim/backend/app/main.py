from fastapi import FastAPI

app = FastAPI(title="Incident Commander Simulator API")


@app.get('/health')
async def health() -> dict[str, str]:
    return {'status': 'ok', 'app': 'incident-commander-sim'}
