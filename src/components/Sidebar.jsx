import React from 'react';
import {
  Home,
  Building2,
  Calendar,
  CalendarDays,
  ListTree,
  PenSquare,
  BookOpen,
  Scale,
  Receipt,
  Coins,
  Boxes,
  BarChart3,
  ShieldCheck,
  FileSpreadsheet,
  ChevronDown,
  LayoutGrid,
  X
} from 'lucide-react';

export default function Sidebar({
  activeMenu,
  setActiveMenu,
  activeSubmenu,
  setActiveSubmenu,
  onOpenModule,
  isMobileOpen,
  setIsMobileOpen
}) {
  const [ficoExpanded, setFicoExpanded] = React.useState(true);

  const subMenuItems = [
    { id: 'Company', label: 'Company', icon: Building2 },
    { id: 'Fiscal Year', label: 'Fiscal Year', icon: Calendar },
    { id: 'Fiscal Period', label: 'Fiscal Period', icon: CalendarDays },
    { id: 'Chart of Accounts', label: 'Chart of Accounts', icon: ListTree },
    { id: 'Journal Entry', label: 'Journal Entry', icon: PenSquare },
    { id: 'General Ledger', label: 'General Ledger', icon: BookOpen },
    { id: 'Trial Balance', label: 'Trial Balance', icon: Scale },
    { id: 'Accounts Payable (AP)', label: 'Accounts Payable (AP)', icon: Receipt },
    { id: 'Accounts Receivable (AR)', label: 'Accounts Receivable (AR)', icon: Coins },
    { id: 'Fixed Assets', label: 'Fixed Assets', icon: Boxes },
    { id: 'Budgeting', label: 'Budgeting', icon: BarChart3 },
    { id: 'GST', label: 'GST', icon: ShieldCheck },
    { id: 'Financial Reports', label: 'Financial Reports', icon: FileSpreadsheet },
  ];

  return (
    <>
      {/* Mobile backdrop overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-xs"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed lg:static top-0 left-0 bottom-0 z-50 w-64 bg-[#0d1a38] text-white flex flex-col transition-transform duration-200 ease-in-out shrink-0 select-none shadow-xl lg:shadow-none ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand / Logo Header */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-[#1b2b52]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 flex items-center justify-center text-blue-400">
              <div className="grid grid-cols-2 gap-1">
                <span className="w-2 h-2 rounded-xs bg-white"></span>
                <span className="w-2 h-2 rounded-xs bg-blue-400"></span>
                <span className="w-2 h-2 rounded-xs bg-blue-400"></span>
                <span className="w-2 h-2 rounded-xs bg-white"></span>
              </div>
            </div>
            <div className="flex items-baseline gap-1.5 tracking-wide">
              <span className="font-extrabold text-[17px] text-white tracking-wider">STACKLY</span>
              <span className="font-medium text-[15px] text-blue-200/90">OneERP</span>
            </div>
          </div>

          <button
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden p-1.5 text-slate-400 hover:text-white rounded-md hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation List */}
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1.5 custom-sidebar-scroll">
          {/* Home Nav Item */}
          <button
            onClick={() => {
              setActiveMenu('Home');
              setActiveSubmenu(null);
              if (window.innerWidth < 1024) setIsMobileOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-[13.5px] font-medium transition-colors ${
              activeMenu === 'Home'
                ? 'bg-[#19284d] text-white shadow-xs'
                : 'text-slate-300 hover:text-white hover:bg-[#162344]'
            }`}
          >
            <Home className="w-4 h-4 text-slate-400" />
            <span>Home</span>
          </button>

          {/* FICO Main Group Button */}
          <div className="pt-1">
            <button
              onClick={() => {
                setActiveMenu('FICO');
                setFicoExpanded(!ficoExpanded);
              }}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-[13.5px] font-medium bg-[#1e4fcb] hover:bg-[#1b46b6] text-white shadow-md shadow-blue-900/30 transition-all"
            >
              <div className="flex items-center gap-3">
                <LayoutGrid className="w-4 h-4 text-blue-200" />
                <span className="font-semibold tracking-wide">FICO</span>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-blue-200 transition-transform duration-200 ${
                  ficoExpanded ? 'rotate-0' : '-rotate-90'
                }`}
              />
            </button>

            {/* FICO Submenu Items */}
            {ficoExpanded && (
              <div className="mt-1 space-y-0.5 pl-2 pr-1">
                {subMenuItems.map((item) => {
                  const Icon = item.icon;
                  const isSelected = activeSubmenu === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveMenu('FICO');
                        setActiveSubmenu(item.id);
                        if (onOpenModule) onOpenModule(item.id);
                        if (window.innerWidth < 1024) setIsMobileOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-normal transition-all text-left ${
                        isSelected
                          ? 'bg-[#1c2c54] text-white font-medium shadow-xs'
                          : 'text-[#9cb1d1] hover:text-white hover:bg-[#162344]'
                      }`}
                    >
                      <Icon className={`w-4 h-4 shrink-0 ${isSelected ? 'text-blue-400' : 'text-[#7e95bb]'}`} />
                      <span className="truncate">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Footer Info */}
        <div className="p-3 border-t border-[#1b2b52] text-[11px] text-[#7187aa] flex items-center justify-between">
          <span>FICO Edition v2.5</span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Online
          </span>
        </div>
      </aside>
    </>
  );
}
