const API_BASE_URL = 'http://localhost:8000';

export async function fetchCompanies() {
  try {
    const res = await fetch(`${API_BASE_URL}/companies/`);
    if (!res.ok) throw new Error('Failed to fetch companies');
    return await res.json();
  } catch (err) {
    console.warn('API offline, falling back to local storage or defaults', err);
    return null;
  }
}

export async function createCompanyApi(companyData) {
  const res = await fetch(`${API_BASE_URL}/companies/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(companyData)
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.detail || 'Failed to create company');
  }
  return data;
}

export async function updateCompanyApi(id, updateData) {
  const res = await fetch(`${API_BASE_URL}/companies/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updateData)
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.detail || 'Failed to update company');
  }
  return data;
}

export async function deleteCompanyApi(id) {
  const res = await fetch(`${API_BASE_URL}/companies/${id}`, {
    method: 'DELETE'
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.detail || 'Failed to delete company');
  }
  return data;
}

export async function fetchSummaryApi() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/summary/`);
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    return null;
  }
}
