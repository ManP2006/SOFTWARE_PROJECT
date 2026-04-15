import React from 'react';

// --- Utility: Currency Formatter ---
export const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    }).format(val || 0);
};

export default function PayslipPreview({ data }) {
    if (!data) return null;

    // Auto Calculations
    const grossIncome = data.earnings.reduce((sum, item) => sum + item.amount, 0);
    const totalDeductions = data.deductions.reduce((sum, item) => sum + item.amount, 0);
    const netSalary = grossIncome - totalDeductions;

    return (
        <div id="payslip-printable-area" className="w-full max-w-[210mm] mx-auto bg-white shadow-sm ring-1 ring-slate-200 p-10 md:p-16 my-8 print:my-0 print:shadow-none print:p-8">
            
            {/* Corporate Header */}
            <div className="border-t-[6px] border-blue-600 pt-8 flex justify-between items-start mb-10">
                <div>
                    <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter mb-1">PPS LIMITED</h2>
                    <p className="text-xs text-slate-500 max-w-[200px] leading-relaxed">
                        101 Tech Hub, HITEC City, Hyderabad, 500081 Tel: +91 40 1234 5678
                    </p>
                </div>
                <div className="text-right">
                    <div className="inline-block px-3 py-1 bg-blue-50 text-blue-700 text-[10px] font-bold uppercase tracking-widest rounded mb-2">Original Copy</div>
                    <p className="text-xs text-slate-400 capitalize">Generated on {new Date().toLocaleDateString('en-IN')}</p>
                </div>
            </div>

            <h1 className="text-center text-xl font-bold text-slate-800 underline underline-offset-8 decoration-blue-200 mb-12 uppercase tracking-widest">Employee Pay Slip</h1>

            {/* Employee Details - 2 Column Layout */}
            <div className="grid grid-cols-2 gap-x-12 gap-y-6 mb-12">
                <div className="space-y-4">
                    <div className="flex justify-between items-center border-b border-slate-50 pb-1">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Employee Name</span>
                        <span className="text-sm font-bold text-slate-800">{data.name}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-slate-50 pb-1">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Employee Code</span>
                        <span className="text-sm font-bold text-slate-800 font-mono">{data.id}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-slate-50 pb-1">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Department</span>
                        <span className="text-sm text-slate-700">{data.department}</span>
                    </div>
                </div>
                <div className="space-y-4">
                    <div className="flex justify-between items-center border-b border-slate-50 pb-1">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Designation</span>
                        <span className="text-sm text-slate-700">{data.position}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-slate-50 pb-1">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Pay Period</span>
                        <span className="text-sm font-bold text-blue-600">{data.period}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-slate-50 pb-1">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Bank Details</span>
                        <span className="text-sm text-slate-700">{data.payment.method} ({data.payment.account})</span>
                    </div>
                </div>
            </div>

            {/* Earnings & Deductions Table */}
            <div className="grid grid-cols-2 gap-0 border border-slate-200 rounded-xl overflow-hidden mb-10">
                <div className="border-r border-slate-200">
                    <div className="bg-slate-50 px-5 py-3 border-b border-slate-200">
                        <span className="text-[11px] font-bold text-slate-600 uppercase tracking-widest">Earnings Description</span>
                    </div>
                    <div className="divide-y divide-slate-100 min-h-[220px]">
                        {data.earnings.map((e, idx) => (
                            <div key={idx} className="flex justify-between px-5 py-3">
                                <span className="text-sm text-slate-600">{e.label}</span>
                                <span className="text-sm font-semibold text-slate-900">{formatCurrency(e.amount)}</span>
                            </div>
                        ))}
                    </div>
                    <div className="bg-blue-50/50 px-5 py-4 border-t border-slate-200 flex justify-between items-center">
                        <span className="text-xs font-bold text-blue-900 uppercase">Gross Income</span>
                        <span className="text-base font-black text-blue-900">{formatCurrency(grossIncome)}</span>
                    </div>
                </div>

                <div>
                    <div className="bg-slate-50 px-5 py-3 border-b border-slate-200">
                        <span className="text-[11px] font-bold text-slate-600 uppercase tracking-widest">Deductions</span>
                    </div>
                    <div className="divide-y divide-slate-100 min-h-[220px]">
                        {data.deductions.map((d, idx) => (
                            <div key={idx} className="flex justify-between px-5 py-3">
                                <span className="text-sm text-slate-600">{d.label}</span>
                                <span className="text-sm font-semibold text-red-600">-{formatCurrency(d.amount)}</span>
                            </div>
                        ))}
                    </div>
                    <div className="bg-red-50/50 px-5 py-4 border-t border-slate-200 flex justify-between items-center">
                        <span className="text-xs font-bold text-red-900 uppercase">Total Deductions</span>
                        <span className="text-base font-black text-red-900">{formatCurrency(totalDeductions)}</span>
                    </div>
                </div>
            </div>

            {/* Net Pay Highlight */}
            <div className="flex flex-col md:flex-row justify-between items-center p-8 bg-slate-900 rounded-2xl shadow-xl shadow-slate-200 mb-12 ring-4 ring-offset-4 ring-slate-900 relative overflow-hidden">
                <div className="relative z-10 text-white mb-4 md:mb-0">
                    <p className="text-[10px] uppercase font-black tracking-[0.2em] text-white/50 mb-1">Net Monthly Salary</p>
                    <p className="text-sm italic text-white/90">Amount in Words: {data.period} Statement</p>
                </div>
                <div className="relative z-10 text-right">
                    <span className="text-5xl font-black text-white px-2">{formatCurrency(netSalary)}</span>
                </div>
                <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
            </div>

            {/* Footer Signatures */}
            <div className="flex justify-between items-end mt-16 pt-10 border-t border-slate-100">
                <div className="text-center w-40">
                    <div className="h-10 border-b border-slate-300 mb-2"></div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Employee Signature</p>
                </div>
                <div className="text-center w-40">
                    {/* Placeholder for Signature/Seal */}
                    <div className="h-12 w-auto mx-auto opacity-20 mb-[10px]" style={{ backgroundImage: "radial-gradient(circle, #000 10%, transparent 10%), radial-gradient(circle, #000 10%, transparent 10%)", backgroundSize: "10px 10px", backgroundPosition: "0 0, 5px 5px", width: "40px", borderRadius: "50%" }}></div>
                    <div className="h-10 border-b border-slate-300 mb-2"></div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Authorized Signatory</p>
                </div>
            </div>

            <p className="text-[9px] text-center text-slate-400 mt-12 italic">
                This is a computer-generated payslip and does not require a physical signature. Confidential.
            </p>
        </div>
    );
}
