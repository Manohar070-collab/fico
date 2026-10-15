import React from 'react';
import { Building2, Calendar, CalendarDays, FileText, ArrowRight } from 'lucide-react';

export default function KpiCards({ onCardClick, companiesCount = 2 }) {
  const cards = [
    {
      id: 'Company',
      title: 'Total Companies',
      value: String(companiesCount),
      bg: 'bg-[#eff7ff]',
      border: 'border-[#d6ecfd]',
      iconBg: 'bg-[#0091ff]',
      icon: Building2,
      textColor: 'text-slate-900',
      linkColor: 'text-[#0284c7] hover:text-[#0369a1]'
    },
    {
      id: 'Fiscal Year',
      title: 'Active Fiscal Years',
      value: '2',
      bg: 'bg-[#effbf5]',
      border: 'border-[#caedd8]',
      iconBg: 'bg-[#10b981]',
      icon: Calendar,
      textColor: 'text-slate-900',
      linkColor: 'text-[#059669] hover:text-[#047857]'
    },
    {
      id: 'Fiscal Period',
      title: 'Open Periods',
      value: '5',
      bg: 'bg-[#f7f4fe]',
      border: 'border-[#e4dcfc]',
      iconBg: 'bg-[#9333ea]',
      icon: CalendarDays,
      textColor: 'text-[#7e22ce]',
      linkColor: 'text-[#7e22ce] hover:text-[#6b21a8]'
    },
    {
      id: 'Chart of Accounts',
      title: 'Total Accounts',
      value: '128',
      bg: 'bg-[#fff8f2]',
      border: 'border-[#fee3d0]',
      iconBg: 'bg-[#f97316]',
      icon: FileText,
      textColor: 'text-[#ea580c]',
      linkColor: 'text-[#2563eb] hover:text-[#1d4ed8]'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((card) => {
        const IconComponent = card.icon;
        return (
          <div
            key={card.id}
            onClick={() => onCardClick && onCardClick(card.id)}
            className={`${card.bg} border ${card.border} rounded-xl p-4 flex flex-col justify-between transition-all duration-200 hover:shadow-md cursor-pointer`}
          >
            <div>
              {/* Icon Container */}
              <div className={`w-9 h-9 rounded-lg ${card.iconBg} flex items-center justify-center text-white mb-3 shadow-xs`}>
                <IconComponent className="w-5 h-5" />
              </div>

              {/* Title & Value */}
              <div className="text-[13px] font-medium text-slate-600 mb-1">
                {card.title}
              </div>
              <div className={`text-3xl font-bold tracking-tight ${card.textColor}`}>
                {card.value}
              </div>
            </div>

            {/* Bottom link */}
            <div className="mt-4 pt-1">
              <span className={`inline-flex items-center gap-1.5 text-[12.5px] font-semibold ${card.linkColor} transition-colors`}>
                View All <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
