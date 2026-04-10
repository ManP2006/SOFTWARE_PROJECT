import React, { useRef, useState, useEffect, useMemo } from 'react';

/**
 * PixelPerfectPreview Component
 * 
 * A high-fidelity, auto-scaling payslip viewer designed for enterprise financial reports.
 * Enforces a strict 2px padding (4px total buffer) and ZERO cropping or scrolling.
 */
const PixelPerfectPreview = ({ employee, period = "April 2026" }) => {
  const containerRef = useRef(null);
  const [scale, setScale] = useState(1);

  // Fixed A4 Dimensions (Standard 96 DPI approximation)
  const DOC_W = 794;
  const DOC_H = 1123;

  // Scaling Logic: Calculate the safe fit while maintaining aspect ratio
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const { clientWidth, clientHeight } = containerRef.current;
        
        // Strict 2px per-side padding (4px total)
        const safeW = clientWidth - 4;
        const safeH = clientHeight - 4;

        // Ratio-based scaling: Take the MIN of width/height ratios to ensure 100% visibility
        const scaleW = safeW / DOC_W;
        const scaleH = safeH / DOC_H;
        
        setScale(Math.min(scaleW, scaleH));
      }
    };

    // Initialize scaling
    handleResize();

    // Re-scale instantly on window or container resize
    const observer = new ResizeObserver(handleResize);
    if (containerRef.current) observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, []);

  // Formatter for currency
  const fmt = (val) => `₹ ${new Intl.NumberFormat('en-IN').format(val || 0)}`;

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-full overflow-hidden p-[2px] bg-slate-400 flex items-center justify-center grayscale-[0.2] transition-colors"
    >
      {/* Scaling Layer: Origin-Top keeps content vertically stable during scale */}
      <div 
        style={{ 
          transform: `scale(${scale})`, 
          transformOrigin: 'top center',
          width: DOC_W,
          height: DOC_H,
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
        }}
        className="bg-white relative flex flex-col overflow-hidden select-none"
      >
        
        {/* --- 1. ENTERPRISE HEADER (Deep Blue) --- */}
        <header className="bg-sky-800 p-10 flex justify-between items-start text-white relative z-10">
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tighter">ppslimited</h1>
            <div className="mt-1 text-sm font-medium opacity-90 leading-tight">
              <p>101 Tech Hub, HITEC City</p>
              <p>Hyderabad, 500081</p>
            </div>
          </div>
          <div className="w-14 h-14 bg-white/20 rounded-xl border-2 border-white/30 flex items-center justify-center backdrop-blur-sm">
            <span className="text-2xl font-black text-white italic">P</span>
          </div>
        </header>

        {/* --- 2. DOCUMENT TITLE --- */}
        <div className="mt-12 text-center relative z-10 px-20">
          <h2 className="text-3xl font-black uppercase tracking-[0.2em] text-slate-800 inline-block pb-2 border-b-4 border-slate-800">
            Employee Pay Slip
          </h2>
        </div>

        {/* --- 3. EMPLOYEE DETAILS --- */}
        <div className="mt-16 px-20 grid grid-cols-2 gap-x-20 text-lg relative z-10 font-medium">
          <div className="space-y-4">
            <DetailRow label="Period" value={`${period} | FY 2026-27`} />
            <DetailRow label="Employee Name" value={employee?.name || "Ishaan Gupta"} />
            <DetailRow label="Position" value={employee?.role || "Backend Developer"} />
          </div>
          <div className="space-y-4">
            <DetailRow label="Employee ID" value={employee?.id || "PPS001"} />
            <DetailRow label="Department" value={employee?.dept || "Engineering"} />
          </div>
        </div>

        {/* --- 4. FINANCIAL TABLES --- */}
        <div className="mt-16 px-16 flex gap-10 relative z-10 flex-1">
          {/* Earnings Table */}
          <div className="flex-1">
            <table className="w-full border-collapse border border-slate-200">
              <thead className="bg-blue-50 border-b border-slate-200">
                <tr>
                  <th className="px-5 py-3 text-left text-sm font-bold uppercase text-blue-900 tracking-wider">Earning</th>
                  <th className="px-5 py-3 text-right text-sm font-bold uppercase text-blue-900 tracking-wider">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-[15px]">
                <TableRow label="Basic Salary" value={29000} />
                <TableRow label="House Rent Allowance" value={11600} />
                <TableRow label="Education Allowance" value={2500} />
                <TableRow label="L.T.A" value={5000} />
                <TableRow label="Personal Allowance" value={5800} />
                <TableRow label="Entertainment Reimbursement" value={null} />
                <TableRow label="Conveyance" value={null} />
                <tr className="bg-slate-50 font-bold">
                  <td className="px-5 py-3 uppercase text-xs">Gross Income Total</td>
                  <td className="px-5 py-3 text-right">{fmt(53900)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Deductions & Net Salary Column */}
          <div className="flex-1 flex flex-col">
            <table className="w-full border-collapse border border-slate-200 mb-8">
              <thead className="bg-blue-50 border-b border-slate-200">
                <tr>
                  <th className="px-5 py-3 text-left text-sm font-bold uppercase text-blue-900 tracking-wider">Deductions</th>
                  <th className="px-5 py-3 text-right text-sm font-bold uppercase text-blue-900 tracking-wider">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-[15px]">
                <TableRow label="PF" value={3480} />
                <TableRow label="ESI" value={0} />
                <TableRow label="Professional Tax" value={200} />
                <TableRow label="Loans & Advances" value={null} />
                <TableRow label="Perquisites" value={null} />
                <tr className="bg-slate-50 font-bold border-t border-slate-200">
                  <td className="px-5 py-3">Total Deductions</td>
                  <td className="px-5 py-3 text-right">{fmt(3680)}</td>
                </tr>
              </tbody>
            </table>

            {/* HIGH-IMPACT NET SALARY BOX */}
            <div className="mt-4 flex rounded-xl border-4 border-blue-100 overflow-hidden shadow-sm">
                <div className="w-2/3 bg-blue-50 p-6 flex items-center justify-start font-black text-blue-800 uppercase tracking-widest text-lg">
                    Net Salary
                </div>
                <div className="w-1/3 bg-white p-6 border-l-4 border-blue-100 flex flex-col items-end justify-center">
                    <span className="text-3xl font-black text-slate-800 leading-tight">{fmt(50220)}</span>
                </div>
            </div>
          </div>
        </div>

        {/* --- 5. WATERMARK LAYER (Centered behind tables) --- */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-[0.03] text-[180px] font-black tracking-tighter whitespace-nowrap z-0">
          PPS LIMITED
        </div>

        {/* --- 6. DOCUMENT FOOTER DETAILS --- */}
        <div className="px-20 mb-20 text-sm grid grid-cols-12 gap-y-2 relative z-10">
          <div className="col-span-3 text-slate-400 font-semibold uppercase text-[10px] tracking-widest">Payment Method</div>
          <div className="col-span-9 text-slate-700 font-medium">: Arrowai Bank - Ishaan Gupta <br/> No. 123 456 7890</div>
          
          <div className="col-span-3 text-slate-400 font-semibold uppercase text-[10px] tracking-widest mt-2">Payment Date</div>
          <div className="col-span-9 text-slate-700 font-bold mt-2">: 01 04 2026</div>
        </div>

        {/* --- 7. BOTTOM BRANDING & NOTICES --- */}
        <footer className="mt-auto px-16 pb-12 relative z-10 flex flex-col items-center">
            <div className="w-full h-[1px] bg-slate-100 mb-6"></div>
            <p className="text-xs italic text-slate-400 tracking-wide">This is a computer-generated document. No signature is required.</p>
            <div className="mt-6 flex justify-between w-full text-[10px] uppercase font-extrabold tracking-widest text-slate-300">
                <span>Prime Payroll Solutions</span>
                <span>Confidential Document</span>
                <span>XYZ-001</span>
            </div>
            
            {/* Blue Brand Shape Accent */}
            <div className="absolute bottom-0 right-0 w-72 h-44 bg-sky-400/30 -mr-20 -mb-28 rotate-45 pointer-events-none"></div>
        </footer>

      </div>
    </div>
  );
};

// Reusable Detail Row
const DetailRow = ({ label, value }) => (
  <div className="flex items-start">
    <span className="w-40 text-slate-500 font-bold">{label}</span>
    <span className="text-slate-800">: <span className="ml-2">{value}</span></span>
  </div>
);

// Reusable Table Row
const TableRow = ({ label, value }) => (
  <tr className="hover:bg-slate-50 transition-colors">
    <td className="px-5 py-3 text-slate-700">{label}</td>
    <td className="px-5 py-3 text-right font-mono text-slate-900">{value !== null ? `₹ ${value.toLocaleString()}` : ""}</td>
  </tr>
);

export default PixelPerfectPreview;
