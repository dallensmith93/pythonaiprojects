from fastapi import FastAPI

app = FastAPI(title="Security Practice Lab Tracker API")


@app.get('/health')
async def health() -> dict[str, str]:
    return {'status': 'ok', 'app': 'security-practice-tracker'}
