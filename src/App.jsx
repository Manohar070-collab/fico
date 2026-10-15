import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import KpiCards from './components/KpiCards';
import RecentTransactionsTable from './components/RecentTransactionsTable';
import ModulesGrid from './components/ModulesGrid';
import QuickActions from './components/QuickActions';
import FinancialSummary from './components/FinancialSummary';

import CreateJournalEntryModal from './components/modals/CreateJournalEntryModal';
import CreateInvoiceModal from './components/modals/CreateInvoiceModal';
import AddFixedAssetModal from './components/modals/AddFixedAssetModal';
import CreateBudgetModal from './components/modals/CreateBudgetModal';
import GenerateReportModal from './components/modals/GenerateReportModal';
import ViewAllTransactionsModal from './components/modals/ViewAllTransactionsModal';
import ModuleDetailModal from './components/modals/ModuleDetailModal';
import CompanySetupModal from './components/modals/CompanySetupModal';

import { INITIAL_TRANSACTIONS } from './data/initialData';
import { fetchCompanies } from './services/api';

export default function App() {
  const [activeMenu, setActiveMenu] = useState('FICO');
  const [activeSubmenu, setActiveSubmenu] = useState(null);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [companiesCount, setCompaniesCount] = useState(2);

  // Transaction list state
  const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS);

  // Modals state
  const [modalType, setModalType] = useState(null); // 'company-setup', 'create-je', 'create-ap', 'create-ar', 'add-asset', 'create-budget', 'generate-report', 'view-all-tx', 'module-detail'
  const [selectedModuleForModal, setSelectedModuleForModal] = useState(null);

  // Sync companies count from backend on load
  useEffect(() => {
    fetchCompanies().then((data) => {
      if (data && Array.isArray(data)) {
        setCompaniesCount(data.length);
      }
    });
  }, []);

  // Add a newly created transaction
  const handleAddTransaction = (newTx) => {
    setTransactions([newTx, ...transactions]);
  };

  // Filtered transactions based on search term
  const displayedTransactions = transactions.filter((tx) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      tx.docNo.toLowerCase().includes(term) ||
      tx.description.toLowerCase().includes(term) ||
      tx.module.toLowerCase().includes(term) ||
      tx.status.toLowerCase().includes(term)
    );
  });

  const handleQuickAction = (actionId) => {
    setModalType(actionId);
  };

  const handleOpenModule = (moduleName) => {
    if (moduleName === 'Company' || moduleName === 'Companies') {
      setModalType('company-setup');
    } else {
      setSelectedModuleForModal(moduleName);
      setModalType('module-detail');
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f7fc] text-[#1e293b] flex flex-row font-sans antialiased">
      {/* Left Sidebar */}
      <Sidebar
        activeMenu={activeMenu}
        setActiveMenu={setActiveMenu}
        activeSubmenu={activeSubmenu}
        setActiveSubmenu={setActiveSubmenu}
        onOpenModule={handleOpenModule}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navigation */}
        <Navbar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onOpenMobileSidebar={() => setIsMobileOpen(true)}
        />

        {/* Dashboard Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-7 max-w-[1600px] w-full mx-auto">
          {/* Header Section */}
          <div className="mb-6">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              FICO - Financial Accounting
            </h1>
            <p className="text-[13px] sm:text-[13.5px] text-slate-500 mt-0.5">
              Manage your company's financial transactions and reports
            </p>
          </div>

          {/* KPI Metric Cards (4 Columns) */}
          <KpiCards onCardClick={handleOpenModule} companiesCount={companiesCount} />

          {/* Main 2-Column Split: Content Area + Right Aside */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left / Center Major Section: Transactions & Modules (approx 72%) */}
            <div className="lg:col-span-8 xl:col-span-9 space-y-6">
              {/* Recent Transactions Table */}
              <RecentTransactionsTable
                transactions={displayedTransactions}
                onViewAll={() => setModalType('view-all-tx')}
                onSelectTransaction={(tx) => {
                  setSelectedModuleForModal(tx.module);
                  setModalType('module-detail');
                }}
              />

              {/* FICO Modules Grid */}
              <ModulesGrid
                onSelectModule={handleOpenModule}
                onViewAllModules={() => handleOpenModule('Chart of Accounts')}
              />
            </div>

            {/* Right Aside: Quick Actions & Financial Summary (approx 28%) */}
            <div className="lg:col-span-4 xl:col-span-3 space-y-6">
              <QuickActions onActionClick={handleQuickAction} />
              <FinancialSummary />
            </div>
          </div>
        </main>
      </div>

      {/* Interactive Modals */}
      <CompanySetupModal
        isOpen={modalType === 'company-setup'}
        onClose={() => setModalType(null)}
        onCompaniesUpdated={(count) => setCompaniesCount(count)}
      />

      <CreateJournalEntryModal
        isOpen={modalType === 'create-je'}
        onClose={() => setModalType(null)}
        onAddTransaction={handleAddTransaction}
      />

      <CreateInvoiceModal
        isOpen={modalType === 'create-ap'}
        type="AP"
        onClose={() => setModalType(null)}
        onAddTransaction={handleAddTransaction}
      />

      <CreateInvoiceModal
        isOpen={modalType === 'create-ar'}
        type="AR"
        onClose={() => setModalType(null)}
        onAddTransaction={handleAddTransaction}
      />

      <AddFixedAssetModal
        isOpen={modalType === 'add-asset'}
        onClose={() => setModalType(null)}
        onAddTransaction={handleAddTransaction}
      />

      <CreateBudgetModal
        isOpen={modalType === 'create-budget'}
        onClose={() => setModalType(null)}
        onAddTransaction={handleAddTransaction}
      />

      <GenerateReportModal
        isOpen={modalType === 'generate-report'}
        onClose={() => setModalType(null)}
      />

      <ViewAllTransactionsModal
        isOpen={modalType === 'view-all-tx'}
        onClose={() => setModalType(null)}
        transactions={transactions}
        onSelectTransaction={(tx) => {
          setSelectedModuleForModal(tx.module);
          setModalType('module-detail');
        }}
        onOpenCreate={() => setModalType('create-je')}
      />

      <ModuleDetailModal
        isOpen={modalType === 'module-detail'}
        moduleName={selectedModuleForModal}
        onClose={() => {
          setModalType(null);
          setSelectedModuleForModal(null);
        }}
        onQuickAction={handleQuickAction}
      />
    </div>
  );
}
