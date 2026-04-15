import React, { useState } from 'react';
import { dummyPayslips } from '../../data/payslips';
import PayslipModal from './PayslipModal';
import { formatCurrency } from './PayslipPreview';

export default function PayslipTable() {
    const [selectedPayslip, setSelectedPayslip] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleView = (payslip) => {
        setSelectedPayslip(payslip);
        setIsModalOpen(true);
    };

    return (
        <div className="w-full max-w-6xl mx-auto p-6">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-slate-800">Payslip Records</h2>
                <p className="text-slate-500 text-sm mt-1">View and download employee payslips.</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Employee</th>
                                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Department</th>
                                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Period</th>
                                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Net Pay</th>
                                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {dummyPayslips.map((payslip) => {
                                const gross = payslip.earnings.reduce((sum, e) => sum + e.amount, 0);
                                const ded = payslip.deductions.reduce((sum, d) => sum + d.amount, 0);
                                const net = gross - ded;

                                return (
                                    <tr key={payslip.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                                                    {payslip.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-slate-800">{payslip.name}</p>
                                                    <p className="text-xs text-slate-500 font-mono">{payslip.id}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <p className="text-sm text-slate-700">{payslip.department}</p>
                                            <p className="text-xs text-slate-400">{payslip.position}</p>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className="inline-flex px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-semibold">
                                                {payslip.period}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-right">
                                            <p className="text-sm font-bold text-slate-900">{formatCurrency(net)}</p>
                                        </td>
                                        <td className="py-4 px-6 text-center">
                                            <button 
                                                onClick={() => handleView(payslip)}
                                                className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-200 hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600 text-slate-600 text-sm font-medium rounded-lg transition-all"
                                            >
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                                                View
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            <PayslipModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                data={selectedPayslip} 
            />
        </div>
    );
}
