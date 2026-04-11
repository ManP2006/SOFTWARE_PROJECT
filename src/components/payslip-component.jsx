import React from 'react';

/**
 * PayslipPreview Component
 * 
 * Implements a strict fixed-frame viewer with EXACT 2px padding.
 * Features:
 * - Fixed aspect ratio (A4 document style)
 * - Proportional scaling via transform: scale()
 * - Tailwind CSS for premium styling
 */
const PayslipPreview = ({ src }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md">
      {/* 
          The Modal Window 
          Provides the standard 80% viewport container 
      */}
      <div className="flex h-[92vh] w-[85vw] max-w-[1400px] flex-col overflow-hidden rounded-2xl bg-slate-50 shadow-2xl transition-all">
        
        {/* Header Section */}
        <div className="flex shrink-0 items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
          <div>
            <h3 className="text-lg font-bold text-slate-800">Professional Payslip Preview</h3>
            <p className="text-xs text-slate-500">Verified System Document</p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors">
              <PrintIcon />
              Print / Download
            </button>
            <button className="text-slate-400 hover:text-slate-600 transition-colors">
              <CloseIcon />
            </button>
          </div>
        </div>

        {/* 
            Fixed Preview Container (The "Black Box")
            - EXACT 2px padding (p-[2px])
            - Fixed aspect ratio (A4: 210/297)
            - Proportional scaling
        */}
        <div className="flex flex-1 items-center justify-center p-6 overflow-auto bg-slate-100">
          <div className="relative aspect-[210/297] h-full overflow-hidden rounded-md bg-slate-800 p-[2px] shadow-lg ring-1 ring-black/5">
            {/* 
                Inner Fit Content 
                Everything inside this respects the 2px boundary 
            */}
            <div className="relative h-full w-full overflow-hidden bg-white">
              <iframe
                src={src}
                className="h-full w-full border-none"
                title="Document Preview"
              />
              
              {/* Overlay for scaling protection if needed */}
              <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-black/5" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const PrintIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="6 9 6 2 18 2 18 9" />
    <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
    <rect x="6" y="14" width="12" height="8" />
  </svg>
);

const CloseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

export default PayslipPreview;
