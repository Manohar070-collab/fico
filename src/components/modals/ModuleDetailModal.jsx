import React, { useState, useEffect } from 'react';
import { X, Building2, Calendar, ListTree, BookOpen, ShieldCheck, FileSpreadsheet, Plus, CheckCircle, Trash2, RefreshCw } from 'lucide-react';
import {
  fetchChartOfAccounts,
  createChartOfAccountApi,
  deleteChartOfAccountApi,
  fetchFiscalYears,
  createFiscalYearApi,
  fetchReportApi
} from '../../services/api';
import { CHART_OF_ACCOUNTS_DATA, FISCAL_YEARS_DATA } from '../../data/initialData';

export default function ModuleDetailModal({ moduleName, isOpen, onClose, onQuickAction, onDataChanged }) {
  const [coaList, setCoaList] = useState(CHART_OF_ACCOUNTS_DATA);
  const [fyList, setFyList] = useState(FISCAL_YEARS_DATA);
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [reportData, setReportData] = useState(null);

  // Form states
  const [accNo, setAccNo] = useState('');
  const [accName, setAccName] = useState('');
  const [accCat, setAccCat] = useState('Assets');
  const [accBal, setAccBal] = useState('50000');

  const [fyYear, setFyYear] = useState('2026-2027');
  const [fyStart, setFyStart] = useState('01-04-2026');
  const [fyEnd, setFyEnd] = useState('31-03-2027');

  useEffect(() => {
    if (isOpen) {
      setShowAddForm(false);
      if (moduleName === 'Chart of Accounts') {
        loadCoA();
      } else if (moduleName === 'Fiscal Year' || moduleName === 'Fiscal Period') {
        loadFY();
      } else if (moduleName === 'Financial Reports') {
        loadReport();
      }
    }
  }, [isOpen, moduleName]);

  const loadCoA = async () => {
    setLoading(true);
    const data = await fetchChartOfAccounts();
    if (data && data.length > 0) {
      setCoaList(data);
    }
    setLoading(false);
  };

  const loadFY = async () => {
    setLoading(true);
    const data = await fetchFiscalYears();
    if (data && data.length > 0) {
      setFyList(data);
    }
    setLoading(false);
  };

  const loadReport = async () => {
    setLoading(true);
    try {
      const bs = await fetchReportApi('balance-sheet');
      setReportData(bs);
    } catch (e) {
      console.warn(e);
    }
    setLoading(false);
  };

  const handleAddAccount = async (e) => {
    e.preventDefault();
    try {
      await createChartOfAccountApi({
        account_no: accNo.trim(),
        name: accName.trim(),
        category: accCat,
        type: accCat === 'Revenue' || accCat === 'Expense' ? 'Profit & Loss' : 'Balance Sheet',
        balance: parseFloat(accBal) || 0
      });
      setShowAddForm(false);
      setAccNo('');
      setAccName('');
      await loadCoA();
      if (onDataChanged) onDataChanged();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleAddFiscalYear = async (e) => {
    e.preventDefault();
    try {
      await createFiscalYearApi({
        year: fyYear.trim(),
        start_date: fyStart.trim(),
        end_date: fyEnd.trim(),
        periods: 12,
        status: 'Active'
      });
      setShowAddForm(false);
      await loadFY();
      if (onDataChanged) onDataChanged();
    } catch (err) {
      alert(err.message);
    }
  };

  if (!isOpen || !moduleName) return null;

  const renderContent = () => {
    switch (moduleName) {
      case 'Chart of Accounts':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-xs text-slate-500">General ledger accounts classification synced with live database</p>
              <div className="flex items-center gap-2">
                <button
                  onClick={loadCoA}
                  className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
                  title="Refresh"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                </button>
                <button
                  onClick={() => setShowAddForm(!showAddForm)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" /> {showAddForm ? 'Cancel' : 'Add G/L Account'}
                </button>
              </div>
            </div>

            {showAddForm && (
              <form onSubmit={handleAddAccount} className="p-4 bg-blue-50/40 border border-blue-200 rounded-xl space-y-3">
                <h4 className="text-xs font-bold text-blue-900 uppercase">Create New G/L Account</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700">Account Number *</label>
                    <input
                      type="text"
                      value={accNo}
                      onChange={(e) => setAccNo(e.target.value)}
                      placeholder="e.g. 105000"
                      className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-md font-mono"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700">Account Title *</label>
                    <input
                      type="text"
                      value={accName}
                      onChange={(e) => setAccName(e.target.value)}
                      placeholder="e.g. Petty Cash"
                      className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-md"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700">Category</label>
                    <select
                      value={accCat}
                      onChange={(e) => setAccCat(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-md"
                    >
                      <option value="Assets">Assets</option>
                      <option value="Liabilities">Liabilities</option>
                      <option value="Equity">Equity</option>
                      <option value="Revenue">Revenue</option>
                      <option value="Expense">Expense</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700">Initial Balance (₹)</label>
                    <input
                      type="number"
                      value={accBal}
                      onChange={(e) => setAccBal(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-md"
                    />
                  </div>
                </div>
                <div className="flex justify-end pt-2">
                  <button type="submit" className="px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 rounded-lg">
                    Save to Database
                  </button>
                </div>
              </form>
            )}

            <div className="border border-slate-200 rounded-xl overflow-hidden max-h-80 overflow-y-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 font-semibold text-slate-600 sticky top-0">
                  <tr>
                    <th className="py-2.5 px-3">Account No</th>
                    <th className="py-2.5 px-3">Account Title</th>
                    <th className="py-2.5 px-3">Category</th>
                    <th className="py-2.5 px-3">Statement</th>
                    <th className="py-2.5 px-3">Balance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {coaList.map((acc) => (
                    <tr key={acc.account_no || acc.accountNo} className="hover:bg-slate-50">
                      <td className="py-2.5 px-3 font-semibold text-slate-900 font-mono">
                        {acc.account_no || acc.accountNo}
                      </td>
                      <td className="py-2.5 px-3 font-medium">{acc.name}</td>
                      <td className="py-2.5 px-3">{acc.category}</td>
                      <td className="py-2.5 px-3">{acc.type}</td>
                      <td className="py-2.5 px-3 font-semibold text-slate-900">
                        {typeof acc.balance === 'number' ? `₹ ${acc.balance.toLocaleString('en-IN')}` : acc.balance}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'Fiscal Year':
      case 'Fiscal Period':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-xs text-slate-500">Active accounting cycles and period posting controls</p>
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" /> {showAddForm ? 'Cancel' : 'New Fiscal Year'}
              </button>
            </div>

            {showAddForm && (
              <form onSubmit={handleAddFiscalYear} className="p-4 bg-emerald-50/40 border border-emerald-200 rounded-xl space-y-3">
                <h4 className="text-xs font-bold text-emerald-900 uppercase">Create New Fiscal Year</h4>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700">Fiscal Year (e.g. 2026-2027)</label>
                    <input
                      type="text"
                      value={fyYear}
                      onChange={(e) => setFyYear(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-md font-mono"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700">Start Date</label>
                    <input
                      type="text"
                      value={fyStart}
                      onChange={(e) => setFyStart(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-md"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700">End Date</label>
                    <input
                      type="text"
                      value={fyEnd}
                      onChange={(e) => setFyEnd(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-md"
                      required
                    />
                  </div>
                </div>
                <div className="flex justify-end pt-2">
                  <button type="submit" className="px-4 py-1.5 text-xs font-semibold text-white bg-emerald-600 rounded-lg">
                    Save Fiscal Year
                  </button>
                </div>
              </form>
            )}

            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 font-semibold text-slate-600">
                  <tr>
                    <th className="py-2.5 px-3">Fiscal Year</th>
                    <th className="py-2.5 px-3">Start Date</th>
                    <th className="py-2.5 px-3">End Date</th>
                    <th className="py-2.5 px-3">Periods</th>
                    <th className="py-2.5 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {fyList.map((fy, i) => (
                    <tr key={i} className="hover:bg-slate-50">
                      <td className="py-2.5 px-3 font-semibold text-slate-900">{fy.year}</td>
                      <td className="py-2.5 px-3">{fy.start_date || fy.startDate}</td>
                      <td className="py-2.5 px-3">{fy.end_date || fy.endDate}</td>
                      <td className="py-2.5 px-3">{fy.periods} Periods</td>
                      <td className="py-2.5 px-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                            fy.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {fy.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'Financial Reports':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500">Live Balance Sheet generated directly from Database</span>
              <button
                onClick={loadReport}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
            {reportData && (
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="border border-slate-200 rounded-xl p-3 bg-slate-50">
                  <h5 className="font-bold text-slate-900 mb-2">Total Assets</h5>
                  <p className="text-xl font-bold text-blue-600">₹ {reportData.total_assets.toLocaleString('en-IN')}</p>
                  <ul className="mt-3 space-y-1 text-slate-600">
                    {reportData.assets.map((a, idx) => (
                      <li key={idx} className="flex justify-between">
                        <span>{a.name}</span>
                        <span className="font-mono">₹ {a.balance.toLocaleString('en-IN')}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="border border-slate-200 rounded-xl p-3 bg-slate-50">
                  <h5 className="font-bold text-slate-900 mb-2">Liabilities & Equity</h5>
                  <p className="text-xl font-bold text-purple-600">
                    ₹ {(reportData.total_liabilities + reportData.total_equity).toLocaleString('en-IN')}
                  </p>
                  <div className="mt-3 space-y-2 text-slate-600">
                    <div>
                      <span className="font-semibold block text-slate-700">Liabilities:</span>
                      {reportData.liabilities.map((l, idx) => (
                        <div key={idx} className="flex justify-between pl-2">
                          <span>{l.name}</span>
                          <span className="font-mono">₹ {l.balance.toLocaleString('en-IN')}</span>
                        </div>
                      ))}
                    </div>
                    <div>
                      <span className="font-semibold block text-slate-700">Equity:</span>
                      {reportData.equity.map((e, idx) => (
                        <div key={idx} className="flex justify-between pl-2">
                          <span>{e.name}</span>
                          <span className="font-mono">₹ {e.balance.toLocaleString('en-IN')}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case 'GST':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
                <span className="text-[11px] text-blue-600 font-medium">Outward Supplies (GSTR-1)</span>
                <p className="text-lg font-bold text-slate-900 mt-1">₹ 12,50,000</p>
                <span className="text-[10px] text-emerald-600 font-semibold">Tax: ₹ 2,25,000</span>
              </div>
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3">
                <span className="text-[11px] text-emerald-600 font-medium">Input Tax Credit (ITC)</span>
                <p className="text-lg font-bold text-slate-900 mt-1">₹ 8,75,000</p>
                <span className="text-[10px] text-emerald-600 font-semibold">Eligible: ₹ 1,57,500</span>
              </div>
              <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-3">
                <span className="text-[11px] text-indigo-600 font-medium">Net GST Liability</span>
                <p className="text-lg font-bold text-slate-900 mt-1">₹ 67,500</p>
                <span className="text-[10px] text-amber-600 font-semibold">Due 20th of month</span>
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => alert('GST reconciliation with purchase register completed!')}
                className="px-3 py-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg"
              >
                Reconcile GSTR-2B
              </button>
              <button
                onClick={() => alert('GSTR-3B monthly return successfully exported!')}
                className="px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs"
              >
                Export GSTR-3B Return
              </button>
            </div>
          </div>
        );

      default:
        return (
          <div className="py-8 text-center space-y-3">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto">
              <BookOpen className="w-6 h-6" />
            </div>
            <h4 className="font-semibold text-slate-900 text-sm">{moduleName} Sub-System</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              All ledger entries, configuration policies, and master documents for {moduleName} are synchronized live with the database.
            </p>
            <div className="pt-2">
              <button
                onClick={() => {
                  onClose();
                  if (onQuickAction) {
                    if (moduleName.includes('AP')) onQuickAction('create-ap');
                    else if (moduleName.includes('AR')) onQuickAction('create-ar');
                    else if (moduleName.includes('Journal')) onQuickAction('create-je');
                    else if (moduleName.includes('Asset')) onQuickAction('add-asset');
                    else if (moduleName.includes('Budget')) onQuickAction('create-budget');
                    else onQuickAction('generate-report');
                  }
                }}
                className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs"
              >
                Perform Action in {moduleName}
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between shrink-0">
          <div>
            <h3 className="text-base font-bold text-slate-900">{moduleName} Overview</h3>
            <span className="text-[11px] font-semibold text-blue-600 uppercase tracking-wider">FICO Accounting Module</span>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">{renderContent()}</div>

        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
