from fastapi import FastAPI

app = FastAPI(title="Scaled Copies Activity Generator API")


@app.get('/health')
async def health() -> dict[str, str]:
    return {'status': 'ok', 'app': 'scaled-copies-generator'}
