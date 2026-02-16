from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    openai_api_key: str = ""
    qdrant_url: str = ""
    qdrant_api_key: str = ""
    database_url: str = ""
    better_auth_secret: str = ""
    cors_origins: str = "http://localhost:3000"

    @property
    def cors_origin_list(self) -> list[str]:
        return [o.strip() for o in self.cors_origins.split(",") if o.strip()]

    model_config = {"env_file": ".env", "env_file_encoding": "utf-8"}


settings = Settings()
