"""MongoDB configuration and database access."""
import os
from dotenv import load_dotenv
from pymongo import MongoClient
from pymongo.database import Database

load_dotenv()  # 👈 IMPORTANT

MONGODB_URI = os.getenv("MONGODB_URI")
DB_NAME = os.getenv("MONGODB_DB_NAME", "hrms_lite")

COLLECTION_EMPLOYEES = "employees"
COLLECTION_ATTENDANCE = "attendance"

_client: MongoClient | None = None


def get_client() -> MongoClient:
    global _client
    if _client is None:
        _client = MongoClient(MONGODB_URI)
    return _client


def get_db() -> Database:
    return get_client()[DB_NAME]


def db_dependency():
    """FastAPI dependency that yields the database."""
    yield get_db()


def init_db():
    """Create indexes for employees and attendance collections (idempotent)."""
    db = get_db()

    employees = db[COLLECTION_EMPLOYEES]
    attendance = db[COLLECTION_ATTENDANCE]

    emp_indexes = employees.index_information()
    att_indexes = attendance.index_information()

    # Employees indexes
    if "employee_id_1" not in emp_indexes:
        employees.create_index("employee_id", unique=True)

    if "email_1" not in emp_indexes:
        employees.create_index("email", unique=True)

    # Attendance indexes
    if "employee_id_1_date_1" not in att_indexes:
        attendance.create_index(
            [("employee_id", 1), ("date", 1)],
            unique=True
        )

    if "date_1" not in att_indexes:
        attendance.create_index("date")

    if "employee_id_1" not in att_indexes:
        attendance.create_index("employee_id")
