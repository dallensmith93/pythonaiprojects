from pydantic import BaseModel


class Settings(BaseModel):
    auth_enabled: bool = False
    sqlite_url: str = 'sqlite:///./dev.db'


settings = Settings()
