from sqlalchemy import Column, Integer, String

from app.database.database import Base


class ProtectedFolder(Base):
    __tablename__ = "protected_folders"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    path = Column(
        String,
        unique=True,
        nullable=False
    )