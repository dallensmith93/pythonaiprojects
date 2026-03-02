from fastapi import FastAPI

app = FastAPI(title="Content Repurposer (Long → Shorts) API")


@app.get('/health')
async def health() -> dict[str, str]:
    return {'status': 'ok', 'app': 'content-repurposer'}
