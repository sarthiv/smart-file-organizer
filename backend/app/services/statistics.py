from collections import Counter

from sqlalchemy.orm import Session

from app.models.activity import Activity


def get_statistics(db: Session):
    activities = db.query(Activity).all()

    total_activities = len(activities)

    organized_files = sum(
        1 for activity in activities
        if activity.action == "ORGANIZE"
    )

    duplicate_moves = sum(
        1 for activity in activities
        if activity.action == "DUPLICATE_MOVE"
    )

    date_organized_files = sum(
        1 for activity in activities
        if activity.action == "DATE_ORGANIZE"
    )

    undo_actions = sum(
        1 for activity in activities
        if activity.action == "UNDO"
    )

    operation_counts = Counter(
        activity.action
        for activity in activities
    )
    category_counts = Counter(
    activity.category
    for activity in activities
    if activity.category
    )
    categories = [
    {
        "category": category,
        "count": count,
    }
    for category, count in category_counts.items()
    ]
    success_count = sum(
        1 for activity in activities
        if activity.status == "success"
    )

    failed_count = sum(
        1 for activity in activities
        if activity.status == "failed"
    )
    
    return {
        "total_activities": total_activities,
        "organized_files": organized_files,
        "duplicate_moves": duplicate_moves,
        "date_organized_files": date_organized_files,
        "undo_actions": undo_actions,
        "operation_counts": dict(operation_counts),
        "category_counts": dict(category_counts),
        "success_count": success_count,
        "failed_count": failed_count,
        "categories": categories,
    }