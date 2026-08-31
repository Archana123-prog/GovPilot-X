"""Async SQLAlchemy engine + session factory with Supabase support."""
import os
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker

# Try to use Supabase config if available, else fall back to local
USE_SUPABASE = os.getenv("SUPABASE_URL") and os.getenv("SUPABASE_DB_HOST")

if USE_SUPABASE:
    # Supabase PostgreSQL connection
    POSTGRES_USER = os.getenv("SUPABASE_DB_USER", "postgres")
    POSTGRES_PASSWORD = os.getenv("SUPABASE_DB_PASSWORD", "")
    POSTGRES_HOST = os.getenv("SUPABASE_DB_HOST", "")
    POSTGRES_PORT = os.getenv("SUPABASE_DB_PORT", "5432")
    POSTGRES_DB = os.getenv("SUPABASE_DB_NAME", "postgres")
    
    DATABASE_URL = f"postgresql+asyncpg://{POSTGRES_USER}:{POSTGRES_PASSWORD}@{POSTGRES_HOST}:{POSTGRES_PORT}/{POSTGRES_DB}"
else:
    # Local PostgreSQL fallback
    DATABASE_URL = os.getenv(
        "DATABASE_URL",
        "postgresql+asyncpg://postgres:password@localhost:5432/govpilotx",
    )

engine = create_async_engine(DATABASE_URL, echo=False, pool_size=10, max_overflow=5)
AsyncSessionLocal = async_sessionmaker(engine, expire_on_commit=False, class_=AsyncSession)


async def get_db():
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()

