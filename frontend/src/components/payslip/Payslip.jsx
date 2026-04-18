/**
 * Payslip Component — A4 Salary Slip Template
 * Uses pre-calculated values from the payroll record to ensure
 * numbers match the payroll table exactly. No independent recalculation.
 *
 * Props (via employee object):
 *   - calculatedEarnings: { basic, hra, educationAllowance, lta, personalAllowance, entertainmentReimbursement, conveyance, bonus, grossTotal }
 *   - calculatedDeductions: { tds, pf, esi, professionalTax, loans, perquisites, totalDeductions }
 *   - netSalary: number
 */

// --- INR Formatter ---
const fmtINR = (val) => {
    if (!val && val !== 0) return '';
    return Math.round(val).toLocaleString('en-IN');
};

// --- React Payslip Component ---
window.Payslip = function Payslip({ employee }) {
    if (!employee) return null;

    // Use pre-calculated values passed from showPayslip (matches payroll table)
    const earnings = employee.calculatedEarnings || {};
    const deductions = employee.calculatedDeductions || {};
    const netSalary = employee.netSalary || 0;

    const companyName = employee.companyName || localStorage.getItem('pps-company-name') || 'Prime Payroll Solution';
    const companyAddress = employee.companyAddress || localStorage.getItem('pps-company-address') || 'Company Address';

    // Table row component
    const EarningRow = ({ label, amount }) => (
        <tr>
            <td style={{ border: '1px solid #3a7ca5', padding: '7px 10px', fontSize: '12.5px', color: '#1a1a1a' }}>{label}</td>
            <td style={{ border: '1px solid #3a7ca5', padding: '7px 10px', fontSize: '12.5px', textAlign: 'right', fontFamily: 'monospace', color: '#1a1a1a' }}>{amount ? fmtINR(amount) : ''}</td>
        </tr>
    );

    const DeductionRow = ({ label, amount }) => (
        <tr>
            <td style={{ border: '1px solid #3a7ca5', padding: '7px 10px', fontSize: '12.5px', color: '#1a1a1a' }}>{label}</td>
            <td style={{ border: '1px solid #3a7ca5', padding: '7px 10px', fontSize: '12.5px', textAlign: 'right', fontFamily: 'monospace', color: '#1a1a1a' }}>{amount ? fmtINR(amount) : ''}</td>
        </tr>
    );

    return (
        <div id="payslip-a4-printable" style={{
            width: '190mm', minHeight: '277mm', margin: '0 auto', padding: '12mm 10mm',
            background: '#fff', fontFamily: "'Inter', 'Segoe UI', sans-serif",
            position: 'relative', overflow: 'hidden',
            boxShadow: '0 4px 24px rgba(0,0,0,0.08)', boxSizing: 'border-box'
        }}>

            {/* ====== TOP-LEFT TEAL DIAGONAL ====== */}
            <div style={{ position: 'absolute', top: 0, left: 0, width: '80px', height: '170px', overflow: 'hidden', zIndex: 1 }}>
                <div style={{
                    position: 'absolute', top: '-40px', left: '-50px',
                    width: '150px', height: '250px',
                    background: 'linear-gradient(135deg, #2bbcca 0%, #1a8fa0 100%)',
                    transform: 'rotate(-15deg)', transformOrigin: 'top left'
                }} />
            </div>

            {/* ====== PUNCH HOLES (screen only) ====== */}
            <div className="payslip-punch-holes" style={{
                position: 'absolute', right: '6px', top: '30px',
                display: 'flex', flexDirection: 'column', gap: '24px', zIndex: 2
            }}>
                {[...Array(12)].map((_, i) => (
                    <div key={i} style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#222' }} />
                ))}
            </div>

            {/* ====== HEADER ====== */}
            <div style={{ paddingLeft: '90px', marginBottom: '6px' }}>
                <h1 style={{
                    fontSize: '28px', fontWeight: 800, color: '#1a1a1a',
                    margin: 0, letterSpacing: '-0.5px', lineHeight: 1.2
                }}>{companyName}</h1>
                <p style={{ fontSize: '12px', color: '#555', margin: '3px 0 0 0', lineHeight: 1.5 }}>
                    {companyAddress}<br />India
                </p>
            </div>

            {/* ====== DIVIDER LINE ====== */}
            <div style={{ margin: '12px 0 10px 0', borderTop: '3px solid #1a1a1a' }} />

            {/* ====== TITLE ====== */}
            <h2 style={{
                textAlign: 'center', fontSize: '20px', fontWeight: 800,
                letterSpacing: '4px', color: '#1a1a1a', margin: '0 0 16px 0'
            }}>EMPLOYEE PAY SLIP</h2>

            {/* ====== EMPLOYEE DETAILS ====== */}
            <div style={{ marginBottom: '16px' }}>
                <table style={{ borderCollapse: 'collapse', fontSize: '13px', color: '#1a1a1a' }}>
                    <tbody>
                        {[
                            ['Period', employee.period || 'April 2026'],
                            ['Employee Name', employee.name],
                            ['Position', employee.position || 'Professional'],
                            ['Employee ID', employee.id],
                            ['Department', employee.department || 'Engineering']
                        ].map(([label, value], i) => (
                            <tr key={i}>
                                <td style={{ padding: '2px 0', fontWeight: 600, width: '150px' }}>{label}</td>
                                <td style={{ padding: '2px 14px', fontWeight: 600 }}>:</td>
                                <td style={{ padding: '2px 0' }}>{value}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* ====== SALARY TABLE ====== */}
            <div style={{ position: 'relative', marginBottom: '20px' }}>

                {/* ---- WATERMARK ---- */}
                <div style={{
                    position: 'absolute', top: '50%', left: '50%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 0, pointerEvents: 'none',
                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                    opacity: 0.06
                }}>
                    <span style={{ fontSize: '80px', fontWeight: 900, color: '#1a1a1a', letterSpacing: '10px', lineHeight: 1 }}>PPS</span>
                    <span style={{ fontSize: '14px', fontWeight: 700, color: '#1a1a1a', letterSpacing: '5px', marginTop: '4px' }}>PRIME PAYROLL SOLUTIONS</span>
                </div>

                <div style={{ display: 'flex', gap: '12px', position: 'relative', zIndex: 1 }}>

                    {/* --- EARNINGS TABLE --- */}
                    <div style={{ flex: 1 }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr>
                                    <th style={{
                                        border: '2px solid #3a7ca5', padding: '8px 10px',
                                        background: '#c5d9f1', fontSize: '14px', fontWeight: 700,
                                        textAlign: 'center', letterSpacing: '3px', color: '#1a1a1a'
                                    }}>Earning</th>
                                    <th style={{
                                        border: '2px solid #3a7ca5', padding: '8px 10px',
                                        background: '#c5d9f1', fontSize: '12px', fontWeight: 700,
                                        textAlign: 'center', color: '#1a1a1a', width: '100px'
                                    }}>Amount<br />(INR)</th>
                                </tr>
                            </thead>
                            <tbody>
                                <EarningRow label="Basic Salary" amount={earnings.basic} />
                                <EarningRow label="House Rent Allowance" amount={earnings.hra} />
                                <EarningRow label="Education Allowance" amount={earnings.educationAllowance} />
                                <EarningRow label="L.T.A" amount={earnings.lta} />
                                <EarningRow label="Personal Allowance" amount={earnings.personalAllowance} />
                                <EarningRow label="Entertainment Reimbursement" amount={earnings.entertainmentReimbursement} />
                                <EarningRow label="Conveyance" amount={earnings.conveyance} />
                                {earnings.bonus > 0 && <EarningRow label="Bonus" amount={earnings.bonus} />}
                                <tr>
                                    <td style={{
                                        border: '2px solid #3a7ca5', padding: '8px 10px',
                                        fontSize: '13px', fontWeight: 800, color: '#1a1a1a'
                                    }}>Gross Income Total</td>
                                    <td style={{
                                        border: '2px solid #3a7ca5', padding: '8px 10px',
                                        fontSize: '13px', fontWeight: 800, textAlign: 'right',
                                        fontFamily: 'monospace', color: '#1a1a1a'
                                    }}>{fmtINR(earnings.grossTotal)}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* --- DEDUCTIONS TABLE --- */}
                    <div style={{ flex: 1 }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr>
                                    <th style={{
                                        border: '2px solid #3a7ca5', padding: '8px 10px',
                                        background: '#c5d9f1', fontSize: '14px', fontWeight: 700,
                                        textAlign: 'center', letterSpacing: '3px', color: '#1a1a1a'
                                    }}>Deductions</th>
                                    <th style={{
                                        border: '2px solid #3a7ca5', padding: '8px 10px',
                                        background: '#c5d9f1', fontSize: '12px', fontWeight: 700,
                                        textAlign: 'center', color: '#1a1a1a', width: '100px'
                                    }}>Amount<br />(INR)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {deductions.tds > 0 && <DeductionRow label="TDS" amount={deductions.tds} />}
                                {deductions.pf > 0 && <DeductionRow label="PF" amount={deductions.pf} />}
                                {deductions.esi > 0 && <DeductionRow label="ESI" amount={deductions.esi} />}
                                {deductions.professionalTax > 0 && <DeductionRow label="Professional Tax" amount={deductions.professionalTax} />}
                                {deductions.loans > 0 && <DeductionRow label="Loans & Advances" amount={deductions.loans} />}
                                {deductions.perquisites > 0 && <DeductionRow label="Perquisites" amount={deductions.perquisites} />}
                                {deductions.otherDeductions > 0 && <DeductionRow label="Other Deductions" amount={deductions.otherDeductions} />}

                                {/* Total Deductions */}
                                <tr>
                                    <td style={{
                                        border: '2px solid #3a7ca5', padding: '8px 10px',
                                        background: '#c5d9f1', fontSize: '13px', fontWeight: 800, color: '#1a1a1a'
                                    }}>Total Deductions</td>
                                    <td style={{
                                        border: '2px solid #3a7ca5', padding: '8px 10px',
                                        background: '#c5d9f1', fontSize: '13px', fontWeight: 800,
                                        textAlign: 'right', fontFamily: 'monospace', color: '#1a1a1a'
                                    }}>{fmtINR(deductions.totalDeductions)}</td>
                                </tr>

                                {/* Spacer */}
                                <tr>
                                    <td style={{ border: '1px solid #3a7ca5', padding: '7px 10px' }}>&nbsp;</td>
                                    <td style={{ border: '1px solid #3a7ca5', padding: '7px 10px' }}>&nbsp;</td>
                                </tr>

                                {/* Net Salary */}
                                <tr>
                                    <td style={{
                                        border: '2px solid #3a7ca5', padding: '10px',
                                        background: '#c5d9f1', fontSize: '14px', fontWeight: 800,
                                        color: '#c0392b'
                                    }}>Net Salary</td>
                                    <td style={{
                                        border: '2px solid #3a7ca5', padding: '10px',
                                        background: '#c5d9f1', fontSize: '15px', fontWeight: 900,
                                        textAlign: 'right', fontFamily: 'monospace', color: '#c0392b'
                                    }}>{fmtINR(netSalary)}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* ====== PAYMENT DETAILS ====== */}
            <div style={{ marginBottom: '30px' }}>
                <table style={{ borderCollapse: 'collapse', fontSize: '13px', color: '#1a1a1a' }}>
                    <tbody>
                        <tr>
                            <td style={{ padding: '2px 0', fontWeight: 600, width: '150px' }}>Payment Method</td>
                            <td style={{ padding: '2px 14px', fontWeight: 600 }}>:</td>
                            <td style={{ padding: '2px 0' }}>
                                {employee.bankName || 'HDFC Bank'} - {employee.name}<br />
                                <span style={{ color: '#555' }}>No. {employee.accountNumber || 'XXXX XXXX 4589'}</span>
                            </td>
                        </tr>
                        <tr>
                            <td style={{ padding: '2px 0', fontWeight: 600 }}>Payment Date</td>
                            <td style={{ padding: '2px 14px', fontWeight: 600 }}>:</td>
                            <td style={{ padding: '2px 0' }}>
                                {employee.paymentDate || new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* ====== FOOTER MESSAGE ====== */}
            <div style={{
                textAlign: 'center', fontSize: '12px', color: '#555',
                fontStyle: 'italic', marginBottom: '30px'
            }}>
                This is a computer-generated document. No signature is required.
            </div>

            {/* ====== BOTTOM TEAL WAVE ====== */}
            <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', overflow: 'hidden', zIndex: 1 }}>
                <svg viewBox="0 0 800 80" preserveAspectRatio="none" style={{ width: '100%', height: '50px', display: 'block' }}>
                    <path d="M0,80 L0,40 Q200,0 400,40 Q600,80 800,30 L800,80 Z"
                        fill="url(#tealGrad)" />
                    <defs>
                        <linearGradient id="tealGrad" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor="#2bbcca" />
                            <stop offset="100%" stopColor="#1a8fa0" />
                        </linearGradient>
                    </defs>
                </svg>
            </div>

            {/* ====== PRINT/PDF STYLES — hide punch holes when printing ====== */}
            <style dangerouslySetInnerHTML={{ __html: `
                @media print {
                    .payslip-punch-holes { display: none !important; }
                }
            `}} />
        </div>
    );
};
