from fastapi import FastAPI

app = FastAPI(title="Podcast Episode Factory API")


@app.get('/health')
async def health() -> dict[str, str]:
    return {'status': 'ok', 'app': 'podcast-episode-factory'}
