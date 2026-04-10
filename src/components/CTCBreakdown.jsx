import React from 'react';

/**
 * CTCBreakdown Component
 * 
 * A high-fidelity financial table for employee CTC structures.
 * Features: Grouped sections, zebra striping, and clear subtotals.
 */
const CTCBreakdown = ({ isOpen, onClose, employee }) => {
  if (!isOpen || !employee) return null;

  // Calculation logic mirrors the production script.js
  const annualCTC = employee.ctc || 800000;
  const monthlyCTC = Math.round(annualCTC / 12);
  const monthlyEmployerPF = Math.min(Math.round(monthlyCTC * 0.5 * 0.12), 1800);
  const monthlyGross = monthlyCTC - monthlyEmployerPF;
  
  const basic = Math.round(monthlyGross * 0.5);
  const hra = Math.round(basic * 0.4);
  const conveyance = 1600;
  const cca = 2000;
  const bonus = Math.round(monthlyGross * 0.0833);
  const specialAllowance = monthlyGross - basic - hra - conveyance - cca - bonus;
  
  const employeePF = monthlyEmployerPF;
  const pt = 200;
  const totalDeductions = employeePF + pt;
  const netSalary = monthlyGross - totalDeductions;

  const data = [
    { section: 'Earnings (Fixed & Variable)', type: 'header' },
    { name: 'Basic Salary', type: 'Earning', value: basic },
    { name: 'House Rent Allowance (HRA)', type: 'Earning', value: hra },
    { name: 'Conveyance Allowance', type: 'Earning', value: conveyance },
    { name: 'City Compensatory Allowance (CCA)', type: 'Earning', value: cca },
    { name: 'Special Allowance', type: 'Earning', value: specialAllowance },
    { name: 'Performance Bonus', type: 'Earning', value: bonus },
    { name: 'Employer PF Contribution', type: 'Earning', value: monthlyEmployerPF },
    
    { section: 'Deductions & Statutory', type: 'header' },
    { name: 'Employee PF Contribution', type: 'Deduction', value: employeePF },
    { name: 'Professional Tax (PT)', type: 'Deduction', value: pt },
    
    { section: 'Summary (Annual Recap)', type: 'header' },
    { name: 'Gross Salary', type: 'Total', value: monthlyGross, highlight: 'font-bold' },
    { name: 'Total Deductions', type: 'Total', value: totalDeductions, highlight: 'text-red-600 font-bold' },
    { name: 'Net Take-Home (Monthly)', type: 'Total', value: netSalary, highlight: 'bg-blue-50 text-blue-700 font-bold' },
    { name: 'Annual CTC', type: 'Total', value: annualCTC / 12, yearly: annualCTC, highlight: 'bg-emerald-50 text-emerald-700 font-bold' },
  ];

  const format = (val) => `₹${val.toLocaleString()}`;

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/40 backdrop-blur-sm transition-all duration-200">
      <div className="w-full max-w-3xl scale-100 rounded-2xl bg-white shadow-2xl transition-transform">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 p-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{employee.name}</h2>
            <p className="text-xs text-gray-500">{employee.id} • {employee.role}</p>
          </div>
          <div className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">
            CTC Breakdown
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm">
            <table className="w-full text-left text-sm border-collapse">
              <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-600">
                <tr>
                  <th className="px-4 py-3 font-semibold">Component Name</th>
                  <th className="px-4 py-3 text-center font-semibold">Type</th>
                  <th className="px-4 py-3 text-right font-semibold">Monthly</th>
                  <th className="px-4 py-3 text-right font-semibold">Yearly</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data.map((row, idx) => (
                  row.type === 'header' ? (
                    <tr key={idx} className="bg-gray-50/50">
                      <td colSpan={4} className="px-4 py-2 text-[10px] font-extrabold uppercase tracking-widest text-gray-400">
                        {row.section}
                      </td>
                    </tr>
                  ) : (
                    <tr key={idx} className={`hover:bg-blue-50/30 transition-colors ${row.highlight || ''}`}>
                      <td className="px-4 py-3 text-gray-800">{row.name}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                          row.type === 'Earning' ? 'bg-emerald-50 text-emerald-700' : 
                          row.type === 'Deduction' ? 'bg-red-50 text-red-700' : 'text-gray-400'
                        }`}>
                          {row.type}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-gray-900">{format(row.value)}</td>
                      <td className="px-4 py-3 text-right font-mono text-gray-900">{format(row.yearly || (row.value * 12))}</td>
                    </tr>
                  )
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between bg-gray-50 p-6 rounded-b-2xl">
          <button 
            onClick={onClose}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all"
          >
            Close Window
          </button>
          <button 
            className="group relative flex items-center rounded-lg bg-blue-600 px-6 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-200 hover:bg-blue-700 hover:scale-105 active:scale-95 transition-all"
          >
            <DownloadIcon />
            Download Summary
          </button>
        </div>
      </div>
    </div>
  );
};

const DownloadIcon = () => (
  <svg className="mr-2 h-4 w-4 transition-transform group-hover:translate-y-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

export default CTCBreakdown;
