import { Sparkles, Check, X, Zap } from 'lucide-react';

export default function UpgradeModal({ isOpen, onClose, message }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative border border-slate-100 animate-in fade-in zoom-in duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-indigo-600 font-semibold mb-2">
          <Zap className="w-5 h-5 fill-indigo-600 text-indigo-600" />
          <span>One-Time Processing Pass</span>
        </div>

        <h3 className="text-xl font-bold text-slate-900 mb-2">
          Unlock Large File Processing
        </h3>
        
        <p className="text-slate-600 text-sm mb-6">
          {message || 'Unlock single-job execution for your extra-large PDFs or high batch counts with instant 1-click checkout.'}
        </p>

        <div className="space-y-3 mb-6 bg-slate-50 p-4 rounded-xl">
          <div className="flex items-center gap-2.5 text-sm text-slate-700">
            <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
            <span>Process this file batch instantly</span>
          </div>
          <div className="flex items-center gap-2.5 text-sm text-slate-700">
            <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
            <span>Up to 100MB per file & unlimited files</span>
          </div>
          <div className="flex items-center gap-2.5 text-sm text-slate-700">
            <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
            <span><strong>No subscription:</strong> Pay once ($0.99) & you're done</span>
          </div>
        </div>

        <button
          onClick={() => alert('Stripe 1-Click Express Checkout (Apple Pay / Google Pay) coming next in Stage 4!')}
          className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl shadow-lg shadow-indigo-200 transition flex items-center justify-center gap-2"
        >
          <span>Process Now – $0.99</span>
        </button>

        <p className="text-center text-xs text-slate-400 mt-3">
          1-Click payment via Apple Pay & Google Pay
        </p>
      </div>
    </div>
  );
}