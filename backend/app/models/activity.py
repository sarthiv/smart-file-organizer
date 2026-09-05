from sqlalchemy import Column, Integer, String

from app.database.database import Base


class Activity(Base):
    __tablename__ = "activities"

    id = Column(Integer, primary_key=True, index=True)

    action = Column(String, nullable=False)

    details = Column(String, nullable=False)

    category = Column(String, nullable=True)
    
    status = Column(String, nullable=True)