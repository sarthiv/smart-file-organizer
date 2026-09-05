from pathlib import Path
from app.core.logger import logger

CUSTOM_RULES = {}


def add_rule(extension: str, category: str):
    extension = extension.lower()

    if not extension.startswith("."):
        extension = "." + extension

    CUSTOM_RULES[extension] = category
    logger.info(
       f"Custom rule added: {extension} -> {category}"
    )

    return {
        "extension": extension,
        "category": category,
    }


def get_rule(extension: str):
    extension = extension.lower()

    return CUSTOM_RULES.get(extension)
def get_all_rules():
    return CUSTOM_RULES
def delete_rule(extension: str):
    extension = extension.lower()

    if extension in CUSTOM_RULES:
        del CUSTOM_RULES[extension]
        logger.info(
            f"Custom rule deleted: {extension}"
        )

        return True

    return False