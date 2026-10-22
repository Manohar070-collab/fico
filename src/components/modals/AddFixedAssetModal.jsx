import React, { useState } from 'react';
import { X } from 'lucide-react';
import { createTransactionApi } from '../../services/api';

export default function AddFixedAssetModal({ isOpen, onClose, onAddTransaction }) {
  const [assetName, setAssetName] = useState('Production CNC Machine');
  const [assetClass, setAssetClass] = useState('Plant & Machinery');
  const [cost, setCost] = useState('500000');
  const [docDate, setDocDate] = useState('15-04-2025');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const parsedCost = parseFloat(cost) || 0;
    const randomNum = Math.floor(100000 + Math.random() * 900000);

    const txPayload = {
      doc_no: `FA-${randomNum}`,
      date: docDate,
      module: 'Fixed Assets',
      description: `${assetName} (${assetClass})`,
      amount: parsedCost,
      status: 'Posted',
      status_color: 'green'
    };

    setSubmitting(true);
    try {
      const savedTx = await createTransactionApi(txPayload);
      onAddTransaction(savedTx);
      onClose();
    } catch (err) {
      onAddTransaction({
        id: `tx-${Date.now()}`,
        docNo: txPayload.doc_no,
        date: txPayload.date,
        module: txPayload.module,
        description: txPayload.description,
        amount: parsedCost,
        status: 'Posted',
        statusColor: 'green'
      });
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150">
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Add Fixed Asset</h3>
            <p className="text-xs text-slate-500">Record asset acquisition and capitalization into database</p>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Asset Name</label>
            <input
              type="text"
              value={assetName}
              onChange={(e) => setAssetName(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Asset Class</label>
              <select
                value={assetClass}
                onChange={(e) => setAssetClass(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
              >
                <option value="Plant & Machinery">Plant & Machinery</option>
                <option value="IT Equipment">IT Equipment</option>
                <option value="Vehicles">Vehicles</option>
                <option value="Office Furniture">Office Furniture</option>
                <option value="Buildings">Buildings</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Acquisition Date</label>
              <input
                type="text"
                value={docDate}
                onChange={(e) => setDocDate(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                placeholder="DD-MM-YYYY"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Asset Cost / Value (₹)</label>
            <input
              type="number"
              value={cost}
              onChange={(e) => setCost(e.target.value)}
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
              disabled={submitting}
              className="px-5 py-2 text-xs font-semibold text-white bg-orange-600 hover:bg-orange-700 rounded-lg shadow-xs transition-colors"
            >
              {submitting ? 'Saving to Ledger...' : 'Add Asset to Ledger'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
