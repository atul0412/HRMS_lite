"""Employee REST API routes (MongoDB)."""
from fastapi import APIRouter, Depends, HTTPException
from pymongo.database import Database

from database import db_dependency, COLLECTION_EMPLOYEES, COLLECTION_ATTENDANCE
from schemas import EmployeeCreate, EmployeeResponse

router = APIRouter(prefix="/api/employees", tags=["employees"])


def _doc_to_employee(doc: dict) -> EmployeeResponse:
    return EmployeeResponse(
        id=str(doc["_id"]),
        employee_id=doc["employee_id"],
        full_name=doc["full_name"],
        email=doc["email"],
        department=doc["department"],
    )


@router.get("", response_model=list[EmployeeResponse])
def list_employees(db: Database = Depends(db_dependency)):
    cursor = db[COLLECTION_EMPLOYEES].find().sort("employee_id", 1)
    return [_doc_to_employee(doc) for doc in cursor]


@router.post("", response_model=EmployeeResponse, status_code=201)
def create_employee(payload: EmployeeCreate, db: Database = Depends(db_dependency)):
    col = db[COLLECTION_EMPLOYEES]
    if col.find_one({"employee_id": payload.employee_id.strip()}):
        raise HTTPException(status_code=409, detail="Employee ID already exists")
    if col.find_one({"email": payload.email.strip().lower()}):
        raise HTTPException(status_code=409, detail="Email already registered")
    doc = {
        "employee_id": payload.employee_id.strip(),
        "full_name": payload.full_name.strip(),
        "email": payload.email.strip().lower(),
        "department": payload.department.strip(),
    }
    res = col.insert_one(doc)
    doc["_id"] = res.inserted_id
    return _doc_to_employee(doc)


@router.delete("/{employee_id}", status_code=204)
def delete_employee(employee_id: str, db: Database = Depends(db_dependency)):
    col = db[COLLECTION_EMPLOYEES]
    emp = col.find_one({"employee_id": employee_id})
    if not emp:
        raise HTTPException(status_code=404, detail="Employee not found")
    col.delete_one({"_id": emp["_id"]})
    db[COLLECTION_ATTENDANCE].delete_many({"employee_id": employee_id})
    return None
