from pathlib import Path
import shutil
from app.core.logger import logger
from app.services.conflict_handler import get_unique_destination
from app.core.logger import save_activity


def move_duplicate_file(file_path: str) -> str:
    file = Path(file_path)

    # Check that the file exists
    if not file.exists():
        raise FileNotFoundError(
            f"File does not exist: {file}"
        )

    # Create Duplicates folder beside the original file
    duplicate_folder = file.parent / "Duplicates"
    duplicate_folder.mkdir(exist_ok=True)

    # Create destination path
    destination = duplicate_folder / file.name

    # Handle filename conflict safely
    destination = get_unique_destination(destination)

    # Move the duplicate
    shutil.move(str(file), str(destination))
    save_activity(
         "DUPLICATE_MOVE",
        f"{file} -> {destination}"
    )
    logger.info(
       f"Duplicate moved: {file} -> {destination}"
    )
    return str(destination)
def create_duplicate_preview(duplicates: list) -> list:
    preview = []

    for group in duplicates:
        files = group["files"]

        if len(files) < 2:
            continue

        # First file is kept as the original
        original = files[0]

        for duplicate in files[1:]:
            file = Path(duplicate)

            destination_folder = file.parent / "Duplicates"
            destination = destination_folder / file.name

            destination = get_unique_destination(destination)

            preview.append({
                "original": original,
                "duplicate": str(file),
                "destination": str(destination),
                "action": "move",
            })

    return preview