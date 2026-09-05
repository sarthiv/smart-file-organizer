from pathlib import Path
from app.services.conflict_handler import get_unique_destination
from app.core.logger import logger
from app.services.undo_manager import add_undo_record
from app.core.logger import save_activity
from datetime import datetime
def get_destination_path(file_path: str, category: str) -> Path:
    file = Path(file_path)

    destination_folder = file.parent / category
    destination_file = destination_folder / file.name

    return destination_file


def create_preview(files: list) -> list:
    preview = []

    for file in files:
        destination = get_destination_path(
            file["path"],
            file["category"]
        )

        preview.append({
            "name": file["name"],
            "category": file["category"],
            "source": file["path"],
            "destination": str(destination),
        })

    return preview

import shutil


def organize_file(file_path: str, category: str) -> str:
    file = Path(file_path)

    # File is already inside the correct category folder
    if file.parent.name.lower() == category.lower():
        return str(file)

    destination_folder = file.parent / category
    destination_folder.mkdir(exist_ok=True)

    destination_file = destination_folder / file.name

    # Automatically handle duplicate filenames
    destination_file = get_unique_destination(destination_file)

    shutil.move(
        str(file),
        str(destination_file)
    )

    add_undo_record(
        str(file),
        str(destination_file)
    )

    save_activity(
        "ORGANIZE",
        f"{file} -> {destination_file}",
        category,
)

    logger.info(
        f"File organized: {file} -> {destination_file}"
    )
    return str(destination_file)
def organize_folder(files: list) -> list:
    results = []

    for file in files:
        try:
            destination = organize_file(
                file["path"],
                file["category"]
            )

            results.append({
                "name": file["name"],
                "category": file["category"],
                "status": "organized",
                "destination": destination,
            })

        except Exception as error:
            results.append({
                "name": file["name"],
                "category": file["category"],
                "status": "failed",
                "error": str(error),
            })

    return results
def get_organization_summary(results: list) -> dict:
    total_files = len(results)

    organized = sum(
        1 for result in results
        if result["status"] == "organized"
    )

    failed = sum(
        1 for result in results
        if result["status"] == "failed"
    )

    return {
        "total_files": total_files,
        "organized": organized,
        "failed": failed,
    }
def organize_by_date(file_path: str, category: str):
    file = Path(file_path)

    file_info = file.stat()

    modified_date = datetime.fromtimestamp(
        file_info.st_mtime
    )

    year = modified_date.strftime("%Y")
    month = modified_date.strftime("%B")

    destination_folder = (
        file.parent
        / category
        / year
        / month
    )

    destination_folder.mkdir(
        parents=True,
        exist_ok=True
    )

    destination = destination_folder / file.name

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
        f"{file} -> {destination}",
        category,
)

    logger.info(
        f"Date organization: {file} -> {destination}"
    )

    return str(destination)

    
