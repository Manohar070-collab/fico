import pytest
from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)

def test_home():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json()["message"] == "Welcome to SAP OneERP"

def test_list_companies():
    response = client.get("/companies/")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
    assert len(response.json()) >= 2

def test_create_valid_company():
    payload = {
        "company_name": "ABC Technologies",
        "company_code": "ABC001",
        "country": "India",
        "currency": "INR",
        "financial_year_start": "01-April",
        "address": "Chennai, Tamil Nadu",
        "status": "Active"
    }
    response = client.post("/companies/", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["company_code"] == "ABC001"
    assert data["company_name"] == "ABC Technologies"
    assert "id" in data

def test_reject_duplicate_company_code():
    # Attempt to create duplicate company code ABC001
    payload = {
        "company_name": "Duplicate ABC Corp",
        "company_code": "ABC001",
        "country": "India",
        "currency": "INR",
        "financial_year_start": "01-April",
        "address": "Bangalore",
        "status": "Active"
    }
    response = client.post("/companies/", json=payload)
    assert response.status_code == 400
    assert "already exists" in response.json()["detail"]

def test_get_non_existent_company():
    response = client.get("/companies/999999")
    assert response.status_code == 404
    assert "not found" in response.json()["detail"]

def test_update_company():
    # First get list to find an ID
    companies = client.get("/companies/").json()
    target_id = companies[0]["id"]
    update_payload = {"address": "Updated Corporate Headquarters"}
    response = client.put(f"/companies/{target_id}", json=update_payload)
    assert response.status_code == 200
    assert response.json()["address"] == "Updated Corporate Headquarters"

def test_journal_entry_double_entry_balance_check():
    # Unbalanced entry should fail
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

    # Balanced entry should succeed
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
