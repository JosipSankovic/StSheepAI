from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    capture_interval_minutes: int = 30
    images_dir: str = "images"
    host: str = "127.0.0.1"
    port: int = 8000
    openai_api_key: str = ""

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")


settings = Settings()

vlm_model_name = "gpt-4o"
llm_model_name = "gpt-5.5"
