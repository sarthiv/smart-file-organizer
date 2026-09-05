import hashlib
from pathlib import Path
from collections import defaultdict
from app.core.logger import logger

def calculate_file_hash(file_path: str) -> str:
    sha256 = hashlib.sha256()

    with open(file_path, "rb") as file:
        while chunk := file.read(4096):
            sha256.update(chunk)

    return sha256.hexdigest()



def find_duplicates(files: list) -> list:
    hash_groups = defaultdict(list)

    for file in files:
        file_path = Path(file["path"])

        if not file_path.exists():
            continue

        file_hash = calculate_file_hash(str(file_path))
        hash_groups[file_hash].append(str(file_path))

    duplicates = []

    for file_hash, file_paths in hash_groups.items():
        if len(file_paths) > 1:
            duplicates.append({
                "hash": file_hash,
                "files": file_paths,
                "count": len(file_paths),
            })
    logger.info(
       f"Duplicate scan completed | Groups found: {len(duplicates)}"
    )
    return duplicates