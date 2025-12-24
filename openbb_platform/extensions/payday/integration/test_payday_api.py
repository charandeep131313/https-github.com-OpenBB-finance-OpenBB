"""API integration tests for payday extension."""

import os
import pytest
import tempfile
from fastapi.testclient import TestClient
from openbb_payday.payday_router import router
from openbb_payday.database import create_tables, set_database_file

client = TestClient(router)

@pytest.fixture(autouse=True)
def setup_database():
    os.environ["ADMIN_TOKEN"] = "admin"
    with tempfile.NamedTemporaryFile() as tmp:
        set_database_file(tmp.name)
        create_tables()
        yield

def test_payday_register():
    params = {"email": "test@test.com", "referred_by": None}
    response = client.post("/payday/register", json=params)
    assert response.status_code == 200

def test_payday_login():
    # First, register to get a token
    register_params = {"email": "test@test.com", "referred_by": None}
    register_response = client.post("/payday/register", json=register_params)
    token = register_response.json()["token"]

    # Then, complete the registration
    complete_params = {"token": token, "username": "test", "password": "password"}
    client.post("/payday/complete-registration", json=complete_params)

    # Now, login
    params = {"username": "test", "password": "password"}
    response = client.post("/payday/login", json=params)
    assert response.status_code == 200

def test_payday_apply():
    # First, register to get a token
    register_params = {"email": "test@test.com", "referred_by": None}
    register_response = client.post("/payday/register", json=register_params)
    token = register_response.json()["token"]

    # Then, complete the registration
    complete_params = {"token": token, "username": "test", "password": "password"}
    client.post("/payday/complete-registration", json=complete_params)

    # Now, login
    login_params = {"username": "test", "password": "password"}
    login_response = client.post("/payday/login", json=login_params)
    user_id = login_response.json()["user"]["id"]

    params = {
        "id": 1,
        "user_id": user_id,
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
    # First, create an application
    apply_params = {
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
    client.post("/payday/apply", json=apply_params)

    params = {"application_id": 1, "approved": True}
    response = client.post("/payday/approve", json=params)
    assert response.status_code == 200

def test_payday_repay():
    # First, create an application
    apply_params = {
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
    client.post("/payday/apply", json=apply_params)

    params = {"application_id": 1, "amount": 500}
    response = client.post("/payday/repay", json=params)
    assert response.status_code == 200

def test_payday_get_users():
    response = client.post("/payday/users", headers={"X-Admin-Token": "admin"})
    assert response.status_code == 200

def test_payday_get_applications():
    response = client.post("/payday/applications", headers={"X-Admin-Token": "admin"})
    assert response.status_code == 200

def test_payday_get_repayments():
    response = client.post("/payday/repayments", headers={"X-Admin-Token": "admin"})
    assert response.status_code == 200

def test_payday_referral_code():
    # First, register to get a token
    register_params = {"email": "test@test.com", "referred_by": None}
    register_response = client.post("/payday/register", json=register_params)
    token = register_response.json()["token"]

    # Then, complete the registration
    complete_params = {"token": token, "username": "test", "password": "password"}
    client.post("/payday/complete-registration", json=complete_params)

    # Now, login
    login_params = {"username": "test", "password": "password"}
    login_response = client.post("/payday/login", json=login_params)
    user_id = login_response.json()["user"]["id"]

    params = {"user_id": user_id}
    response = client.post("/payday/referral_code", json=params)
    assert response.status_code == 200

def test_complete_registration():
    # First, register to get a token
    register_params = {"email": "test@test.com", "referred_by": None}
    register_response = client.post("/payday/register", json=register_params)
    token = register_response.json()["token"]

    # Then, complete the registration
    complete_params = {"token": token, "username": "test", "password": "password"}
    response = client.post("/payday/complete-registration", json=complete_params)
    assert response.status_code == 200
