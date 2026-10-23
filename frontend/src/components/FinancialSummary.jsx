import React, { useState } from 'react';
import { ChevronDown, ArrowUp } from 'lucide-react';
import { FINANCIAL_SUMMARIES } from '../data/initialData';

export default function FinancialSummary({ liveSummary }) {
  const [selectedPeriod, setSelectedPeriod] = useState('This Year');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const baseData = FINANCIAL_SUMMARIES[selectedPeriod] || FINANCIAL_SUMMARIES['This Year'];
  const periods = ['This Year', 'This Quarter', 'This Month', 'Previous Year'];

  // Use live database numbers if available for This Year
  const currentData = {
    income: (selectedPeriod === 'This Year' && liveSummary?.income) ? liveSummary.income : baseData.income,
    incomeChange: baseData.incomeChange,
    expenses: (selectedPeriod === 'This Year' && liveSummary?.expenses) ? liveSummary.expenses : baseData.expenses,
    expensesChange: baseData.expensesChange,
    netProfit: (selectedPeriod === 'This Year' && liveSummary?.net_profit) ? liveSummary.net_profit : baseData.netProfit,
    profitChange: baseData.profitChange
  };

  return (
    <div className="bg-white border border-[#e2e8f0] rounded-xl p-4 shadow-xs">
      {/* Header with Period Dropdown */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[15px] font-bold text-slate-900 tracking-tight">
          Financial Summary
        </h2>

        {/* Dropdown Button */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-1.5 px-2.5 py-1 text-[12px] font-medium text-slate-600 bg-white border border-slate-200 rounded-md hover:bg-slate-50 transition-colors shadow-2xs"
          >
            <span>{selectedPeriod}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-1 w-32 bg-white border border-slate-200 rounded-lg shadow-lg py-1 z-20 animate-in fade-in zoom-in-95 duration-100">
              {periods.map((p) => (
                <button
                  key={p}
                  onClick={() => {
                    setSelectedPeriod(p);
                    setDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 text-xs hover:bg-slate-50 transition-colors ${
                    selectedPeriod === p ? 'font-bold text-blue-600 bg-blue-50/50' : 'text-slate-700'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Metrics Stack */}
      <div className="space-y-3.5">
        {/* Total Income */}
        <div>
          <div className="text-[12px] text-slate-500 font-medium mb-1">
            Total Income
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-[19px] font-bold text-slate-900 tracking-tight">
              {currentData.income}
            </span>
            <span className="inline-flex items-center text-[12px] font-bold text-[#16a34a] gap-0.5">
              <ArrowUp className="w-3 h-3 stroke-[2.5]" />
              {currentData.incomeChange}
            </span>
          </div>
        </div>

        <div className="border-t border-[#f1f5f9]" />

        {/* Total Expenses */}
        <div>
          <div className="text-[12px] text-slate-500 font-medium mb-1">
            Total Expenses
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-[19px] font-bold text-slate-900 tracking-tight">
              {currentData.expenses}
            </span>
            <span className="inline-flex items-center text-[12px] font-bold text-[#16a34a] gap-0.5">
              <ArrowUp className="w-3 h-3 stroke-[2.5]" />
              {currentData.expensesChange}
            </span>
          </div>
        </div>

        <div className="border-t border-[#f1f5f9]" />

        {/* Net Profit */}
        <div>
          <div className="text-[12px] text-slate-500 font-medium mb-1">
            Net Profit
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-[19px] font-bold text-slate-900 tracking-tight">
              {currentData.netProfit}
            </span>
            <span className="inline-flex items-center text-[12px] font-bold text-[#16a34a] gap-0.5">
              <ArrowUp className="w-3 h-3 stroke-[2.5]" />
              {currentData.profitChange}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
