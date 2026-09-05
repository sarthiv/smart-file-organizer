from pathlib import Path
from datetime import datetime
import shutil

from app.services.conflict_handler import get_unique_destination
from app.core.logger import logger, save_activity
from app.services.undo_manager import add_undo_record


def get_date_folder(file_path: str) -> str:
    file = Path(file_path)

    file_info = file.stat()

    modified_date = datetime.fromtimestamp(
        file_info.st_mtime
    )

    year = modified_date.strftime("%Y")
    month = modified_date.strftime("%B")

    return f"{year}/{month}"


def get_date_destination(file_path: str, category: str) -> Path:
    file = Path(file_path)

    date_folder = get_date_folder(file_path)

    category_folder = None

    for parent in file.parents:
        if parent.name.lower() == category.lower():
            category_folder = parent
            break

    if category_folder:
        destination_folder = category_folder / date_folder
    else:
        destination_folder = file.parent / category / date_folder

    destination_file = destination_folder / file.name

    return destination_file


def organize_by_date(file_path: str, category: str) -> str:
    file = Path(file_path)

    destination = get_date_destination(
        file_path,
        category
    )

    # File is already at the correct date-based location
    if file.resolve() == destination.resolve():
        return str(file)

    destination.parent.mkdir(
        parents=True,
        exist_ok=True
    )

    # Handle filename conflicts safely
    destination = get_unique_destination(
        destination
    )

    shutil.move(
        str(file),
        str(destination)
    )

    add_undo_record(
        str(file),
        str(destination)
    )

    save_activity(
        "DATE_ORGANIZE",
        f"{file} -> {destination}"
    )

    logger.info(
        f"Date organization: {file} -> {destination}"
    )

    return str(destination)


def create_date_preview(files: list) -> list:
    preview = []

    for file in files:
        destination = get_date_destination(
            file["path"],
            file["category"]
        )

        preview.append({
            "name": file["name"],
            "category": file["category"],
            "source": file["path"],
            "destination": str(destination),
            "action": "move",
        })

    return preview