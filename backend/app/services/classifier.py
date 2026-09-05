from app.services.rules import get_rule
FILE_CATEGORIES = {
    # Documents
    ".pdf": "Documents",
    ".doc": "Documents",
    ".docx": "Documents",
    ".txt": "Documents",
    ".rtf": "Documents",
    ".odt": "Documents",

    # Images
    ".jpg": "Images",
    ".jpeg": "Images",
    ".png": "Images",
    ".gif": "Images",
    ".bmp": "Images",
    ".webp": "Images",
    ".svg": "Images",

    # Videos
    ".mp4": "Videos",
    ".mkv": "Videos",
    ".avi": "Videos",
    ".mov": "Videos",
    ".wmv": "Videos",
    ".webm": "Videos",

    # Music
    ".mp3": "Music",
    ".wav": "Music",
    ".flac": "Music",
    ".aac": "Music",
    ".ogg": "Music",
    ".m4a": "Music",

    # Code
    ".py": "Code",
    ".js": "Code",
    ".jsx": "Code",
    ".ts": "Code",
    ".tsx": "Code",
    ".java": "Code",
    ".cpp": "Code",
    ".c": "Code",
    ".html": "Code",
    ".css": "Code",
    ".sql": "Code",

    # Archives
    ".zip": "Archives",
    ".rar": "Archives",
    ".7z": "Archives",
    ".tar": "Archives",
    ".gz": "Archives",

    # Executables
    ".exe": "Executables",
    ".msi": "Executables",
    ".bat": "Executables",
    ".cmd": "Executables",
}


def classify_file(extension: str) -> str:
    extension = extension.lower()

    # Check custom rule first
    custom_category = get_rule(extension)

    if custom_category:
        return custom_category

    # Use default category
    return FILE_CATEGORIES.get(extension, "Others")