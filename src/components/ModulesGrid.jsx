import React from 'react';
import {
  Building2,
  ListTree,
  PenSquare,
  BookOpen,
  FileText,
  Receipt,
  Boxes,
  BarChart3,
  ShieldCheck,
  FileSpreadsheet,
  ChevronRight,
  ArrowRight
} from 'lucide-react';
import { FICO_MODULES } from '../data/initialData';

const ICON_MAP = {
  Building2,
  ListTree,
  PenSquare,
  BookOpen,
  FileText,
  Receipt,
  Boxes,
  BarChart3,
  ShieldCheck,
  FileSpreadsheet
};

export default function ModulesGrid({ onSelectModule, onViewAllModules }) {
  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-[17px] font-bold text-slate-900 tracking-tight">
          FICO Modules
        </h2>
        <button
          onClick={onViewAllModules}
          className="inline-flex items-center gap-1 text-[13px] font-semibold text-[#2563eb] hover:text-[#1d4ed8] transition-colors"
        >
          View All Modules <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3.5">
        {FICO_MODULES.map((mod) => {
          const IconComponent = ICON_MAP[mod.icon] || FileText;
          return (
            <div
              key={mod.id}
              onClick={() => onSelectModule && onSelectModule(mod.name)}
              className="bg-white border border-[#e2e8f0] rounded-xl p-3.5 flex items-center justify-between hover:shadow-md hover:border-slate-300 transition-all duration-200 cursor-pointer group"
            >
              <div className="flex items-center gap-3 min-w-0 pr-2">
                <div
                  className={`w-9 h-9 rounded-lg ${mod.iconBg} ${mod.iconColor} flex items-center justify-center shrink-0 transition-transform group-hover:scale-105`}
                >
                  <IconComponent className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-[13.5px] font-bold text-slate-900 truncate group-hover:text-blue-600 transition-colors">
                    {mod.name}
                  </h3>
                  <p className="text-[11.5px] text-slate-500 truncate leading-snug">
                    {mod.description}
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all shrink-0" />
            </div>
          );
        })}
      </div>
    </div>
  );
}
