/**
 * PPS Payroll — Payroll Calculation Service
 * Reusable salary calculation logic.
 */
import { SALARY_COMPONENTS } from '../utils/constants.js';

const S = SALARY_COMPONENTS;

/**
 * Calculate salary breakdown for an employee
 * @param {Object} employee - Employee document
 * @param {Object} attendance - { present, absent, halfDay, paidLeave, unpaidLeave }
 * @param {number} totalBonus - Sum of bonuses
 * @param {number} totalModuleDeduction - Sum of module deductions
 * @returns {Object} Full salary breakdown
 */
export const calculateSalary = (employee, attendance = {}, totalBonus = 0, totalModuleDeduction = 0) => {
    const ms = employee.monthlySalary || Math.round(employee.ctc / 12 / 1.15);
    const basic = Math.round(ms * S.BASIC_PERCENT);
    const hra = Math.round(ms * S.HRA_PERCENT);
    const ta = Math.round(ms * S.TA_PERCENT);
    const da = Math.round(ms * S.DA_PERCENT);

    const { present = 0, absent = 0, halfDay = 0, paidLeave = 0, unpaidLeave = 0 } = attendance;
    const daysWorked = present + halfDay * 0.5 + paidLeave;
    const totalWorkingDays = employee.totalWorking || S.DEFAULT_WORKING_DAYS;

    const gross = basic + hra + ta + da + totalBonus;

    // Tax
    let tds = 0;
    if (gross > 50000) tds = Math.round(gross * 0.10);
    else if (gross > 30000) tds = Math.round(gross * 0.05);

    const pf = Math.round(basic * S.PF_PERCENT);
    const esi = gross <= S.ESI_THRESHOLD ? Math.round(gross * S.ESI_PERCENT) : 0;
    const pt = gross > S.PROFESSIONAL_TAX_THRESHOLD ? S.PROFESSIONAL_TAX_AMOUNT : 0;
    const lop = Math.round((absent + unpaidLeave) * (ms / totalWorkingDays));
    const totalDeductions = tds + pf + esi + pt + lop + totalModuleDeduction;

    return {
        basicSalary: basic, hra, ta, da, bonus: totalBonus,
        grossEarnings: gross, pf, esi, tds, professionalTax: pt,
        lossOfPay: lop, otherDeductions: totalModuleDeduction,
        totalDeductions, netPay: gross - totalDeductions,
        daysWorked, totalWorkingDays, present, absent, halfDay, paidLeave, unpaidLeave,
    };
};

export default { calculateSalary };
