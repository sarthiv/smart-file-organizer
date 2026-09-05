from pathlib import Path
import shutil

from app.core.logger import logger, save_activity


UNDO_HISTORY = []


def add_undo_record(source: str, destination: str):
    UNDO_HISTORY.append({
        "source": source,
        "destination": destination,
    })


def get_undo_history():
    return UNDO_HISTORY


def undo_last_action():
    if not UNDO_HISTORY:
        return None

    record = UNDO_HISTORY.pop()

    source = Path(record["source"])
    destination = Path(record["destination"])

    if not destination.exists():
        raise FileNotFoundError(
            f"Moved file does not exist: {destination}"
        )

    source.parent.mkdir(
        parents=True,
        exist_ok=True
    )

    shutil.move(
        str(destination),
        str(source)
    )

    save_activity(
        "UNDO",
        f"{destination} -> {source}"
    )

    logger.info(
        f"Action undone: {destination} -> {source}"
    )

    return {
        "source": str(source),
        "destination": str(destination),
        "status": "undone",
    }