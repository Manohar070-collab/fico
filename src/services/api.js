const API_BASE_URL = 'http://localhost:8000';

function getAuthHeader() {
  const token = localStorage.getItem('access_token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
}

// ----------------- Auth APIs -----------------
export async function loginApi(username, password) {
  const body = new URLSearchParams({
    username: username || 'admin',
    password: password || 'admin123'
  });
  const res = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString()
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || 'Login failed');
  if (data.access_token) {
    localStorage.setItem('access_token', data.access_token);
    localStorage.setItem('user_name', data.username || 'admin');
  }
  return data;
}

export async function getCurrentUserApi() {
  const res = await fetch(`${API_BASE_URL}/api/v1/auth/me`, {
    headers: { ...getAuthHeader() }
  });
  if (!res.ok) return null;
  return await res.json();
}

// ----------------- Company APIs -----------------
export async function fetchCompanies() {
  try {
    const res = await fetch(`${API_BASE_URL}/companies/`);
    if (!res.ok) throw new Error('Failed to fetch companies');
    return await res.json();
  } catch (err) {
    console.warn('Backend unavailable, using fallback', err);
    return null;
  }
}

export async function createCompanyApi(companyData) {
  const res = await fetch(`${API_BASE_URL}/companies/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
    body: JSON.stringify(companyData)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || 'Failed to create company');
  return data;
}

export async function updateCompanyApi(id, updateData) {
  const res = await fetch(`${API_BASE_URL}/companies/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
    body: JSON.stringify(updateData)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || 'Failed to update company');
  return data;
}

export async function deleteCompanyApi(id) {
  const res = await fetch(`${API_BASE_URL}/companies/${id}`, {
    method: 'DELETE',
    headers: { ...getAuthHeader() }
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || 'Failed to delete company');
  return data;
}

// ----------------- Fiscal Year APIs -----------------
export async function fetchFiscalYears() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/fiscal-years/`);
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    return null;
  }
}

export async function createFiscalYearApi(fyData) {
  const res = await fetch(`${API_BASE_URL}/api/fiscal-years/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
    body: JSON.stringify(fyData)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || 'Failed to create fiscal year');
  return data;
}

// ----------------- Chart of Accounts APIs -----------------
export async function fetchChartOfAccounts() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/chart-of-accounts/`);
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    return null;
  }
}

export async function createChartOfAccountApi(coaData) {
  const res = await fetch(`${API_BASE_URL}/api/chart-of-accounts/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
    body: JSON.stringify(coaData)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || 'Failed to create account');
  return data;
}

export async function deleteChartOfAccountApi(id) {
  const res = await fetch(`${API_BASE_URL}/api/chart-of-accounts/${id}`, {
    method: 'DELETE',
    headers: { ...getAuthHeader() }
  });
  return await res.json();
}

// ----------------- Transactions APIs -----------------
export async function fetchTransactions() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/transactions/`);
    if (!res.ok) return null;
    const data = await res.json();
    return data.map(tx => ({
      id: `tx-${tx.id}`,
      docNo: tx.doc_no,
      date: tx.date,
      module: tx.module,
      description: tx.description,
      amount: tx.amount,
      status: tx.status,
      statusColor: tx.status_color || 'green'
    }));
  } catch (err) {
    console.warn('Transactions API unavailable', err);
    return null;
  }
}

export async function createTransactionApi(txData) {
  const payload = {
    doc_no: txData.docNo || txData.doc_no,
    date: txData.date,
    module: txData.module,
    description: txData.description,
    amount: parseFloat(txData.amount) || 0,
    status: txData.status || 'Posted',
    status_color: txData.statusColor || 'green'
  };

  const res = await fetch(`${API_BASE_URL}/api/transactions/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
    body: JSON.stringify(payload)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || 'Failed to create transaction');
  return {
    id: `tx-${data.id}`,
    docNo: data.doc_no,
    date: data.date,
    module: data.module,
    description: data.description,
    amount: data.amount,
    status: data.status,
    statusColor: data.status_color
  };
}

export async function postJournalEntryApi(jeData) {
  const res = await fetch(`${API_BASE_URL}/api/journal-entries/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
    body: JSON.stringify(jeData)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || 'Failed to post journal entry');
  return {
    id: `tx-${data.id}`,
    docNo: data.doc_no,
    date: data.date,
    module: data.module,
    description: data.description,
    amount: data.amount,
    status: data.status,
    statusColor: data.status_color
  };
}

// ----------------- Reports & Summary APIs -----------------
export async function fetchSummaryApi() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/summary/`);
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    return null;
  }
}

export async function fetchReportApi(type) {
  const endpoint = type === 'balance-sheet' ? '/api/reports/balance-sheet' : '/api/reports/profit-loss';
  const res = await fetch(`${API_BASE_URL}${endpoint}`);
  if (!res.ok) throw new Error('Failed to generate report');
  return await res.json();
}

// ----------------- System & Database Health API -----------------
export async function fetchSystemStatusApi() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/system/status`);
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    return null;
  }
}

