import React from 'react';
import PayslipPreview from './PayslipPreview';

export default function PayslipModal({ isOpen, onClose, data }) {
    if (!isOpen || !data) return null;

    const handleDownload = () => {
        const element = document.getElementById('payslip-printable-area');
        const opt = {
            margin: 10,
            filename: `payslip_${data.name.replace(' ', '_')}_${data.period.replace(' ', '_')}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };
        if (window.html2pdf) {
            window.html2pdf().from(element).set(opt).save();
        } else {
            window.print();
        }
    };

    return (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
            
            <div className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
                {/* Modal Header */}
                <div className="flex items-center justify-between px-8 py-5 border-b border-slate-100 bg-white/80 backdrop-blur-md sticky top-0 z-20">
                    <div>
                        <h3 className="text-xl font-bold text-slate-800">Payslip Preview</h3>
                        <p className="text-sm text-slate-500">{data.name} • {data.period}</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={handleDownload}
                            className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-all active:scale-95 shadow-lg shadow-blue-200"
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                            Download PDF
                        </button>
                        <button 
                            onClick={onClose}
                            className="p-2.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all"
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                        </button>
                    </div>
                </div>

                {/* Modal Body (Scrollable) */}
                <div className="flex-1 overflow-y-auto p-1 zero-scrollbar bg-slate-50/50">
                    <PayslipPreview data={data} />
                </div>
            </div>
        </div>
    );
}
