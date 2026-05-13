from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, scoped_session

from .base import Base

# 👉 Use the same SQLite file the original code used.
engine = create_engine("sqlite:///cloud-lab.db", connect_args={"check_same_thread": False})

# Scoped session gives a thread‑local session – perfect for FastAPI dependencies.
SessionLocal = scoped_session(sessionmaker(autocommit=False, autoflush=False, bind=engine))


def init_db() -> None:
    """Create tables (run once on startup or via Alembic)."""
    import backend.models  # noqa: F401 – imports all model modules so Base knows them
    Base.metadata.create_all(bind=engine)