import React, { useState } from 'react';
import { X, User, Mail, Shield, Building2, Key, CheckCircle, Save } from 'lucide-react';

export default function UserProfileModal({ isOpen, onClose, user, onUpdateUser }) {
  const [fullName, setFullName] = useState(user?.name || 'John Doe');
  const [email, setEmail] = useState(user?.email || 'john.doe@stackly.erp');
  const [role, setRole] = useState(user?.role || 'FICO User');
  const [company, setCompany] = useState('Stackly Technologies Pvt Ltd (1000)');
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    if (onUpdateUser) {
      onUpdateUser({ name: fullName, email, role, company });
    }
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600/10 text-blue-600 flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Profile & Account</h3>
              <p className="text-xs text-slate-500">Manage user credentials and accounting access</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Profile Card Summary */}
        <div className="p-6 space-y-5">
          <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-slate-900 to-[#101c38] rounded-xl text-white shadow-sm">
            <div className="w-14 h-14 rounded-full bg-blue-600 text-white font-bold text-lg flex items-center justify-center ring-4 ring-white/10 shrink-0">
              {fullName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'JD'}
            </div>
            <div className="min-w-0">
              <h4 className="text-base font-bold truncate">{fullName}</h4>
              <p className="text-xs text-blue-200/90 font-medium">{role}</p>
              <div className="flex items-center gap-2 mt-1.5 text-[11px] text-slate-300">
                <span className="flex items-center gap-1">
                  <Building2 className="w-3 h-3 text-blue-400" /> {company.split(' ')[0]}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 text-emerald-400">
                  <Shield className="w-3 h-3" /> Full Access
                </span>
              </div>
            </div>
          </div>

          {/* Edit Form */}
          <form onSubmit={handleSave} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Assigned Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
                >
                  <option value="FICO User">FICO User</option>
                  <option value="FICO Administrator">FICO Administrator</option>
                  <option value="Chief Financial Officer (CFO)">Chief Financial Officer (CFO)</option>
                  <option value="Auditor (Read-Only)">Auditor (Read-Only)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Active Entity</label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-slate-50 text-slate-600"
                  readOnly
                />
              </div>
            </div>

            {/* Permission badges */}
            <div className="pt-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Module Permissions</label>
              <div className="flex flex-wrap gap-1.5">
                {['General Ledger', 'Accounts Payable', 'Accounts Receivable', 'Fixed Assets', 'Budgeting', 'Financial Reports'].map((perm) => (
                  <span key={perm} className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
                    ✓ {perm}
                  </span>
                ))}
              </div>
            </div>

            {savedSuccess && (
              <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-700 text-xs flex items-center gap-1.5 animate-in fade-in">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>Profile updated successfully!</span>
              </div>
            )}

            {/* Actions */}
            <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs"
              >
                <Save className="w-3.5 h-3.5" /> Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

