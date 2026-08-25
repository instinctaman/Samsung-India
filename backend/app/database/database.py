from sqlalchemy import URL, create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

from app.core.config import settings

# URL.create safely encodes characters such as @, :, and / in database
# credentials. Building the URL with an f-string makes those characters look
# like URL delimiters and prevents the API from starting.
DATABASE_URL = URL.create(
    drivername="mysql+pymysql",
    username=settings.DB_USER,  
    password=settings.DB_PASSWORD,
    host=settings.DB_HOST,
    port=settings.DB_PORT,
    database=settings.DB_NAME,
)

engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
