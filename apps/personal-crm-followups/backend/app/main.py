from fastapi import FastAPI

app = FastAPI(title="Personal CRM + Follow-up Agent API")


@app.get('/health')
async def health() -> dict[str, str]:
    return {'status': 'ok', 'app': 'personal-crm-followups'}
