from fastapi import APIRouter
from openbb_payday.payday_models import (
    Register,
    Login,
    Apply,
    Approve,
    Repay,
    User,
    LoanApplication,
    Repayment
)

router = APIRouter(prefix="/payday")

@router.post("/register")
async def register(register: Register):
    from openbb_payday.database import get_db_connection
    from passlib.context import CryptContext
    import uuid

    pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
    hashed_password = pwd_context.hash(register.password)
    referral_code = str(uuid.uuid4())

    conn = get_db_connection()
    conn.execute(
        "INSERT INTO users (username, hashed_password, email, referral_code, referred_by) VALUES (?, ?, ?, ?, ?)",
        (register.username, hashed_password, register.email, referral_code, register.referred_by),
    )
    conn.commit()
    conn.close()
    return {"message": "User created successfully"}

@router.post("/login")
async def login(login: Login):
    from openbb_payday.database import get_db_connection
    from passlib.context import CryptContext

    pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
    conn = get_db_connection()
    user = conn.execute("SELECT * FROM users WHERE username = ?", (login.username,)).fetchone()
    conn.close()

    if user and pwd_context.verify(login.password, user["hashed_password"]):
        return {"message": "Login successful"}
    return {"message": "Login failed"}

@router.post("/apply")
async def apply(application: Apply):
    from openbb_payday.database import get_db_connection
    conn = get_db_connection()
    conn.execute(
        """
        INSERT INTO loan_applications (user_id, full_name, address, date_of_birth, social_insurance_number, employment_status, monthly_income, loan_amount_requested, loan_purpose, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """,
        (application.user_id, application.full_name, application.address, application.date_of_birth, application.social_insurance_number, application.employment_status, application.monthly_income, application.loan_amount_requested, application.loan_purpose, application.status),
    )
    conn.commit()
    conn.close()
    return {"message": "Loan application submitted successfully"}

@router.post("/approve")
async def approve(approval: Approve):
    from openbb_payday.database import get_db_connection
    from openbb_payday.ml_model import predict_approval

    conn = get_db_connection()
    application = conn.execute("SELECT * FROM loan_applications WHERE id = ?", (approval.application_id,)).fetchone()

    if application:
        approved = predict_approval(application)
        status = "approved" if approved else "rejected"
        conn.execute(
            "UPDATE loan_applications SET status = ? WHERE id = ?",
            (status, approval.application_id),
        )
        conn.commit()
        conn.close()
        return {"message": f"Application {approval.application_id} has been {status}"}

    conn.close()
    return {"message": f"Application {approval.application_id} not found"}

@router.post("/repay")
async def repay(repayment: Repay):
    from openbb_payday.database import get_db_connection
    from datetime import date

    conn = get_db_connection()
    conn.execute(
        "INSERT INTO repayments (application_id, amount, date) VALUES (?, ?, ?)",
        (repayment.application_id, repayment.amount, date.today()),
    )
    conn.commit()
    conn.close()
    return {"message": f"Repayment of ${repayment.amount} for application {repayment.application_id} has been received."}

@router.post("/users")
async def users():
    from openbb_payday.database import get_db_connection
    conn = get_db_connection()
    users = conn.execute("SELECT * FROM users").fetchall()
    conn.close()
    return [dict(user) for user in users]

@router.post("/applications")
async def applications():
    from openbb_payday.database import get_db_connection
    conn = get_db_connection()
    applications = conn.execute("SELECT * FROM loan_applications").fetchall()
    conn.close()
    return [dict(application) for application in applications]

@router.post("/repayments")
async def repayments():
    from openbb_payday.database import get_db_connection
    conn = get_db_connection()
    repayments = conn.execute("SELECT * FROM repayments").fetchall()
    conn.close()
    return [dict(repayment) for repayment in repayments]

@router.post("/referral_code")
async def referral_code(user: User):
    from openbb_payday.database import get_db_connection
    conn = get_db_connection()
    user = conn.execute("SELECT referral_code FROM users WHERE id = ?", (user.id,)).fetchone()
    conn.close()

    if user:
        return {"referral_code": user["referral_code"]}
    return {"message": "User not found"}
