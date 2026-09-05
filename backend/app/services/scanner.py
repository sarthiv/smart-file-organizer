from pathlib import Path
from datetime import datetime

from app.core.logger import logger
from app.services.classifier import classify_file


# Folders created automatically by the organizer
ORGANIZER_FOLDERS = {
    "Documents",
    "Images",
    "Videos",
    "Music",
    "Code",
    "Archives",
    "Executables",
    "Others",
    "Duplicates",
}


def scan_folder(folder_path: str):
    folder = Path(folder_path)

    if not folder.exists():
        raise FileNotFoundError("Folder does not exist.")

    if not folder.is_dir():
        raise NotADirectoryError(
            "Provided path is not a folder."
        )

    files = []

    for item in folder.rglob("*"):

        if not item.is_file():
            continue

        # Get folders between selected folder and file
        relative_parts = item.relative_to(folder).parts

        # Ignore organizer-created folders
        if any(
            part in ORGANIZER_FOLDERS
            for part in relative_parts[:-1]
        ):
            continue

        file_info = item.stat()

        files.append({
            "name": item.name,
            "extension": item.suffix.lower(),
            "path": str(item),
            "size": file_info.st_size,
            "created_at": datetime.fromtimestamp(
                file_info.st_ctime
            ).isoformat(),
            "modified_at": datetime.fromtimestamp(
                file_info.st_mtime
            ).isoformat(),
            "category": classify_file(
                item.suffix
            ),
        })

    logger.info(
        f"Folder scanned: {folder} | "
        f"Files found: {len(files)}"
    )

    return files