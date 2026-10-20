import { Sparkles, Check, X } from 'lucide-react';

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
          <Sparkles className="w-5 h-5" />
          <span>PDF Studio Pro</span>
        </div>

        <h3 className="text-xl font-bold text-slate-900 mb-2">
          Limit Reached
        </h3>

        <p className="text-slate-600 text-sm mb-6">
          {message || 'Upgrade to Pro to remove all processing limits and unlock premium features.'}
        </p>

        <div className="space-y-3 mb-6 bg-slate-50 p-4 rounded-xl">
          <div className="flex items-center gap-2.5 text-sm text-slate-700">
            <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
            <span>Merge unlimited PDF files at once</span>
          </div>
          <div className="flex items-center gap-2.5 text-sm text-slate-700">
            <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
            <span>Process files up to 100MB each</span>
          </div>
          <div className="flex items-center gap-2.5 text-sm text-slate-700">
            <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
            <span>Faster client-side rendering</span>
          </div>
        </div>

        <button
          onClick={() => alert('Stripe Checkout will be connected in Stage 4!')}
          className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl shadow-lg shadow-indigo-200 transition"
        >
          Get Pro Access – $4.99/mo
        </button>
      </div>
    </div>
  );
}