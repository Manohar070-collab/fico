import React, { useState } from 'react';
import { X } from 'lucide-react';

export default function CreateBudgetModal({ isOpen, onClose, onAddTransaction }) {
  const [budgetTitle, setBudgetTitle] = useState('Annual Marketing & Operations Budget');
  const [department, setDepartment] = useState('Operations');
  const [amount, setAmount] = useState('1000000');
  const [fiscalYear, setFiscalYear] = useState('2025-2026');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount) || 0;
    const randomNum = Math.floor(100000 + Math.random() * 900000);

    const newTx = {
      id: `tx-${Date.now()}`,
      date: '15-04-2025',
      docNo: `BG-${randomNum}`,
      module: 'Budgeting',
      description: `${budgetTitle} (${fiscalYear})`,
      amount: parsedAmount,
      status: 'Created',
      statusColor: 'purple'
    };

    onAddTransaction(newTx);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150">
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Create Budget Allocation</h3>
            <p className="text-xs text-slate-500">Plan and approve departmental fiscal budget</p>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Budget Title</label>
            <input
              type="text"
              value={budgetTitle}
              onChange={(e) => setBudgetTitle(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Department</label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
              >
                <option value="Operations">Operations</option>
                <option value="Finance & Accounts">Finance & Accounts</option>
                <option value="Information Tech">Information Tech</option>
                <option value="Human Resources">Human Resources</option>
                <option value="Marketing & Sales">Marketing & Sales</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Fiscal Year</label>
              <select
                value={fiscalYear}
                onChange={(e) => setFiscalYear(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
              >
                <option value="2025-2026">FY 2025-2026</option>
                <option value="2026-2027">FY 2026-2027</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Allocated Amount (₹)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              required
            />
          </div>

          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-xs transition-colors"
            >
              Save Budget
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

