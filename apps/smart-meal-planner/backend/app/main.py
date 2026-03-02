from fastapi import FastAPI

app = FastAPI(title="Smart Meal Planner (Low-carb, Simple) API")


@app.get('/health')
async def health() -> dict[str, str]:
    return {'status': 'ok', 'app': 'smart-meal-planner'}
