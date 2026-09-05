from pathlib import Path


def get_unique_destination(destination: Path) -> Path:
    if not destination.exists():
        return destination

    counter = 1

    while True:
        new_name = f"{destination.stem} ({counter}){destination.suffix}"
        new_destination = destination.parent / new_name

        if not new_destination.exists():
            return new_destination

        counter += 1