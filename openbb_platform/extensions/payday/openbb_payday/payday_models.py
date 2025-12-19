from datetime import date
from typing import Optional
from pydantic import BaseModel, Field

class User(BaseModel):
    id: int
    username: str
    hashed_password: str
    email: str
    disabled: bool = False

class LoanApplication(BaseModel):
    id: int
    user_id: int
    full_name: str
    address: str
    date_of_birth: date
    social_insurance_number: str = Field(..., min_length=9, max_length=9)
    employment_status: str
    monthly_income: float
    loan_amount_requested: float
    loan_purpose: str
    status: str = "pending"

class Repayment(BaseModel):
    application_id: int
    amount: float
    date: date

class Register(BaseModel):
    username: str
    password: str
    email: str
    referred_by: Optional[str] = None

class Login(BaseModel):
    username: str
    password: str

class Apply(LoanApplication):
    pass

class Approve(BaseModel):
    application_id: int
    approved: bool

class Repay(BaseModel):
    application_id: int
    amount: float

class Users(BaseModel):
    pass

class Applications(BaseModel):
    pass

class Repayments(BaseModel):
    pass
