"""Pydantic schemas for request/response validation."""
from pydantic import BaseModel, EmailStr, Field
from datetime import date
from typing import Optional


class EmployeeBase(BaseModel):
    employee_id: str = Field(..., min_length=1, max_length=50, description="Unique employee identifier")
    full_name: str = Field(..., min_length=1, max_length=255)
    email: EmailStr
    department: str = Field(..., min_length=1, max_length=255)


class EmployeeCreate(EmployeeBase):
    pass


class EmployeeResponse(EmployeeBase):
    id: str


class AttendanceBase(BaseModel):
    date: date
    status: str = Field(..., pattern="^(Present|Absent)$")


class AttendanceCreate(AttendanceBase):
    employee_id: str = Field(..., min_length=1, description="Employee ID (e.g. EMP001)")


class AttendanceResponse(AttendanceBase):
    id: str
    employee_id: str  # business employee_id


class AttendanceWithEmployee(AttendanceResponse):
    employee_identifier: Optional[str] = None
    employee_name: Optional[str] = None
