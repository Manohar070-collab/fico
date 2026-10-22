import React, { useState, useEffect, useCallback } from 'react';
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
import UserProfileModal from './components/modals/UserProfileModal';
import AuthModal from './components/modals/AuthModal';

import { INITIAL_TRANSACTIONS } from './data/initialData';
import { fetchCompanies, fetchTransactions, fetchSummaryApi, fetchSystemStatusApi } from './services/api';

export default function App() {
  const [activeMenu, setActiveMenu] = useState('FICO');
  const [activeSubmenu, setActiveSubmenu] = useState(null);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Current authenticated user state
  const [currentUser, setCurrentUser] = useState({
    name: 'John Doe',
    role: 'FICO User',
    email: 'john.doe@stackly.erp'
  });

  // Real-time Database Status
  const [dbStatus, setDbStatus] = useState({ database: 'MySQL 8.0', status: 'online', database_target: '127.0.0.1:3306/saperp' });

  // Live real-time state from Database
  const [companiesCount, setCompaniesCount] = useState(2);
  const [activeFiscalYears, setActiveFiscalYears] = useState(2);
  const [openPeriods, setOpenPeriods] = useState(5);
  const [totalAccounts, setTotalAccounts] = useState(128);
  const [liveSummary, setLiveSummary] = useState(null);

  // Transaction list state
  const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS);

  // Modals state: 'company-setup' | 'user-profile' | 'auth-login' | 'create-je' | 'create-ap' | 'create-ar' | 'add-asset' | 'create-budget' | 'generate-report' | 'view-all-tx' | 'module-detail'
  const [modalType, setModalType] = useState(null);
  const [selectedModuleForModal, setSelectedModuleForModal] = useState(null);

  // Function to load all live real-time data from database
  const loadRealtimeData = useCallback(async () => {
    try {
      const status = await fetchSystemStatusApi();
      if (status) setDbStatus(status);

      const summary = await fetchSummaryApi();
      if (summary) {
        if (summary.total_companies !== undefined) setCompaniesCount(summary.total_companies);
        if (summary.active_fiscal_years !== undefined) setActiveFiscalYears(summary.active_fiscal_years);
        if (summary.open_periods !== undefined) setOpenPeriods(summary.open_periods);
        if (summary.total_accounts !== undefined) setTotalAccounts(summary.total_accounts);
        if (summary.financial_summary) setLiveSummary(summary.financial_summary);
      }

      const txs = await fetchTransactions();
      if (txs && txs.length > 0) {
        setTransactions(txs);
      }
    } catch (e) {
      console.warn('Realtime fetch fallback', e);
    }
  }, []);

  useEffect(() => {
    loadRealtimeData();
  }, [loadRealtimeData]);

  const handleAddTransaction = (newTx) => {
    setTransactions((prev) => [newTx, ...prev.filter(t => t.docNo !== newTx.docNo)]);
    loadRealtimeData();
  };

  const displayedTransactions = transactions.filter((tx) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      (tx.docNo && tx.docNo.toLowerCase().includes(term)) ||
      (tx.description && tx.description.toLowerCase().includes(term)) ||
      (tx.module && tx.module.toLowerCase().includes(term)) ||
      (tx.status && tx.status.toLowerCase().includes(term))
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

  // Sign out handler
  const handleSignOut = () => {
    localStorage.removeItem('access_token');
    setCurrentUser({
      name: 'Signed Out',
      role: 'Guest / Not Authenticated',
      email: ''
    });
    setModalType('auth-login');
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
        {/* Top Navigation Bar with fully working buttons */}
        <Navbar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onOpenMobileSidebar={() => setIsMobileOpen(true)}
          currentUser={currentUser}
          dbStatus={dbStatus}
          onOpenProfile={() => setModalType('user-profile')}
          onOpenCompanySettings={() => setModalType('company-setup')}
          onSignOut={handleSignOut}
        />

        {/* Dashboard Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-7 max-w-[1600px] w-full mx-auto">
          {/* Header Section */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                FICO - Financial Accounting
              </h1>
              <p className="text-[13px] sm:text-[13.5px] text-slate-500 mt-0.5">
                Manage your company's financial transactions and reports with real-time database sync
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Real-Time DB Sync Active
              </span>
            </div>
          </div>

          {/* KPI Metric Cards */}
          <KpiCards
            onCardClick={handleOpenModule}
            companiesCount={companiesCount}
            activeFiscalYears={activeFiscalYears}
            openPeriods={openPeriods}
            totalAccounts={totalAccounts}
          />

          {/* Main 2-Column Split */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Center Section: Transactions & Modules */}
            <div className="lg:col-span-8 xl:col-span-9 space-y-6">
              <RecentTransactionsTable
                transactions={displayedTransactions}
                onViewAll={() => setModalType('view-all-tx')}
                onSelectTransaction={(tx) => {
                  setSelectedModuleForModal(tx.module);
                  setModalType('module-detail');
                }}
              />

              <ModulesGrid
                onSelectModule={handleOpenModule}
                onViewAllModules={() => handleOpenModule('Chart of Accounts')}
              />
            </div>

            {/* Right Aside: Quick Actions & Financial Summary */}
            <div className="lg:col-span-4 xl:col-span-3 space-y-6">
              <QuickActions onActionClick={handleQuickAction} />
              <FinancialSummary liveSummary={liveSummary} />
            </div>
          </div>
        </main>
      </div>

      {/* User Profile Modal */}
      <UserProfileModal
        isOpen={modalType === 'user-profile'}
        onClose={() => setModalType(null)}
        user={currentUser}
        onUpdateUser={(updated) => setCurrentUser(updated)}
      />

      {/* Sign In / Sign Out Auth Modal */}
      <AuthModal
        isOpen={modalType === 'auth-login'}
        onClose={() => setModalType(null)}
        onLoginSuccess={(loggedUser) => setCurrentUser(loggedUser)}
      />

      {/* Company Settings / Setup Modal */}
      <CompanySetupModal
        isOpen={modalType === 'company-setup'}
        onClose={() => setModalType(null)}
        onCompaniesUpdated={() => loadRealtimeData()}
      />

      {/* Quick Action Modals */}
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
        onDataChanged={loadRealtimeData}
      />
    </div>
  );
}
