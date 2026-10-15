import React from 'react';
import { PenSquare, Receipt, FileText, Building2, BarChart3, FileSpreadsheet, ChevronRight } from 'lucide-react';
import { QUICK_ACTIONS } from '../data/initialData';

const ICON_MAP = {
  PenSquare,
  Receipt,
  FileText,
  Building2,
  BarChart3,
  FileSpreadsheet
};

export default function QuickActions({ onActionClick }) {
  return (
    <div className="bg-white border border-[#e2e8f0] rounded-xl p-4 shadow-xs mb-6">
      <h2 className="text-[15px] font-bold text-slate-900 tracking-tight mb-3">
        Quick Actions
      </h2>

      <div className="space-y-1.5">
        {QUICK_ACTIONS.map((action) => {
          const IconComponent = ICON_MAP[action.icon] || FileText;
          return (
            <button
              key={action.id}
              onClick={() => onActionClick && onActionClick(action.id)}
              className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 transition-colors text-left group"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-7 h-7 rounded-md ${action.iconBg} ${action.textColor} flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform`}
                >
                  <IconComponent className="w-4 h-4" />
                </div>
                <span className="text-[13px] font-medium text-slate-800 group-hover:text-blue-600 transition-colors">
                  {action.title}
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all" />
            </button>
          );
        })}
      </div>
    </div>
  );
}
