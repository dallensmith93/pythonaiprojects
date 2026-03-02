from fastapi import FastAPI

app = FastAPI(title="Knowledge Base Builder API")


@app.get('/health')
async def health() -> dict[str, str]:
    return {'status': 'ok', 'app': 'knowledge-base-builder'}
