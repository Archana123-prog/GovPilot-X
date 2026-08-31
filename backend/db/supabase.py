"""Supabase client initialization and PostgreSQL connection via Supabase."""
import os
from supabase import create_client, Client
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker


class SupabaseConfig:
    """Supabase configuration wrapper."""

    SUPABASE_URL = os.getenv("SUPABASE_URL", "")
    SUPABASE_KEY = os.getenv("SUPABASE_KEY", "")
    SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")
    
    # PostgreSQL connection via Supabase
    POSTGRES_USER = os.getenv("SUPABASE_DB_USER", "postgres")
    POSTGRES_PASSWORD = os.getenv("SUPABASE_DB_PASSWORD", "")
    POSTGRES_HOST = os.getenv("SUPABASE_DB_HOST", "")
    POSTGRES_PORT = os.getenv("SUPABASE_DB_PORT", "5432")
    POSTGRES_DB = os.getenv("SUPABASE_DB_NAME", "postgres")
    
    # Build DATABASE_URL if using Supabase PostgreSQL
    if POSTGRES_HOST:
        DATABASE_URL = f"postgresql+asyncpg://{POSTGRES_USER}:{POSTGRES_PASSWORD}@{POSTGRES_HOST}:{POSTGRES_PORT}/{POSTGRES_DB}"
    else:
        # Fallback to local
        DATABASE_URL = os.getenv(
            "DATABASE_URL",
            "postgresql+asyncpg://postgres:password@localhost:5432/govpilotx",
        )

    @staticmethod
    def validate():
        """Validate required Supabase configuration."""
        if not SupabaseConfig.SUPABASE_URL or not SupabaseConfig.SUPABASE_KEY:
            raise ValueError(
                "SUPABASE_URL and SUPABASE_KEY environment variables must be set"
            )


# Initialize Supabase client (sync client for auth operations)
def get_supabase_client() -> Client:
    """Get Supabase client for sync operations (file upload, auth, etc)."""
    SupabaseConfig.validate()
    return create_client(
        supabase_url=SupabaseConfig.SUPABASE_URL,
        supabase_key=SupabaseConfig.SUPABASE_KEY,
    )


# AsyncEngine for database operations
engine = create_async_engine(
    SupabaseConfig.DATABASE_URL,
    echo=False,
    pool_size=10,
    max_overflow=5,
)

AsyncSessionLocal = async_sessionmaker(
    engine,
    expire_on_commit=False,
    class_=AsyncSession,
)


async def get_db():
    """Dependency for FastAPI to get async DB session."""
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()


async def dispose_db():
    """Dispose of database connections."""
    await engine.dispose()
