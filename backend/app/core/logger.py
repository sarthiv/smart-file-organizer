import logging
from pathlib import Path


LOG_DIR = Path("logs")
LOG_DIR.mkdir(exist_ok=True)

LOG_FILE = LOG_DIR / "activity.log"


logging.basicConfig(
    filename=LOG_FILE,
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
)


logger = logging.getLogger("smart_file_organizer")
from app.database.database import SessionLocal
from app.models.activity import Activity


def save_activity(
    action: str,
    details: str,
    category: str = None,
    status: str = "success",
):
    db = SessionLocal()

    try:
        activity = Activity(
            action=action,
            details=details,
            category=category,
            status=status,
        )

        db.add(activity)
        db.commit()

    finally:
        db.close()