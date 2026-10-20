import React, { useState } from 'react';
import { Layers, Scissors, FileOutput, Upload, Lock } from 'lucide-react';
import UpgradeModal from './UpgradeModal';
import { checkFreemiumLimits } from '../utils/freemium';

export default function PdfStudio({ activeTab = 'merge', onTabChange }) {
  const [files, setFiles] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (!selectedFiles.length) return;

    const newFileList = [...files, ...selectedFiles];

    // Check freemium limits
    const limitCheck = checkFreemiumLimits(newFileList);

    if (!limitCheck.allowed) {
      setModalMessage(limitCheck.reason);
      setIsModalOpen(true);
      return;
    }

    setFiles(newFileList);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 w-full">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
          Fast, Free & Private PDF Tools
        </h1>
        <p className="text-slate-500 text-sm">
          100% Client-Side Processing. Files never leave your browser memory.
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex justify-center border-b border-slate-200 mb-8">
        <button
          onClick={() => onTabChange('merge')}
          className={`flex items-center gap-2 py-3 px-6 font-medium text-sm transition-all border-b-2 ${
            activeTab === 'merge'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Layers className="w-4 h-4" />
          Merge PDFs
        </button>

        <button
          onClick={() => onTabChange('extract')}
          className={`flex items-center gap-2 py-3 px-6 font-medium text-sm transition-all border-b-2 ${
            activeTab === 'extract'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileOutput className="w-4 h-4" />
          Extract Pages
        </button>

        <button
          onClick={() => onTabChange('split')}
          className={`flex items-center gap-2 py-3 px-6 font-medium text-sm transition-all border-b-2 ${
            activeTab === 'split'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Scissors className="w-4 h-4" />
          Split PDF
        </button>
      </div>

      {/* Upload Zone */}
      <div className="bg-slate-50/50 border-2 border-dashed border-slate-300 hover:border-indigo-400 rounded-2xl p-12 text-center transition-all cursor-pointer relative group">
        <input
          type="file"
          multiple
          accept=".pdf"
          onChange={handleFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <div className="flex flex-col items-center justify-center gap-3">
          <div className="p-4 bg-white rounded-full shadow-sm border border-slate-100 group-hover:scale-110 transition-transform">
            <Upload className="w-8 h-8 text-indigo-600" />
          </div>
          <div>
            <p className="text-slate-700 font-semibold text-base mb-1">
              Drag & drop PDF files here, or click to browse
            </p>
            <p className="text-slate-400 text-xs">
              Free tier limit: Max 3 files • Up to 10MB per file
            </p>
          </div>
        </div>
      </div>

      {/* Selected Files Counter */}
      {files.length > 0 && (
        <div className="mt-6 bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <span className="text-sm font-medium text-slate-700">
            Selected Files: <strong className="text-indigo-600">{files.length} / 3</strong>
          </span>
          <button
            onClick={() => setFiles([])}
            className="text-xs text-rose-500 hover:underline"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Paywall / Upgrade Modal */}
      <UpgradeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        message={modalMessage}
      />
    </div>
  );
}