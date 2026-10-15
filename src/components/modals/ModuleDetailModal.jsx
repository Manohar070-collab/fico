import React from 'react';
import { X, Building2, Calendar, ListTree, BookOpen, ShieldCheck, FileSpreadsheet, Plus, CheckCircle, AlertCircle } from 'lucide-react';
import { COMPANIES_DATA, FISCAL_YEARS_DATA, CHART_OF_ACCOUNTS_DATA } from '../../data/initialData';

export default function ModuleDetailModal({ moduleName, isOpen, onClose, onQuickAction }) {
  if (!isOpen || !moduleName) return null;

  const renderContent = () => {
    switch (moduleName) {
      case 'Company':
      case 'Companies':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-xs text-slate-500">Registered legal entities and enterprise business units</p>
              <button
                onClick={() => alert('New Company setup wizard opened')}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                <Plus className="w-3.5 h-3.5" /> Add Company
              </button>
            </div>
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 font-semibold text-slate-600">
                  <tr>
                    <th className="py-2.5 px-3">Company Code</th>
                    <th className="py-2.5 px-3">Legal Name</th>
                    <th className="py-2.5 px-3">Country</th>
                    <th className="py-2.5 px-3">Currency</th>
                    <th className="py-2.5 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {COMPANIES_DATA.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50">
                      <td className="py-2.5 px-3 font-semibold text-slate-900">{c.code}</td>
                      <td className="py-2.5 px-3 font-medium">{c.name}</td>
                      <td className="py-2.5 px-3">{c.country}</td>
                      <td className="py-2.5 px-3 font-mono">{c.currency}</td>
                      <td className="py-2.5 px-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-700">
                          {c.status}
                        </span>
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
                onClick={() => alert('New Fiscal Year creation')}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700"
              >
                <Plus className="w-3.5 h-3.5" /> New Fiscal Year
              </button>
            </div>
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
                  {FISCAL_YEARS_DATA.map((fy, i) => (
                    <tr key={i} className="hover:bg-slate-50">
                      <td className="py-2.5 px-3 font-semibold text-slate-900">{fy.year}</td>
                      <td className="py-2.5 px-3">{fy.startDate}</td>
                      <td className="py-2.5 px-3">{fy.endDate}</td>
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

      case 'Chart of Accounts':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-xs text-slate-500">General ledger accounts classification (Assets, Liabilities, Equity, Revenue, Expense)</p>
              <button
                onClick={() => alert('Add G/L Account modal')}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                <Plus className="w-3.5 h-3.5" /> Add Account
              </button>
            </div>
            <div className="border border-slate-200 rounded-xl overflow-hidden max-h-80 overflow-y-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 font-semibold text-slate-600 sticky top-0">
                  <tr>
                    <th className="py-2.5 px-3">Account No</th>
                    <th className="py-2.5 px-3">Account Title</th>
                    <th className="py-2.5 px-3">Category</th>
                    <th className="py-2.5 px-3">Statement</th>
                    <th className="py-2.5 px-3">Current Balance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {CHART_OF_ACCOUNTS_DATA.map((acc) => (
                    <tr key={acc.accountNo} className="hover:bg-slate-50">
                      <td className="py-2.5 px-3 font-semibold text-slate-900 font-mono">{acc.accountNo}</td>
                      <td className="py-2.5 px-3 font-medium">{acc.name}</td>
                      <td className="py-2.5 px-3">{acc.category}</td>
                      <td className="py-2.5 px-3">{acc.type}</td>
                      <td className="py-2.5 px-3 font-semibold text-slate-900">{acc.balance}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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
                onClick={() => alert('GST reconciliation initiated')}
                className="px-3 py-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg"
              >
                Reconcile 2B vs Purchase Register
              </button>
              <button
                onClick={() => alert('GSTR JSON generated')}
                className="px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg"
              >
                Generate GSTR-3B Return
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
              All ledger entries, configuration policies, and master documents for {moduleName} are synchronized with SAP/FICO standards.
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
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150">
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">{moduleName} Overview</h3>
            <span className="text-[11px] font-semibold text-blue-600 uppercase tracking-wider">FICO Accounting Module</span>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">{renderContent()}</div>

        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex justify-end">
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

