"""API integration tests for payday extension."""

import pytest
import tempfile
from fastapi.testclient import TestClient
from openbb_payday.payday_router import router
from openbb_payday.database import create_tables, set_database_file

client = TestClient(router)

@pytest.fixture(autouse=True)
def setup_database():
    with tempfile.NamedTemporaryFile() as tmp:
        set_database_file(tmp.name)
        create_tables()
        yield

def test_payday_register():
    params = {"username": "test", "password": "password", "email": "test@test.com", "referred_by": None}
    response = client.post("/payday/register", json=params)
    assert response.status_code == 200

def test_payday_login():
    params = {"username": "test", "password": "password"}
    response = client.post("/payday/login", json=params)
    assert response.status_code == 200

def test_payday_apply():
    params = {
        "id": 1,
        "user_id": 1,
        "full_name": "Test User",
        "address": "123 Test St",
        "date_of_birth": "2000-01-01",
        "social_insurance_number": "123456789",
        "employment_status": "employed",
        "monthly_income": 5000,
        "loan_amount_requested": 1000,
        "loan_purpose": "testing",
        "status": "pending"
    }
    response = client.post("/payday/apply", json=params)
    assert response.status_code == 200

def test_payday_approve():
    params = {"application_id": 1, "approved": True}
    response = client.post("/payday/approve", json=params)
    assert response.status_code == 200

def test_payday_repay():
    params = {"application_id": 1, "amount": 500}
    response = client.post("/payday/repay", json=params)
    assert response.status_code == 200

def test_payday_get_users():
    response = client.post("/payday/users")
    assert response.status_code == 200

def test_payday_get_applications():
    response = client.post("/payday/applications")
    assert response.status_code == 200

def test_payday_get_repayments():
    response = client.post("/payday/repayments")
    assert response.status_code == 200

def test_payday_referral_code():
    params = {"id": 1, "username": "test", "hashed_password": "password", "email": "test@test.com"}
    response = client.post("/payday/referral_code", json=params)
    assert response.status_code == 200
