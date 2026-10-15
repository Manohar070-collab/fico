import React, { useState } from 'react';
import { X } from 'lucide-react';

export default function CreateInvoiceModal({ isOpen, onClose, type = 'AP', onAddTransaction }) {
  const isAP = type === 'AP';
  const [partyName, setPartyName] = useState(isAP ? 'ABC Tech Supplies Pvt Ltd' : 'Global Software Solutions');
  const [description, setDescription] = useState(isAP ? 'Supplier Invoice - Hardware' : 'Customer Invoice - Cloud Consulting');
  const [amount, setAmount] = useState('50000');
  const [docDate, setDocDate] = useState('15-04-2025');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount) || 0;
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    const prefix = isAP ? 'AP' : 'AR';
    const modName = isAP ? 'Accounts Payable' : 'Accounts Receivable';

    const newTx = {
      id: `tx-${Date.now()}`,
      date: docDate,
      docNo: `${prefix}-${randomNum}`,
      module: modName,
      description: `${isAP ? 'Supplier Invoice' : 'Customer Invoice'} - ${partyName}`,
      amount: parsedAmount,
      status: 'Approved',
      statusColor: 'blue'
    };

    onAddTransaction(newTx);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150">
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              {isAP ? 'Create Accounts Payable (AP) Invoice' : 'Create Accounts Receivable (AR) Invoice'}
            </h3>
            <p className="text-xs text-slate-500">
              {isAP ? 'Record vendor bill and payment liability' : 'Issue customer billing invoice and receivable'}
            </p>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {isAP ? 'Vendor / Supplier Name' : 'Customer Name'}
            </label>
            <input
              type="text"
              value={partyName}
              onChange={(e) => setPartyName(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Date</label>
              <input
                type="text"
                value={docDate}
                onChange={(e) => setDocDate(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                placeholder="DD-MM-YYYY"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Total Amount (₹)</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              required
            />
          </div>

          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-5 py-2 text-xs font-semibold text-white rounded-lg shadow-xs transition-colors ${
                isAP ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-purple-600 hover:bg-purple-700'
              }`}
            >
              {isAP ? 'Post AP Invoice' : 'Generate AR Invoice'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

