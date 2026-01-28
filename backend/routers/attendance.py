"""Attendance REST API routes (MongoDB)."""
from datetime import date, datetime
from fastapi import APIRouter, Depends, HTTPException, Query
from pymongo.database import Database
from pymongo.errors import DuplicateKeyError
from pydantic import BaseModel

from database import db_dependency, COLLECTION_EMPLOYEES, COLLECTION_ATTENDANCE
from schemas import AttendanceCreate, AttendanceResponse, AttendanceWithEmployee

router = APIRouter(prefix="/api/attendance", tags=["attendance"])


def _date_to_dt(d: date) -> datetime:
    return datetime.combine(d, datetime.min.time())


def _dt_to_date(dt) -> date:
    if hasattr(dt, "date"):
        return dt.date()
    if isinstance(dt, str):
        return date.fromisoformat(dt)
    return dt


def _doc_to_attendance_response(doc: dict) -> AttendanceResponse:
    return AttendanceResponse(
        id=str(doc["_id"]),
        employee_id=doc["employee_id"],
        date=_dt_to_date(doc["date"]),
        status=doc["status"],
    )


@router.post("", response_model=AttendanceResponse, status_code=201)
def mark_attendance(payload: AttendanceCreate, db: Database = Depends(db_dependency)):
    emp = db[COLLECTION_EMPLOYEES].find_one({"employee_id": payload.employee_id.strip()})
    if not emp:
        raise HTTPException(status_code=404, detail="Employee not found")
    doc = {
        "employee_id": payload.employee_id.strip(),
        "date": _date_to_dt(payload.date),
        "status": payload.status,
    }
    try:
        res = db[COLLECTION_ATTENDANCE].insert_one(doc)
        doc["_id"] = res.inserted_id
        return _doc_to_attendance_response(doc)
    except DuplicateKeyError:
        raise HTTPException(status_code=409, detail="Attendance already recorded for this employee on this date")


def _attendance_with_employee(doc: dict, emp_doc: dict | None) -> AttendanceWithEmployee:
    return AttendanceWithEmployee(
        id=str(doc["_id"]),
        employee_id=doc["employee_id"],
        date=_dt_to_date(doc["date"]),
        status=doc["status"],
        employee_identifier=doc.get("employee_id"),
        employee_name=emp_doc["full_name"] if emp_doc else None,
    )


@router.get("", response_model=list[AttendanceWithEmployee])
def list_attendance(
    employee_id: str | None = Query(None, description="Filter by employee_id (business id)"),
    from_date: date | None = Query(None, alias="from_date"),
    to_date: date | None = Query(None, alias="to_date"),
    db: Database = Depends(db_dependency),
):
    col = db[COLLECTION_ATTENDANCE]
    q = {}
    if employee_id is not None:
        q["employee_id"] = employee_id
    if from_date is not None or to_date is not None:
        q["date"] = {}
        if from_date is not None:
            q["date"]["$gte"] = _date_to_dt(from_date)
        if to_date is not None:
            q["date"]["$lte"] = _date_to_dt(to_date)
    cursor = col.find(q).sort("date", -1)
    emp_ids = set()
    rows = list(cursor)
    for r in rows:
        emp_ids.add(r["employee_id"])
    employees = {e["employee_id"]: e for e in db[COLLECTION_EMPLOYEES].find({"employee_id": {"$in": list(emp_ids)}})}
    return [_attendance_with_employee(r, employees.get(r["employee_id"])) for r in rows]


@router.get("/employee/{employee_id}", response_model=list[AttendanceWithEmployee])
def get_attendance_for_employee(
    employee_id: str,
    from_date: date | None = Query(None, alias="from_date"),
    to_date: date | None = Query(None, alias="to_date"),
    db: Database = Depends(db_dependency),
):
    emp = db[COLLECTION_EMPLOYEES].find_one({"employee_id": employee_id})
    if not emp:
        raise HTTPException(status_code=404, detail="Employee not found")
    col = db[COLLECTION_ATTENDANCE]
    q = {"employee_id": employee_id}
    if from_date is not None or to_date is not None:
        q["date"] = {}
        if from_date is not None:
            q["date"]["$gte"] = _date_to_dt(from_date)
        if to_date is not None:
            q["date"]["$lte"] = _date_to_dt(to_date)
    rows = list(col.find(q).sort("date", -1))
    return [_attendance_with_employee(r, emp) for r in rows]


class PresentDaysSummary(BaseModel):
    employee_id: str
    full_name: str
    present_days: int


@router.get("/summary", response_model=list[PresentDaysSummary])
def attendance_summary(db: Database = Depends(db_dependency)):
    pipeline = [
        {"$match": {"status": "Present"}},
        {"$group": {"_id": "$employee_id", "present_days": {"$sum": 1}}},
    ]
    rows = list(db[COLLECTION_ATTENDANCE].aggregate(pipeline))
    if not rows:
        return []
    emp_ids = [r["_id"] for r in rows]
    employees = {e["employee_id"]: e for e in db[COLLECTION_EMPLOYEES].find({"employee_id": {"$in": emp_ids}})}
    return [
        PresentDaysSummary(
            employee_id=r["_id"],
            full_name=employees.get(r["_id"], {}).get("full_name", "—"),
            present_days=r["present_days"],
        )
        for r in rows
    ]
