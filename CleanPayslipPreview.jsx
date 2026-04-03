import React, { useRef, useEffect, useState } from 'react';

/**
 * CleanPayslipPreview Component
 * 
 * Implements a high-fidelity document viewer with:
 * - NO borders (clean, natural look)
 * - 100% full visibility (no cropping, no scrollbars)
 * - Dynamic auto-scaling based on viewport size
 */
const CleanPayslipPreview = ({ isOpen, onClose, payslipContent }) => {
  const containerRef = useRef(null);
  const scalingRef = useRef(null);
  const [scale, setScale] = useState(1);

  // Constants for document dimensions (A4 approx @ 96DPI)
  const DOC_WIDTH = 794; 
  const DOC_HEIGHT = 1123;
  const PADDING = 32; // Total padding (16px per side)

  useEffect(() => {
    const handleResize = () => {
      if (!containerRef.current) return;

      const { clientWidth, clientHeight } = containerRef.current;
      
      const availableW = clientWidth - PADDING;
      const availableH = clientHeight - PADDING;

      // STRICT Scaling Logic: Ensure the entire document fits within the smaller axis
      const ratioW = availableW / DOC_WIDTH;
      const ratioH = availableH / DOC_HEIGHT;
      
      const newScale = Math.min(ratioW, ratioH);
      setScale(newScale);
    };

    if (isOpen) {
      window.addEventListener('resize', handleResize);
      // Small timeout to ensure DOM is painted and clientWidth is accurate
      const timer = setTimeout(handleResize, 50);
      return () => {
        window.removeEventListener('resize', handleResize);
        clearTimeout(timer);
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm">
      {/* 
          Modal Container (70-80vw, 80-90vh)
          - Centered
          - Overflow: hidden
      */}
      <div className="relative flex h-[90vh] w-[80vw] flex-col overflow-hidden rounded-xl bg-slate-200 shadow-2xl">
        
        {/* Clean Header */}
        <div className="flex shrink-0 items-center justify-between bg-white/80 px-6 py-4 backdrop-blur-md">
          <div>
            <h3 className="text-lg font-bold text-slate-800">Payslip Preview</h3>
            <p className="text-[10px] uppercase tracking-wider text-slate-400">Official Document Preview</p>
          </div>
          <button 
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-all"
          >
            <CloseIcon />
          </button>
        </div>

        {/* 
            Clean Preview Root
            - Minimal spacing
            - Centered content
        */}
        <div 
          ref={containerRef}
          className="relative flex-1 overflow-hidden p-4 flex items-center justify-center"
        >
          {/* 
              Inner Wrapper (Scaling Layer) 
              - Apply transform: scale() 
              - Center-aligned
          */}
          <div 
            ref={scalingRef}
            style={{ 
              transform: `scale(${scale})`,
              transformOrigin: 'center center',
              transition: 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
            className="flex items-center justify-center"
          >
            {/* The Actual Document Content (Fixed Design) */}
            <div className="relative overflow-hidden bg-white shadow-[0_20px_50px_rgba(0,0,0,0.2)] rounded-sm ring-1 ring-black/5" style={{ width: DOC_WIDTH, height: DOC_HEIGHT }}>
              {/* If using iframe: */}
              {/* <iframe src={payslipContent} className="w-full h-full border-none" title="Payslip" /> */}
              
              {/* For React Component Content: */}
              <div className="w-full h-full p-12">
                 {/* Internal Payslip UI goes here */}
                 <div className="h-24 w-full bg-slate-50 rounded mb-8 animate-pulse" />
                 <div className="space-y-4">
                    <div className="h-4 w-3/4 bg-slate-100 rounded" />
                    <div className="h-4 w-1/2 bg-slate-100 rounded" />
                    <div className="h-4 w-5/6 bg-slate-100 rounded" />
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

export default CleanPayslipPreview;
