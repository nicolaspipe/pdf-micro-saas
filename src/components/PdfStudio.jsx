import React, { useState, useRef } from 'react';
import { PDFDocument, degrees } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist';
import { 
  Upload, Trash2, Download, CheckCircle, FileText, 
  Layers, RefreshCw, RotateCw, Scissors, GripVertical 
} from 'lucide-react';

// Configure PDF.js worker via CDN
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

export default function PdfStudio() {
  const [files, setFiles] = useState([]);
  const [pages, setPages] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState('merge'); // 'merge', 'extract', 'split'
  const [draggedPageIndex, setDraggedPageIndex] = useState(null);
  const fileInputRef = useRef(null);

  const processFile = async (file) => {
    const fileId = `${file.name}-${Date.now()}`;
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const newPages = [];

    for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
      const page = await pdfDoc.getPage(pageNum);
      const viewport = page.getViewport({ scale: 0.3 });
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      await page.render({ canvasContext: context, viewport }).promise;
      const canvasUrl = canvas.toDataURL('image/png');

      newPages.push({
        id: `${fileId}-p${pageNum}-${Math.random()}`,
        fileId,
        file,
        pageNum,
        canvasUrl,
        rotation: 0, // 0, 90, 180, 270
        selected: true
      });
    }

    setFiles((prev) => [...prev, { id: fileId, file }]);
    setPages((prev) => [...prev, ...newPages]);
  };

  const handleFileDrop = (e) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files).filter(f => f.type === 'application/pdf');
    droppedFiles.forEach(processFile);
  };

  const handleFileInput = (e) => {
    const selectedFiles = Array.from(e.target.files).filter(f => f.type === 'application/pdf');
    selectedFiles.forEach(processFile);
  };

  const togglePageSelection = (pageId) => {
    setPages((prev) => prev.map((p) => (p.id === pageId ? { ...p, selected: !p.selected } : p)));
  };

  const removePage = (pageId) => {
    setPages((prev) => prev.filter((p) => p.id !== pageId));
  };

  // Rotate page right (+90 deg)
  const rotatePage = (pageId) => {
    setPages((prev) =>
      prev.map((p) => (p.id === pageId ? { ...p, rotation: (p.rotation + 90) % 360 } : p))
    );
  };

  // Drag and drop reordering handlers
  const handleDragStart = (e, index) => {
    setDraggedPageIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (draggedPageIndex === null || draggedPageIndex === index) return;

    const updatedPages = [...pages];
    const draggedItem = updatedPages[draggedPageIndex];
    updatedPages.splice(draggedPageIndex, 1);
    updatedPages.splice(index, 0, draggedItem);

    setDraggedPageIndex(index);
    setPages(updatedPages);
  };

  const handleDragEnd = () => {
    setDraggedPageIndex(null);
  };

  // Export handlers
  const handleExport = async () => {
    const selectedPages = pages.filter((p) => p.selected);
    if (selectedPages.length === 0) return alert('Select at least one page to process.');

    setIsProcessing(true);

    try {
      if (activeTab === 'split') {
        // Split: Export each selected page as an individual PDF file
        for (let i = 0; i < selectedPages.length; i++) {
          const pageItem = selectedPages[i];
          const outputPdf = await PDFDocument.create();
          const arrayBuffer = await pageItem.file.arrayBuffer();
          const sourcePdf = await PDFDocument.load(arrayBuffer);
          const [copiedPage] = await outputPdf.copyPages(sourcePdf, [pageItem.pageNum - 1]);
          
          if (pageItem.rotation > 0) {
            copiedPage.setRotation(degrees((copiedPage.getRotation().angle + pageItem.rotation) % 360));
          }
          
          outputPdf.addPage(copiedPage);
          const pdfBytes = await outputPdf.save();
          
          const blob = new Blob([pdfBytes], { type: 'application/pdf' });
          const link = document.createElement('a');
          link.href = URL.createObjectURL(blob);
          link.download = `page_${pageItem.pageNum}_${pageItem.file.name}`;
          link.click();
          URL.revokeObjectURL(link.href);
        }
      } else {
        // Merge & Extract: Build one combined PDF file
        const outputPdf = await PDFDocument.create();

        for (const pageItem of selectedPages) {
          const arrayBuffer = await pageItem.file.arrayBuffer();
          const sourcePdf = await PDFDocument.load(arrayBuffer);
          const [copiedPage] = await outputPdf.copyPages(sourcePdf, [pageItem.pageNum - 1]);
          
          if (pageItem.rotation > 0) {
            copiedPage.setRotation(degrees((copiedPage.getRotation().angle + pageItem.rotation) % 360));
          }

          outputPdf.addPage(copiedPage);
        }

        const pdfBytes = await outputPdf.save();
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = activeTab === 'merge' ? 'merged_document.pdf' : 'extracted_pages.pdf';
        link.click();
        URL.revokeObjectURL(link.href);
      }
    } catch (err) {
      console.error('Processing failed:', err);
      alert('Error building PDF file.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 font-sans">
      <header className="text-center my-8">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Fast, Free & Private PDF Tools</h1>
        <p className="text-slate-500 mt-2">100% Client-Side Processing. Files never leave your browser memory.</p>
      </header>

      {/* Mode Selection Tabs */}
      <div className="flex justify-center border-b mb-6 space-x-6">
        <button
          onClick={() => setActiveTab('merge')}
          className={`flex items-center gap-2 pb-3 px-4 font-semibold border-b-2 transition ${
            activeTab === 'merge' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
        >
          <Layers size={18} /> Merge PDFs
        </button>
        <button
          onClick={() => setActiveTab('extract')}
          className={`flex items-center gap-2 pb-3 px-4 font-semibold border-b-2 transition ${
            activeTab === 'extract' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
        >
          <FileText size={18} /> Extract Pages
        </button>
        <button
          onClick={() => setActiveTab('split')}
          className={`flex items-center gap-2 pb-3 px-4 font-semibold border-b-2 transition ${
            activeTab === 'split' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
        >
          <Scissors size={18} /> Split PDF
        </button>
      </div>

      {/* Upload Dropzone */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleFileDrop}
        onClick={() => fileInputRef.current.click()}
        className="border-2 border-dashed border-gray-300 hover:border-blue-500 rounded-2xl p-10 text-center cursor-pointer bg-slate-50 hover:bg-blue-50/50 transition mb-8 shadow-sm"
      >
        <Upload className="mx-auto text-blue-500 mb-3" size={40} />
        <p className="text-gray-800 font-semibold text-lg">Drag & drop PDF files here, or click to browse</p>
        <p className="text-xs text-gray-400 mt-1">Runs entirely in your browser using WebAssembly</p>
        <input type="file" ref={fileInputRef} onChange={handleFileInput} multiple accept="application/pdf" className="hidden" />
      </div>

      {/* Interactive Page Grid */}
      {pages.length > 0 && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="font-bold text-gray-800 text-lg">
                Selected Pages ({pages.filter((p) => p.selected).length} of {pages.length})
              </h3>
              <p className="text-xs text-gray-400">Drag pages to reorder • Hover to rotate or delete</p>
            </div>
            <button
              onClick={handleExport}
              disabled={isProcessing}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-6 rounded-xl shadow transition disabled:opacity-50"
            >
              {isProcessing ? <RefreshCw className="animate-spin" size={18} /> : <Download size={18} />}
              {activeTab === 'merge' && 'Merge Selected PDF'}
              {activeTab === 'extract' && 'Download Extracted PDF'}
              {activeTab === 'split' && 'Split into Individual PDFs'}
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {pages.map((page, index) => (
              <div
                key={page.id}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
                className={`relative group border-2 rounded-xl p-2 bg-white shadow-sm transition cursor-grab active:cursor-grabbing ${
                  page.selected ? 'border-blue-500 ring-2 ring-blue-100' : 'border-gray-200 opacity-50'
                }`}
                onClick={() => togglePageSelection(page.id)}
              >
                {/* Selection Checkbox */}
                <div className="absolute top-3 left-3 z-10">
                  <CheckCircle size={20} className={page.selected ? 'text-blue-600 fill-white' : 'text-gray-300'} />
                </div>

                {/* Drag Handle Indicator */}
                <div className="absolute top-3 left-10 z-10 text-gray-400 opacity-0 group-hover:opacity-100 transition">
                  <GripVertical size={16} />
                </div>

                {/* Action Buttons: Rotate & Delete */}
                <div className="absolute top-3 right-3 z-10 flex gap-1 opacity-0 group-hover:opacity-100 transition">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      rotatePage(page.id);
                    }}
                    title="Rotate 90°"
                    className="bg-gray-700 text-white p-1 rounded-full hover:bg-gray-900 transition"
                  >
                    <RotateCw size={13} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removePage(page.id);
                    }}
                    title="Delete page"
                    className="bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>

                {/* Thumbnail Image with Rotation transform */}
                <div className="flex items-center justify-center min-h-[160px]">
                  <img
                    src={page.canvasUrl}
                    alt={`Page ${page.pageNum}`}
                    style={{ transform: `rotate(${page.rotation}deg)` }}
                    className="w-full h-auto max-h-[160px] rounded-lg border object-contain bg-gray-50 transition-transform duration-200"
                  />
                </div>

                <div className="text-center text-xs text-gray-500 truncate mt-2">
                  P. {page.pageNum} {page.rotation > 0 && `(${page.rotation}°)`}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}