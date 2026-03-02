from fastapi import FastAPI

app = FastAPI(title="Product Spec → Prototype Builder API")


@app.get('/health')
async def health() -> dict[str, str]:
    return {'status': 'ok', 'app': 'spec-to-prototype'}
