import React from 'react';
import { ArrowRight } from 'lucide-react';

export function formatIndianCurrency(num) {
  if (num === 0) return '₹ 0.00';
  const parts = Number(num).toFixed(2).split('.');
  let integerPart = parts[0];
  const decimalPart = parts[1];

  // Indian currency formatting: last 3 digits, then groups of 2
  const lastThree = integerPart.substring(integerPart.length - 3);
  const otherNumbers = integerPart.substring(0, integerPart.length - 3);
  if (otherNumbers !== '') {
    integerPart = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + "," + lastThree;
  } else {
    integerPart = lastThree;
  }

  return `₹ ${integerPart}.${decimalPart}`;
}

export function StatusBadge({ status }) {
  switch (status) {
    case 'Posted':
      return (
        <span className="inline-block px-3 py-1 rounded-full text-[11.5px] font-semibold bg-[#dcfce7] text-[#16a34a] border border-[#bbf7d0]/60">
          Posted
        </span>
      );
    case 'Approved':
      return (
        <span className="inline-block px-3 py-1 rounded-full text-[11.5px] font-semibold bg-[#e0f2fe] text-[#0284c7] border border-[#bae6fd]/60">
          Approved
        </span>
      );
    case 'Created':
      return (
        <span className="inline-block px-3 py-1 rounded-full text-[11.5px] font-semibold bg-[#ede9fe] text-[#7c3aed] border border-[#ddd6fe]/60">
          Created
        </span>
      );
    case 'In Progress':
      return (
        <span className="inline-block px-3 py-1 rounded-full text-[11.5px] font-semibold bg-[#f1f5f9] text-[#475569] border border-[#e2e8f0]">
          In Progress
        </span>
      );
    case 'Rejected':
      return (
        <span className="inline-block px-3 py-1 rounded-full text-[11.5px] font-semibold bg-[#fee2e2] text-[#dc2626] border border-[#fecaca]">
          Rejected
        </span>
      );
    default:
      return (
        <span className="inline-block px-3 py-1 rounded-full text-[11.5px] font-semibold bg-slate-100 text-slate-700">
          {status}
        </span>
      );
  }
}

export default function RecentTransactionsTable({
  transactions,
  onViewAll,
  onSelectTransaction
}) {
  return (
    <div className="mb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-[17px] font-bold text-slate-900 tracking-tight">
          Recent Transactions
        </h2>
        <button
          onClick={onViewAll}
          className="inline-flex items-center gap-1 text-[13px] font-semibold text-[#2563eb] hover:text-[#1d4ed8] transition-colors"
        >
          View All <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Table Container */}
      <div className="bg-white border border-[#e2e8f0] rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#e2e8f0] bg-[#f8fafc]/80 text-[12.5px] font-semibold text-slate-600">
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Document No.</th>
                <th className="py-3 px-4">Module</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#edf2f7] text-[13px] text-slate-700">
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-slate-400">
                    No transactions found.
                  </td>
                </tr>
              ) : (
                transactions.map((tx) => (
                  <tr
                    key={tx.id || tx.docNo}
                    onClick={() => onSelectTransaction && onSelectTransaction(tx)}
                    className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                  >
                    <td className="py-3 px-4 text-slate-600 whitespace-nowrap">
                      {tx.date}
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-900 whitespace-nowrap group-hover:text-blue-600 transition-colors">
                      {tx.docNo}
                    </td>
                    <td className="py-3 px-4 text-slate-600 whitespace-nowrap">
                      {tx.module}
                    </td>
                    <td className="py-3 px-4 text-slate-700">
                      {tx.description}
                    </td>
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
      </div>
    </div>
  );
}
