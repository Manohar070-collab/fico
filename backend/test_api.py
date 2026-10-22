import time
import pytest
from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)

def test_home():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json()["message"] == "Welcome to SAP OneERP"

def test_auth_login_success():
    # Login with admin credentials using OAuth2 form data
    response = client.post(
        "/api/v1/auth/login",
        data={"username": "admin", "password": "admin123"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"
    assert data["username"] == "admin"

def test_auth_login_invalid_password():
    response = client.post(
        "/api/v1/auth/login",
        data={"username": "admin", "password": "wrongpassword"}
    )
    assert response.status_code == 401
    assert "Incorrect username or password" in response.json()["detail"]

def test_auth_me_profile():
    # Login to obtain token
    login_res = client.post(
        "/api/v1/auth/login",
        data={"username": "admin", "password": "admin123"}
    )
    token = login_res.json()["access_token"]

    # Call /api/v1/auth/me with Bearer token
    headers = {"Authorization": f"Bearer {token}"}
    me_res = client.get("/api/v1/auth/me", headers=headers)
    assert me_res.status_code == 200
    user_data = me_res.json()
    assert user_data["username"] == "admin"
    assert "role" in user_data

def test_list_companies():
    response = client.get("/companies/")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
    assert len(response.json()) >= 2

def test_create_valid_company():
    unique_code = f"CMP_{int(time.time() * 1000) % 1000000}"
    payload = {
        "company_name": "ABC Technologies",
        "company_code": unique_code,
        "country": "India",
        "currency": "INR",
        "financial_year_start": "01-April",
        "address": "Chennai, Tamil Nadu",
        "status": "Active"
    }
    response = client.post("/companies/", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["company_code"] == unique_code
    assert data["company_name"] == "ABC Technologies"
    assert "id" in data

def test_reject_duplicate_company_code():
    unique_code = f"DUP_{int(time.time() * 1000) % 1000000}"
    payload = {
        "company_name": "Original Company",
        "company_code": unique_code,
        "country": "India",
        "currency": "INR"
    }
    res1 = client.post("/companies/", json=payload)
    assert res1.status_code == 201

    res2 = client.post("/companies/", json=payload)
    assert res2.status_code == 400
    assert "already exists" in res2.json()["detail"]

def test_get_non_existent_company():
    response = client.get("/companies/999999")
    assert response.status_code == 404
    assert "not found" in response.json()["detail"]

def test_update_company():
    companies = client.get("/companies/").json()
    target_id = companies[0]["id"]
    update_payload = {"address": "Updated Corporate Headquarters"}
    response = client.put(f"/companies/{target_id}", json=update_payload)
    assert response.status_code == 200
    assert response.json()["address"] == "Updated Corporate Headquarters"

def test_journal_entry_double_entry_balance_check():
    unbalanced_payload = {
        "date": "15-04-2025",
        "description": "Unbalanced Entry Test",
        "items": [
            {"account": "Cash", "debit": 5000.0, "credit": 0.0},
            {"account": "Expense", "debit": 0.0, "credit": 3000.0}
        ]
    }
    response = client.post("/api/journal-entries/", json=unbalanced_payload)
    assert response.status_code == 400
    assert "Double-entry violation" in response.json()["detail"]

    balanced_payload = {
        "date": "15-04-2025",
        "description": "Office Supplies Expense",
        "items": [
            {"account": "Office Supplies Expense", "debit": 5000.0, "credit": 0.0},
            {"account": "Cash/Bank", "debit": 0.0, "credit": 5000.0}
        ]
    }
    response = client.post("/api/journal-entries/", json=balanced_payload)
    assert response.status_code == 201
    assert response.json()["amount"] == 5000.0
