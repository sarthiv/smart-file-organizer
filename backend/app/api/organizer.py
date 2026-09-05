from fastapi import APIRouter, HTTPException
from app.services.scanner import scan_folder
from app.services.organizer import organize_folder
from app.schemas.organizer import FolderRequest
from app.services.duplicate_detector import find_duplicates
from app.services.duplicate_manager import create_duplicate_preview
from app.services.duplicate_manager import move_duplicate_file
from pathlib import Path
from app.services.date_organizer import create_date_preview
from app.services.date_organizer import organize_by_date
from app.services.rules import add_rule, get_all_rules
from app.services.rules import add_rule, get_all_rules, delete_rule
from app.services.undo_manager import undo_last_action
from sqlalchemy.orm import Session
from fastapi import Depends
from app.database.database import get_db
from app.models.activity import Activity
from app.services.safety import (
    validate_folder_safety,
    add_protected_folder,
    get_protected_folders,
    remove_protected_folder,
)
from app.services.statistics import get_statistics

router = APIRouter(
    prefix="/organizer",
    tags=["Organizer"]
)


@router.post("/scan")
def scan(request: FolderRequest):
    try:
        validate_folder_safety(request.path)

        files = scan_folder(request.path)

        return {
            "status": "success",
            "total_files": len(files),
            "files": files
        }

    except FileNotFoundError as error:
        raise HTTPException(
            status_code=404,
            detail=str(error)
        )

    except NotADirectoryError as error:
        raise HTTPException(
            status_code=400,
            detail=str(error)
        )

    except PermissionError as error:
        raise HTTPException(
            status_code=403,
            detail=str(error)
        )

@router.post("/organize")
def organize(request: FolderRequest):
    try:
        validate_folder_safety(request.path)
        files = scan_folder(request.path)
        results = organize_folder(files)

        return {
            "status": "success",
            "total_files": len(results),
            "results": results,
        }

    except FileNotFoundError as error:
        raise HTTPException(
            status_code=404,
            detail=str(error)
        )

    except NotADirectoryError as error:
        raise HTTPException(
            status_code=400,
            detail=str(error)
        )
@router.post("/duplicates")
def find_duplicate_files(request: FolderRequest):
    files = scan_folder(request.path)
    duplicates = find_duplicates(files)

    return {
        "status": "success",
        "duplicate_groups": len(duplicates),
        "duplicates": duplicates,
    }
@router.post("/duplicate-preview")
def duplicate_preview(request: FolderRequest):
    try:
        validate_folder_safety(request.path)

        files = scan_folder(request.path)
        duplicates = find_duplicates(files)
        preview = create_duplicate_preview(duplicates)

        return {
            "status": "success",
            "duplicate_groups": len(duplicates),
            "preview": preview,
        }

    except FileNotFoundError as error:
        raise HTTPException(status_code=404, detail=str(error))

    except NotADirectoryError as error:
        raise HTTPException(status_code=400, detail=str(error))

    except PermissionError as error:
        raise HTTPException(status_code=403, detail=str(error))
@router.post("/move-duplicate")
def move_duplicate(request: FolderRequest):
    try:
        file_path = Path(request.path)

        if not file_path.exists():
            raise FileNotFoundError(
                f"File does not exist: {file_path}"
            )

        if not file_path.is_file():
            raise ValueError(
                "Provided path is not a file."
            )

        # Safety check should be performed on the
        # folder containing the duplicate file.
        validate_folder_safety(str(file_path.parent))

        destination = move_duplicate_file(
            str(file_path)
        )

        return {
            "status": "success",
            "message": "Duplicate file moved successfully.",
            "destination": destination,
        }

    except FileNotFoundError as error:
        raise HTTPException(
            status_code=404,
            detail=str(error),
        )

    except ValueError as error:
        raise HTTPException(
            status_code=400,
            detail=str(error),
        )

    except PermissionError as error:
        raise HTTPException(
            status_code=403,
            detail=str(error),
        )
@router.get("/activity")
def get_activity(db: Session = Depends(get_db)):
    activities = (
        db.query(Activity)
        .order_by(Activity.id.desc())
        .all()
    )

    return {
        "status": "success",
        "activities": [
            {
                "id": activity.id,
                "action": activity.action,
                "details": activity.details,
            }
            for activity in activities
        ],
    }
@router.post("/date-preview")
def date_preview(request: FolderRequest):
    try:
        validate_folder_safety(request.path)
        
        files = scan_folder(request.path)
        preview = create_date_preview(files)

        return {
            "status": "success",
            "total_files": len(preview),
            "preview": preview,
        }

    except FileNotFoundError as error:
        raise HTTPException(
            status_code=404,
            detail=str(error),
        )

    except NotADirectoryError as error:
        raise HTTPException(
            status_code=400,
            detail=str(error),
        )
@router.post("/organize-by-date")
def organize_by_date_api(request: FolderRequest):
    try:
        files = scan_folder(request.path)

        results = []

        for file in files:
            try:
                destination = organize_by_date(
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

        return {
            "status": "success",
            "total_files": len(results),
            "results": results,
        }

    except FileNotFoundError as error:
        raise HTTPException(
            status_code=404,
            detail=str(error),
        )

    except NotADirectoryError as error:
        raise HTTPException(
            status_code=400,
            detail=str(error),
        )
    except PermissionError as error:
        raise HTTPException(
            status_code=403,
            detail=str(error)
    )

@router.post("/rules")
def create_rule(extension: str, category: str):
    rule = add_rule(extension, category)

    return {
        "status": "success",
        "message": "Custom rule added successfully.",
        "rule": rule,
    }
@router.get("/rules")
def get_rules():
    return {
        "status": "success",
        "rules": get_all_rules(),
    }
@router.delete("/rules")
def remove_rule(extension: str):
    deleted = delete_rule(extension)

    if not deleted:
        raise HTTPException(
            status_code=404,
            detail="Rule not found."
        )

    return {
        "status": "success",
        "message": "Custom rule deleted successfully.",
        "extension": extension,
    }
@router.post("/undo")
def undo():
    try:
        result = undo_last_action()

        if result is None:
            raise HTTPException(
                status_code=404,
                detail="No action available to undo."
            )

        return {
            "status": "success",
            "message": "Last action undone successfully.",
            "result": result,
        }

    except FileNotFoundError as error:
        raise HTTPException(
            status_code=404,
            detail=str(error),
        )
@router.get("/protected-folders")
def get_protected_folders_api():
    return {
        "status": "success",
        "protected_folders": get_protected_folders(),
    }


@router.post("/protected-folders")
def add_protected_folder_api(path: str):
    try:
        result = add_protected_folder(path)

        return {
            "status": "success",
            "message": "Protected folder added successfully.",
            "result": result,
        }

    except Exception as error:
        raise HTTPException(
            status_code=400,
            detail=str(error),
        )


@router.delete("/protected-folders")
def remove_protected_folder_api(path: str):
    result = remove_protected_folder(path)

    if result["status"] == "not_found":
        raise HTTPException(
            status_code=404,
            detail="Protected folder not found.",
        )

    return {
        "status": "success",
        "message": "Protected folder removed successfully.",
        "result": result,
    }
@router.get("/statistics")
def get_statistics_api(db: Session = Depends(get_db)):
    statistics = get_statistics(db)

    return {
        "status": "success",
        "statistics": statistics,
    }
@router.get("/dashboard")
def get_dashboard(db: Session = Depends(get_db)):
    statistics = get_statistics(db)

    return {
        "status": "success",
        "dashboard": {
            "overview": {
                "total_activities": statistics["total_activities"],
                "organized_files": statistics["organized_files"],
                "duplicate_moves": statistics["duplicate_moves"],
                "date_organized_files": statistics["date_organized_files"],
                "undo_actions": statistics["undo_actions"],
            },
            "performance": {
                "success_count": statistics["success_count"],
                "failed_count": statistics["failed_count"],
            },
            "operations": statistics["operation_counts"],
            "categories": statistics["categories"],
        },
    }

    return {
        "status": "success",
        "dashboard": {
            "total_activities": statistics["total_activities"],
            "organized_files": statistics["organized_files"],
            "duplicate_moves": statistics["duplicate_moves"],
            "date_organized_files": statistics["date_organized_files"],
            "undo_actions": statistics["undo_actions"],
            "success_count": statistics["success_count"],
            "failed_count": statistics["failed_count"],
            "operation_counts": statistics["operation_counts"],
            "category_counts": statistics["category_counts"],
            "categories": statistics["categories"],
        },
    }