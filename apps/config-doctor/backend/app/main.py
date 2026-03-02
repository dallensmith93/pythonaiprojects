from fastapi import FastAPI

app = FastAPI(title="Config Doctor API")


@app.get('/health')
async def health() -> dict[str, str]:
    return {'status': 'ok', 'app': 'config-doctor'}
