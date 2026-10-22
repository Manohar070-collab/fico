import React, { useState, useEffect } from 'react';
import { X, Building2, Plus, Edit2, Trash2, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { fetchCompanies, createCompanyApi, updateCompanyApi, deleteCompanyApi } from '../../services/api';

export default function CompanySetupModal({ isOpen, onClose, onCompaniesUpdated }) {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Form mode: null | 'create' | 'edit'
  const [formMode, setFormMode] = useState(null);
  const [editingId, setEditingId] = useState(null);

  // Form fields
  const [companyName, setCompanyName] = useState('');
  const [companyCode, setCompanyCode] = useState('');
  const [country, setCountry] = useState('India');
  const [currency, setCurrency] = useState('INR');
  const [fyStart, setFyStart] = useState('01-April');
  const [address, setAddress] = useState('');

  const loadCompanies = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchCompanies();
      if (data) {
        setCompanies(data);
        if (onCompaniesUpdated) onCompaniesUpdated(data.length);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadCompanies();
      setFormMode(null);
      setError(null);
      setSuccessMsg(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const resetForm = () => {
    setCompanyName('');
    setCompanyCode('');
    setCountry('India');
    setCurrency('INR');
    setFyStart('01-April');
    setAddress('');
    setFormMode(null);
    setEditingId(null);
  };

  const handleStartCreate = () => {
    resetForm();
    setFormMode('create');
  };

  const handleStartEdit = (c) => {
    setEditingId(c.id);
    setCompanyName(c.company_name);
    setCompanyCode(c.company_code);
    setCountry(c.country || 'India');
    setCurrency(c.currency || 'INR');
    setFyStart(c.financial_year_start || '01-April');
    setAddress(c.address || '');
    setFormMode('edit');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    try {
      if (formMode === 'create') {
        const payload = {
          company_name: companyName.trim(),
          company_code: companyCode.trim().toUpperCase(),
          country: country.trim(),
          currency: currency.trim().toUpperCase(),
          financial_year_start: fyStart.trim(),
          address: address.trim(),
          status: 'Active'
        };
        const created = await createCompanyApi(payload);
        setSuccessMsg(`Company '${created.company_name}' (${created.company_code}) created successfully in database!`);
        resetForm();
        await loadCompanies();
      } else if (formMode === 'edit') {
        const payload = {
          company_name: companyName.trim(),
          country: country.trim(),
          currency: currency.trim().toUpperCase(),
          financial_year_start: fyStart.trim(),
          address: address.trim()
        };
        await updateCompanyApi(editingId, payload);
        setSuccessMsg(`Company updated successfully!`);
        resetForm();
        await loadCompanies();
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (c) => {
    if (!window.confirm(`Are you sure you want to delete company '${c.company_name}'?`)) return;
    setError(null);
    try {
      await deleteCompanyApi(c.id);
      setSuccessMsg(`Company '${c.company_code}' deleted.`);
      await loadCompanies();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-600/10 text-blue-600 flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Company Setup (SAP OneERP / FICO)</h3>
              <p className="text-xs text-slate-500">
                Connected to FastAPI Backend (<span className="font-mono text-blue-600">http://localhost:8000/companies/</span>)
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notifications / Alerts */}
        {error && (
          <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
            <span className="font-medium">{error}</span>
          </div>
        )}
        {successMsg && (
          <div className="mx-6 mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-xs flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
            <span className="font-medium">{successMsg}</span>
          </div>
        )}

        {/* Main Content Area */}
        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          {/* Action Toolbar */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="font-semibold text-slate-700">Total Registered Entities:</span>
              <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-bold font-mono">
                {companies.length}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={loadCompanies}
                className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                title="Refresh from Database"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>

              {!formMode && (
                <button
                  onClick={handleStartCreate}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" /> Add New Company
                </button>
              )}
            </div>
          </div>

          {/* Create or Edit Form */}
          {formMode && (
            <form onSubmit={handleSubmit} className="border border-blue-200 bg-blue-50/30 rounded-xl p-5 space-y-4 animate-in fade-in duration-150">
              <div className="flex items-center justify-between border-b border-blue-100 pb-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-blue-900">
                  {formMode === 'create' ? 'Create New Company (Step 6 Practice)' : 'Edit Company Details'}
                </h4>
                <button
                  type="button"
                  onClick={resetForm}
                  className="text-xs text-slate-500 hover:text-slate-800 font-medium"
                >
                  Cancel
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Company Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g. ABC Technologies"
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Company Code <span className="text-red-500">* (Unique, e.g. ABC001)</span>
                  </label>
                  <input
                    type="text"
                    value={companyCode}
                    disabled={formMode === 'edit'}
                    onChange={(e) => setCompanyCode(e.target.value)}
                    placeholder="e.g. ABC001"
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 disabled:bg-slate-100 disabled:text-slate-500 font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Country</label>
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="e.g. India"
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Currency</label>
                  <input
                    type="text"
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    placeholder="e.g. INR, USD, EUR"
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Financial Year Start</label>
                  <input
                    type="text"
                    value={fyStart}
                    onChange={(e) => setFyStart(e.target.value)}
                    placeholder="e.g. 01-April"
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Company Address</label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="e.g. Chennai, Tamil Nadu"
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-200/60 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs"
                >
                  {formMode === 'create' ? 'Save Company to Database' : 'Update Company'}
                </button>
              </div>
            </form>
          )}

          {/* Companies List Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#f8fafc] border-b border-slate-200 text-slate-600 font-semibold">
                <tr>
                  <th className="py-3 px-4">Code</th>
                  <th className="py-3 px-4">Company Name</th>
                  <th className="py-3 px-4">Country</th>
                  <th className="py-3 px-4">Currency</th>
                  <th className="py-3 px-4">FY Start</th>
                  <th className="py-3 px-4">Address</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {companies.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="py-8 text-center text-slate-400">
                      {loading ? 'Connecting to backend...' : 'No companies found in database.'}
                    </td>
                  </tr>
                ) : (
                  companies.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-blue-600">{c.company_code}</td>
                      <td className="py-3 px-4 font-semibold text-slate-900">{c.company_name}</td>
                      <td className="py-3 px-4">{c.country}</td>
                      <td className="py-3 px-4 font-mono font-medium">{c.currency}</td>
                      <td className="py-3 px-4">{c.financial_year_start}</td>
                      <td className="py-3 px-4 text-slate-500 truncate max-w-[180px]">{c.address || '—'}</td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleStartEdit(c)}
                            className="p-1 text-slate-400 hover:text-blue-600 rounded hover:bg-blue-50"
                            title="Edit"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(c)}
                            className="p-1 text-slate-400 hover:text-red-600 rounded hover:bg-red-50"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <span>Backend status: <span className="text-emerald-600 font-semibold">● Online (FastAPI)</span></span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200 rounded-lg"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

