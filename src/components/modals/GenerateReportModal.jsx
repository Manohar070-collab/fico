import React, { useState } from 'react';
import { X, FileText, Download, Check } from 'lucide-react';

export default function GenerateReportModal({ isOpen, onClose }) {
  const [reportType, setReportType] = useState('Balance Sheet');
  const [period, setPeriod] = useState('FY 2025-2026');
  const [format, setFormat] = useState('PDF');
  const [isExporting, setIsExporting] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleGenerate = (e) => {
    e.preventDefault();
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1200);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150">
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Generate Financial Report</h3>
            <p className="text-xs text-slate-500">Export compliance and audit reports</p>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleGenerate} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Report Type</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
            >
              <option value="Balance Sheet">Balance Sheet (Statement of Financial Position)</option>
              <option value="Profit & Loss">Profit & Loss Statement (Income Statement)</option>
              <option value="Trial Balance">General Trial Balance</option>
              <option value="Cash Flow">Cash Flow Statement</option>
              <option value="GST Report">GST GSTR-1 & 3B Summary</option>
              <option value="Asset Schedule">Fixed Asset Depreciation Schedule</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Fiscal Period</label>
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
            >
              <option value="FY 2025-2026">FY 2025-2026 (YTD)</option>
              <option value="Q1 2025">Q1 2025 (Apr - Jun)</option>
              <option value="FY 2024-2025">FY 2024-2025 (Annual Audited)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Output Format</label>
            <div className="grid grid-cols-2 gap-3">
              {['PDF Document', 'Excel Spreadsheet'].map((fmt) => (
                <button
                  type="button"
                  key={fmt}
                  onClick={() => setFormat(fmt.includes('PDF') ? 'PDF' : 'Excel')}
                  className={`px-3 py-2 rounded-lg border text-xs font-medium text-center transition-all ${
                    (format === 'PDF' && fmt.includes('PDF')) || (format === 'Excel' && fmt.includes('Excel'))
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-semibold'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {fmt}
                </button>
              ))}
            </div>
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
              disabled={isExporting || success}
              className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors"
            >
              {success ? (
                <>
                  <Check className="w-3.5 h-3.5" /> Downloaded
                </>
              ) : isExporting ? (
                'Generating...'
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" /> Export Report
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

