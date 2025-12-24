import os
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import APIKeyHeader
from openbb_payday.payday_models import (
    Register,
    Verify,
    CompleteRegistration,
    Login,
    Apply,
    Approve,
    Repay,
    User,
    LoanApplication,
    Repayment,
    ReferralCodeRequest,
    UserApplicationsRequest
)

router = APIRouter(prefix="/payday")

api_key_header = APIKeyHeader(name="X-Admin-Token", auto_error=False)

async def get_admin_user(api_key: str = Depends(api_key_header)):
    if api_key != os.environ.get("ADMIN_TOKEN"):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid admin token",
        )
    return True

@router.post("/register")
async def register(register: Register):
    from openbb_payday.database import get_db_connection
    import uuid

    verification_token = str(uuid.uuid4())
    referral_code = str(uuid.uuid4())

    conn = get_db_connection()
    conn.execute(
        "INSERT INTO users (email, verification_token, referral_code, referred_by) VALUES (?, ?, ?, ?)",
        (register.email, verification_token, referral_code, register.referred_by),
    )
    conn.commit()
    conn.close()
    return {"message": "Registration initiated. Please check your email for a verification link.", "token": verification_token}

@router.post("/verify")
async def verify(verification: Verify):
    from openbb_payday.database import get_db_connection

    conn = get_db_connection()
    user = conn.execute("SELECT * FROM users WHERE verification_token = ? AND account_status = 'pending'", (verification.token,)).fetchone()
    conn.close()

    if user:
        return {"message": "Token is valid."}
    return {"message": "Invalid or expired token."}

@router.post("/complete-registration")
async def complete_registration(registration: CompleteRegistration):
    from openbb_payday.database import get_db_connection
    from passlib.context import CryptContext

    pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
    conn = get_db_connection()
    user = conn.execute("SELECT * FROM users WHERE verification_token = ? AND account_status = 'pending'", (registration.token,)).fetchone()

    if not user:
        conn.close()
        return {"message": "Invalid or expired token."}

    hashed_password = pwd_context.hash(registration.password)
    conn.execute(
        "UPDATE users SET username = ?, hashed_password = ?, account_status = 'active', verification_token = NULL WHERE id = ?",
        (registration.username, hashed_password, user["id"]),
    )
    conn.commit()
    conn.close()
    return {"message": "Registration complete. You can now log in."}

from openbb_payday.auth import create_access_token, verify_password, ACCESS_TOKEN_EXPIRE_MINUTES, Token
from datetime import timedelta

@router.post("/login", response_model=Token)
async def login(login: Login):
    from openbb_payday.database import get_db_connection

    conn = get_db_connection()
    user = conn.execute("SELECT * FROM users WHERE username = ?", (login.username,)).fetchone()
    conn.close()

    if not user or not verify_password(login.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user["username"], "user_id": user["id"]}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/apply")
async def apply(application: Apply):
    from openbb_payday.database import get_db_connection

    # Ontario Payday Loan Regulations
    if application.loan_amount_requested > (application.monthly_income * 0.5):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Loan amount cannot exceed 50% of your net monthly income.",
        )

    cost_of_borrowing = (application.loan_amount_requested / 100) * 14
    total_repayment = application.loan_amount_requested + cost_of_borrowing

    conn = get_db_connection()
    conn.execute(
        """
        INSERT INTO loan_applications (user_id, full_name, address, date_of_birth, social_insurance_number, employment_status, monthly_income, loan_amount_requested, loan_purpose, status, total_repayment)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """,
        (application.user_id, application.full_name, application.address, application.date_of_birth, application.social_insurance_number, application.employment_status, application.monthly_income, application.loan_amount_requested, application.loan_purpose, "pending", total_repayment),
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
async def users(admin: bool = Depends(get_admin_user)):
    from openbb_payday.database import get_db_connection
    conn = get_db_connection()
    users = conn.execute("SELECT * FROM users").fetchall()
    conn.close()
    return [dict(user) for user in users]

@router.post("/applications")
async def applications(admin: bool = Depends(get_admin_user)):
    from openbb_payday.database import get_db_connection
    conn = get_db_connection()
    applications = conn.execute("SELECT * FROM loan_applications").fetchall()
    conn.close()
    return [dict(application) for application in applications]

@router.post("/user/applications")
async def user_applications(req: UserApplicationsRequest):
    from openbb_payday.database import get_db_connection
    conn = get_db_connection()
    applications = conn.execute("SELECT * FROM loan_applications WHERE user_id = ?", (req.user_id,)).fetchall()
    conn.close()
    return [dict(application) for application in applications]

@router.get("/repayments/{application_id}")
async def get_repayments_for_application(application_id: int, current_user: User = Depends(get_current_user)):
    from openbb_payday.database import get_db_connection
    conn = get_db_connection()

    # Check if the application belongs to the current user
    application = conn.execute("SELECT * FROM loan_applications WHERE id = ? AND user_id = ?", (application_id, current_user["id"])).fetchone()
    if not application:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Application not found or does not belong to the current user.",
        )

    repayments = conn.execute("SELECT * FROM repayments WHERE application_id = ?", (application_id,)).fetchall()
    conn.close()
    return [dict(repayment) for repayment in repayments]

@router.post("/referral_code")
async def referral_code(req: ReferralCodeRequest):
    from openbb_payday.database import get_db_connection
    conn = get_db_connection()
    user = conn.execute("SELECT referral_code FROM users WHERE id = ?", (req.user_id,)).fetchone()
    conn.close()

    if user:
        return {"referral_code": user["referral_code"]}
    return {"message": "User not found"}
