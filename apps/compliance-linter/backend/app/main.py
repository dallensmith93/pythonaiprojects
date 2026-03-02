from fastapi import FastAPI

app = FastAPI(title="Policy & Constraints Compliance Checker API")


@app.get('/health')
async def health() -> dict[str, str]:
    return {'status': 'ok', 'app': 'compliance-linter'}
