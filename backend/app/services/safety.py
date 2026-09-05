from pathlib import Path

from app.database.database import SessionLocal
from app.models.protected_folder import ProtectedFolder


DEFAULT_PROTECTED_FOLDERS = [
    "C:\\Windows",
    "C:\\Program Files",
    "C:\\Program Files (x86)",
]


def load_protected_folders():
    folders = DEFAULT_PROTECTED_FOLDERS.copy()

    db = SessionLocal()

    try:
        database_folders = (
            db.query(ProtectedFolder)
            .all()
        )

        for folder in database_folders:
            if folder.path not in folders:
                folders.append(folder.path)

    finally:
        db.close()

    return folders


def is_protected_folder(folder_path: str) -> bool:
    folder = Path(folder_path).resolve()

    protected_folders = load_protected_folders()

    for protected in protected_folders:
        protected_path = Path(protected).resolve()

        try:
            folder.relative_to(protected_path)
            return True
        except ValueError:
            continue

    return False


def validate_folder_safety(folder_path: str) -> bool:
    folder = Path(folder_path)

    if not folder.exists():
        raise FileNotFoundError(
            "Folder does not exist."
        )

    if not folder.is_dir():
        raise NotADirectoryError(
            "Provided path is not a folder."
        )

    if is_protected_folder(folder_path):
        raise PermissionError(
            "This folder is protected and cannot be organized."
        )

    return True


def add_protected_folder(folder_path: str):
    folder = str(Path(folder_path).resolve())

    db = SessionLocal()

    try:
        existing = (
            db.query(ProtectedFolder)
            .filter(ProtectedFolder.path == folder)
            .first()
        )

        if not existing:
            protected_folder = ProtectedFolder(
                path=folder
            )

            db.add(protected_folder)
            db.commit()

        return {
            "folder": folder,
            "status": "protected",
        }

    finally:
        db.close()


def get_protected_folders():
    return load_protected_folders()


def remove_protected_folder(folder_path: str):
    folder = str(Path(folder_path).resolve())

    db = SessionLocal()

    try:
        protected_folder = (
            db.query(ProtectedFolder)
            .filter(ProtectedFolder.path == folder)
            .first()
        )

        if not protected_folder:
            return {
                "folder": folder,
                "status": "not_found",
            }

        db.delete(protected_folder)
        db.commit()

        return {
            "folder": folder,
            "status": "removed",
        }

    finally:
        db.close()