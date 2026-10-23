import React, { useState } from 'react';
import { X, Search, Filter, Download } from 'lucide-react';
import { formatIndianCurrency, StatusBadge } from '../RecentTransactionsTable';

export default function ViewAllTransactionsModal({
  isOpen,
  onClose,
  transactions,
  onSelectTransaction,
  onOpenCreate
}) {
  const [filterModule, setFilterModule] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const modules = ['All', 'Journal Entry', 'Accounts Payable', 'Accounts Receivable', 'Fixed Assets', 'Budgeting', 'General Ledger'];
  const statuses = ['All', 'Posted', 'Approved', 'Created', 'In Progress'];

  const filtered = transactions.filter((tx) => {
    const matchModule = filterModule === 'All' || tx.module === filterModule;
    const matchStatus = filterStatus === 'All' || tx.status === filterStatus;
    const matchQuery =
      !query ||
      tx.docNo.toLowerCase().includes(query.toLowerCase()) ||
      tx.description.toLowerCase().includes(query.toLowerCase()) ||
      tx.module.toLowerCase().includes(query.toLowerCase());
    return matchModule && matchStatus && matchQuery;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between shrink-0">
          <div>
            <h3 className="text-base font-bold text-slate-900">All Financial Transactions</h3>
            <p className="text-xs text-slate-500">Comprehensive audit trail across all FICO sub-ledgers</p>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Toolbar */}
        <div className="p-4 border-b border-slate-200 bg-white flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px]">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search doc number, description..."
                className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>

            {/* Module Filter */}
            <select
              value={filterModule}
              onChange={(e) => setFilterModule(e.target.value)}
              className="px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white text-slate-700"
            >
              {modules.map((m) => (
                <option key={m} value={m}>
                  {m === 'All' ? 'All Modules' : m}
                </option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white text-slate-700"
            >
              {statuses.map((s) => (
                <option key={s} value={s}>
                  {s === 'All' ? 'All Statuses' : s}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => {
              alert('Transactions exported to CSV!');
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-slate-600" /> Export CSV
          </button>
        </div>

        {/* Table Content */}
        <div className="flex-1 overflow-y-auto">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 bg-[#f8fafc] border-b border-[#e2e8f0] text-[12.5px] font-semibold text-slate-600 z-10">
              <tr>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Document No.</th>
                <th className="py-3 px-4">Module</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#edf2f7] text-[13px] text-slate-700">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-400">
                    No transactions match the selected filters.
                  </td>
                </tr>
              ) : (
                filtered.map((tx) => (
                  <tr
                    key={tx.id || tx.docNo}
                    onClick={() => {
                      if (onSelectTransaction) onSelectTransaction(tx);
                    }}
                    className="hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <td className="py-3 px-4 text-slate-600 whitespace-nowrap">{tx.date}</td>
                    <td className="py-3 px-4 font-medium text-slate-900 whitespace-nowrap hover:text-blue-600">
                      {tx.docNo}
                    </td>
                    <td className="py-3 px-4 text-slate-600 whitespace-nowrap">{tx.module}</td>
                    <td className="py-3 px-4 text-slate-700">{tx.description}</td>
                    <td className="py-3 px-4 font-semibold text-slate-900 whitespace-nowrap">
                      {typeof tx.amount === 'number' ? formatIndianCurrency(tx.amount) : tx.amount}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <StatusBadge status={tx.status} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <span>Showing {filtered.length} of {transactions.length} records</span>
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

