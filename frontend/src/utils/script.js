// --- Global Utilities & Navigation ---
window.getEl = (id) => document.getElementById(id);
window.queryAll = (selector) => document.querySelectorAll(selector);

// --- Global Data & State ---
const defaultEmployees = [
    { id: 'PPS001', name: 'MAN PATEL', email: 'man@pps.com', role: 'Software Developer', dept: 'Engineering', status: 'Active', dailyWage: 2500, monthlySalary: 65000, ctc: 900000, present: 22, absent: 1, halfDay: 1, paidLeave: 1, unpaidLeave: 0, sickLeave: 0, wfh: 1, totalWorking: 26, holidays: 4, assignedTasks: 25, completedTasks: 22, phone: '+91 98765 43210', location: 'Mumbai, India', joiningDate: '2024-01-15', profileImage: '' },
    { id: 'PPS002', name: 'Ishaan Gupta', email: 'ishaan@pps.com', role: 'Backend Developer', dept: 'Engineering', status: 'Active', dailyWage: 2200, monthlySalary: 58000, ctc: 800000, present: 21, absent: 0, halfDay: 2, paidLeave: 2, unpaidLeave: 0, sickLeave: 1, wfh: 2, totalWorking: 26, holidays: 4, assignedTasks: 20, completedTasks: 18, phone: '+91 98765 43211', location: 'Delhi, India', joiningDate: '2023-06-10', profileImage: '' },
    { id: 'PPS003', name: 'Ananya Iyer', email: 'ananya@pps.com', role: 'UI/UX Designer', dept: 'Design', status: 'Active', dailyWage: 2800, monthlySalary: 72000, ctc: 1000000, present: 23, absent: 0, halfDay: 0, paidLeave: 1, unpaidLeave: 0, sickLeave: 0, wfh: 0, totalWorking: 26, holidays: 4, assignedTasks: 15, completedTasks: 15, phone: '+91 98765 43212', location: 'Bangalore, India', joiningDate: '2023-03-20', profileImage: '' },
    { id: 'PPS004', name: 'Vihaan Reddy', email: 'vihaan@pps.com', role: 'Full Stack Developer', dept: 'Engineering', status: 'Active', dailyWage: 2700, monthlySalary: 70000, ctc: 970000, present: 23, absent: 0, halfDay: 0, paidLeave: 1, unpaidLeave: 0, sickLeave: 1, wfh: 1, totalWorking: 26, holidays: 4, assignedTasks: 30, completedTasks: 28, phone: '+91 98765 43213', location: 'Hyderabad, India', joiningDate: '2023-08-01', profileImage: '' },
    { id: 'PPS005', name: 'Saanvi Malhotra', email: 'saanvi@pps.com', role: 'QA Engineer', dept: 'Quality', status: 'Active', dailyWage: 2400, monthlySalary: 62000, ctc: 860000, present: 20, absent: 2, halfDay: 1, paidLeave: 1, unpaidLeave: 1, sickLeave: 0, wfh: 3, totalWorking: 26, holidays: 4, assignedTasks: 40, completedTasks: 35, phone: '+91 98765 43214', location: 'Pune, India', joiningDate: '2023-11-05', profileImage: '' },
    { id: 'PPS006', name: 'Advait Joshi', email: 'advait@pps.com', role: 'Devops Engineer', dept: 'Engineering', status: 'Active', dailyWage: 2300, monthlySalary: 60000, ctc: 830000, present: 24, absent: 0, halfDay: 0, paidLeave: 1, unpaidLeave: 0, sickLeave: 1, wfh: 0, totalWorking: 26, holidays: 4, assignedTasks: 12, completedTasks: 11, phone: '+91 98765 43215', location: 'Chennai, India', joiningDate: '2024-02-12', profileImage: '' },
    { id: 'PPS007', name: 'Kyra Nair', email: 'kyra@pps.com', role: 'Product Manager', dept: 'Product', status: 'Active', dailyWage: 2600, monthlySalary: 68000, ctc: 940000, present: 22, absent: 0, halfDay: 0, paidLeave: 0, unpaidLeave: 0, sickLeave: 0, wfh: 1, totalWorking: 26, holidays: 4, assignedTasks: 10, completedTasks: 9, phone: '+91 98765 43216', location: 'Kochi, India', joiningDate: '2023-09-18', profileImage: '' },
    { id: 'PPS008', name: 'Reyansh Verma', email: 'reyansh@pps.com', role: 'Data Scientist', dept: 'Analytics', status: 'Active', dailyWage: 2300, monthlySalary: 60000, ctc: 830000, present: 24, absent: 0, halfDay: 0, paidLeave: 1, unpaidLeave: 0, sickLeave: 1, wfh: 0, totalWorking: 26, holidays: 4, assignedTasks: 18, completedTasks: 17, phone: '+91 98765 43217', location: 'Noida, India', joiningDate: '2023-05-25', profileImage: '' },
    { id: 'PPS009', name: 'Diya Saxena', email: 'diya@pps.com', role: 'Mobile App Developer', dept: 'Engineering', status: 'Active', dailyWage: 1800, monthlySalary: 45000, ctc: 620000, present: 19, absent: 3, halfDay: 2, paidLeave: 1, unpaidLeave: 0, sickLeave: 1, wfh: 0, totalWorking: 26, holidays: 4, assignedTasks: 22, completedTasks: 19, phone: '+91 98765 43218', location: 'Jaipur, India', joiningDate: '2024-04-01', profileImage: '' },
    { id: 'PPS010', name: 'Kabir Singh', email: 'kabir@pps.com', role: 'Backend Developer', dept: 'Engineering', status: 'Active', dailyWage: 2000, monthlySalary: 52000, ctc: 720000, present: 21, absent: 1, halfDay: 0, paidLeave: 2, unpaidLeave: 0, sickLeave: 2, wfh: 0, totalWorking: 26, holidays: 4, assignedTasks: 20, completedTasks: 16, phone: '+91 98765 43219', location: 'Lucknow, India', joiningDate: '2023-07-14', profileImage: '' },
    { id: 'PPS011', name: 'Myra Kapoor', email: 'myra@pps.com', role: 'Machine Learning Engineer', dept: 'AI/ML', status: 'Active', dailyWage: 1900, monthlySalary: 48000, ctc: 660000, present: 22, absent: 0, halfDay: 1, paidLeave: 2, unpaidLeave: 0, sickLeave: 1, wfh: 0, totalWorking: 26, holidays: 4, assignedTasks: 15, completedTasks: 13, phone: '+91 98765 43220', location: 'Gurugram, India', joiningDate: '2023-10-22', profileImage: '' },
    { id: 'PPS012', name: 'Vivaan Choudhury', email: 'vivaan@pps.com', role: 'Security Analyst', dept: 'Security', status: 'Active', dailyWage: 1500, monthlySalary: 38000, ctc: 520000, present: 26, absent: 0, halfDay: 0, paidLeave: 0, unpaidLeave: 0, sickLeave: 0, wfh: 0, totalWorking: 26, holidays: 4, assignedTasks: 8, completedTasks: 8, phone: '+91 98765 43221', location: 'Kolkata, India', joiningDate: '2024-03-10', profileImage: '' },
    { id: 'PPS013', name: 'Shanaya Bhatia', email: 'shanaya@pps.com', role: 'Frontend Developer', dept: 'Engineering', status: 'Active', dailyWage: 2450, monthlySalary: 64000, ctc: 880000, present: 21, absent: 1, halfDay: 2, paidLeave: 2, unpaidLeave: 0, sickLeave: 0, wfh: 0, totalWorking: 26, holidays: 4, assignedTasks: 25, completedTasks: 21, phone: '+91 98765 43222', location: 'Ahmedabad, India', joiningDate: '2023-12-01', profileImage: '' },
    { id: 'PPS014', name: 'Arjun Mehra', email: 'arjun@pps.com', role: 'Cloud Architect', dept: 'Infrastructure', status: 'Active', dailyWage: 2900, monthlySalary: 75000, ctc: 1050000, present: 20, absent: 2, halfDay: 0, paidLeave: 1, unpaidLeave: 0, sickLeave: 3, wfh: 7, totalWorking: 26, holidays: 4, assignedTasks: 12, completedTasks: 10, phone: '+91 98765 43223', location: 'Bangalore, India', joiningDate: '2022-11-15', profileImage: '' },
    { id: 'PPS015', name: 'Zara Khan', email: 'zara@pps.com', role: 'Technical Writer', dept: 'Documentation', status: 'Active', dailyWage: 2000, monthlySalary: 52000, ctc: 720000, present: 22, absent: 0, halfDay: 0, paidLeave: 3, unpaidLeave: 0, sickLeave: 1, wfh: 0, totalWorking: 26, holidays: 4, assignedTasks: 10, completedTasks: 10, phone: '+91 98765 43224', location: 'Mumbai, India', joiningDate: '2024-01-20', profileImage: '' },
    { id: 'PPS016', name: 'Raj Mehta', email: 'raj@pps.com', role: 'Full Stack Developer', dept: 'Engineering', status: 'Active', dailyWage: 2500, monthlySalary: 65000, ctc: 900000, present: 22, absent: 0, halfDay: 0, paidLeave: 0, unpaidLeave: 0, sickLeave: 0, wfh: 0, totalWorking: 26, holidays: 4, assignedTasks: 15, completedTasks: 12, phone: '+91 98765 43225', location: 'Delhi, India', joiningDate: '2023-04-15', profileImage: '' },
    { id: 'PPS017', name: 'Neha Kapoor', email: 'neha@pps.com', role: 'HR Manager', dept: 'HR', status: 'Active', dailyWage: 2200, monthlySalary: 58000, ctc: 800000, present: 24, absent: 0, halfDay: 0, paidLeave: 0, unpaidLeave: 0, sickLeave: 0, wfh: 0, totalWorking: 26, holidays: 4, assignedTasks: 10, completedTasks: 10, phone: '+91 98765 43226', location: 'Pune, India', joiningDate: '2023-02-28', profileImage: '' }
];

let employees = [];
let payrolls = [];
let bonusesDeductions = [];
let leaveRequests = [];
let leaveTypes = [];
let currentSalaryType = 'monthly';

// --- Toast Notification System ---
window.showToast = function (message, type = 'info') {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        document.body.appendChild(container);
    }
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    const icons = {
        success: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
        error: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>',
        warning: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
        info: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>'
    };
    toast.innerHTML = `
        <span class="toast-icon">${icons[type] || icons.info}</span>
        <span class="toast-message">${message}</span>
        <button class="toast-close" onclick="this.parentElement.classList.add('toast-exit');setTimeout(()=>this.parentElement.remove(),300)" aria-label="Close">&times;</button>
    `;
    container.appendChild(toast);
    // Force reflow for animation
    toast.offsetHeight;
    toast.classList.add('toast-enter');
    // Auto-dismiss
    setTimeout(() => {
        if (toast.parentElement) {
            toast.classList.add('toast-exit');
            setTimeout(() => toast.remove(), 300);
        }
    }, 4000);
};
// --- Auth Storage & Remember Me Utility ---
window.AuthStorage = {
    getKeys: function (role) {
        return {
            nameKey: role === 'employee' ? 'employee_remember_name' : 'admin_remember_name',
            emailKey: role === 'employee' ? 'employee_remember_email' : 'admin_remember_email'
        };
    },
    saveCredentials: function (role, name, email) {
        const keys = this.getKeys(role);
        localStorage.setItem(keys.nameKey, name);
        localStorage.setItem(keys.emailKey, email);
    },
    getCredentials: function (role) {
        const keys = this.getKeys(role);
        return {
            name: localStorage.getItem(keys.nameKey) || '',
            email: localStorage.getItem(keys.emailKey) || ''
        };
    },
    clearCredentials: function (role) {
        const keys = this.getKeys(role);
        localStorage.removeItem(keys.nameKey);
        localStorage.removeItem(keys.emailKey);
    }
};

// --- Attendance Live Timer System ---
// simulateCheckIn, simulateCheckOut, and startLiveTimer are defined further below
// after the employees array is available.

window.formatTime = function (ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return [hours, minutes, seconds].map(v => v < 10 ? '0' + v : v).join(':');
};

// --- Logout System ---
window.handleLogout = function () {
    // Show custom confirmation modal
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay logout-confirm-overlay';
    overlay.id = 'logout-confirm-modal';
    overlay.innerHTML = `
        <div class="modal" style="max-width:400px;padding:2rem;text-align:center;animation:modalScaleIn 0.25s ease">
            <div style="width:64px;height:64px;background:rgba(239,68,68,0.1);border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 1.25rem">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                    <polyline points="16 17 21 12 16 7"/>
                    <line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
            </div>
            <h3 style="margin:0 0 0.5rem;font-size:1.15rem;font-weight:700;color:var(--text)">Sign Out?</h3>
            <p style="margin:0 0 1.5rem;font-size:0.875rem;color:var(--text-muted);line-height:1.5">
                Are you sure you want to sign out?<br>You will be redirected to the landing page.
            </p>
            <div style="display:flex;gap:0.75rem;justify-content:center">
                <button id="logout-cancel-btn" class="btn btn-outline" style="min-width:100px">Cancel</button>
                <button id="logout-confirm-btn" class="btn btn-primary" style="min-width:100px;background:#ef4444;border-color:#ef4444">Sign Out</button>
            </div>
        </div>
    `;
    document.body.appendChild(overlay);

    // Focus trap
    const cancelBtn = overlay.querySelector('#logout-cancel-btn');
    const confirmBtn = overlay.querySelector('#logout-confirm-btn');
    cancelBtn.focus();

    const closeModal = () => {
        overlay.classList.add('hidden');
        setTimeout(() => overlay.remove(), 200);
    };

    cancelBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal(); });
    document.addEventListener('keydown', function escHandler(e) {
        if (e.key === 'Escape') { closeModal(); document.removeEventListener('keydown', escHandler); }
    });

    confirmBtn.addEventListener('click', () => {
        // Visual loading state on confirm button
        confirmBtn.innerHTML = '<span class="spinner-sm"></span> Signing out...';
        confirmBtn.disabled = true;
        cancelBtn.disabled = true;

        // Simulate async logout (clear all auth state)
        setTimeout(() => {
            // 1. Clear session metadata (but preserve Remember Me data)
            localStorage.removeItem('pps-current-payslip');
            // Clear check-in states
            const keys = Object.keys(localStorage).filter(k => k.startsWith('pps-checkin-'));
            keys.forEach(k => localStorage.removeItem(k));

            // 2. Clear runtime state
            window.currentUser = null;
            if (window.timerInterval) clearInterval(window.timerInterval);

            // 3. Close modal & redirect to landing
            closeModal();
            window.showLandingView();
            showToast('Signed out successfully.', 'success');
        }, 600);
    });
};

// Expose these immediately for inline onclick handlers
window.showLandingView = function () {
    const views = ['landing-view', 'auth-view', 'dashboard-view'];
    views.forEach(v => { const el = getEl(v); if (el) el.style.display = (v === 'landing-view' ? 'block' : 'none'); });
    // Scroll the landing-view container (not window) to top
    const landingView = getEl('landing-view');
    if (landingView) landingView.scrollTop = 0;
    document.body.classList.remove('auth-active');
    window.applyTheme('light', false); // Landing page is always light mode
};

// Global Dashboard Root Navigation
// Global Dashboard Root Navigation
window.handleDashboardLogoClick = function (e) {
    if (e) e.preventDefault();

    const dashboardView = getEl('dashboard-view');
    const isDashboardVisible = dashboardView && dashboardView.style.display !== 'none';

    if (isDashboardVisible) {
        const role = localStorage.getItem('pps-role');
        if (role) {
            window.showView(role === 'admin' ? 'admin-overview' : 'employee-overview');
            window.scrollTo(0, 0);
            return;
        }
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (!isDashboardVisible) window.showLandingView();
};

window.showDashboardView = function (role, userName) {
    const views = ['landing-view', 'auth-view', 'dashboard-view'];
    views.forEach(v => { const el = getEl(v); if (el) el.style.display = (v === 'dashboard-view' ? 'flex' : 'none'); });

    document.body.classList.remove('auth-active');
    document.body.style.overflow = 'auto';
    document.documentElement.style.overflow = 'auto';

    window.currentUser = { role: role, displayName: userName };
    localStorage.setItem('pps-role', role);
    localStorage.setItem('pps-user-display', userName);
    const userNameEl = getEl('user-name');
    const userAvatarEl = getEl('user-avatar');
    if (userNameEl) userNameEl.textContent = userName;
    if (userAvatarEl) userAvatarEl.textContent = userName.charAt(0).toUpperCase();

    const adminNav = getEl('admin-nav');
    const employeeNav = getEl('employee-nav');

    if (role === 'admin') {
        if (adminNav) adminNav.style.display = 'flex';
        if (employeeNav) employeeNav.style.display = 'none';
        window.showView('admin-overview');
        const welcomeUser = getEl('welcome-user');
        if (welcomeUser) welcomeUser.textContent = userName;
    } else {
        if (adminNav) adminNav.style.display = 'none';
        if (employeeNav) employeeNav.style.display = 'flex';
        // Initialize Employee Data
        window.initEmployeePortal(userName);
        window.showView('employee-overview');
    }

    // Apply saved user theme only when entering dashboard
    const savedTheme = localStorage.getItem('pps-theme') || 'light';
    window.applyTheme(savedTheme, false);
};

// --- Employee Portal Logic ---
window.initEmployeePortal = function (userName) {
    // Find employee: prefer stored ID, then name match, then fallback
    let emp = null;
    if (window._currentEmpId) {
        emp = employees.find(e => e.id === window._currentEmpId);
    }
    if (!emp) {
        emp = employees.find(e => e.name === userName) || employees[0];
    }
    if (!emp) return;
    
    // Store stable ID for all profile functions
    window._currentEmpId = emp.id;

    // 1. Dashboard & General
    const welcomeName = getEl('welcome-employee-name');
    if (welcomeName) welcomeName.textContent = emp.name;

    const now = new Date();
    const dayNums = getEl('dash-day-num');
    const monthYears = getEl('dash-month-year');
    const dayNumsModern = getEl('dash-day-num-modern');
    const monthYearsModern = getEl('dash-month-year-modern');

    if (dayNums) dayNums.textContent = now.getDate();
    if (dayNumsModern) dayNumsModern.textContent = now.getDate();

    const monthYearText = now.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }).toUpperCase();
    if (monthYears) monthYears.textContent = monthYearText;
    if (monthYearsModern) monthYearsModern.textContent = monthYearText;
    
    // Set dynamic current date text
    if (getEl('hero-day-text')) getEl('hero-day-text').textContent = now.toLocaleDateString('en-IN', { weekday: 'long' });
    if (getEl('hero-date-text')) getEl('hero-date-text').textContent = now.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

    if (getEl('dash-emp-salary')) getEl('dash-emp-salary').textContent = `₹ ${emp.monthlySalary.toLocaleString()}`;
    if (getEl('dash-emp-leave')) getEl('dash-emp-leave').textContent = `${emp.paidLeave + emp.sickLeave + 12} Days`; // Simulated
    // Calculate Rating
    const assignedTasks = emp.assignedTasks || 0;
    const completedTasks = emp.completedTasks || 0;
    const ratingPct = assignedTasks > 0 ? ((completedTasks / assignedTasks) * 100).toFixed(1) : '0.0';

    if (getEl('dash-emp-rating')) getEl('dash-emp-rating').textContent = `${ratingPct}%`;
    if (getEl('dash-emp-task-counts')) getEl('dash-emp-task-counts').textContent = `${completedTasks} / ${assignedTasks} Tasks Completed`;

    // 2. Profile Details — Populate all fields
    if (getEl('prof-name')) getEl('prof-name').textContent = emp.name;
    if (getEl('prof-email')) getEl('prof-email').textContent = emp.email;
    if (getEl('prof-id')) getEl('prof-id').textContent = emp.id;
    if (getEl('prof-role')) getEl('prof-role').textContent = emp.role;
    if (getEl('prof-dept')) getEl('prof-dept').textContent = emp.dept;
    if (getEl('prof-name-large')) getEl('prof-name-large').textContent = emp.name;
    if (getEl('prof-role-large')) getEl('prof-role-large').textContent = emp.role;
    if (getEl('prof-dept-large')) getEl('prof-dept-large').textContent = emp.dept;
    if (getEl('prof-phone')) getEl('prof-phone').textContent = emp.phone || '+91 98765 43210';
    if (getEl('prof-loc')) getEl('prof-loc').textContent = emp.location || 'Mumbai, India';
    if (getEl('prof-joining')) getEl('prof-joining').textContent = emp.joiningDate || '2024-01-15';
    // Employment details (locked)
    if (getEl('prof-designation')) getEl('prof-designation').textContent = emp.role;
    if (getEl('prof-department')) getEl('prof-department').textContent = emp.dept;
    if (getEl('prof-ctc')) getEl('prof-ctc').textContent = `₹${(emp.ctc / 100000).toFixed(2)} LPA`;

    // Reset edit mode when navigating to profile
    const profContainer = getEl('profile-container');
    if (profContainer && profContainer.classList.contains('edit-mode-active')) {
        profContainer.classList.remove('edit-mode-active');
        profContainer.querySelectorAll('.profile-edit-ui').forEach(el => el.classList.add('hidden'));
        profContainer.querySelectorAll('.profile-view-ui').forEach(el => el.classList.remove('hidden'));
        window._profileSnapshot = null;
    }

    // Avatar and Greeting logic
    const hour = now.getHours();
    let greeting = "Good morning";
    if (hour >= 12 && hour < 17) greeting = "Good afternoon";
    if (hour >= 17) greeting = "Good evening";
    document.querySelectorAll('.greeting-text').forEach(el => el.textContent = greeting);
    
    // Check local storage for dynamic avatar overrides
    const savedImage = localStorage.getItem('profileImage');
    if (savedImage) {
        emp.profileImage = savedImage;
    }
    
    const initials = emp.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    
    const setAvatar = (textId, imgId, applyBg = false) => {
        const textEl = getEl(textId);
        const imgEl = getEl(imgId);
        
        if (emp.profileImage && imgEl) {
            imgEl.src = emp.profileImage;
            imgEl.style.display = 'block';
            imgEl.classList.remove('hidden');
            if (textEl) {
                textEl.style.display = 'none';
                textEl.classList.add('hidden');
            }
        } else {
            if (imgEl) {
                imgEl.style.display = 'none';
                imgEl.classList.add('hidden');
            }
            if (textEl) {
                textEl.textContent = initials;
                textEl.style.display = 'block';
                textEl.classList.remove('hidden');
            }
        }
        
        if (applyBg && textEl && textEl.parentElement && !emp.profileImage) {
            textEl.parentElement.style.background = 'var(--primary-light)';
            textEl.parentElement.style.color = 'var(--primary)';
        }
    };
    
    // Update dashboard avatars
    setAvatar('prof-avatar-text', 'prof-avatar-img');
    setAvatar('emp-avatar-initials', 'emp-avatar-img-main');
    
    // If there is a top nav avatar
    const userAvatarEl = getEl('user-avatar');
    if (userAvatarEl) {
        if (emp.profileImage) {
            // Need to create an image inside or adjust
            userAvatarEl.innerHTML = `<img src="${emp.profileImage}" style="width:100%;height:100%;border-radius:50%;object-fit:cover;">`;
        } else {
            userAvatarEl.textContent = initials;
        }
    }
    
    if (getEl('prof-avatar-large')) {
        getEl('prof-avatar-large').style.background = 'var(--primary-light)';
        getEl('prof-avatar-large').style.color = 'var(--primary)';
        getEl('prof-avatar-large').style.borderRadius = '50%';
    }

    // 3. Attendance Session — Daily Reset + Restore
    const todayDateStr = new Date().toISOString().split('T')[0]; // e.g. 2026-04-12
    const lastCheckinDate = localStorage.getItem(`pps-checkin-date-${emp.id}`);
    
    // Daily reset: if stored date is not today, clear the session
    if (lastCheckinDate && lastCheckinDate !== todayDateStr) {
        localStorage.removeItem(`pps-checkin-${emp.id}`);
        localStorage.removeItem(`pps-checkin-timestamp-${emp.id}`);
        localStorage.removeItem(`pps-checkin-date-${emp.id}`);
        localStorage.removeItem(`pps-total-work-hours-ms-${emp.id}`);
    }

    const savedTimestamp = localStorage.getItem(`pps-checkin-timestamp-${emp.id}`);
    const checkinBtn = getEl('btn-checkin');
    const checkoutBtn = getEl('btn-checkout');
    const timerEl = getEl('live-timer');

    // Check if already punched out today (has checkout record but no active session)
    const todayRecord = JSON.parse(localStorage.getItem(`pps-attendance-today-${emp.id}`) || 'null');
    const alreadyPunchedOut = todayRecord && todayRecord.date === todayDateStr && todayRecord.checkOut;

    if (savedTimestamp && !alreadyPunchedOut) {
        // Active session: restore punch-in state
        const punchInDate = new Date(parseInt(savedTimestamp, 10));
        const punchInTimeStr = punchInDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        if (checkinBtn) checkinBtn.disabled = true;
        if (checkoutBtn) checkoutBtn.disabled = false;
        if (getEl('live-checkin-time')) getEl('live-checkin-time').textContent = punchInTimeStr;
        if (getEl('live-checkout-time')) getEl('live-checkout-time').textContent = '--:--';

        window.startLiveTimer();
    } else if (alreadyPunchedOut) {
        // Already punched out today: show completed state
        if (checkinBtn) checkinBtn.disabled = true;
        if (checkoutBtn) checkoutBtn.disabled = true;
        if (getEl('live-checkin-time')) getEl('live-checkin-time').textContent = todayRecord.checkIn || '--:--';
        if (getEl('live-checkout-time')) getEl('live-checkout-time').textContent = todayRecord.checkOut || '--:--';
        
        if (timerEl) timerEl.textContent = todayRecord.workHours || '00:00:00';
        if (getEl('live-work-hours')) getEl('live-work-hours').textContent = todayRecord.workHours || '00:00:00';
    } else {
        // Fresh day: no session yet
        if (checkinBtn) checkinBtn.disabled = false;
        if (checkoutBtn) checkoutBtn.disabled = true;
        if (getEl('live-checkin-time')) getEl('live-checkin-time').textContent = '--:--';
        if (getEl('live-checkout-time')) getEl('live-checkout-time').textContent = '--:--';
        if (timerEl) timerEl.textContent = '00:00:00';
        if (getEl('live-work-hours')) getEl('live-work-hours').textContent = '00:00:00';
    }
    
    // Initialize month dropdown
    const monthSelect = getEl('emp-att-month-filter');
    if (monthSelect && monthSelect.options.length === 0) {
        const nowMs = new Date();
        for (let i = 0; i < 6; i++) {
            const d = new Date(nowMs.getFullYear(), nowMs.getMonth() - i, 1);
            const val = `${d.getFullYear()}-${String(d.getMonth()).padStart(2, '0')}`;
            const label = d.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
            monthSelect.add(new Option(label, val));
        }
    }

    // Render attendance history table for the employee
    window.renderEmployeeAttendanceHistory(emp);
    
    // Add event handler globally if not present
    if (!window.onEmpAttMonthChange) {
        window.onEmpAttMonthChange = function() {
            const emp = (window._currentEmpId ? employees.find(e => e.id === window._currentEmpId) : null) 
                || employees.find(e => e.name === window.currentUser?.displayName) || employees[0];
            if (emp) window.renderEmployeeAttendanceHistory(emp);
        };
    }

    // 4. Payslip Preview & Salary Breakdown
    const breakdown = window.calculateSalaryBreakdown(emp);
    if (getEl('pre-basic')) getEl('pre-basic').textContent = `₹ ${breakdown.basic.toLocaleString()}`;
    if (getEl('pre-hra')) getEl('pre-hra').textContent = `₹ ${breakdown.hra.toLocaleString()}`;
    if (getEl('pre-ot')) getEl('pre-ot').textContent = `₹ ${breakdown.overtimePay.toLocaleString()}`;
    if (getEl('pre-gross')) getEl('pre-gross').textContent = `₹ ${breakdown.gross.toLocaleString()}`;
    if (getEl('pre-pf')) getEl('pre-pf').textContent = `₹ ${breakdown.pf.toLocaleString()}`;
    if (getEl('pre-pt')) getEl('pre-pt').textContent = `₹ ${breakdown.pt.toLocaleString()}`;
    if (getEl('pre-net')) getEl('pre-net').textContent = `₹ ${breakdown.net.toLocaleString()}`;

    // Update main dashboard net salary card to be consistent
    if (getEl('dash-emp-salary')) getEl('dash-emp-salary').textContent = `₹ ${breakdown.net.toLocaleString()}`;

    // 5. Payslip History Table Sync (6 Months Dummy Data)
    const tableBody = getEl('emp-payslips-table-body');
    if (tableBody) {
        const months = ["February 2026", "January 2026", "December 2025", "November 2025", "October 2025", "September 2025"];
        const dates = ["Mar 01, 2026", "Feb 01, 2026", "Jan 01, 2026", "Dec 01, 2025", "Nov 01, 2025", "Oct 01, 2025"];
        const salaries = [breakdown.net, breakdown.net - 500, breakdown.net + 1200, breakdown.net, breakdown.net - 200, breakdown.net];

        tableBody.innerHTML = months.map((month, i) => `
            <tr style="height: 64px;">
                <td class="font-medium" style="padding: 1rem;">${month}</td>
                <td style="padding: 1rem;">${dates[i]}</td>
                <td class="font-bold text-primary" style="padding: 1rem;">₹ ${salaries[i].toLocaleString()}</td>
                <td style="padding: 1rem;"><span class="badge badge-green">Paid</span></td>
                <td class="text-center" style="padding: 1rem;">
                    <button class="payslip-view-btn" onclick="window.showPayslip('${emp.id}', '${month}', ${salaries[i]})">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                            <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                        View
                    </button>
                </td>
            </tr>
        `).join('');
    }

    // 6. Persist for Standalone View
    const companyName = localStorage.getItem('pps-company-name') || 'XYZ Private Limited';
    const companyAddress = localStorage.getItem('pps-company-address') || '123 Tech Hub, HITEC City, Hyderabad, 500081';

    const payslipData = {
        name: emp.name,
        id: emp.id,
        position: emp.role,
        dept: emp.dept,
        period: now.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }),
        date: now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        companyName: companyName,
        companyAddress: companyAddress,
        salary: breakdown
    };
    localStorage.setItem('pps-current-payslip', JSON.stringify(payslipData));

    // 7. Render dynamic tasks
    window.renderEmployeeTasks(emp.id);
};

window.showPayslip = function (empId, month, customNet) {
    console.log('--- Payslip Debug Start ---');
    
    // Check if React portal is ready
    if (typeof window.showPayslipPreview !== 'function') {
        console.warn('React portal not ready yet, retrying in 500ms...');
        alert('The payslip preview is initializing. Please try again in a second.');
        return;
    }

    const emp = employees.find(e => String(e.id) === String(empId)) || employees[0];
    if (!emp) {
        console.error('Error: Employee not found');
        return;
    }

    const breakdown = window.calculateSalaryBreakdown(emp);

    const payslipData = {
        name: emp.name,
        id: emp.id,
        month: month.split(' ')[0], 
        year: month.split(' ')[1] || new Date().getFullYear(),
        designation: emp.role,
        department: emp.dept,
        bankName: emp.bankName || 'HDFC Bank',
        accountNumber: emp.accountNumber || 'XXXXXXXX4589',
        panNumber: emp.panNumber || 'ABCDE1234F',
        earnings: {
            basic: breakdown.basic,
            hra: breakdown.hra,
            overtime: breakdown.overtimePay,
            conveyance: 1600,
            medical: 1250
        },
        deductions: {
            pf: breakdown.pf,
            pt: breakdown.pt,
            tds: breakdown.tds || 0
        },
        totals: {
            gross: breakdown.gross,
            deductions: breakdown.pf + breakdown.pt + (breakdown.tds || 0),
            net: customNet || breakdown.net
        }
    };

    try {
        window.showPayslipPreview(payslipData);
        console.log('✅ React Modal Triggered Successfully');
    } catch (err) {
        console.error('❌ Error triggering React modal:', err);
        alert('Failed to show payslip preview. Check console for details.');
    }
    console.log('--- Payslip Debug End ---');
};

window.closePayslipModal = function() {
    const modal = getEl('payslip-modal');
    if (modal) {
        modal.style.display = 'none';
        modal.classList.add('hidden');
    }
};

window.showFullPayslip = function (empId, month) {
    const emp = employees.find(e => String(e.id) === String(empId)) || employees[0];
    const breakdown = window.calculateSalaryBreakdown(emp);

    const payload = {
        name: emp.name,
        id: emp.id,
        dept: emp.dept || 'Operations',
        position: emp.role || 'Employee',
        period: month,
        date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' }),
        salary: breakdown,
        companyName: 'Prime Payroll Solutions',
        companyAddress: '123 Tech Hub, HITEC City, Hyderabad, 500081'
    };

    localStorage.setItem('pps-current-payslip', JSON.stringify(payload));

    const iframe = getEl('payslip-iframe');
    if (iframe) {
        iframe.src = 'payslip.html?t=' + Date.now();
        iframe.onload = () => {
            iframe.contentWindow.postMessage({ type: 'POPULATE_PAYSLIP', payload }, '*');
            setTimeout(() => {
                window.autoScaleViewer('payslip-scaling-container', 'payslip-print-modal');
            }, 100);
        };
    }

    getEl('payslip-print-modal')?.classList.remove('hidden');
    getEl('payslip-print-modal').style.display = 'flex';
};

window.renderEmployeeTasks = function (empId) {
    const container = getEl('emp-tasks-container');
    if (!container) return;

    const emp = employees.find(e => e.id === empId);
    if (!emp || !emp.taskList) {
        container.innerHTML = '<div class="p-6 text-center text-muted">No tasks found.</div>';
        return;
    }

    const pendingTasks = emp.taskList.filter(t => !t.completed);

    if (pendingTasks.length === 0) {
        container.innerHTML = `
            <div class="p-6 text-center">
                <div class="stat-icon mx-auto mb-3" style="width: 48px; height: 48px; background: var(--success-light); color: var(--success);">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </div>
                <div class="font-medium text-success">All caught up!</div>
                <div class="text-xs text-muted mt-1">You have no pending tasks.</div>
            </div>
        `;
        return;
    }

    let html = '';
    pendingTasks.forEach(task => {
        const badgeColor = task.priority === 'High' ? 'badge-blue' : (task.priority === 'Medium' ? 'badge-orange' : 'badge-green');
        html += `
            <div class="flex-align p-4 border-b hover:bg-gray-50 transition-colors animate-fade-in" id="task-row-${task.id}">
                <div class="flex-1">
                    <div class="font-medium text-sm">${task.title}</div>
                    <div class="text-xs text-muted mt-1">Priority: <span class="badge ${badgeColor}" style="padding: 2px 6px; font-size: 0.65rem;">${task.priority}</span></div>
                </div>
                <button class="btn btn-primary compact-btn text-xs" onclick="window.completeTask('${emp.id}', '${task.id}')" style="margin-left: 1rem;">
                    Completed
                </button>
            </div>
        `;
    });

    container.innerHTML = html;
};

window.completeTask = function (empId, taskId) {
    const emp = employees.find(e => e.id === empId);
    if (!emp) return;

    const task = emp.taskList.find(t => t.id === taskId);
    if (task && !task.completed) {
        task.completed = true;
        emp.completedTasks++;

        window.saveEmployees();

        // Update Dashboard Stats dynamically
        const assignedTasks = emp.assignedTasks || 0;
        const completedTasks = emp.completedTasks || 0;
        const ratingPct = assignedTasks > 0 ? ((completedTasks / assignedTasks) * 100).toFixed(1) : '0.0';

        if (getEl('dash-emp-rating')) getEl('dash-emp-rating').textContent = `${ratingPct}%`;
        if (getEl('dash-emp-task-counts')) getEl('dash-emp-task-counts').textContent = `${completedTasks} / ${assignedTasks} Tasks Completed`;

        // Remove task with animation
        const taskRow = getEl(`task-row-${taskId}`);
        if (taskRow) {
            taskRow.style.opacity = '0';
            taskRow.style.transform = 'translateY(10px)';
            taskRow.style.transition = 'all 0.3s ease';
            setTimeout(() => {
                window.renderEmployeeTasks(empId);
            }, 300);
        } else {
            window.renderEmployeeTasks(empId);
        }

        window.showToast('Task marked as completed!', 'success');

        if (window.renderEmployeeTable) window.renderEmployeeTable();
        if (window.updateDashboardStats) window.updateDashboardStats();
    }
};

window.showPayslipFromDashboard = function () {
    // This assumes the data is already in localStorage via initEmployeePortal
    const iframe = getEl('payslip-iframe');
    if (iframe) {
        iframe.src = 'payslip.html?t=' + Date.now();
    }
    getEl('payslip-modal')?.classList.remove('hidden');
    // Standardized 2px padding scaling
    setTimeout(() => window.autoScaleViewer('payslip-scaling-container', 'payslip-modal'), 50);
};

window.getPayrollStats = function (empId, year, month) {
    const monthStr = `${year}-${String(month + 1).padStart(2, '0')}`;
    const now = new Date();
    
    // 1. Get History
    const history = JSON.parse(localStorage.getItem(`pps-attendance-history-${empId}`) || '[]');
    const emp = employees.find(e => e.id === empId);
    
    // If no history exists, generate some sample data for stats calculation
    let currentMonthHistory = history.filter(r => r.date.startsWith(monthStr));
    if (currentMonthHistory.length === 0 && emp) {
        currentMonthHistory = window.generateSampleAttendanceData(emp, year, month);
    }
    
    let presentDays = 0;
    let absentDays = 0;
    let totalOvertimeMs = 0;

    currentMonthHistory.forEach(r => {
        if (r.status === 'Present' || r.status === 'Late') presentDays++;
        if (r.status === 'Absent') absentDays++;
        if (r.overtimeMs) totalOvertimeMs += r.overtimeMs;
    });

    // 2. Leave Requests Integration
    const leaves = JSON.parse(localStorage.getItem('pps-leave-requests') || '[]');
    const approvedMonthLeaves = leaves.filter(l => 
        l.empId === empId && 
        l.status === 'Approved' && 
        l.startDate.startsWith(monthStr)
    );
    
    const leaveDays = approvedMonthLeaves.length; 

    return {
        presentDays,
        absentDays,
        leaveDays,
        totalOvertimeMs,
        totalOvertimeHours: totalOvertimeMs / 3600000
    };
};

window.calculateSalaryBreakdown = function (emp, year, month) {
    const monthlySalary = emp.monthlySalary || 65000;
    
    // Use current month if not provided
    if (year === undefined || month === undefined) {
        const now = new Date();
        year = now.getFullYear();
        month = now.getMonth();
    }
    
    const stats = window.getPayrollStats(emp.id, year, month);
    
    const totalWorkingDays = 22; // Standard SaaS working month
    const perDaySalary = Math.round(monthlySalary / totalWorkingDays);
    const perHourSalary = Math.round(perDaySalary / 6); // 6-hour standard
    
    // Absent days deduction (Leave days are already factored out of present count)
    const leaveDeduction = stats.absentDays * perDaySalary;
    const overtimePay = Math.round(stats.totalOvertimeHours * perHourSalary * 1.5); // 1.5x Overtime Multiplier
    
    const gross = monthlySalary + overtimePay;
    const net = monthlySalary - leaveDeduction + overtimePay;

    return {
        monthlySalary,
        perDaySalary,
        perHourSalary,
        presentDays: stats.presentDays,
        absentDays: stats.absentDays,
        leaveDays: stats.leaveDays,
        overtimeHours: stats.totalOvertimeHours.toFixed(1),
        leaveDeduction,
        overtimePay,
        gross,
        net,
        // Compatibility fields
        basic: Math.round(monthlySalary * 0.5),
        hra: Math.round(monthlySalary * 0.2),
        special: Math.round(monthlySalary * 0.3),
        pf: Math.min(Math.round(monthlySalary * 0.12), 1800),
        pt: 200
    };
};

// --- Holiday Calendar Logic ---
window.currentCalendarDate = new Date(2026, 2, 1); // Start at March 2026
window.holidays = [
    { date: '2026-03-29', name: 'Holi Festival', type: 'Public' },
    { date: '2026-03-31', name: 'Eid-ul-Fitr', type: 'Public' },
    { date: '2026-04-10', name: 'Good Friday', type: 'Public' },
    { date: '2026-05-01', name: 'May Day', type: 'Public' },
    { date: '2026-08-15', name: 'Independence Day', type: 'National' },
    { date: '2026-10-02', name: 'Gandhi Jayanti', type: 'National' },
    { date: '2026-12-25', name: 'Christmas Day', type: 'Public' }
];

window.showHolidayCalendar = function () {
    const modal = getEl('holiday-modal');
    if (modal) {
        modal.classList.remove('hidden');
        window.renderCalendar(window.currentCalendarDate);
    }
};

window.changeCalendarMonth = function (delta) {
    window.currentCalendarDate.setMonth(window.currentCalendarDate.getMonth() + delta);
    window.renderCalendar(window.currentCalendarDate);
};

window.renderCalendar = function (date) {
    const month = date.getMonth();
    const year = date.getFullYear();

    // Update Header
    const monthName = date.toLocaleString('default', { month: 'long' });
    if (getEl('calendar-month-year')) getEl('calendar-month-year').textContent = `${monthName} ${year}`;

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const grid = getEl('calendar-days-grid');
    if (!grid) return;
    grid.innerHTML = '';

    // Empty cells for previous month
    for (let i = 0; i < firstDay; i++) {
        const div = document.createElement('div');
        div.className = 'calendar-day empty';
        grid.appendChild(div);
    }

    const today = new Date();
    const holidayListGroup = getEl('holiday-list-details');
    if (holidayListGroup) holidayListGroup.innerHTML = '';

    for (let d = 1; d <= daysInMonth; d++) {
        const div = document.createElement('div');
        div.className = 'calendar-day current-month';
        div.textContent = d;

        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
        const holiday = window.holidays.find(h => h.date === dateStr);

        if (holiday) {
            div.classList.add('is-holiday');
            div.title = holiday.name;

            // Add to side list
            if (holidayListGroup) {
                const item = document.createElement('div');
                item.className = 'holiday-item animate-fade-in';
                item.innerHTML = `
                    <div class="holiday-item-name">${holiday.name}</div>
                    <div class="holiday-item-date">${new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', weekday: 'long' })}</div>
                `;
                holidayListGroup.appendChild(item);
            }
        }

        if (today.getFullYear() === year && today.getMonth() === month && today.getDate() === d) {
            div.classList.add('is-today');
        }

        grid.appendChild(div);
    }

    if (holidayListGroup && holidayListGroup.innerHTML === '') {
        holidayListGroup.innerHTML = '<p class="text-xs text-muted">No holidays this month.</p>';
    }
};

window.closeModal = function (modalId) {
    const modal = getEl(modalId);
    if (modal) modal.classList.add('hidden');
};

// CHECKIN_KEY removed

window.simulateCheckIn = function () {
    const emp = (window._currentEmpId ? employees.find(e => e.id === window._currentEmpId) : null) 
        || employees.find(e => e.name === window.currentUser?.displayName) || employees[0];
    if (!emp) return;

    const now = new Date();
    const todayDateStr = now.toISOString().split('T')[0];
    const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Prevent duplicate punch-in if already punched out today
    const todayRecord = JSON.parse(localStorage.getItem(`pps-attendance-today-${emp.id}`) || 'null');
    if (todayRecord && todayRecord.date === todayDateStr && todayRecord.checkOut) {
        window.showToast('Already punched out for today. See you tomorrow!', 'info');
        return;
    }

    // If resuming (already punched in earlier today but refreshed page), don't reset
    const existingTimestamp = localStorage.getItem(`pps-checkin-timestamp-${emp.id}`);
    const existingDate = localStorage.getItem(`pps-checkin-date-${emp.id}`);
    if (existingTimestamp && existingDate === todayDateStr) {
        // Already have an active session — just resume timer
        if (getEl('btn-checkin')) getEl('btn-checkin').disabled = true;
        if (getEl('btn-checkout')) getEl('btn-checkout').disabled = false;
        window.startLiveTimer();
        window.showToast('Resuming active session...', 'info');
        return;
    }

    // Save session data
    localStorage.setItem(`pps-checkin-${emp.id}`, time);
    localStorage.setItem(`pps-checkin-timestamp-${emp.id}`, now.getTime().toString());
    localStorage.setItem(`pps-checkin-date-${emp.id}`, todayDateStr);
    // Reset accumulated time for fresh punch-in
    localStorage.setItem(`pps-accumulated-ms-${emp.id}`, '0');

    // Create today's attendance record
    const record = { date: todayDateStr, checkIn: time, checkOut: null, status: 'Present', workHours: '00:00:00' };
    localStorage.setItem(`pps-attendance-today-${emp.id}`, JSON.stringify(record));

    // Update UI
    if (getEl('btn-checkin')) getEl('btn-checkin').disabled = true;
    if (getEl('btn-checkout')) getEl('btn-checkout').disabled = false;
    if (getEl('live-checkin-time')) getEl('live-checkin-time').textContent = time;
    if (getEl('live-checkout-time')) getEl('live-checkout-time').textContent = '--:--';

    const timerEl = getEl('live-timer');
    if (timerEl) timerEl.textContent = '00:00:00';
    if (getEl('live-work-hours')) getEl('live-work-hours').textContent = '00:00:00';

    // Reset overtime indicator
    const otEl = getEl('overtime-indicator');
    if (otEl) otEl.style.display = 'none';
    const warnEl = getEl('punch-out-warning');
    if (warnEl) warnEl.style.display = 'block';

    window.startLiveTimer();
    window.renderEmployeeAttendanceHistory(emp);
    window.showToast('Punched in at ' + time, 'success');
};

window.simulateCheckOut = function () {
    const emp = (window._currentEmpId ? employees.find(e => e.id === window._currentEmpId) : null) 
        || employees.find(e => e.name === window.currentUser?.displayName) || employees[0];
    if (!emp) return;

    const now = new Date();
    const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const todayDateStr = now.toISOString().split('T')[0];

    // Calculate total work time
    const savedTime = localStorage.getItem(`pps-checkin-timestamp-${emp.id}`);
    const accumulatedMs = parseInt(localStorage.getItem(`pps-accumulated-ms-${emp.id}`) || '0');
    let totalMs = accumulatedMs;
    
    if (savedTime) {
        const startTimestamp = parseInt(savedTime);
        totalMs += Math.max(0, now.getTime() - startTimestamp);
    }

    const SIX_HOURS_MS = 6 * 60 * 60 * 1000; // 21600000

    // === 6-HOUR ENFORCEMENT ===
    if (totalMs < SIX_HOURS_MS) {
        const modal = document.getElementById('early-exit-block-modal');
        if (modal) {
            modal.classList.remove('hidden');
            modal.style.display = '';
        }
        window.showToast('You must complete 6 working hours or apply for leave.', 'error');
        return; // Block punch out
    }

    // Stop timer
    if (window.timerInterval) {
        clearInterval(window.timerInterval);
        window.timerInterval = null;
    }

    // Format total work hours
    const h = Math.floor(totalMs / 3600000);
    const m = Math.floor((totalMs % 3600000) / 60000);
    const s = Math.floor((totalMs % 60000) / 1000);
    const formattedTotal = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;

    // Calculate overtime
    let overtimeMs = 0;
    if (totalMs > SIX_HOURS_MS) {
        overtimeMs = totalMs - SIX_HOURS_MS;
        const otH = Math.floor(overtimeMs / 3600000);
        const otM = Math.floor((overtimeMs % 3600000) / 60000);
        const otLabel = getEl('overtime-label');
        if (otLabel) otLabel.textContent = `🎉 Overtime: ${otH}h ${otM}m`;
        const otEl = getEl('overtime-indicator');
        if (otEl) otEl.style.display = 'block';
    }

    // Update today's attendance record with checkout
    let todayRecord = JSON.parse(localStorage.getItem(`pps-attendance-today-${emp.id}`) || 'null');
    if (todayRecord && todayRecord.date === todayDateStr) {
        todayRecord.checkOut = time;
        todayRecord.workHours = formattedTotal;
        todayRecord.overtimeMs = overtimeMs; // Store for salary calculation integration
        
        // Mark as Late if checked in after 10:00 AM
        if (todayRecord.checkIn) {
            const parts = todayRecord.checkIn.match(/(\d+):(\d+)\s*(AM|PM)/i);
            if (parts) {
                let hr = parseInt(parts[1]);
                const ampm = parts[3].toUpperCase();
                if (ampm === 'PM' && hr !== 12) hr += 12;
                if (ampm === 'AM' && hr === 12) hr = 0;
                if (hr >= 10) todayRecord.status = 'Late';
            }
        }
        
        localStorage.setItem(`pps-attendance-today-${emp.id}`, JSON.stringify(todayRecord));

        // Save to persistent attendance history
        let history = JSON.parse(localStorage.getItem(`pps-attendance-history-${emp.id}`) || '[]');
        history = history.filter(r => r.date !== todayDateStr);
        history.unshift(todayRecord);
        localStorage.setItem(`pps-attendance-history-${emp.id}`, JSON.stringify(history));
    }

    // Store overtime separately
    if (overtimeMs > 0) {
        let otHistory = JSON.parse(localStorage.getItem(`pps-overtime-${emp.id}`) || '[]');
        otHistory = otHistory.filter(r => r.date !== todayDateStr);
        otHistory.push({ date: todayDateStr, overtimeMs: overtimeMs });
        localStorage.setItem(`pps-overtime-${emp.id}`, JSON.stringify(otHistory));
    }

    // Clear active session (but keep today record)
    localStorage.removeItem(`pps-checkin-${emp.id}`);
    localStorage.removeItem(`pps-checkin-timestamp-${emp.id}`);
    localStorage.removeItem(`pps-accumulated-ms-${emp.id}`);

    // Update UI
    if (getEl('btn-checkin')) getEl('btn-checkin').disabled = true; // Can't punch in again today
    if (getEl('btn-checkout')) getEl('btn-checkout').disabled = true;
    if (getEl('live-checkout-time')) getEl('live-checkout-time').textContent = time;
    const warnEl = getEl('punch-out-warning');
    if (warnEl) warnEl.style.display = 'none';

    const timerEl = getEl('live-timer');
    if (timerEl) timerEl.textContent = formattedTotal;
    if (getEl('live-work-hours')) getEl('live-work-hours').textContent = formattedTotal;

    window.renderEmployeeAttendanceHistory(emp);
    window.showToast(`Punched out at ${time}  |  Total: ${formattedTotal}`, 'info');
};

window.startLiveTimer = function () {
    const emp = (window._currentEmpId ? employees.find(e => e.id === window._currentEmpId) : null) 
        || employees.find(e => e.name === window.currentUser?.displayName) || employees[0];
    if (!emp) return;

    if (window.timerInterval) clearInterval(window.timerInterval);

    const savedTime = localStorage.getItem(`pps-checkin-timestamp-${emp.id}`);
    const startTimestamp = savedTime ? parseInt(savedTime) : Date.now();
    if (!savedTime) {
        localStorage.setItem(`pps-checkin-timestamp-${emp.id}`, startTimestamp.toString());
    }
    const accumulatedMs = parseInt(localStorage.getItem(`pps-accumulated-ms-${emp.id}`) || '0');

    const SIX_HOURS_MS = 21600000;

    const updateTimer = () => {
        const now = Date.now();
        const sessionMs = Math.max(0, now - startTimestamp);
        const totalMs = accumulatedMs + sessionMs;

        const h = Math.floor(totalMs / 3600000);
        const m = Math.floor((totalMs % 3600000) / 60000);
        const s = Math.floor((totalMs % 60000) / 1000);
        const formattedTime = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;

        const timerEl = getEl('live-timer');
        if (timerEl) timerEl.textContent = formattedTime;
        if (getEl('live-work-hours')) getEl('live-work-hours').textContent = formattedTime;

        // 6-Hour Progress Tracker
        if (getEl('att-req-text')) getEl('att-req-text').textContent = `Worked: ${h}h ${m}m`;
        const percentage = Math.min((totalMs / SIX_HOURS_MS) * 100, 100);
        const progressEl = getEl('att-req-progress');
        if (progressEl) {
            progressEl.style.width = `${percentage}%`;
            if (percentage >= 100) {
                progressEl.style.background = 'var(--green)';
                if (getEl('att-warn-text')) {
                    getEl('att-warn-text').textContent = '✅ Minimum 6 hours completed';
                    getEl('att-warn-text').className = 'text-xs text-green mt-2 text-center font-bold';
                }
                // Hide warning, show punch out is enabled
                const warnEl = getEl('punch-out-warning');
                if (warnEl) warnEl.style.display = 'none';
            } else {
                progressEl.style.background = 'var(--orange)';
                if (getEl('att-warn-text')) {
                    getEl('att-warn-text').textContent = 'You must complete 6 working hours today';
                    getEl('att-warn-text').className = 'text-xs text-muted mt-2 text-center';
                }
            }
        }

        // Overtime live display
        if (totalMs > SIX_HOURS_MS) {
            const otMs = totalMs - SIX_HOURS_MS;
            const otH = Math.floor(otMs / 3600000);
            const otM = Math.floor((otMs % 3600000) / 60000);
            const otLabel = getEl('overtime-label');
            if (otLabel) otLabel.textContent = `🎉 Overtime: ${otH}h ${otM}m`;
            const otEl = getEl('overtime-indicator');
            if (otEl) otEl.style.display = 'block';
        }

        // Update today's record live work hours for table
        const todayDateStr = new Date().toISOString().split('T')[0];
        let todayRecord = JSON.parse(localStorage.getItem(`pps-attendance-today-${emp.id}`) || 'null');
        if (todayRecord && todayRecord.date === todayDateStr && !todayRecord.checkOut) {
            todayRecord.workHours = formattedTime;
            localStorage.setItem(`pps-attendance-today-${emp.id}`, JSON.stringify(todayRecord));
        }
    };

    updateTimer();
    window.timerInterval = setInterval(updateTimer, 1000);
};

// --- Employee Attendance History with Sample Data ---
window.generateSampleAttendanceData = function (emp, year, month) {
    // Generate realistic attendance for past weekdays in the given month
    const data = [];
    const now = new Date();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    // Seed a simple hash from emp.id for consistent random per employee
    let seed = 0;
    for (let i = 0; i < emp.id.length; i++) seed += emp.id.charCodeAt(i);
    const seededRandom = (day) => {
        const x = Math.sin(seed * 9301 + day * 49297) * 49297;
        return x - Math.floor(x);
    };

    for (let d = 1; d <= daysInMonth; d++) {
        const date = new Date(year, month, d);
        // Skip weekends
        if (date.getDay() === 0 || date.getDay() === 6) continue;
        // Skip future dates
        if (date > now) continue;

        const dateStr = date.toISOString().split('T')[0];
        const rand = seededRandom(d);

        // ~85% Present, ~5% Late, ~10% Absent
        let status, checkIn, checkOut, workHours, overtimeMs = 0;
        if (rand < 0.10) {
            status = 'Absent';
            checkIn = '--:--';
            checkOut = '--:--';
            workHours = '00:00:00';
            overtimeMs = 0;
        } else if (rand < 0.15) {
            status = 'Late';
            // Late: 10:00-11:30 AM check-in
            const lateHr = 10 + Math.floor(seededRandom(d + 100) * 1.5);
            const lateMin = Math.floor(seededRandom(d + 200) * 59);
            checkIn = `${String(lateHr > 12 ? lateHr - 12 : lateHr).padStart(2, '0')}:${String(lateMin).padStart(2, '0')} ${lateHr >= 12 ? 'PM' : 'AM'}`;
            // Checkout: 6:00-7:30 PM
            const outHr = 18 + Math.floor(seededRandom(d + 300) * 1.5);
            const outMin = Math.floor(seededRandom(d + 400) * 59);
            checkOut = `${String(outHr > 12 ? outHr - 12 : outHr).padStart(2, '0')}:${String(outMin).padStart(2, '0')} PM`;
            const diffMs = (outHr * 60 + outMin - lateHr * 60 - lateMin) * 60000;
            const wh = Math.floor(diffMs / 3600000);
            const wm = Math.floor((diffMs % 3600000) / 60000);
            workHours = `${String(wh).padStart(2, '0')}:${String(wm).padStart(2, '0')}:00`;
            
            // 6-hour standard (21,600,000 ms)
            if (diffMs > 21600000) overtimeMs = diffMs - 21600000;
        } else {
            status = 'Present';
            // Normal: 8:45-9:45 AM check-in
            const inHr = 9;
            const inMin = Math.floor(seededRandom(d + 500) * 45);
            checkIn = `${String(inHr).padStart(2, '0')}:${String(inMin).padStart(2, '0')} AM`;
            // Checkout: 5:30-8:30 PM (Randomizing more overtime)
            const outHr = 17 + Math.floor(seededRandom(d + 600) * 3);
            const outMin = 30 + Math.floor(seededRandom(d + 700) * 29);
            checkOut = `${String(outHr > 12 ? outHr - 12 : outHr).padStart(2, '0')}:${String(outMin).padStart(2, '0')} PM`;
            const diffMs = (outHr * 60 + outMin - inHr * 60 - inMin) * 60000;
            const wh = Math.floor(diffMs / 3600000);
            const wm = Math.floor((diffMs % 3600000) / 60000);
            workHours = `${String(wh).padStart(2, '0')}:${String(wm).padStart(2, '0')}:00`;
            
            if (diffMs > 21600000) overtimeMs = diffMs - 21600000;
        }

        data.push({ date: dateStr, checkIn, checkOut, status, workHours, overtimeMs });
    }

    return data.reverse(); // Most recent first
};

window.renderEmployeeAttendanceHistory = function (emp) {
    if (!emp) return;
    const tbody = getEl('emp-attendance-history-body');
    if (!tbody) return;

    // Determine selected month from dropdown
    const monthSelect = document.querySelector('#employee-attendance .form-select');
    const now = new Date();
    let targetYear = now.getFullYear();
    let targetMonth = now.getMonth(); // 0-indexed

    if (monthSelect && monthSelect.value) {
        const parts = monthSelect.value.split('-');
        if (parts.length === 2) {
            targetYear = parseInt(parts[0]);
            targetMonth = parseInt(parts[1]);
        }
    }

    // Get persisted real records for this month
    const realHistory = JSON.parse(localStorage.getItem(`pps-attendance-history-${emp.id}`) || '[]');
    
    // Get sample data
    const sampleData = window.generateSampleAttendanceData(emp, targetYear, targetMonth);
    
    // Merge: real records override sample data for the same date
    const realDates = new Set(realHistory.map(r => r.date));
    const monthStr = `${targetYear}-${String(targetMonth + 1).padStart(2, '0')}`;
    const realForMonth = realHistory.filter(r => r.date.startsWith(monthStr));
    const sampleFiltered = sampleData.filter(r => !realDates.has(r.date));
    
    const allRecords = [...realForMonth, ...sampleFiltered];
    // Sort most recent first
    allRecords.sort((a, b) => b.date.localeCompare(a.date));

    // Add today's active session (if punched in but not out) at the top
    const todayDateStr = now.toISOString().split('T')[0];
    const todayRecord = JSON.parse(localStorage.getItem(`pps-attendance-today-${emp.id}`) || 'null');
    if (todayRecord && todayRecord.date === todayDateStr && todayDateStr.startsWith(monthStr)) {
        // Remove any existing today entry and prepend fresh one
        const filtered = allRecords.filter(r => r.date !== todayDateStr);
        filtered.unshift(todayRecord);
        allRecords.length = 0;
        allRecords.push(...filtered);
    }

    // Count stats
    let presentCount = 0, absentCount = 0, lateCount = 0;
    allRecords.forEach(r => {
        if (r.status === 'Present') presentCount++;
        else if (r.status === 'Absent') absentCount++;
        else if (r.status === 'Late') lateCount++;
    });

    // Update stat cards
    if (getEl('emp-att-present')) getEl('emp-att-present').textContent = presentCount;
    if (getEl('emp-att-absent')) getEl('emp-att-absent').textContent = absentCount;
    if (getEl('emp-att-late')) getEl('emp-att-late').textContent = lateCount;
    const total = presentCount + absentCount + lateCount;
    const score = total > 0 ? (((presentCount + lateCount) / total) * 100).toFixed(1) : '0.0';
    if (getEl('emp-att-score')) getEl('emp-att-score').textContent = score + '%';

    // Render table rows
    if (allRecords.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="text-center text-muted py-4">No attendance records for this month.</td></tr>';
        return;
    }

    tbody.innerHTML = allRecords.map(r => {
        const dateObj = new Date(r.date + 'T00:00:00');
        const dateDisplay = dateObj.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
        const isToday = r.date === todayDateStr;

        let badgeClass = 'badge-green';
        if (r.status === 'Absent') badgeClass = 'badge-red';
        else if (r.status === 'Late') badgeClass = 'badge-orange';

        // Format Overtime Display
        let otDisplay = '--:--';
        if (r.overtimeMs && r.overtimeMs > 0) {
            const oh = Math.floor(r.overtimeMs / 3600000);
            const om = Math.floor((r.overtimeMs % 3600000) / 60000);
            otDisplay = `<span class="text-green font-bold">+${oh}h ${om}m</span>`;
        }

        return `<tr${isToday ? ' style="background: rgba(59,130,246,0.04);"' : ''}>
            <td>${dateDisplay}${isToday ? ' <span class="badge badge-blue" style="font-size:0.6rem;padding:1px 5px;">TODAY</span>' : ''}</td>
            <td>${r.checkIn || '--:--'}</td>
            <td>${r.checkOut || '--:--'}</td>
            <td><span class="badge ${badgeClass}">${r.status}</span></td>
            <td>${r.workHours || '00:00:00'}</td>
            <td>${otDisplay}</td>
        </tr>`;
    }).join('');
};

window.simulateLeaveSubmit = function (event) {
    if (event) event.preventDefault();
    const type = document.querySelector('#employee-leave select')?.value || 'Casual';
    const start = document.querySelectorAll('#employee-leave input[type="date"]')[0]?.value;
    const end = document.querySelectorAll('#employee-leave input[type="date"]')[1]?.value;

    if (!start || !end) {
        alert('Please select both start and end dates.');
        return;
    }

    const tbody = getEl('emp-leave-history-body');
    if (tbody) {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td class="font-medium text-xs">${type}</td>
            <td class="text-xs">${start} - ${end}</td>
            <td><span class="badge badge-orange">Pending</span></td>
        `;
        tbody.prepend(tr);
    }

    alert(`Leave request for ${type} (${start} to ${end}) submitted successfully!`);
};

// Event Listeners for Employee Portal
document.addEventListener('DOMContentLoaded', () => {
    const leaveForm = getEl('emp-leave-form');
    if (leaveForm) {
        leaveForm.addEventListener('submit', (e) => window.simulateLeaveSubmit(e));
    }
});

window.showView = function (viewId) {
    // 1. Basic Visibility Toggle
    queryAll('.view-section').forEach(s => s.style.display = 'none');

    // 2. Global Modal & Dropdown Cleanup (Fixes overlapping)
    queryAll('.modal-overlay').forEach(m => m.classList.add('hidden'));
    queryAll('.dropdown-menu').forEach(d => d.classList.add('hidden'));

    const target = getEl(viewId);
    if (target) {
        target.style.display = 'flex';
    } else {
        const fallback = (window.currentUser && window.currentUser.role === 'admin') ? 'admin-overview' : 'employee-overview';
        const fSection = getEl(fallback);
        if (fSection) fSection.style.display = 'flex';
    }

    // 3. UI State Cleanup
    queryAll('.sidebar-link').forEach(link => {
        link.classList.toggle('active', link.getAttribute('data-target') === viewId);
    });

    if (viewId === 'admin-overview') {
        const welcome = getEl('welcome-user');
        if (welcome) welcome.textContent = (window.currentUser && window.currentUser.displayName) || 'Admin';

        // Update Dashboard Stats
        const dashTotalEmp = getEl('dash-total-emp');
        const dashPresent = getEl('dash-present-today');
        const dashPresenceTotal = document.querySelector('.stat-presence-total');

        if (dashTotalEmp) dashTotalEmp.textContent = employees.length;
        if (dashPresent) dashPresent.textContent = employees.length; // Assume all present for now
        if (dashPresenceTotal) dashPresenceTotal.textContent = `/ ${employees.length} total`;

        setTimeout(() => { if (window.initPayrollChart) window.initPayrollChart(); }, 50);
    }

    if (viewId === 'admin-attendance') {
        if (window.initAttendanceModule) window.initAttendanceModule();
    } else if (viewId === 'admin-payroll') {
        if (window.renderPayrollTable) window.renderPayrollTable();
    } else if (viewId === 'admin-leave') {
        if (window.initAdminLeaveModule) window.initAdminLeaveModule();
    }

    if (viewId === 'shared-settings') {
        const profileName = getEl('profile-name-input');
        const profileEmail = getEl('profile-email-input');
        const companyName = getEl('setting-company-name');
        const companyAddress = getEl('setting-company-address');

        if (profileName) profileName.value = localStorage.getItem('pps-profile-name') || (window.currentUser?.displayName || 'Admin User');
        if (profileEmail) profileEmail.value = localStorage.getItem('pps-profile-email') || 'admin@pps.com';
        if (companyName) companyName.value = localStorage.getItem('pps-company-name') || 'XYZ Private Limited';
        if (companyAddress) companyAddress.value = localStorage.getItem('pps-company-address') || '123 Tech Hub, HITEC City, Hyderabad, 500081';
    }

    // 4. Scroll Reset
    const dashContent = getEl('dashboard-content');
    if (dashContent) {
        dashContent.scrollTo({ top: 0, behavior: 'auto' });
    }
};

window.saveProfileSettings = function () {
    const name = getEl('profile-name-input')?.value;
    const email = getEl('profile-email-input')?.value;
    if (name) localStorage.setItem('pps-profile-name', name);
    if (email) localStorage.setItem('pps-profile-email', email);
    alert('Profile information saved successfully!');
};

window.saveCompanySettings = function () {
    const name = getEl('setting-company-name')?.value;
    const address = getEl('setting-company-address')?.value;
    if (name) localStorage.setItem('pps-company-name', name);
    if (address) localStorage.setItem('pps-company-address', address);
    alert('Company information saved successfully!');
};

// --- Global Employee Rendering Functions (must be at top-level to avoid TypeError on init) ---
window.renderEmployeeTable = function () {
    const employeeTableBody = getEl('employee-table-body');
    if (!employeeTableBody) return;
    employeeTableBody.innerHTML = '';
    employees.forEach(emp => {
        const initials = emp.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
        const statusClasses = { 'Active': 'badge-green', 'On Leave': 'badge-orange', 'Inactive': 'badge-red' };
        const badgeClass = statusClasses[emp.status] || 'badge-green';

        const assigned = emp.assignedTasks || 0;
        const completed = emp.completedTasks || 0;
        const perfPct = assigned > 0 ? ((completed / assigned) * 100).toFixed(1) : '0.0';
        const perfColor = perfPct >= 90 ? 'text-green' : (perfPct >= 70 ? 'text-blue' : 'text-orange');

        const tr = document.createElement('tr');
        tr.setAttribute('data-id', emp.id);
        tr.innerHTML = `
            <td data-label="Employee ID"><span class="emp-id">${emp.id}</span></td>
            <td data-label="Name" class="name-cell">
                <div style="display: flex; align-items: center; gap: 12px;">
                    <div class="avatar-sm" style="background: var(--primary-light); color: var(--primary);">${initials}</div>
                    <div>
                        <div class="font-medium">${emp.name}</div>
                        <div class="text-xs text-muted email">${emp.email}</div>
                    </div>
                </div>
            </td>
            <td data-label="Role">${emp.role}</td>
            <td data-label="Department">${emp.dept}</td>
            <td data-label="Status"><span class="badge ${badgeClass}">${emp.status}</span></td>
            <td data-label="Tasks">
                <span class="text-xs font-bold">${completed}/${assigned}</span>
            </td>
            <td data-label="Manage">
                <button class="btn btn-primary compact-btn text-xs" onclick="window.showTaskManagementModal('${emp.id}')" style="padding: 3px 8px;">Manage</button>
            </td>
            <td data-label="Rating">
                <span class="text-xs ${perfColor} font-bold">${perfPct}%</span>
            </td>
            <td data-label="CTC">
                <span class="font-medium">₹${(emp.ctc / 100000).toFixed(2)} LPA</span>
            </td>
            <td data-label="CTC Breakdown">
                <button class="btn btn-outline compact-btn text-xs ctc-button" onclick="window.showCTCBreakdown('${emp.id}')">CTC Breakdown</button>
            </td>
            <td>
                <div style="display: flex; gap: 0.5rem;" class="action-buttons-cell">
                    <button class="icon-btn edit-btn" data-action="edit-employee" data-id="${emp.id}" aria-label="Edit"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg></button>
                    <button class="icon-btn text-red delete-btn" data-action="delete-employee" data-id="${emp.id}" aria-label="Delete"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg></button>
                </div>
            </td>
        `;
        employeeTableBody.appendChild(tr);
    });
};

window.updateDashboardStats = function () {
    if (!getEl('admin-overview') || getEl('admin-overview').style.display === 'none') return;

    const totalEmp = employees.length;
    const activeEmp = employees.filter(e => e.status === 'Active').length;
    const avgScore = totalEmp > 0 ? (employees.reduce((acc, emp) => acc + parseFloat(calculateAttPercentage ? calculateAttPercentage(emp) : 100), 0) / totalEmp).toFixed(1) : '0.0';

    const totalCard = document.getElementById('dash-total-emp');
    const presentCard = document.getElementById('dash-present-today');
    const scoreCard = document.getElementById('dash-att-score');
    const presenceTotal = document.querySelector('.stat-presence-total');

    if (totalCard) totalCard.textContent = totalEmp;
    if (presentCard) presentCard.textContent = activeEmp;
    if (scoreCard) scoreCard.textContent = avgScore + '%';
    if (presenceTotal) presenceTotal.textContent = `/ ${totalEmp} total`;
};

window.getNextId = function () {
    if (employees.length === 0) return 'PPS001';
    const ids = employees.map(e => parseInt(e.id.replace('PPS', '')) || 0);
    const max = Math.max(...ids);
    return `PPS${String(max + 1).padStart(3, '0')}`;
};

window.getNextLeaveTypeId = function () {
    if (leaveTypes.length === 0) return 'LT001';
    const ids = leaveTypes.map(lt => parseInt(lt.id.replace('LT', '')) || 0);
    const max = Math.max(...ids);
    return `LT${String(max + 1).padStart(3, '0')}`;
};

window.showAddEmployeeModal = function () {
    const employeeModal = getEl('employee-modal');
    const addEmployeeForm = getEl('add-employee-form');
    const editEmpIdInput = getEl('edit-emp-index');
    const modalTitleEl = getEl('employee-modal-title');
    const nextEmpIdDisplay = getEl('next-emp-id');

    if (addEmployeeForm) addEmployeeForm.reset();
    if (editEmpIdInput) editEmpIdInput.value = '';
    if (modalTitleEl) modalTitleEl.textContent = 'Add New Employee';
    if (getEl('emp-id-label')) getEl('emp-id-label').textContent = 'Assigning ID:';
    if (nextEmpIdDisplay) nextEmpIdDisplay.textContent = window.getNextId();
    if (employeeModal) employeeModal.classList.remove('hidden');
};

window.editEmployee = function (id) {
    const emp = employees.find(e => e.id === id);
    if (!emp) return;

    const employeeModal = getEl('employee-modal');
    const editEmpIdInput = getEl('edit-emp-index');
    const modalTitleEl = getEl('employee-modal-title');
    const nextEmpIdDisplay = getEl('next-emp-id');

    if (modalTitleEl) modalTitleEl.textContent = 'Edit Employee';
    if (getEl('emp-id-label')) getEl('emp-id-label').textContent = 'Assigned ID:';
    if (nextEmpIdDisplay) nextEmpIdDisplay.textContent = id;
    if (editEmpIdInput) editEmpIdInput.value = id;

    if (getEl('new-emp-name')) getEl('new-emp-name').value = emp.name;
    if (getEl('new-emp-email')) getEl('new-emp-email').value = emp.email;
    if (getEl('new-emp-role')) getEl('new-emp-role').value = emp.role;
    if (getEl('new-emp-dept')) getEl('new-emp-dept').value = emp.dept;
    if (getEl('new-emp-status')) getEl('new-emp-status').value = emp.status;
    if (getEl('new-emp-ctc')) getEl('new-emp-ctc').value = emp.ctc;

    if (employeeModal) employeeModal.classList.remove('hidden');
};

let rowToDelete = null;
window.confirmDeleteEmployee = function (id) {
    rowToDelete = id;
    const deleteModal = getEl('delete-modal');
    if (deleteModal) deleteModal.classList.remove('hidden');
};

window.updatePayrollAnalytics = function () {
    const bars = document.querySelectorAll('.css-bar');
    const values = [];

    bars.forEach(bar => {
        const amountText = bar.getAttribute('data-amount') || '';
        const match = amountText.replace(/[^\d.]/g, '');
        if (match) values.push(parseFloat(match));
    });

    if (values.length === 0) return;

    const sum = values.reduce((a, b) => a + b, 0);
    const avg = sum / values.length;

    let totalGrowth = 0;
    let growthCount = 0;
    for (let i = 1; i < values.length; i++) {
        totalGrowth += (values[i] - values[i - 1]);
        growthCount++;
    }
    const avgGrowth = growthCount > 0 ? totalGrowth / growthCount : 0;
    const projected = values[values.length - 1] + avgGrowth;

    const avgEl = document.getElementById('payroll-avg');
    const projEl = document.getElementById('payroll-proj');
    const trendIcon = document.getElementById('payroll-trend-icon');

    const curr = localStorage.getItem('pps-currency') || 'INR';
    const sym = { INR: '₹', USD: '$', EUR: '€', GBP: '£' }[curr] || '₹';
    const suffix = curr === 'INR' ? 'L' : 'k';

    if (avgEl) avgEl.textContent = `${sym}${avg.toFixed(1)}${suffix}`;
    if (projEl) projEl.textContent = `${sym}${projected.toFixed(1)}${suffix}`;

    if (trendIcon) {
        trendIcon.className = `trend-indicator ${avgGrowth >= 0 ? 'trend-up' : 'trend-down'}`;
        trendIcon.style.transform = avgGrowth >= 0 ? 'rotate(0deg)' : 'rotate(180deg)';
    }
};

// --- Initialization ---
function initApp() {
    try {
        window.loadEmployees();
        window.loadPayrolls();
        window.initPayrollModule();
        window.initAttendanceModule();
    } catch (err) {
        console.error('Initialization Error:', err);
    }

    const menuToggle = document.querySelector('.menu-toggle');
    const header = document.querySelector('.header');
    const modal = getEl('role-modal');
    const roleBtns = queryAll('.role-card[data-role]');

    // UI Selectors (auth)
    const authTitle = getEl('auth-title');
    const authSubmitBtn = getEl('auth-submit-btn');

    // Employee Management DOM refs & state
    const addEmployeeBtn = getEl('add-employee-btn');
    const cancelEmployeeBtn = getEl('cancel-employee-btn');
    const employeeModal = getEl('employee-modal');
    const addEmployeeForm = getEl('add-employee-form');
    const editEmpIndexInput = getEl('edit-emp-index');
    const modalTitleEl = getEl('modal-title');
    const nextEmpIdDisplay = getEl('next-emp-id');
    const employeeSearch = getEl('employee-search');
    const employeeTableBody = getEl('employee-table-body');
    const deleteModal = getEl('delete-modal');
    const confirmDeleteBtn = getEl('confirm-delete-btn');
    const cancelDeleteBtn = getEl('cancel-delete-btn');
    let rowToDelete = null;
    let isEditing = false;
    let editRow = null;

    // Mobile Nav Construction
    if (header && menuToggle) {
        let mobileNav = document.querySelector('.mobile-nav');
        if (!mobileNav) {
            mobileNav = document.createElement('nav');
            mobileNav.className = 'mobile-nav';
            mobileNav.innerHTML = `
                <a href="#features" class="nav-link">Features</a>
                <a href="#pricing" class="nav-link">Pricing</a>
                <a href="#about" class="nav-link">About</a>
                <button class="nav-link open-modal" id="mobile-signin-btn" style="padding-top: 1rem; border: none; background: transparent; text-align: left; width: 100%; font-family: inherit; font-size: inherit; cursor: pointer;">Sign In</button>
            `;
            header.appendChild(mobileNav);
        }

        menuToggle.onclick = () => {
            mobileNav.classList.toggle('is-open');
            const isOpen = mobileNav.classList.contains('is-open');
            menuToggle.innerHTML = isOpen
                ? '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>'
                : '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>';
        };
    }

    // Role Modal - Re-query to include dynamic buttons
    // Robust Modal Triggers using Event Delegation
    document.addEventListener('click', (e) => {
        const openBtn = e.target.closest('.open-modal');
        if (openBtn) {
            e.preventDefault();
            const targetModal = getEl('role-modal');
            if (targetModal) targetModal.classList.remove('hidden');
        }

        // Close modal if clicking overlay
        if (e.target.id === 'role-modal') {
            e.target.classList.add('hidden');
        }

        // Role Selection Handling
        const roleBtn = e.target.closest('.role-card[data-role]');
        if (roleBtn) {
            e.preventDefault();
            const role = roleBtn.getAttribute('data-role');
            if (role) showAuthView(role);
        }
    });

    function hydrateCredentials(role) {
        if (getEl('email')) getEl('email').value = '';
        if (getEl('admin-user')) getEl('admin-user').value = '';
        if (getEl('employee-name')) getEl('employee-name').value = '';
        if (getEl('remember-me')) getEl('remember-me').checked = false;

        const creds = window.AuthStorage.getCredentials(role);

        if (creds.email) {
            if (getEl('email')) getEl('email').value = creds.email;
            if (getEl('remember-me')) getEl('remember-me').checked = true;
        }
        if (creds.name) {
            if (role === 'employee') {
                if (getEl('employee-name')) getEl('employee-name').value = creds.name;
            } else {
                if (getEl('admin-user')) getEl('admin-user').value = creds.name;
            }
        }
    }

    function showAuthView(role) {
        const authView = getEl('auth-view');
        const adminGroup = getEl('admin-user-group');
        const empGroup = getEl('employee-name-group');
        const authSubtitle = document.querySelector('.auth-subtitle');
        const authSubmitBtn = getEl('auth-submit-btn');

        if (role === 'employee') {
            if (authTitle) authTitle.textContent = 'Employee Sign In';
            if (authSubtitle) authSubtitle.textContent = 'Welcome back! Sign in to view your payslips.';
            if (authSubmitBtn) authSubmitBtn.textContent = 'Sign In as Employee';
            if (adminGroup) adminGroup.style.display = 'none';
            if (empGroup) empGroup.style.display = 'flex';
            if (authView) authView.setAttribute('data-current-role', 'employee');
        } else {
            if (authTitle) authTitle.textContent = 'Admin Sign In';
            if (authSubtitle) authSubtitle.textContent = 'Access your account to manage payroll.';
            if (authSubmitBtn) authSubmitBtn.textContent = 'Sign In as Administrator';
            if (adminGroup) adminGroup.style.display = 'flex';
            if (empGroup) empGroup.style.display = 'none';
            if (authView) authView.setAttribute('data-current-role', 'admin');
        }

        if (modal) modal.classList.add('hidden');
        const views = ['landing-view', 'dashboard-view', 'auth-view'];
        views.forEach(v => { const el = getEl(v); if (el) el.style.display = (v === 'auth-view' ? 'flex' : 'none'); });
        document.body.classList.add('auth-active');
        hydrateCredentials(role);
        window.scrollTo(0, 0);
    }

    // Auth Submission
    function handleAuthSubmit() {
        const authView = getEl('auth-view');
        const role = authView ? (authView.getAttribute('data-current-role') || 'admin') : 'admin';
        const email = getEl('email')?.value.trim();
        const password = getEl('password')?.value.trim();
        const rememberMe = getEl('remember-me')?.checked;

        let name = '';
        if (role === 'employee') {
            name = getEl('employee-name')?.value.trim();
        } else {
            name = getEl('admin-user')?.value.trim();
        }

        // Strict Validation
        if (!name || !email || !password) {
            alert('Please fill in all fields to sign in.');
            return;
        }

        // Remember Me Logic
        if (rememberMe) {
            window.AuthStorage.saveCredentials(role, name, email);
        } else {
            window.AuthStorage.clearCredentials(role);
        }

        window.loadEmployees();
        window.loadPayrolls();
        localStorage.setItem('pps-role', role);
        window.showDashboardView(role, name);
        // Clear password for security
        if (getEl('password')) getEl('password').value = '';
    }

    if (authSubmitBtn) authSubmitBtn.addEventListener('click', (e) => { e.preventDefault(); handleAuthSubmit(); });
    const authForm = document.querySelector('.auth-form-body');
    if (authForm) authForm.addEventListener('submit', (e) => { e.preventDefault(); handleAuthSubmit(); });

    // Sidebar Links
    queryAll('.sidebar-link[data-target]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('data-target');
            if (targetId) window.showView(targetId);
            const sidebar = document.querySelector('.sidebar');
            if (sidebar) sidebar.classList.remove('open');
        });
    });

    const mobileSidebarToggle = getEl('mobile-sidebar-toggle');
    if (mobileSidebarToggle) {
        mobileSidebarToggle.addEventListener('click', () => {
            const sidebar = document.querySelector('.sidebar');
            if (sidebar) sidebar.classList.toggle('open');
        });
    }

    // --- Employee Management Event Listeners ---
    // (renderEmployeeTable, updateDashboardStats, getNextId, showAddEmployeeModal are now global)

    // --- Enhanced Listener Setup ---
    if (addEmployeeBtn) {
        addEmployeeBtn.addEventListener('click', (e) => {
            console.log('Add Employee clicked');
            window.showAddEmployeeModal();
        });
    }

    const addLeaveTypeBtn = getEl('add-leave-type-btn');
    if (addLeaveTypeBtn) {
        addLeaveTypeBtn.addEventListener('click', (e) => {
            console.log('Add Leave Type clicked');
            window.showAddLeaveTypeModal();
        });
    }

    // Event Delegation for Tables
    if (employeeTableBody) {
        employeeTableBody.addEventListener('click', (e) => {
            const btn = e.target.closest('button[data-action]');
            if (!btn) return;
            const action = btn.getAttribute('data-action');
            const id = btn.getAttribute('data-id');
            console.log(`Employee Table Action: ${action} for ID: ${id}`);

            if (action === 'edit-employee') window.editEmployee(id);
            if (action === 'delete-employee') window.confirmDeleteEmployee(id);
        });
    }

    const leaveTypeTableBody = getEl('admin-leave-types-body');
    if (leaveTypeTableBody) {
        leaveTypeTableBody.addEventListener('click', (e) => {
            const btn = e.target.closest('button[data-action]');
            if (!btn) return;
            const action = btn.getAttribute('data-action');
            const id = btn.getAttribute('data-id');
            console.log(`Leave Type Table Action: ${action} for ID: ${id}`);

            if (action === 'edit-leave-type') window.showAddLeaveTypeModal(id);
            if (action === 'delete-leave-type') window.deleteLeaveType(id);
        });
    }

    if (confirmDeleteBtn) {
        confirmDeleteBtn.addEventListener('click', () => {
            if (rowToDelete) {
                employees = employees.filter(e => e.id !== rowToDelete);
                window.saveEmployees();
                rowToDelete = null;
                if (window.showToast) window.showToast('Employee deleted successfully.', 'success');
            }
            if (deleteModal) deleteModal.classList.add('hidden');
        });
    }

    if (cancelDeleteBtn) cancelDeleteBtn.addEventListener('click', () => { if (deleteModal) deleteModal.classList.add('hidden'); });
    if (deleteModal) deleteModal.addEventListener('click', (e) => { if (e.target === deleteModal) deleteModal.classList.add('hidden'); });

    if (addEmployeeForm) {
        addEmployeeForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = getEl('new-emp-name').value.trim();
            const email = getEl('new-emp-email').value.trim();
            const role = getEl('new-emp-role').value.trim();
            const department = getEl('new-emp-dept').value;
            const status = getEl('new-emp-status').value;
            const ctc = parseInt(getEl('new-emp-ctc').value) || 0;
            const editId = editEmpIndexInput ? editEmpIndexInput.value : '';

            if (editId) {
                const index = employees.findIndex(e => e.id === editId);
                if (index !== -1) {
                    employees[index] = { ...employees[index], name, email, role, dept: department, status, ctc, monthlySalary: Math.round(ctc / 12 / 1.15) };
                    if (window.showToast) window.showToast('Employee updated successfully.', 'success');
                }
            } else {
                const newEmp = {
                    id: window.getNextId(),
                    name, email, role, dept: department, status, ctc,
                    monthlySalary: Math.round(ctc / 12 / 1.15),
                    dailyWage: Math.round(ctc / 12 / 30),
                    present: 22, absent: 0, halfDay: 0, paidLeave: 0, unpaidLeave: 0, sickLeave: 0, wfh: 0, totalWorking: 26, holidays: 4,
                    assignedTasks: 0, completedTasks: 0, taskList: []
                };
                employees.unshift(newEmp);
                if (window.showToast) window.showToast('Employee added successfully.', 'success');
            }

            window.saveEmployees();
            if (employeeModal) employeeModal.classList.add('hidden');
            addEmployeeForm.reset();
            isEditing = false;
        });
    }

    const assignTaskForm = getEl('assign-task-form');
    if (assignTaskForm) {
        assignTaskForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const empId = getEl('task-assign-emp-id').value;
            const title = getEl('new-task-title').value.trim();
            const desc = getEl('new-task-desc').value.trim();
            const priority = getEl('new-task-priority').value;

            const emp = employees.find(e => e.id === empId);
            if (!emp) return;

            if (!emp.taskList) emp.taskList = [];
            if (emp.assignedTasks === undefined) emp.assignedTasks = 0;

            const newTask = {
                id: 'task_' + Date.now(),
                title: title,
                desc: desc,
                priority: priority,
                completed: false
            };

            emp.taskList.push(newTask);
            emp.assignedTasks++;
            window.saveEmployees();

            assignTaskForm.reset();
            getEl('task-assign-emp-id').value = empId; // retain context across submissions

            window.renderAdminTaskList(empId);
            window.renderEmployeeTable();
            window.showToast('Task assigned successfully!', 'success');
        });
    }

    if (employeeSearch) {
        employeeSearch.addEventListener('input', () => {
            const query = employeeSearch.value.toLowerCase();
            const rows = employeeTableBody.querySelectorAll('tr');
            rows.forEach(row => {
                row.style.display = row.textContent.toLowerCase().includes(query) ? '' : 'none';
            });
        });
    }

    const employeeSort = getEl('employee-sort');
    if (employeeSort) {
        employeeSort.addEventListener('change', () => {
            const criteria = employeeSort.value;
            if (criteria === 'none') return;

            employees.sort((a, b) => {
                const getPerf = (emp) => (emp.assignedTasks > 0 ? (emp.completedTasks / emp.assignedTasks) : 0);

                switch (criteria) {
                    case 'id-asc':
                        return a.id.localeCompare(b.id, undefined, { numeric: true });
                    case 'id-desc':
                        return b.id.localeCompare(a.id, undefined, { numeric: true });
                    case 'name-asc':
                        return a.name.localeCompare(b.name);
                    case 'name-desc':
                        return b.name.localeCompare(a.name);
                    case 'rating-desc':
                        return getPerf(b) - getPerf(a);
                    case 'rating-asc':
                        return getPerf(a) - getPerf(b);
                    case 'ctc-asc':
                        return (a.ctc || 0) - (b.ctc || 0);
                    case 'ctc-desc':
                        return (b.ctc || 0) - (a.ctc || 0);
                    default:
                        return 0;
                }
            });
            window.renderEmployeeTable();
        });
    }

    // --- LOGOTYPE NAVIGATION FIX ---
    document.querySelectorAll('.logo').forEach(logo => {
        logo.addEventListener('click', (e) => window.handleDashboardLogoClick(e));
    });

    window.refreshAllTables();
    window.updateDashboardStats();
    window.updatePayrollAnalytics();

    // Theme Toggle
    const themeToggleBtn = getEl('theme-toggle');
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', (e) => {
            const current = document.documentElement.getAttribute('data-theme') || 'light';
            const newTheme = current === 'dark' ? 'light' : 'dark';
            window.setTheme(newTheme, e);
        });
    }

    // --- ISSUE 1 FIX: Wire up Logout Button (Top-Right) ---
    const logoutBtn = getEl('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.handleLogout();
        });
    }

    // Wire all sidebar .btn-logout links to use confirmation flow
    document.querySelectorAll('.btn-logout').forEach(link => {
        link.removeAttribute('onclick'); // Remove legacy inline handler
        link.addEventListener('click', (e) => {
            e.preventDefault();
            window.handleLogout();
        });
    });

    // Preferences
    window.savePreferences = () => {
        const curr = getEl('setting-currency')?.value || 'INR';
        const lang = getEl('setting-language')?.value || 'en';
        localStorage.setItem('pps-currency', curr);
        localStorage.setItem('pps-lang', lang);
        applyCurrency(curr);
        const btn = document.querySelector('[onclick="savePreferences()"]');
        if (btn) {
            const orig = btn.textContent; btn.textContent = '✓ Saved!'; btn.style.background = '#10b981';
            setTimeout(() => { btn.textContent = orig; btn.style.background = ''; }, 2000);
        }
    };

    const applyCurrency = (curr) => {
        const sym = { INR: '₹', USD: '$', EUR: '€', GBP: '£' }[curr] || '₹';
        const val = { INR: '35.8L', USD: '42.9k', EUR: '39.5k', GBP: '33.8k' }[curr] || '35.8L';
        const el = getEl('monthly-payroll-val');
        if (el) el.textContent = sym + val;
    };
    applyCurrency(localStorage.getItem('pps-currency') || 'INR');

    // --- Payroll Analytics ---
    window.updatePayrollAnalytics = function () {
        const bars = document.querySelectorAll('.css-bar');
        const values = [];

        bars.forEach(bar => {
            const amountText = bar.getAttribute('data-amount') || '';
            // Robust parsing for ₹28.4L or $33.2k
            const match = amountText.replace(/[^\d.]/g, '');
            if (match) values.push(parseFloat(match));
        });

        if (values.length === 0) {
            console.log('No analytic bars found/parsed.');
            return;
        }

        // 1. Calculate Average
        const sum = values.reduce((a, b) => a + b, 0);
        const avg = sum / values.length;

        // 2. Calculate Projection (Linear Trend)
        // Simple trend: average monthly growth
        let totalGrowth = 0;
        let growthCount = 0;
        for (let i = 1; i < values.length; i++) {
            totalGrowth += (values[i] - values[i - 1]);
            growthCount++;
        }
        const avgGrowth = growthCount > 0 ? totalGrowth / growthCount : 0;
        const projected = values[values.length - 1] + avgGrowth;

        // 3. Update UI
        const avgEl = document.getElementById('payroll-avg');
        const projEl = document.getElementById('payroll-proj');
        const trendIcon = document.getElementById('payroll-trend-icon');

        const curr = localStorage.getItem('pps-currency') || 'INR';
        const sym = { INR: '₹', USD: '$', EUR: '€', GBP: '£' }[curr] || '₹';
        const suffix = curr === 'INR' ? 'L' : 'k';

        if (avgEl) avgEl.textContent = `${sym}${avg.toFixed(1)}${suffix}`;
        if (projEl) projEl.textContent = `${sym}${projected.toFixed(1)}${suffix}`;

        if (trendIcon) {
            trendIcon.className = `trend-indicator ${avgGrowth >= 0 ? 'trend-up' : 'trend-down'}`;
            trendIcon.style.transform = avgGrowth >= 0 ? 'rotate(0deg)' : 'rotate(180deg)';
        }
    };

    updatePayrollAnalytics();

    // --- Dynamic Dashboard Date ---
    function updateDashboardDate() {
        const now = new Date();
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const dateString = now.toLocaleDateString('en-IN', options);

        // Populate the new inline date text spans
        const adminDateText = document.getElementById('dashboard-date-admin-text');
        if (adminDateText) adminDateText.textContent = dateString;

        const emplDate = document.getElementById('dashboard-date-empl');
        if (emplDate) emplDate.textContent = dateString;

        // Legacy header date element (if still present)
        const headerDate = document.getElementById('current-header-date');
        if (headerDate) headerDate.textContent = dateString;
    }
    updateDashboardDate();

    // --- Mobile Sidebar Toggle ---
    const sidebar = document.querySelector('.sidebar');
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const sidebarOverlay = document.getElementById('sidebar-overlay');
    const sidebarLinks = document.querySelectorAll('.sidebar-link');

    if (sidebarToggle && sidebar && sidebarOverlay) {
        sidebarToggle.addEventListener('click', () => {
            sidebar.classList.toggle('open');
            sidebarOverlay.classList.toggle('active');
        });

        sidebarOverlay.addEventListener('click', () => {
            sidebar.classList.remove('open');
            sidebarOverlay.classList.remove('active');
        });

        sidebarLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 1024) {
                    sidebar.classList.remove('open');
                    sidebarOverlay.classList.remove('active');
                }
            });
        });
    }

    // Initialize Reports Module
    if (typeof initReportsModule === 'function') initReportsModule();
}

// Add global listener to close CTC modal if clicked outside
document.addEventListener('click', (e) => {
    const ctcModal = getEl('ctc-breakdown-modal');
    if (ctcModal && e.target === ctcModal) {
        window.closeCTCBreakdownModal();
    }
});

// --- Payroll Processing Logic ---
window.getFinancialYear = function (dateObj) {
    let d = dateObj;
    if (!(d instanceof Date) || isNaN(d.getTime())) d = new Date();
    const month = d.getMonth() + 1;
    const yearStr = String(d.getFullYear()).slice(-4);
    const year = parseInt(yearStr);
    let fy = (month >= 4) ? `FY ${year}-${(year + 1).toString().slice(-2)}` : `FY ${year - 1}-${yearStr.slice(-2)}`;
    return fy;
};

window.initPayrollModule = function () {
    const dateInput = getEl('payroll-date');
    const monthInput = getEl('payroll-month-display');
    const fyInput = getEl('payroll-fy-display');
    const runBtn = getEl('run-payroll-btn');
    const searchInput = getEl('payroll-search');

    if (dateInput) {
        dateInput.addEventListener('change', (e) => {
            if (!e.target.value) {
                monthInput.value = '';
                fyInput.value = '';
                return;
            }
            const d = new Date(e.target.value);
            if (isNaN(d.getTime())) return;
            const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            const yearStr = String(d.getFullYear()).slice(-4);
            monthInput.value = monthNames[d.getMonth()] + " " + yearStr;
            fyInput.value = window.getFinancialYear(d);
        });
    }

    if (runBtn) {
        runBtn.addEventListener('click', () => {
            const processedEntries = [];
            // Extremely robust date extraction
            const dayParts = dateInput.value.split('-'); // YYYY-MM-DD
            const d = new Date(dayParts[0], dayParts[1] - 1, dayParts[2]);

            if (isNaN(d.getTime())) {
                alert('Invalid Date selected.');
                return;
            }

            const yearOnly = d.getFullYear();
            if (yearOnly < 2020 || yearOnly > 2030) {
                alert('Date out of range (2020-2030).');
                return;
            }

            const fyStr = window.getFinancialYear(d);
            const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            const monthOnly = monthNames[d.getMonth()];
            const yearStr = String(yearOnly).slice(-4);
            const monthLabel = monthOnly + " " + yearStr;

            console.log('Generating Payroll for:', monthLabel, 'FY:', fyStr);

            // Check if already processed
            if (payrolls.some(p => p.month === monthLabel)) {
                if (!confirm(`Payroll for ${monthLabel} already exists. Do you want to regenerate and overwrite it?`)) return;
                payrolls = payrolls.filter(p => p.month !== monthLabel);
            }

            // Process for each active employee
            employees.filter(e => e.status === 'Active').forEach(emp => {
                const basic = emp.monthlySalary * 0.5;
                const allow = emp.monthlySalary * 0.4;
                const rating = emp.rating || 5; // Fallback to 5 if rating is missing
                const bonus = emp.monthlySalary * 0.1 * (rating / 5);
                const gross = basic + allow;
                const totalGross = basic + allow + bonus;

                let tds = 0;
                if (totalGross > 50000) tds = Math.round(totalGross * 0.10);
                else if (totalGross > 30000) tds = Math.round(totalGross * 0.05);

                // Attendance Deductions (Synced with selected month)
                const attDed = calculateDeductionForMonth(emp, 'monthly', monthLabel);

                // --- NEW: Bonuses & Deductions Module Integration (SaaS Upgrade) ---
                const periodMonthStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;

                const periodEntries = bonusesDeductions.filter(item => {
                    return item.empId === emp.id &&
                        item.effectiveMonth === periodMonthStr &&
                        item.status === 'Pending';
                });

                const totalModuleBonus = periodEntries
                    .filter(item => item.type === 'Bonus')
                    .reduce((sum, item) => sum + item.amount, 0);

                const totalModuleDeduction = periodEntries
                    .filter(item => item.type === 'Deduction')
                    .reduce((sum, item) => sum + item.amount, 0);

                // Record entries to mark as Applied later
                periodEntries.forEach(entry => processedEntries.push(entry.id));

                const finalBonus = bonus + totalModuleBonus;
                const finalGross = gross + finalBonus; // Gross including all bonuses

                // TDS recalculation based on new gross
                if (finalGross > 50000) tds = Math.round(finalGross * 0.10);
                else if (finalGross > 30000) tds = Math.round(finalGross * 0.05);
                else tds = 0;

                // Unpaid Leave Deductions
                const startOfMonth = new Date(d.getFullYear(), d.getMonth(), 1);
                const endOfMonth = new Date(d.getFullYear(), d.getMonth() + 1, 0);

                let unpaidLeaveDays = 0;
                leaveRequests.filter(r => r.empId === emp.id && r.status === 'Approved').forEach(req => {
                    const reqType = leaveTypes.find(t => t.id === req.typeId);
                    if (reqType && !reqType.isPaid) {
                        const ls = new Date(req.startDate);
                        const le = new Date(req.endDate);

                        // Check if leave overlaps with current month
                        if (ls <= endOfMonth && le >= startOfMonth) {
                            const overlapStart = ls < startOfMonth ? startOfMonth : ls;
                            const overlapEnd = le > endOfMonth ? endOfMonth : le;
                            unpaidLeaveDays += Math.round((overlapEnd - overlapStart) / (1000 * 60 * 60 * 24)) + 1;
                        }
                    }
                });

                const perDaySalary = emp.monthlySalary / (emp.totalWorking || 22); // Default to 22 working days
                const leaveDed = Math.round(unpaidLeaveDays * perDaySalary);

                // Total Deductions = TDS + AttDed + LeaveDed + Module Deductions
                const totalDed = tds + attDed + leaveDed + totalModuleDeduction;
                const net = finalGross - totalDed;

                // Form 16 specific data simulation (Part B details)
                const f16Data = {
                    sec17_1: finalGross,
                    sec17_2: Math.round(finalGross * 0.02), // 2% perk simulation
                    exempt10: Math.round(allow * 0.5), // 50% allowance exempt simulation
                    chapter6A: 150000, // Fixed 80C simulation
                    stdDed: 50000,
                    challans: [
                        { q: 'Q1', receipt: 'CH-2025-Q1-001', amt: Math.round(tds * 3) },
                        { q: 'Q2', receipt: 'CH-2025-Q2-005', amt: Math.round(tds * 3) },
                        { q: 'Q3', receipt: 'CH-2025-Q3-012', amt: Math.round(tds * 3) },
                        { q: 'Q4', receipt: 'CH-2026-Q4-089', amt: Math.round(tds * 3) }
                    ]
                };

                payrolls.push({
                    id: 'PR-' + Date.now() + Math.floor(Math.random() * 1000),
                    empId: String(emp.id),
                    empName: String(emp.name),
                    empRole: String(emp.role),
                    dateObj: String(dateInput.value),
                    dateFormatted: `${String(d.getDate()).padStart(2, '0')} ${String(d.getMonth() + 1).padStart(2, '0')} ${d.getFullYear()}`,
                    month: String(monthLabel),
                    financialYear: String(fyStr),
                    basic: Number(basic) || 0,
                    allowances: Number(allow) || 0,
                    bonus: Number(finalBonus) || 0,
                    gross: Number(finalGross) || 0,
                    tds: Number(tds) || 0,
                    otherDeductions: Number(attDed + leaveDed + totalModuleDeduction) || 0,
                    totalDeductions: Number(totalDed) || 0,
                    net: Number(net) || 0,
                    status: 'Processed',
                    form16: f16Data
                });
            });

            // Mark and Save
            bonusesDeductions.forEach(entry => {
                if (processedEntries.includes(entry.id)) {
                    entry.status = 'Applied';
                }
            });
            window.saveBonusesDeductions();

            window.savePayrolls();
            if (window.showToast) {
                showToast(`Payroll for ${monthLabel} generated successfully!`, 'success');
            } else {
                alert(`Payroll for ${monthLabel} generated successfully!`);
            }

            // Show the newly generated payroll
            window.renderPayrollTable(monthLabel, fyStr);
        });
    }

    // Toggle Mode Logic
    const tabRun = getEl('tab-run-payroll');
    const tabSearch = getEl('tab-search-payroll');
    const tabForm16 = getEl('tab-form16');
    const schedulingCard = getEl('payroll-scheduling-card');
    const searchCard = getEl('payroll-search-card');
    const form16Card = getEl('payroll-form16-card');
    const taxSummaryTitle = getEl('tax-summary-title');
    const taxSummaryGrid = getEl('tax-summary-grid');
    const payrollRecordsHeader = getEl('payroll-records-header');
    const payrollRecordsTableContainer = getEl('payroll-records-table-container');

    function switchPayrollTab(tab) {
        if (tabRun) tabRun.className = 'btn compact-btn ' + (tab === 'run' ? 'btn-primary' : 'btn-outline');
        if (tabSearch) tabSearch.className = 'btn compact-btn ' + (tab === 'search' ? 'btn-primary' : 'btn-outline');
        if (tabForm16) tabForm16.className = 'btn compact-btn ' + (tab === 'form16' ? 'btn-primary' : 'btn-outline');

        if (schedulingCard) schedulingCard.classList.toggle('hidden', tab !== 'run');
        if (searchCard) searchCard.classList.toggle('hidden', tab !== 'search');
        if (form16Card) form16Card.classList.toggle('hidden', tab !== 'form16');

        const showRecordsAndSummary = tab !== 'form16';
        if (taxSummaryTitle) taxSummaryTitle.classList.toggle('hidden', !showRecordsAndSummary);
        if (taxSummaryGrid) taxSummaryGrid.classList.toggle('hidden', !showRecordsAndSummary);
        if (payrollRecordsHeader) payrollRecordsHeader.classList.toggle('hidden', !showRecordsAndSummary);
        if (payrollRecordsTableContainer) payrollRecordsTableContainer.classList.toggle('hidden', !showRecordsAndSummary);

        if (tab === 'form16') {
            if (window.renderForm16Table) window.renderForm16Table();
        }
    }

    if (tabRun) tabRun.addEventListener('click', () => switchPayrollTab('run'));
    if (tabSearch) tabSearch.addEventListener('click', () => switchPayrollTab('search'));
    if (tabForm16) tabForm16.addEventListener('click', () => switchPayrollTab('form16'));

    // Form 16 Render Logic
    window.renderForm16Table = function () {
        const tbody = getEl('form16-table-body');
        if (!tbody) return;
        const searchQuery = getEl('form16-search')?.value.toLowerCase() || '';
        const selectedFY = getEl('form16-fy')?.value || 'FY 2025-26';

        let html = '';
        const filtered = employees.filter(emp => emp.name.toLowerCase().includes(searchQuery) || emp.id.toLowerCase().includes(searchQuery));

        if (filtered.length === 0) {
            html = `<tr><td colspan="5" class="text-center py-6 text-muted">No employees found.</td></tr>`;
        } else {
            filtered.forEach(emp => {
                const totalCTC = currentSalaryType === 'monthly' ? (emp.monthlySalary * 12) : (emp.dailyWage * emp.totalWorking * 12);

                // Find latest payroll for this FY to pass to Form 16 logic
                const empPayrolls = payrolls.filter(p => p.empId === emp.id && p.financialYear === selectedFY);
                empPayrolls.sort((a, b) => new Date(b.dateObj) - new Date(a.dateObj));

                // If no payroll record, pass the FY itself — showForm16 will generate synthetic data
                const f16Month = empPayrolls.length > 0 ? empPayrolls[0].month : selectedFY;
                // Button is always enabled since showForm16 now generates synthetic data for any FY
                const availabilityBadge = empPayrolls.length > 0
                    ? '<span class="badge badge-green" style="font-size:0.7rem;">Available</span>'
                    : '<span class="badge badge-orange" style="font-size:0.7rem;">Synthetic</span>';

                html += `
                    <tr>
                        <td><strong>${emp.name}</strong></td>
                        <td><span class="text-xs font-bold text-muted">${emp.id}</span></td>
                        <td>${selectedFY}</td>
                        <td>₹${totalCTC.toLocaleString()}</td>
                        <td style="text-align: right; display:flex; gap:0.5rem; align-items:center; justify-content:flex-end;">
                            ${availabilityBadge}
                            <button class="btn btn-secondary compact-btn text-xs" onclick="showForm16('${emp.id}', '${f16Month}')">Form 16</button>
                        </td>
                    </tr>
                `;
            });
        }
        tbody.innerHTML = html;
    };

    if (getEl('form16-search')) getEl('form16-search').addEventListener('input', window.renderForm16Table);
    if (getEl('form16-fy')) getEl('form16-fy').addEventListener('change', window.renderForm16Table);

    // Search Execution
    const searchBtn = getEl('search-payroll-btn');
    const searchMonthSelect = getEl('search-payroll-month');
    const searchFYSelect = getEl('search-payroll-fy');

    const triggerSearch = () => {
        const month = searchMonthSelect?.value || '';
        const fy = searchFYSelect?.value || '';
        window.renderPayrollTable(month, fy);
    };

    if (searchBtn) searchBtn.addEventListener('click', triggerSearch);
    if (searchMonthSelect) searchMonthSelect.addEventListener('change', triggerSearch);
    if (searchFYSelect) searchFYSelect.addEventListener('change', triggerSearch);

    // Reactive search for name/ID
    if (searchInput) {
        searchInput.addEventListener('input', triggerSearch);
    }

    // Export / Print Listeners
    getEl('export-payroll-btn')?.addEventListener('click', () => {
        const month = searchMonthSelect?.value || 'All';
        const fy = searchFYSelect?.value || 'All';
        const filename = `Payroll_Report_${month}_${fy}_${Date.now()}.csv`;

        let csv = 'Employee Name,Employee ID,Financial Year,Month,Gross Salary,Total Deductions,Net Salary\n';
        const filtered = payrolls.filter(p => {
            const matchesMonth = month !== 'All' ? p.month.includes(month) : true;
            const matchesFY = fy !== 'All' ? p.financialYear === fy : true;
            return matchesMonth && matchesFY;
        });

        filtered.forEach(p => {
            csv += `"${p.empName}","${p.empId}","${p.financialYear}","${p.month}",${p.gross},${p.totalDeductions},${p.net}\n`;
        });

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        if (window.showToast) showToast('Payroll exported successfully!', 'success');
    });

    getEl('print-payroll-btn')?.addEventListener('click', () => {
        window.print();
    });

    const resetPBtn = getEl('reset-payroll-btn');
    if (resetPBtn) {
        resetPBtn.addEventListener('click', () => {
            if (searchMonthSelect) searchMonthSelect.value = '';
            if (searchFYSelect) searchFYSelect.value = '';
            if (searchInput) searchInput.value = '';
            window.renderPayrollTable();
        });
    }

    if (searchInput) {
        searchInput.addEventListener('input', () => window.renderPayrollTable());
    }

    // Modal listeners
    getEl('pd-view-payslip-btn')?.addEventListener('click', () => {
        closePayrollDetailModal();
        const empId = getEl('pd-emp-id')?.textContent;
        const month = getEl('pd-month-fy')?.getAttribute('data-month');
        if (empId && month) window.showPayslip(empId, month);
    });

    // View Form 16
    const viewForm16Btn = getEl('pd-view-form16-btn');
    if (viewForm16Btn) {
        viewForm16Btn.addEventListener('click', () => {
            closePayrollDetailModal();
            const empId = getEl('pd-emp-id')?.textContent;
            const month = getEl('pd-month-fy')?.getAttribute('data-month');
            if (empId && month) window.showForm16(empId, month);
        });
    }

    // Close Modals
    window.closeForm16Modal = function () {
        getEl('form16-modal')?.classList.add('hidden');
    };
};

window.savePayrolls = function () {
    localStorage.setItem('pps-payrolls', JSON.stringify(payrolls));
    // We do not auto-render here without arguments to preserve the blank state requirement
    // window.renderPayrollTable();
    window.updatePayrollSummary();
};

window.loadPayrolls = function () {
    const saved = localStorage.getItem('pps-payrolls');
    if (saved) payrolls = JSON.parse(saved);
    else payrolls = [];
};

window.renderPayrollTable = function (searchMonth = '', searchFY = '', forceShow = false) {
    const tbody = getEl('payroll-table-body');
    if (!tbody) return;

    const query = (getEl('payroll-search')?.value || '').toLowerCase();

    // Sort reverse chronological by date
    const sorted = [...payrolls].sort((a, b) => new Date(b.dateObj) - new Date(a.dateObj));

    // Default to show senaste data if no search is active
    let filtered = sorted;
    if (searchMonth || searchFY || query) {
        filtered = sorted.filter(p => {
            const matchesQuery = p.empName.toLowerCase().includes(query) || p.empId.toLowerCase().includes(query) || p.month.toLowerCase().includes(query);
            const matchesMonth = searchMonth ? p.month.includes(searchMonth) : true;
            const matchesFY = searchFY ? p.financialYear === searchFY : true;
            return matchesQuery && matchesMonth && matchesFY;
        });
    } else if (!forceShow) {
        // Show only the 10 most recent records by default if no search
        filtered = sorted.slice(0, 10);
    }

    // Update Summary labels and values
    // Update Summary labels and values based on the filtered set
    window.updatePayrollSummary(searchFY, searchMonth, query, filtered);

    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8" class="text-center py-6 text-muted">No payroll data found.</td></tr>`;
        return;
    }

    tbody.innerHTML = '';
    filtered.forEach(p => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td data-label="Employee">
                <div class="font-medium">${p.empName}</div>
                <div class="text-xs text-muted">${p.empId}</div>
            </td>
            <td data-label="Month">
                <div class="font-medium">${String(p.month).replace(/[36](?=202)/g, '').slice(-15)}</div>
                <div class="text-xs text-muted">${p.dateFormatted}</div>
            </td>
            <td data-label="Gross Salary">₹${p.gross.toLocaleString()}</td>
            <td data-label="Tax (TDS)" class="text-red">₹${p.tds.toLocaleString()}</td>
            <td data-label="Total Deduction">₹${p.totalDeductions.toLocaleString()}</td>
            <td data-label="Net Salary"><span class="font-bold text-green">₹${p.net.toLocaleString()}</span></td>
            <td data-label="Status"><span class="badge badge-green">${p.status}</span></td>
            <td>
                <div style="display: flex; gap: 0.5rem; justify-content: flex-end;">
                    <button class="btn btn-secondary compact-btn text-xs" onclick="showPayslip('${p.empId}', '${p.month}')">Payslip</button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });

    // Handle Table Footer Totals
    const tfoot = getEl('payroll-table-foot');
    if (tfoot) {
        const totals = filtered.reduce((acc, curr) => {
            acc.gross += (parseFloat(curr.gross) || 0);
            acc.tds += (parseFloat(curr.tds) || 0);
            acc.deduction += (parseFloat(curr.totalDeductions) || 0);
            acc.net += (parseFloat(curr.net) || 0);
            return acc;
        }, { gross: 0, tds: 0, deduction: 0, net: 0 });

        getEl('foot-total-gross').textContent = `₹${totals.gross.toLocaleString()}`;
        getEl('foot-total-tds').textContent = `₹${totals.tds.toLocaleString()}`;
        getEl('foot-total-deduction').textContent = `₹${totals.deduction.toLocaleString()}`;
        getEl('foot-total-net').textContent = `₹${totals.net.toLocaleString()}`;
        tfoot.classList.remove('hidden');
    }
};

window.updatePayrollSummary = function (fyFilter = '', monthFilter = '', searchText = '', records = null) {
    let displayFY = fyFilter;
    if (!displayFY) {
        if (records && records.length > 0) {
            displayFY = records[0].financialYear;
        } else if (payrolls.length > 0) {
            const sorted = [...payrolls].sort((a, b) => new Date(b.dateObj) - new Date(a.dateObj));
            displayFY = sorted[0].financialYear;
        } else {
            displayFY = window.getFinancialYear(new Date());
        }
    }

    displayFY = String(displayFY || '').replace(/^6/, '').trim();
    const label = getEl('summary-fy-label');
    if (label) label.textContent = `(${displayFY})`;

    const filteredPayrolls = records || payrolls.filter(p => {
        const pFY = String(p.financialYear || '').replace(/^6/, '').trim();
        const matchesFY = displayFY ? pFY === displayFY : true;
        const matchesMonth = monthFilter ? String(p.month).trim() === String(monthFilter).trim() : true;
        const s = (searchText || '').toLowerCase();
        const matchesSearch = s ? Object.values(p).some(val => String(val).toLowerCase().includes(s)) : true;
        return matchesFY && matchesMonth && matchesSearch;
    });

    const totals = filteredPayrolls.reduce((acc, curr) => {
        acc.gross += (parseFloat(curr.gross) || 0);
        acc.deduction += (parseFloat(curr.totalDeductions) || 0);
        acc.net += (parseFloat(curr.net) || 0);
        return acc;
    }, { gross: 0, deduction: 0, net: 0 });

    getEl('summary-total-gross') && (getEl('summary-total-gross').textContent = `₹${Math.round(totals.gross).toLocaleString()}`);
    getEl('summary-total-tds') && (getEl('summary-total-tds').textContent = `₹${Math.round(totals.deduction).toLocaleString()}`);
    getEl('summary-total-net') && (getEl('summary-total-net').textContent = `₹${Math.round(totals.net).toLocaleString()}`);
};

window.showForm16 = function (empId, month) {
    let p = payrolls.find(x => x.empId === empId && x.month === month);
    const emp = employees.find(e => e.id === empId);

    // If no payroll record found, generate synthetic data for the year
    // This handles FY 2023-24 and FY 2022-23 clicks where no payroll was generated
    if (!p) {
        if (!emp) { showToast('Employee not found.', 'error'); return; }

        // Determine FY from the month parameter (may be "FY 2023-24" or a month string)
        let fy = month;
        let salaryScale = 1.0;
        if (month === 'FY 2023-24' || month.includes('2023') || month.includes('2024')) {
            fy = 'FY 2023-24';
            salaryScale = 0.82; // Salary was ~18% lower 2 years ago
        } else if (month === 'FY 2022-23' || month.includes('2022')) {
            fy = 'FY 2022-23';
            salaryScale = 0.72; // Salary was ~28% lower 3 years ago
        } else {
            fy = 'FY 2024-25';
            salaryScale = 0.91;
        }

        // Build a synthetic payroll record from employee's current salary
        const syntheticMonthly = Math.round((emp.monthlySalary || 50000) * salaryScale);
        const syntheticAnnual = syntheticMonthly * 12;
        const basic = Math.round(syntheticMonthly * 0.5);
        const allow = Math.round(syntheticMonthly * 0.4);
        const bonus = Math.round(syntheticMonthly * 0.1);
        const gross = syntheticAnnual;
        const tds = Math.round(gross * 0.1 / 12);
        const annualTds = tds * 12;

        p = {
            empId: emp.id,
            empName: emp.name,
            empRole: emp.role,
            financialYear: fy,
            month: `March ${fy.split('-')[0].replace('FY ', '')}`,
            gross: gross,
            tds: annualTds,
            totalDeductions: annualTds,
            net: gross - annualTds,
            form16: {
                sec17_1: Math.round(gross * 0.95),
                sec17_2: Math.round(gross * 0.03),
                exempt10: Math.round(allow * 12 * 0.4),
                chapter6A: 150000,
                stdDed: 50000,
                challans: [
                    { q: 'Q1', receipt: `CH-${fy.split('-')[0].replace('FY ', '')}-Q1-001`, amt: Math.round(annualTds * 0.25) },
                    { q: 'Q2', receipt: `CH-${fy.split('-')[0].replace('FY ', '')}-Q2-005`, amt: Math.round(annualTds * 0.25) },
                    { q: 'Q3', receipt: `CH-${fy.split('-')[0].replace('FY ', '')}-Q3-012`, amt: Math.round(annualTds * 0.25) },
                    { q: 'Q4', receipt: `CH-${fy.split('-')[1]}-Q4-089`, amt: Math.round(annualTds * 0.25) }
                ]
            }
        };
    }

    const f16 = p.form16;

    // Part A Data
    if (getEl('f16-emp-name')) getEl('f16-emp-name').textContent = p.empName;
    if (getEl('f16-emp-address')) getEl('f16-emp-address').textContent = emp ? `${emp.dept || 'Engineering'}, PPS Software` : 'PPS Software Solution';
    if (getEl('f16-emp-pan')) getEl('f16-emp-pan').textContent = p.empName.substring(0, 4).toUpperCase() + 'E' + p.empId.replace(/\D/g, '') + 'F';
    if (getEl('f16-emp-id')) getEl('f16-emp-id').textContent = p.empId;
    if (getEl('f16-emp-designation')) getEl('f16-emp-designation').textContent = emp ? emp.role : 'Professional';

    if (getEl('f16-fy')) getEl('f16-fy').textContent = p.financialYear.replace('FY ', '');
    const fyYears = p.financialYear.replace('FY ', '').split('-');
    const aySecond = fyYears[1] ? (parseInt(fyYears[1]) + 1) + '' : '27';
    if (getEl('f16-ay')) getEl('f16-ay').textContent = `20${fyYears[1]}-${aySecond}`.replace('20202', '2026');
    if (getEl('f16-period')) getEl('f16-period').textContent = `01-Apr-${fyYears[0]} to 31-Mar-${fyYears[1] ? '20' + fyYears[1] : '2026'}`;

    const formattedDate = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    if (getEl('f16-current-date')) getEl('f16-current-date').textContent = formattedDate;
    if (getEl('f16-current-date-final')) getEl('f16-current-date-final').textContent = formattedDate;
    if (getEl('f16-place')) getEl('f16-place').textContent = 'Hyderabad, TS';

    // Challan Summary
    const tbody = getEl('f16-tds-summary');
    if (tbody && f16 && f16.challans) {
        tbody.innerHTML = '';
        let totalDeducted = 0;
        f16.challans.forEach(c => {
            totalDeducted += c.amt;
            tbody.innerHTML += `
                <tr>
                    <td>${c.q}</td>
                    <td class="text-xs">${c.receipt}</td>
                    <td class="text-right">₹${c.amt.toLocaleString()}</td>
                    <td class="text-right">₹${c.amt.toLocaleString()}</td>
                </tr>
            `;
        });
        if (getEl('f16-total-deducted')) getEl('f16-total-deducted').textContent = `₹${totalDeducted.toLocaleString()}`;
        if (getEl('f16-total-deposited')) getEl('f16-total-deposited').textContent = `₹${totalDeducted.toLocaleString()}`;
        if (getEl('f16-tds-subtracted')) getEl('f16-tds-subtracted').textContent = `₹${totalDeducted.toLocaleString()}`;
    }

    // Part B Data - Realistic Breakdown
    const grossVal = p.gross || 0;
    const sec17_1_val = (f16 && f16.sec17_1) ? f16.sec17_1 : Math.round(grossVal * 0.95);
    const sec17_2_val = (f16 && f16.sec17_2) ? f16.sec17_2 : Math.round(grossVal * 0.04);
    const sec17_3_val = (f16 && f16.sec17_3) ? f16.sec17_3 : Math.round(grossVal * 0.01);
    const exempt10_val = (f16 && f16.exempt10) ? f16.exempt10 : Math.round(grossVal * 0.1);
    const stdDed_val = (f16 && f16.stdDed) ? f16.stdDed : 50000;
    const chaper6A_val = (f16 && f16.chapter6A) ? f16.chapter6A : 150000;

    if (getEl('f16-gross-salary')) getEl('f16-gross-salary').textContent = `₹${grossVal.toLocaleString()}`;
    if (getEl('f16-sec17-1')) getEl('f16-sec17-1').textContent = `₹${sec17_1_val.toLocaleString()}`;
    if (getEl('f16-sec17-2')) getEl('f16-sec17-2').textContent = `₹${sec17_2_val.toLocaleString()}`;
    if (getEl('f16-sec17-3')) getEl('f16-sec17-3').textContent = `₹${sec17_3_val.toLocaleString()}`;
    if (getEl('f16-exempt-10')) getEl('f16-exempt-10').textContent = `₹${exempt10_val.toLocaleString()}`;

    const totalSal = sec17_1_val + sec17_2_val + sec17_3_val - exempt10_val;
    if (getEl('f16-total-salary')) getEl('f16-total-salary').textContent = `₹${totalSal.toLocaleString()}`;

    const taxableSal = totalSal - stdDed_val;
    if (getEl('f16-taxable-salary')) getEl('f16-taxable-salary').textContent = `₹${taxableSal.toLocaleString()}`;
    if (getEl('f16-chapter-via')) getEl('f16-chapter-via').textContent = `₹${chaper6A_val.toLocaleString()}`;

    const finalTaxable = Math.max(0, taxableSal - chaper6A_val);
    if (getEl('f16-total-taxable-income')) getEl('f16-total-taxable-income').textContent = `₹${finalTaxable.toLocaleString()}`;

    // Tax simple simulation
    const taxPayable = Math.round(finalTaxable * 0.05);
    if (getEl('f16-tax-payable')) getEl('f16-tax-payable').textContent = `₹${taxPayable.toLocaleString()}`;

    // Using total TDS as subtracted
    const totalTDS = (f16 && f16.challans) ? f16.challans.reduce((a, b) => a + b.amt, 0) : p.tds;
    const netPayable = taxPayable - totalTDS;
    if (getEl('f16-net-tax-payable')) {
        getEl('f16-net-tax-payable').textContent = netPayable >= 0 ? `₹${netPayable.toLocaleString()}` : `(Refund: ₹${Math.abs(netPayable).toLocaleString()})`;
    }

    getEl('form16-modal')?.classList.remove('hidden');
    const f16Content = getEl('form16-modal')?.querySelector('.form16-modal-content');
    if (f16Content) f16Content.scrollTop = 0;
};


window.showPayrollDetails = function (empId, month) {
    const p = payrolls.find(x => x.empId === empId && x.month === month);
    if (!p) return;

    getEl('pd-emp-name').textContent = p.empName;
    getEl('pd-emp-id').textContent = p.empId;
    const mfEl = getEl('pd-month-fy');
    if (mfEl) {
        mfEl.textContent = `${p.month} | ${p.financialYear}`;
        mfEl.setAttribute('data-month', p.month);
    }

    getEl('pd-basic').textContent = `₹${p.basic.toLocaleString()}`;
    getEl('pd-allow').textContent = `₹${p.allowances.toLocaleString()}`;
    getEl('pd-bonus').textContent = `₹${p.bonus.toLocaleString()}`;
    getEl('pd-gross').textContent = `₹${p.gross.toLocaleString()}`;

    getEl('pd-tds').textContent = `₹${p.tds.toLocaleString()}`;
    getEl('pd-other-ded').textContent = `₹${p.otherDeductions.toLocaleString()}`;
    getEl('pd-total-ded').textContent = `₹${p.totalDeductions.toLocaleString()}`;

    getEl('pd-net').textContent = `₹${p.net.toLocaleString()}`;

    getEl('payroll-detail-modal')?.classList.remove('hidden');
};

window.closePayrollDetailModal = function () {
    getEl('payroll-detail-modal')?.classList.add('hidden');
};

window.showPayslip = function (empId, month) {
    let p = payrolls.find(x => x.empId === empId && x.month === month);
    const emp = employees.find(x => x.id === empId);

    if (!p && !emp) {
        window.showToast('Employee record not found.', 'error');
        return;
    }

    // Show professional feedback
    window.showToast('Generating secure payslip preview...', 'info');

    // Synthetic record if missing
    if (!p) {
        const breakdown = window.calculateSalaryBreakdown(emp.monthlySalary);
        p = {
            empName: emp.name,
            empId: emp.id,
            empRole: emp.role,
            month: month.split(' | ')[0],
            financialYear: month.split(' | ')[1] || 'FY 2025-26',
            dateFormatted: '01-' + (month.split(' ')[0].substring(0, 3)) + '-2026',
            ...breakdown
        };
    }

    const companyName = localStorage.getItem('pps-company-name') || 'XYZ Private Limited';
    const companyAddress = localStorage.getItem('pps-company-address') || '123 Tech Hub, HITEC City, Hyderabad, 500081';

    // Map data for payslip.html
    const payslipData = {
        name: p.empName,
        id: p.empId,
        position: p.empRole || (emp ? emp.role : 'Professional'),
        dept: emp ? (emp.dept || 'Engineering') : 'Engineering',
        period: p.financialYear ? `${p.month} | ${p.financialYear}` : p.month,
        date: p.dateFormatted,
        companyName: companyName,
        companyAddress: companyAddress,
        salary: {
            basic: p.basic,
            hra: p.hra || Math.round(p.basic * 0.4),
            edu: p.edu || 2500,
            lta: p.lta || 5000,
            special: p.special || (p.bonus || 0),
            pf: p.pf || Math.round(p.basic * 0.12),
            pt: p.pt || 200
        }
    };

    // Store for payslip.html to consume
    localStorage.setItem('pps-current-payslip', JSON.stringify(payslipData));

    // Update iframe and show modal
    const iframe = getEl('payslip-iframe');
    if (iframe) {
        iframe.src = 'payslip.html?t=' + Date.now();
    }

    // Small delay to feel more professional and allow iframe to start loading
    setTimeout(() => {
        getEl('payslip-modal')?.classList.remove('hidden');
        window.autoScalePayslip();
        window.showToast('Payslip generated successfully.', 'success');
    }, 400);
};

window.autoScalePayslip = function () {
    window.autoScaleViewer('payslip-scaling-container', 'payslip-modal');
};

/**
 * Clean Document Scaling Logic
 * STRICT proportionality, ZERO overflow, ZERO cropping.
 */
/**
 * Unified Document Scaling Engine
 * STRICT 2px padding (4px total buffer)
 */
window.autoScaleViewer = function (containerId, modalId) {
    const modal = document.getElementById(modalId);
    const body = modal?.querySelector('.preview-modal-body');
    const container = document.getElementById(containerId);
    const modalWindow = modal?.querySelector('.preview-modal-window');

    if (!body || !container || !modalWindow) return;

    // Use the modal body as the viewport reference
    const availableW = body.offsetWidth - 40;
    const availableH = body.offsetHeight - 40;

    // A4 Dimensions: 210mm x 297mm (approx 794px x 1123px at 96dpi)
    const docW = 794;
    const docH = 1123;

    // Scaling ratio logic: ensure full visibility without scroll
    let scale = Math.min(availableW / docW, availableH / docH);

    // Safety Fallback: Don't let it get microscopically small or over-scale
    scale = Math.min(Math.max(scale, 0.3), 1.0);

    // Apply transform and ensure it's centered
    container.style.transform = `scale(${scale})`;
    container.style.transformOrigin = 'center center';

    // Tight-fit Modal Width for visual balance
    const tightWidth = Math.floor(docW * scale) + 60;
    modalWindow.style.width = `min(95vw, ${tightWidth}px)`;
};

// Global Resize Listener for all Previews
window.addEventListener('resize', () => {
    ['payslip-modal', 'ctc-breakdown-modal'].forEach(id => {
        const modal = document.getElementById(id);
        if (modal && !modal.classList.contains('hidden')) {
            const containerId = id === 'payslip-modal' ? 'payslip-scaling-container' : 'ctc-scaling-container';
            window.autoScaleViewer(containerId, id);
        }
    });
});

window.printPayslip = function () {
    const iframe = getEl('payslip-iframe');
    if (iframe && iframe.contentWindow) {
        iframe.contentWindow.print();
    }
};

window.closePayslipModal = function () {
    getEl('payslip-modal')?.classList.add('hidden');
};

window.applyTheme = function (theme, persist = false) {
    document.documentElement.setAttribute('data-theme', theme);
    if (persist) {
        localStorage.setItem('pps-theme', theme);
    }

    // Update theme icons in top bar
    const sun = document.getElementById('icon-sun');
    const moon = document.getElementById('icon-moon');
    if (sun && moon) {
        sun.style.display = theme === 'dark' ? 'block' : 'none';
        moon.style.display = theme === 'dark' ? 'none' : 'block';
    }

    // Update active state in settings buttons
    document.querySelectorAll('[id^="settings-theme-"]').forEach(btn => {
        btn.classList.toggle('active', btn.id === `settings-theme-${theme}`);
    });
};

window.setTheme = function (theme, event = null) {
    // --- Premium Circular Clip-Path Animation via View Transitions API ---
    const isDark = theme === 'dark';
    const isReverse = !isDark; // light = reverse animation

    // Get click origin for radial expansion (center of toggle button)
    let x = window.innerWidth / 2, y = 0;
    if (event) {
        const btn = event.currentTarget || event.target;
        if (btn) {
            const rect = btn.getBoundingClientRect();
            x = rect.left + rect.width / 2;
            y = rect.top + rect.height / 2;
        } else if (event.clientX !== undefined) {
            x = event.clientX;
            y = event.clientY;
        }
    }

    // Calculate max radius for full-screen coverage
    const maxRadius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y)
    );

    // Use View Transitions API if supported (Chrome 111+, Edge 111+)
    if (document.startViewTransition) {
        // Mark direction for CSS z-index layering
        if (isReverse) {
            document.documentElement.classList.add('theme-transitioning-reverse');
        } else {
            document.documentElement.classList.remove('theme-transitioning-reverse');
        }

        const transition = document.startViewTransition(() => {
            window.applyTheme(theme, true);
        });

        transition.ready.then(() => {
            // Animate the correct pseudo-element based on direction
            const targetPseudo = isReverse
                ? '::view-transition-old(root)'
                : '::view-transition-new(root)';

            // Circular clip-path: expand from click point (or collapse for reverse)
            const clipStart = `circle(0px at ${x}px ${y}px)`;
            const clipEnd = `circle(${maxRadius}px at ${x}px ${y}px)`;

            document.documentElement.animate(
                { clipPath: isReverse ? [clipEnd, clipStart] : [clipStart, clipEnd] },
                {
                    duration: 550,
                    easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                    pseudoElement: targetPseudo,
                }
            );
        }).catch(() => { /* Animation skipped gracefully */ });

        transition.finished.then(() => {
            document.documentElement.classList.remove('theme-transitioning-reverse');
        }).catch(() => { });

    } else {
        // Fallback for browsers without View Transitions API
        document.documentElement.classList.add('theme-transitioning');
        window.applyTheme(theme, true);
        setTimeout(() => {
            document.documentElement.classList.remove('theme-transitioning');
        }, 450);
    }
};

window.savePreferences = function () {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    localStorage.setItem('pps-theme', currentTheme);
    if (window.showToast) {
        showToast('Preferences saved successfully!', 'success');
    } else {
        alert('Preferences saved successfully!');
    }
};

// Initialize app always in light mode for the landing page
(function () {
    window.applyTheme('light', false);
})();

window.initPayrollChart = function () {
    const canvas = document.getElementById('payrollChart');
    if (!canvas || !window.Chart) return;
    if (window.payrollChart) window.payrollChart.destroy();
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const ctx = canvas.getContext('2d');
    const gradient = ctx.createLinearGradient(0, 0, 0, 220);
    gradient.addColorStop(0, 'rgba(59,130,246,0.95)');
    gradient.addColorStop(1, 'rgba(96,165,250,0.6)');
    window.payrollChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
            datasets: [{ label: 'Payroll (₹ Lakhs)', data: [28.4, 29.1, 31.5, 33.2, 34.6, 35.8], backgroundColor: gradient, borderRadius: 8 }]
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                x: { grid: { display: false }, ticks: { color: isDark ? '#94a3b8' : '#64748b' } },
                y: { grid: { color: isDark ? '#1e293b' : '#f1f5f9' }, ticks: { color: isDark ? '#94a3b8' : '#64748b' } }
            }
        }
    });
};

// --- Employee Data Management & Persistence ---
window.saveEmployees = function () {
    localStorage.setItem('pps-employees', JSON.stringify(employees));
    window.refreshAllTables();
    window.updateDashboardStats();
};

window.renderEmployeeDashboard = function () {
    const userRole = localStorage.getItem('pps-role');
    const userEmail = localStorage.getItem('pps-user');

    // Safety check - if not an employee, redirect or clear
    if (userRole !== 'employee') return;

    const emp = employees.find(e => e.email === userEmail);
    if (!emp) return;

    // ... existing stats logic (omitted for brevity if unchanged, but usually it's here)
    // For now, let's ensure we call the table render
    window.renderEmployeePayslipsTable(emp.id);
};

window.renderEmployeePayslipsTable = function (empId) {
    const tbody = getEl('employee-payslip-body');
    if (!tbody) return;

    const filtered = payrolls.filter(p => p.empId === empId)
        .sort((a, b) => new Date(b.dateObj) - new Date(a.dateObj));

    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" class="text-center py-6 text-muted">No records available yet.</td></tr>`;
        return;
    }

    tbody.innerHTML = '';
    filtered.forEach(p => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>
                <div class="font-medium">${p.month}</div>
                <div class="text-xs text-muted">${p.dateFormatted}</div>
            </td>
            <td>₹${p.gross.toLocaleString()}</td>
            <td><span class="font-bold text-green">₹${p.net.toLocaleString()}</span></td>
            <td><span class="badge badge-green">${p.status}</span></td>
            <td style="text-align: right;">
                <div style="display: flex; gap: 0.5rem; justify-content: flex-end;">
                    <button class="btn btn-outline compact-btn text-xs" onclick="showPayslip('${p.empId}', '${p.month}')">Payslip</button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
};

window.loadEmployees = function () {
    console.log('Loading Employees...');
    const saved = localStorage.getItem('pps-employees');
    if (saved) {
        employees = JSON.parse(saved);
        console.log(`Loaded ${employees.length} employees from storage.`);
        // Migration: ensure tasks and attendance fields exist
        employees.forEach(emp => {
            const def = defaultEmployees.find(d => d.id === emp.id) || defaultEmployees[0];

            if (emp.assignedTasks === undefined) emp.assignedTasks = def.assignedTasks || 5;
            if (emp.completedTasks === undefined) emp.completedTasks = def.completedTasks || 0;

            // Generate TaskList dynamically if not present
            if (!emp.taskList) {
                emp.taskList = [];
                const pendingCount = Math.max(0, emp.assignedTasks - emp.completedTasks);
                // Create mock tasks
                for (let i = 0; i < pendingCount; i++) {
                    emp.taskList.push({
                        id: 'TASK_' + emp.id + '_' + i,
                        title: 'Pending Task #' + (i + 1) + ' for ' + emp.name,
                        completed: false,
                        priority: ['High', 'Medium', 'Low'][i % 3]
                    });
                }
            }

            // Attendance fields migration
            if (emp.present === undefined) emp.present = def.present || 22;
            if (emp.absent === undefined) emp.absent = def.absent || 0;
            if (emp.halfDay === undefined) emp.halfDay = def.halfDay || 0;
            if (emp.paidLeave === undefined) emp.paidLeave = def.paidLeave || 0;
            if (emp.unpaidLeave === undefined) emp.unpaidLeave = def.unpaidLeave || 0;
            if (emp.sickLeave === undefined) emp.sickLeave = def.sickLeave || 0;
            if (emp.wfh === undefined) emp.wfh = def.wfh || 0;
            if (emp.totalWorking === undefined) emp.totalWorking = def.totalWorking || 26;
            if (emp.holidays === undefined) emp.holidays = def.holidays || 4;
            if (emp.dailyWage === undefined) emp.dailyWage = def.dailyWage || 2000;
            if (emp.monthlySalary === undefined) emp.monthlySalary = def.monthlySalary || 50000;
            if (emp.ctc === undefined) emp.ctc = emp.monthlySalary * 12 * 1.15;

            // Profile fields migration
            if (emp.phone === undefined) emp.phone = def.phone || '+91 98765 43210';
            if (emp.location === undefined) emp.location = def.location || 'Mumbai, India';
            if (emp.joiningDate === undefined) emp.joiningDate = def.joiningDate || '2024-01-15';
            if (emp.profileImage === undefined) emp.profileImage = def.profileImage || '';

            // Name/Email/Role sync: if defaults changed, update stored data
            if (def && emp.name !== def.name && emp.email !== def.email) {
                emp.name = def.name;
                emp.email = def.email;
                emp.role = def.role;
                emp.dept = def.dept;
            }
        });

        // Data Migration: Ensure IDs are strictly sequential PPS001, PPS002...
        let needsReindex = false;
        employees.forEach((emp, index) => {
            const expectedId = `PPS${String(index + 1).padStart(3, '0')}`;
            if (emp.id !== expectedId) {
                needsReindex = true;
                emp.id = expectedId;
            }
        });
        if (needsReindex) {
            localStorage.setItem('pps-employees', JSON.stringify(employees));
        }
    } else {
        console.log('No saved employees found. Seeding with defaults.');
        employees = [...defaultEmployees];
        localStorage.setItem('pps-employees', JSON.stringify(employees));
    }
    console.log(`Final employee count: ${employees.length}`);

    // Load Leave Types
    const savedLeaveTypes = localStorage.getItem('pps-leave-types');
    if (savedLeaveTypes) {
        leaveTypes = JSON.parse(savedLeaveTypes);
        // Migrations: Ensure all have category/code
        leaveTypes = leaveTypes.map(lt => ({
            ...lt,
            code: lt.code || lt.id.replace('LT', ''),
            category: lt.category || (lt.isPaid ? 'Paid' : 'Unpaid'),
            desc: lt.desc || lt.name
        }));
    } else {
        leaveTypes = [
            { id: 'LT001', name: 'Privilege Leave', code: 'PL', isPaid: true, category: 'Paid', desc: 'Annual earned leave' },
            { id: 'LT002', name: 'Sick Leave', code: 'SL', isPaid: true, category: 'Paid', desc: 'For medical issues' },
            { id: 'LT003', name: 'Casual Leave', code: 'CL', isPaid: true, category: 'Paid', desc: 'For personal contingencies' },
            { id: 'LT004', name: 'Loss of Pay', code: 'LOP', isPaid: false, category: 'Unpaid', desc: 'Leave without pay' }
        ];
        localStorage.setItem('pps-leave-types', JSON.stringify(leaveTypes));
    }

    // Load Leave Requests
    const savedLeaveRequests = localStorage.getItem('pps-leave-requests');
    if (savedLeaveRequests) {
        leaveRequests = JSON.parse(savedLeaveRequests);
        const today = new Date();
        const currentMonth = today.getMonth();
        const hasCurrentMonthLeaves = leaveRequests.some(r => {
            const sd = new Date(r.start_date || r.startDate);
            return sd.getMonth() === currentMonth;
        });
        if (!hasCurrentMonthLeaves) {
            const y = today.getFullYear();
            const m = String(today.getMonth() + 1).padStart(2, '0');
            leaveRequests.push(
                { id: 'LR-D1', employee_id: 'PPS001', leave_type: 'Sick Leave', start_date: `${y}-${m}-04`, end_date: `${y}-${m}-05`, reason: 'Fever', status: 'Pending', created_at: `${y}-${m}-01` },
                { id: 'LR-D2', employee_id: 'PPS003', leave_type: 'Casual Leave', start_date: `${y}-${m}-12`, end_date: `${y}-${m}-13`, reason: 'Personal', status: 'Approved', created_at: `${y}-${m}-10` },
                { id: 'LR-D3', employee_id: 'PPS005', leave_type: 'Privilege Leave', start_date: `${y}-${m}-20`, end_date: `${y}-${m}-22`, reason: 'Travel', status: 'Rejected', created_at: `${y}-${m}-15` },
                { id: 'LR-D4', employee_id: 'PPS007', leave_type: 'Sick Leave', start_date: `${y}-${m}-14`, end_date: `${y}-${m}-15`, reason: 'Urgent Work', status: 'Approved', created_at: `${y}-${m}-11` }
            );
            localStorage.setItem('pps-leave-requests', JSON.stringify(leaveRequests));
        }
    } else {
        const today = new Date();
        const year = today.getFullYear();
        const m = String(today.getMonth() + 1).padStart(2, '0');
        const prevM = String(today.getMonth() === 0 ? 12 : today.getMonth()).padStart(2, '0');
        const prevY = today.getMonth() === 0 ? year - 1 : year;

        leaveRequests = [
            { id: 'LR001', employee_id: 'PPS001', leave_type: 'Sick Leave', start_date: `${year}-${m}-10`, end_date: `${year}-${m}-12`, reason: 'Fever and cold', status: 'Pending', created_at: `${year}-${m}-09` },
            { id: 'LR002', employee_id: 'PPS003', leave_type: 'Casual Leave', start_date: `${year}-${m}-15`, end_date: `${year}-${m}-15`, reason: 'Personal work', status: 'Approved', created_at: `${year}-${m}-13` },
            { id: 'LR003', employee_id: 'PPS005', leave_type: 'Privilege Leave', start_date: `${year}-${m}-20`, end_date: `${year}-${m}-22`, reason: 'Family vacation', status: 'Rejected', created_at: `${year}-${m}-18` },
            { id: 'LR004', employee_id: 'PPS007', employee_id: 'PPS007', leave_type: 'Sick Leave', start_date: `${year}-${m}-05`, end_date: `${year}-${m}-06`, reason: 'Medical appointment', status: 'Approved', created_at: `${year}-${m}-04` },
            { id: 'LR005', employee_id: 'PPS010', leave_type: 'Casual Leave', start_date: `${year}-${m}-25`, end_date: `${year}-${m}-26`, reason: 'Wedding ceremony', status: 'Pending', created_at: `${year}-${m}-22` },
            { id: 'LR006', employee_id: 'PPS014', leave_type: 'Loss of Pay', start_date: `${prevY}-${prevM}-18`, end_date: `${prevY}-${prevM}-19`, reason: 'Visa appointment', status: 'Approved', created_at: `${prevY}-${prevM}-16` },
            { id: 'LR007', employee_id: 'PPS016', leave_type: 'Casual Leave', start_date: `${year}-${m}-28`, end_date: `${year}-${m}-29`, reason: 'Visiting hometown', status: 'Pending', created_at: `${year}-${m}-20` },
            { id: 'LR008', employee_id: 'PPS017', leave_type: 'Sick Leave', start_date: `${year}-${m}-26`, end_date: `${year}-${m}-26`, reason: 'Severe headache', status: 'Pending', created_at: `${year}-${m}-24` }
        ];
        localStorage.setItem('pps-leave-requests', JSON.stringify(leaveRequests));
    }

    // Load Bonuses & Deductions
    window.loadBonusesDeductions();

    // Force UI Refresh after all data is loaded (guard in case called before initApp finishes defining all functions)
    if (window.refreshAllTables) window.refreshAllTables();
    if (window.updateDashboardStats) window.updateDashboardStats();
    if (window.updatePayrollAnalytics) window.updatePayrollAnalytics();
};

window.loadBonusesDeductions = function () {
    const saved = localStorage.getItem('pps-bonuses-deductions');
    if (saved) {
        bonusesDeductions = JSON.parse(saved);
    } else {
        // SaaS Upgrade: 6 Specific High-Fidelity Sample Records (PPSxxx Format)
        bonusesDeductions = [
            { id: 'BD-001', empId: 'PPS001', empName: 'Aarav Sharma', type: 'Bonus', category: 'Performance Bonus', title: 'Q4 High Performer', amount: 5000, date: '2026-03-10', effectiveMonth: '2026-03', status: 'Pending' },
            { id: 'BD-002', empId: 'PPS002', empName: 'Ishaan Gupta', type: 'Deduction', category: 'Late Penalty', title: 'Repeated Tardy - Feb', amount: 1000, date: '2026-03-05', effectiveMonth: '2026-03', status: 'Pending' },
            { id: 'BD-003', empId: 'PPS003', empName: 'Ananya Iyer', type: 'Bonus', category: 'Overtime', title: 'Weekend System Migration', amount: 2500, date: '2026-02-25', effectiveMonth: '2026-02', status: 'Applied' },
            { id: 'BD-004', empId: 'PPS004', empName: 'Vihaan Reddy', type: 'Deduction', category: 'Tax Adjustment', title: 'FY25 TDS Correction', amount: 2000, date: '2026-01-12', effectiveMonth: '2026-01', status: 'Pending' },
            { id: 'BD-005', empId: 'PPS005', empName: 'Saanvi Malhotra', type: 'Bonus', category: 'Performance Bonus', title: 'Festival Bonus', amount: 4000, date: '2026-03-15', effectiveMonth: '2026-03', status: 'Pending' },
            { id: 'BD-006', empId: 'PPS006', empName: 'Advait Joshi', type: 'Deduction', category: 'Other', title: 'Absence Penalty', amount: 1500, date: '2026-02-28', effectiveMonth: '2026-02', status: 'Applied' },
            { id: 'BD-007', empId: 'PPS007', empName: 'Kyra Nair', type: 'Bonus', category: 'Overtime', title: 'Late Night Deployment', amount: 2200, date: '2026-03-18', effectiveMonth: '2026-03', status: 'Pending' }
        ];
        window.saveBonusesDeductions();
    }
};

window.saveBonusesDeductions = function () {
    localStorage.setItem('pps-bonuses-deductions', JSON.stringify(bonusesDeductions));
};

// --- Bonuses & Deductions Logic ---
let bdInitialized = false;
function initBonusesDeductionsModule() {
    if (bdInitialized) {
        window.renderBonusesDeductionsTable();
        return;
    }

    const searchInput = getEl('bd-search');
    const typeFilter = getEl('bd-type-filter');
    const categoryFilter = getEl('bd-category-filter');
    const monthSelectFilter = getEl('bd-month-select-filter');
    const yearSelectFilter = getEl('bd-year-select-filter');

    if (searchInput) searchInput.addEventListener('input', () => window.renderBonusesDeductionsTable());
    if (typeFilter) typeFilter.addEventListener('change', () => window.renderBonusesDeductionsTable());
    if (categoryFilter) categoryFilter.addEventListener('change', () => window.renderBonusesDeductionsTable());
    if (monthSelectFilter) monthSelectFilter.addEventListener('change', () => window.renderBonusesDeductionsTable());
    if (yearSelectFilter) yearSelectFilter.addEventListener('change', () => window.renderBonusesDeductionsTable());

    const bdForm = getEl('bd-form');
    if (bdForm) {
        bdForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const id = getEl('bd-edit-id').value;
            const empId = getEl('bd-employee-select').value;
            const empName = employees.find(e => e.id === empId)?.name || 'Unknown';
            const type = getEl('bd-type-select').value;
            const category = getEl('bd-category-select').value;
            const title = getEl('bd-title').value;
            const amount = parseFloat(getEl('bd-amount').value);

            // Combine Split Selects
            const m = getEl('bd-month-select').value;
            const y = getEl('bd-year-select').value;
            const effectiveMonth = `${y}-${m}`;
            const date = getEl('bd-date').value;

            if (id) {
                const entry = bonusesDeductions.find(b => b.id === id);
                if (entry) {
                    Object.assign(entry, { empId, empName, type, category, title, amount, effectiveMonth, date });
                }
            } else {
                const newId = 'BD' + Date.now();
                bonusesDeductions.push({ id: newId, empId, empName, type, category, title, amount, effectiveMonth, date, status: 'Pending' });
            }

            window.saveBonusesDeductions();
            window.closeBonusDeductionModal();
            alert('Salary adjustment saved successfully.');
            window.renderBonusesDeductionsTable();
        });
    }

    window.renderBonusesDeductionsTable();
    bdInitialized = true;
}

window.saveLeaveData = function () {
    localStorage.setItem('pps-leave-types', JSON.stringify(leaveTypes));
    localStorage.setItem('pps-leave-requests', JSON.stringify(leaveRequests));
    window.renderAdminLeaveTypes?.();
    window.renderAdminLeaveRequests?.();
    window.renderAdminLeaveCalendar?.();
    window.renderEmployeeLeaveBalance?.();
    window.renderEmployeeLeaveHistory?.();
};


window.refreshAllTables = function () {
    window.renderEmployeeTable();
    window.renderAttendanceTable();
};

// --- Seeded monthly attendance variation ---
// Simple hash to generate a consistent seed per employee+month
function simpleHash(str) {
    let h = 0;
    for (let i = 0; i < str.length; i++) {
        h = ((h << 5) - h + str.charCodeAt(i)) | 0;
    }
    return Math.abs(h);
}

// Returns a seeded pseudo-random number between 0 and 1
function seededRandom(seed) {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
}

// Generate realistic attendance for an employee for a given month
function getMonthlyAttendance(emp, monthStr) {
    // Current (default) month returns the original data
    const currentMonth = getEl('att-month-filter')?.options?.[0]?.value;
    if (!monthStr || monthStr === currentMonth) {
        return {
            present: emp.present,
            absent: emp.absent,
            halfDay: emp.halfDay,
            paidLeave: emp.paidLeave,
            unpaidLeave: emp.unpaidLeave,
            sickLeave: emp.sickLeave,
            wfh: emp.wfh,
            totalWorking: emp.totalWorking,
            holidays: emp.holidays
        };
    }

    const seed = simpleHash(emp.id + monthStr);
    const r = (offset) => seededRandom(seed + offset);

    const totalWorking = [22, 23, 24, 25, 26][Math.floor(r(1) * 5)];
    const holidays = [3, 4, 5][Math.floor(r(2) * 3)];

    // Generate realistic absence (most employees are good, some have more absences)
    const absenceWeight = r(3); // personality factor
    const absent = absenceWeight < 0.4 ? 0 : absenceWeight < 0.7 ? Math.floor(r(4) * 2) + 1 : Math.floor(r(4) * 3) + 1;
    const halfDay = r(5) < 0.5 ? 0 : Math.floor(r(6) * 3);
    const paidLeave = Math.floor(r(7) * 3);
    const sickLeave = r(8) < 0.6 ? 0 : Math.floor(r(9) * 2) + 1;
    const unpaidLeave = r(10) < 0.8 ? 0 : Math.floor(r(11) * 2);
    const wfh = r(12) < 0.5 ? 0 : Math.floor(r(13) * 4);

    // Ensure present days make sense
    const usedDays = absent + halfDay + paidLeave + sickLeave + unpaidLeave + wfh;
    const present = Math.max(totalWorking - usedDays, Math.floor(totalWorking * 0.6));

    return { present, absent, halfDay, paidLeave, unpaidLeave, sickLeave, wfh, totalWorking, holidays };
}

// Track the selected month globally for attendance
let currentAttMonth = '';

function calculateAttPercentageForMonth(emp, monthStr) {
    const att = getMonthlyAttendance(emp, monthStr);
    const deductionDays = att.absent + (att.halfDay * 0.5) + (att.unpaidLeave || 0);
    const percentage = 100 - ((deductionDays / att.totalWorking) * 100);
    return Math.max(0, Math.min(100, percentage)).toFixed(1);
}

function calculateDeductionForMonth(emp, type, monthStr) {
    const att = getMonthlyAttendance(emp, monthStr);
    let perDaySalary = 0;
    if (type === 'monthly') {
        perDaySalary = emp.monthlySalary / (att.totalWorking || 22);
    } else {
        perDaySalary = emp.dailyWage;
    }
    const deductionDays = att.absent + (att.halfDay * 0.5) + att.unpaidLeave;
    return Math.round(deductionDays * perDaySalary);
}

function renderAttendanceTable(filterData = employees) {
    const tbody = getEl('attendance-table-body');
    if (!tbody) return;
    tbody.innerHTML = '';

    currentAttMonth = getEl('att-month-filter')?.value || '';

    filterData.forEach(emp => {
        const att = getMonthlyAttendance(emp, currentAttMonth);
        const attPct = calculateAttPercentageForMonth(emp, currentAttMonth);
        const deduction = calculateDeductionForMonth(emp, currentSalaryType, currentAttMonth);
        const grossSalary = currentSalaryType === 'monthly' ? emp.monthlySalary : (emp.dailyWage * att.totalWorking);
        const netSalary = grossSalary - deduction;

        const tr = document.createElement('tr');
        tr.className = 'emp-att-row';
        tr.innerHTML = `
            <td><span class="text-xs font-bold text-muted">${emp.id}</span></td>
            <td>
                <div class="font-bold">${emp.name}</div>
                <div class="text-xs text-muted" style="text-transform: lowercase;">${emp.email || 'N/A'}</div>
            </td>
            <td><span class="badge badge-blue">${emp.dept}</span></td>
            <td style="text-align: center;">₹${grossSalary.toLocaleString()}</td>
            <td class="text-red font-bold" style="text-align: center;">₹${deduction.toLocaleString()}</td>
            <td class="text-green font-bold" style="text-align: center;">₹${netSalary.toLocaleString()}</td>
            <td style="text-align: center;"><span class="badge ${attPct > 95 ? 'badge-green' : 'badge-orange'}">${attPct}%</span></td>
            <td style="text-align: center;">
                <button class="action-btn" onclick="showAttendanceDetailModal('${emp.id}')" title="View Details">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });

    updateAttSummary();
}

// Backward-compatible aliases for payroll module
function calculateAttPercentage(emp) { return calculateAttPercentageForMonth(emp, ''); }
function calculateEstimatedDeduction(emp, type) { return calculateDeductionForMonth(emp, type, ''); }

window.showAttendanceDetailModal = function (id) {
    const emp = employees.find(e => e.id === id);
    if (!emp) return;

    const modal = getEl('attendance-detail-modal');
    const att = getMonthlyAttendance(emp, currentAttMonth);
    const deduction = calculateDeductionForMonth(emp, currentSalaryType, currentAttMonth);
    const attPct = calculateAttPercentageForMonth(emp, currentAttMonth);

    getEl('att-modal-name').textContent = emp.name;
    getEl('att-modal-id').textContent = emp.id;
    getEl('att-modal-dept').textContent = emp.dept;
    getEl('att-modal-pct').textContent = attPct + '%';
    getEl('att-modal-deductions').textContent = '₹' + deduction.toLocaleString();

    // Populate Breakdown
    const breakdown = getEl('att-modal-breakdown');
    breakdown.innerHTML = `
        <div class="att-breakdown-item p-2">
            <span class="text-xs"><span class="att-breakdown-dot bg-green"></span>Present Days</span>
            <strong class="text-sm">${att.present}d</strong>
        </div>
        <div class="att-breakdown-item p-2">
            <span class="text-xs"><span class="att-breakdown-dot bg-blue"></span>Work From Home</span>
            <strong class="text-sm">${att.wfh}d</strong>
        </div>
        <div class="att-breakdown-item p-2">
            <span class="text-xs"><span class="att-breakdown-dot bg-orange"></span>Paid / Sick Leaves</span>
            <strong class="text-sm">${att.paidLeave + att.sickLeave}d</strong>
        </div>
        <div class="att-breakdown-item p-2">
            <span class="text-xs"><span class="att-breakdown-dot bg-red"></span>Absents / Half Days</span>
            <strong class="text-sm">${att.absent + (att.halfDay > 0 ? ' (½)' : '')}d</strong>
        </div>
    `;

    // Populate Transparency Breakdown
    const reasonList = getEl('att-modal-reason');
    const protectedList = getEl('att-modal-protected');
    const perDay = currentSalaryType === 'monthly' ? (emp.monthlySalary / att.totalWorking) : emp.dailyWage;

    // Deducted items
    let reasonsHTML = '';
    if (att.absent > 0) reasonsHTML += `<li class="flex-between"><span>${att.absent} Full Day Absent</span> <span class="text-red">-₹${Math.round(att.absent * perDay).toLocaleString()}</span></li>`;
    if (att.halfDay > 0) reasonsHTML += `<li class="flex-between"><span>${att.halfDay} Half Day Sessions</span> <span class="text-red">-₹${Math.round(att.halfDay * 0.5 * perDay).toLocaleString()}</span></li>`;
    if (att.unpaidLeave > 0) reasonsHTML += `<li class="flex-between"><span>${att.unpaidLeave} Unpaid Leave</span> <span class="text-red">-₹${Math.round(att.unpaidLeave * perDay).toLocaleString()}</span></li>`;
    if (!reasonsHTML) reasonsHTML = '<li class="text-muted italic">No salary deductions</li>';
    reasonList.innerHTML = reasonsHTML;

    // Protected items
    let protectedHTML = '';
    if (att.paidLeave > 0) protectedHTML += `<li class="flex-between"><span>${att.paidLeave} Paid Leaves</span> <span class="text-green">₹${Math.round(att.paidLeave * perDay).toLocaleString()} Covered</span></li>`;
    if (att.sickLeave > 0) protectedHTML += `<li class="flex-between"><span>${att.sickLeave} Sick Leaves</span> <span class="text-green">₹${Math.round(att.sickLeave * perDay).toLocaleString()} Covered</span></li>`;
    if (att.holidays > 0) protectedHTML += `<li class="flex-between"><span>${att.holidays} Holidays</span> <span class="text-green">Free Day</span></li>`;
    if (!protectedHTML) protectedHTML = '<li class="text-muted italic">No protected leaves utilized</li>';
    protectedList.innerHTML = protectedHTML;

    modal.classList.remove('hidden');
};

window.closeAttendanceModal = function () {
    const modal = getEl('attendance-detail-modal');
    if (modal) modal.classList.add('hidden');
};

window.showTaskManagementModal = function (empId) {
    const emp = employees.find(e => e.id === empId);
    if (!emp) return;

    if (!emp.taskList) emp.taskList = [];

    getEl('task-assign-emp-id').value = empId;
    getEl('task-modal-emp-name').textContent = `Manage Tasks - ${emp.name}`;
    getEl('task-modal-emp-id').textContent = `Employee ID: ${emp.id}`;

    window.renderAdminTaskList(empId);

    const modal = getEl('task-management-modal');
    if (modal) modal.classList.remove('hidden');
};

window.closeTaskManagementModal = function () {
    const modal = getEl('task-management-modal');
    if (modal) modal.classList.add('hidden');
    const form = getEl('assign-task-form');
    if (form) form.reset();
};

window.renderAdminTaskList = function (empId) {
    const emp = employees.find(e => e.id === empId);
    if (!emp) return;

    const listContainer = getEl('admin-task-list-container');
    const countsEl = getEl('task-modal-counts');

    if (!emp.taskList || emp.taskList.length === 0) {
        listContainer.innerHTML = '<div class="text-center text-muted p-4">No tasks assigned yet.</div>';
        if (countsEl) countsEl.textContent = '0 / 0 Completed';
        return;
    }

    const assigned = emp.assignedTasks || 0;
    const completed = emp.completedTasks || 0;
    if (countsEl) countsEl.textContent = `${completed} / ${assigned} Completed`;

    // Sort: pending first
    const sortedTasks = [...emp.taskList].sort((a, b) => {
        if (a.completed === b.completed) return 0;
        return a.completed ? 1 : -1;
    });

    let html = '';
    sortedTasks.forEach(task => {
        const badgeColor = task.priority === 'High' ? 'badge-red' : (task.priority === 'Medium' ? 'badge-orange' : 'badge-blue');
        const statusBadge = task.completed ? '<span class="badge badge-green">Completed</span>' : '<span class="badge badge-yellow">Pending</span>';

        html += `
            <div class="p-3 mb-3 border rounded-lg ${task.completed ? 'bg-gray-50 opacity-70' : 'bg-white'}">
                <div class="flex-between">
                    <div class="font-medium text-sm ${task.completed ? 'line-through text-muted' : ''}">${task.title}</div>
                    ${statusBadge}
                </div>
                ${task.desc ? `<div class="text-xs text-muted mt-1">${task.desc}</div>` : ''}
                <div class="text-xs mt-2">
                    <span class="text-muted mr-1">Priority:</span>
                    <span class="badge ${badgeColor}" style="padding: 2px 6px; font-size: 0.6rem;">${task.priority}</span>
                </div>
            </div>
        `;
    });
    listContainer.innerHTML = html;
};

window.showCTCBreakdown = function (empId) {
    const emp = employees.find(e => e.id === empId);
    if (!emp) return;

    const modal = getEl('ctc-breakdown-modal');
    if (!modal) return;

    // --- DETAILED CALCULATION ENGINE ---
    const annualCTC = emp.ctc;
    const monthlyCTC = Math.round(annualCTC / 12);

    // Employer Contributions (e.g., PF) are part of CTC but not Gross
    const monthlyEmployerPF = Math.min(Math.round(monthlyCTC * 0.5 * 0.12), 1800);
    const monthlyGross = monthlyCTC - monthlyEmployerPF;

    // Earnings breakdown from Gross
    const basic = Math.round(monthlyGross * 0.5);
    const hra = Math.round(basic * 0.4);
    const conveyance = 1600;
    const cca = 2000;
    const bonus = Math.round(monthlyGross * 0.0833); // approx 1 month salary as annual bonus
    const specialAllowance = monthlyGross - basic - hra - conveyance - cca - bonus;

    // Deductions
    const employeePF = monthlyEmployerPF; // Typically matches
    const pt = 200;
    const totalDeductions = employeePF + pt;
    const netSalary = monthlyGross - totalDeductions;

    // Data Structure for the Table
    const sections = [
        { title: 'Earnings (Fixed & Variable)', type: 'head' },
        { name: 'Basic Salary', type: 'Earning', m: basic, y: basic * 12 },
        { name: 'House Rent Allowance (HRA)', type: 'Earning', m: hra, y: hra * 12 },
        { name: 'Conveyance Allowance', type: 'Earning', m: conveyance, y: conveyance * 12 },
        { name: 'City Compensatory Allowance (CCA)', type: 'Earning', m: cca, y: cca * 12 },
        { name: 'Special Allowance', type: 'Earning', m: specialAllowance, y: specialAllowance * 12 },
        { name: 'Performance Bonus (Monthly Prov.)', type: 'Earning', m: bonus, y: bonus * 12 },
        { name: 'Employer PF Contribution', type: 'Earning', m: monthlyEmployerPF, y: monthlyEmployerPF * 12 },

        { title: 'Deductions & Statutory', type: 'head' },
        { name: 'Employee PF Contribution', type: 'Deduction', m: employeePF, y: employeePF * 12 },
        { name: 'Professional Tax (PT)', type: 'Deduction', m: pt, y: pt * 12 },

        { title: 'Summary (Net & Cost)', type: 'head' },
        { name: 'Gross Salary', type: 'Total', m: monthlyGross, y: monthlyGross * 12, class: 'ctc-row-total' },
        { name: 'Total Deductions', type: 'Total', m: totalDeductions, y: totalDeductions * 12, class: 'text-red font-bold' },
        { name: 'Monthly Net Take-Home', type: 'Total', m: netSalary, y: netSalary * 12, class: 'ctc-row-total ctc-total-primary' },
        { name: 'Cost to Company (CTC)', type: 'Total', m: monthlyCTC, y: annualCTC, class: 'ctc-row-total ctc-total-value' }
    ];

    // Populate Modal Header & Document Frame
    if (getEl('ctc-modal-name')) getEl('ctc-modal-name').textContent = emp.name;
    if (getEl('ctc-modal-id')) getEl('ctc-modal-id').textContent = emp.id;
    if (getEl('ctc-doc-emp-name')) getEl('ctc-doc-emp-name').textContent = emp.name;
    if (getEl('ctc-doc-emp-id')) getEl('ctc-doc-emp-id').textContent = `Employee ID: ${emp.id}`;

    // Render Table Rows
    const tbody = getEl('ctc-table-body');
    if (tbody) {
        tbody.innerHTML = sections.map(row => {
            if (row.type === 'head') {
                return `<tr class="ctc-section-header"><td colspan="4">${row.title}</td></tr>`;
            }

            const badgeClass = row.type === 'Earning' ? 'badge-earning' : (row.type === 'Deduction' ? 'badge-deduction' : '');
            const typeHtml = badgeClass ? `<span class="ctc-type-badge ${badgeClass}">${row.type}</span>` : `<span class="font-bold">${row.type}</span>`;

            return `
                <tr class="${row.class || ''}">
                    <td>${row.name}</td>
                    <td style="text-align: center;">${typeHtml}</td>
                    <td style="text-align: right; font-family: 'Roboto Mono', monospace;">₹${row.m.toLocaleString()}</td>
                    <td style="text-align: right; font-family: 'Roboto Mono', monospace;">₹${row.y.toLocaleString()}</td>
                </tr>
            `;
        }).join('');
    }

    modal.classList.remove('hidden');
    // Standardized 2px padding scaling
    setTimeout(() => window.autoScaleViewer('ctc-scaling-container', 'ctc-breakdown-modal'), 50);
};

window.closeCTCBreakdownModal = function () {
    const modal = getEl('ctc-breakdown-modal');
    if (modal) modal.classList.add('hidden');
};

// --- PDF Export Logic ---
window.downloadCTCAsPDF = function () {
    const element = document.querySelector('.ctc-card');
    const empName = getEl('ctc-modal-name')?.textContent || 'Employee';
    const logoImg = element?.querySelector('.ctc-branding-header img');

    if (!element) {
        showToast('Error: Document not found', 'error');
        return;
    }

    // High-Resolution Export Options
    const opt = {
        margin: [0.5, 0.5],
        filename: `CTC_Breakdown_${empName.replace(/\s+/g, '_')}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, letterRendering: true },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    };

    // Show loading state
    const btn = document.querySelector('.compact-btn');
    const originalContent = btn.innerHTML;
    btn.innerHTML = 'Generating...';
    btn.disabled = true;

    // Security Fix: Temporarily use Base64 for the logo to avoid Tainted Canvas errors (file:// restriction)
    const originalSrc = logoImg ? logoImg.src : null;
    const base64Logo = "BASE64_LOGO_PLACEHOLDER";
    if (logoImg && base64Logo !== "BASE64_LOGO_PLACEHOLDER") {
        logoImg.src = "data:image/jpeg;base64," + base64Logo;
    }

    html2pdf().set(opt).from(element).save().then(() => {
        if (logoImg) logoImg.src = originalSrc;
        btn.innerHTML = originalContent;
        btn.disabled = false;
        showToast('PDF Exported successfully!', 'success');
    }).catch(err => {
        if (logoImg) logoImg.src = originalSrc;
        console.error('PDF Export Error:', err);
        btn.innerHTML = originalContent;
        btn.disabled = false;
        showToast('Failed to export PDF', 'error');
    });
};

function updateAttSummary() {
    const totalEmp = employees.length;
    const avgAtt = (employees.reduce((acc, emp) => acc + parseFloat(calculateAttPercentageForMonth(emp, currentAttMonth)), 0) / totalEmp).toFixed(1);
    const totalLeaves = employees.reduce((acc, emp) => {
        const att = getMonthlyAttendance(emp, currentAttMonth);
        return acc + att.paidLeave + att.sickLeave + (att.unpaidLeave || 0);
    }, 0);
    const totalDeductions = employees.reduce((acc, emp) => acc + calculateDeductionForMonth(emp, currentSalaryType, currentAttMonth), 0);

    if (getEl('att-total-employees')) getEl('att-total-employees').textContent = totalEmp;
    if (getEl('att-avg-percentage')) getEl('att-avg-percentage').textContent = avgAtt + '%';
    if (getEl('att-total-leaves')) getEl('att-total-leaves').textContent = totalLeaves;
    if (getEl('att-total-deductions')) getEl('att-total-deductions').textContent = '₹' + totalDeductions.toLocaleString();
}

let attendanceInitialized = false;
window.initAttendanceModule = function () {
    if (attendanceInitialized) {
        renderAttendanceTable();
        return;
    }
    const salarySelector = getEl('salary-type-selector');
    if (salarySelector) {
        salarySelector.addEventListener('change', (e) => {
            currentSalaryType = e.target.value;
            renderAttendanceTable();
        });
    }

    const monthFilter = getEl('att-month-filter');
    const searchInput = getEl('att-search');
    const deptFilter = getEl('att-dept-filter');
    const sortFilter = getEl('att-sort');

    const refreshAttendanceTable = () => {
        const searchVal = (searchInput?.value || '').toLowerCase();
        const deptVal = deptFilter?.value || 'all';
        const sortVal = sortFilter?.value || 'none';
        const currentMonth = getEl('att-month-filter')?.value || '';

        let data = [...employees];

        // Filter
        if (searchVal) {
            data = data.filter(e => e.name.toLowerCase().includes(searchVal) || e.id.toLowerCase().includes(searchVal));
        }
        if (deptVal !== 'all') {
            data = data.filter(e => e.dept === deptVal);
        }

        // Sort
        if (sortVal !== 'none') {
            data.sort((a, b) => {
                if (sortVal === 'id-asc') return a.id.localeCompare(b.id, undefined, { numeric: true });
                if (sortVal === 'id-desc') return b.id.localeCompare(a.id, undefined, { numeric: true });

                if (sortVal.startsWith('att-')) {
                    const pctA = calculateAttPercentageForMonth(a, currentMonth);
                    const pctB = calculateAttPercentageForMonth(b, currentMonth);
                    return sortVal === 'att-asc' ? pctA - pctB : pctB - pctA;
                }
                return 0;
            });
        }

        renderAttendanceTable(data);
    };

    if (monthFilter) monthFilter.addEventListener('change', refreshAttendanceTable);
    if (searchInput) searchInput.addEventListener('input', refreshAttendanceTable);
    if (deptFilter) deptFilter.addEventListener('change', refreshAttendanceTable);
    if (sortFilter) sortFilter.addEventListener('change', refreshAttendanceTable);

    // --- Export Dropdown ---
    const exportBtn = getEl('att-export-btn');
    const exportDropdown = getEl('att-export-dropdown');
    if (exportBtn && exportDropdown) {
        exportBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            exportDropdown.classList.toggle('hidden');
        });
        document.addEventListener('click', () => exportDropdown.classList.add('hidden'));
        exportDropdown.addEventListener('click', (e) => e.stopPropagation());
    }

    // Helper: get currently filtered attendance data
    function getFilteredAttendanceData() {
        const searchVal = (getEl('att-search')?.value || '').toLowerCase();
        const deptVal = getEl('att-dept-filter')?.value || 'all';
        let data = [...employees];
        if (searchVal) data = data.filter(e => e.name.toLowerCase().includes(searchVal) || e.id.toLowerCase().includes(searchVal));
        if (deptVal !== 'all') data = data.filter(e => e.dept === deptVal);
        return data;
    }

    function getMonthLabel() {
        const sel = getEl('att-month-filter');
        return sel ? sel.options[sel.selectedIndex].text : 'Report';
    }

    // Export CSV
    getEl('att-export-csv')?.addEventListener('click', () => {
        exportDropdown.classList.add('hidden');
        const data = getFilteredAttendanceData();
        const header = ['Employee ID', 'Employee Name', 'Department', 'Salary', 'Deductions', 'Net Salary', 'Attendance %'];
        const rows = data.map(emp => {
            const gross = currentSalaryType === 'monthly' ? emp.monthlySalary : (emp.dailyWage * emp.totalWorking);
            const ded = calculateEstimatedDeduction(emp, currentSalaryType);
            return [emp.id, emp.name, emp.dept, gross, ded, gross - ded, calculateAttPercentage(emp) + '%'];
        });
        const csv = [header, ...rows].map(r => r.map(c => `"${c}"`).join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = `Attendance_Report_${getMonthLabel().replace(/\s+/g, '_')}.csv`;
        a.click(); URL.revokeObjectURL(url);
    });

    // Export PDF / Print (shared HTML generation)
    function generatePrintHTML(data) {
        const monthLabel = getMonthLabel();
        const totalEmp = data.length;
        const avgAtt = totalEmp > 0 ? Math.round(data.reduce((a, e) => a + calculateAttPercentage(e), 0) / totalEmp) : 0;
        const totalDed = data.reduce((a, e) => a + calculateEstimatedDeduction(e, currentSalaryType), 0);

        let tableRows = data.map(emp => {
            const gross = currentSalaryType === 'monthly' ? emp.monthlySalary : (emp.dailyWage * emp.totalWorking);
            const ded = calculateEstimatedDeduction(emp, currentSalaryType);
            return `<tr>
                <td>${emp.id}</td><td>${emp.name}</td><td>${emp.dept}</td>
                <td style="text-align:right">₹${gross.toLocaleString()}</td>
                <td style="text-align:right;color:#ef4444">₹${ded.toLocaleString()}</td>
                <td style="text-align:right;color:#10b981">₹${(gross - ded).toLocaleString()}</td>
                <td style="text-align:center">${calculateAttPercentage(emp)}%</td>
            </tr>`;
        }).join('');

        return `<!DOCTYPE html><html><head><title>Attendance Report - ${monthLabel}</title>
        <style>
            * { margin:0; padding:0; box-sizing:border-box; }
            body { font-family: 'Inter', Arial, sans-serif; padding: 40px; color: #0f172a; }
            .header { text-align: center; margin-bottom: 32px; border-bottom: 2px solid #3B82F6; padding-bottom: 20px; }
            .header h1 { font-size: 22px; color: #1e293b; margin-bottom: 4px; }
            .header p { font-size: 13px; color: #64748b; }
            .summary { display: flex; gap: 24px; margin-bottom: 24px; }
            .summary-item { flex:1; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; text-align: center; }
            .summary-item .label { font-size: 11px; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.05em; }
            .summary-item .value { font-size: 20px; font-weight: 700; margin-top: 4px; }
            table { width: 100%; border-collapse: collapse; font-size: 13px; }
            th { background: #f1f5f9; color: #64748b; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; padding: 10px 12px; text-align: left; border-bottom: 2px solid #e2e8f0; }
            td { padding: 10px 12px; border-bottom: 1px solid #e2e8f0; }
            tr:nth-child(even) { background: #fafbfc; }
            .footer { margin-top: 32px; text-align: center; font-size: 11px; color: #94a3b8; }
            @media print { body { padding: 20px; } }
        </style></head><body>
        <div class="header">
            <h1>PPS Software — Attendance Report</h1>
            <p>${monthLabel} | Generated: ${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
        </div>
        <div class="summary">
            <div class="summary-item"><div class="label">Total Employees</div><div class="value">${totalEmp}</div></div>
            <div class="summary-item"><div class="label">Avg Attendance</div><div class="value">${avgAtt}%</div></div>
            <div class="summary-item"><div class="label">Total Deductions</div><div class="value" style="color:#ef4444">₹${totalDed.toLocaleString()}</div></div>
        </div>
        <table><thead><tr><th>ID</th><th>Name</th><th>Dept</th><th style="text-align:right">Salary</th><th style="text-align:right">Deduction</th><th style="text-align:right">Net Salary</th><th style="text-align:center">Attendance</th></tr></thead>
        <tbody>${tableRows}</tbody></table>
        <div class="footer">PPS Software Solution — Confidential</div>
        </body></html>`;
    }

    getEl('att-export-pdf')?.addEventListener('click', () => {
        exportDropdown.classList.add('hidden');
        const data = getFilteredAttendanceData();
        const printWin = window.open('', '_blank');
        printWin.document.write(generatePrintHTML(data));
        printWin.document.close();
        setTimeout(() => { printWin.print(); }, 500);
    });

    getEl('att-export-print')?.addEventListener('click', () => {
        exportDropdown.classList.add('hidden');
        const data = getFilteredAttendanceData();
        const printWin = window.open('', '_blank');
        printWin.document.write(generatePrintHTML(data));
        printWin.document.close();
        setTimeout(() => { printWin.print(); }, 500);
    });

    // --- Settings Modal ---
    const settingsBtn = getEl('leave-policy-btn');
    const settingsModal = getEl('att-settings-modal');
    const settingsCloseBtn = getEl('att-settings-close');

    // Load saved settings
    const defaultSettings = { workdays: 30, hours: 8, late: 15, leavedays: 2, deductRule: 'per-day', halfday: '50', showSalary: true, showDeduction: true, showAtt: true };
    let attSettings = JSON.parse(localStorage.getItem('pps-att-settings') || 'null') || { ...defaultSettings };

    function applySettingsToForm() {
        if (getEl('att-set-workdays')) getEl('att-set-workdays').value = attSettings.workdays;
        if (getEl('att-set-hours')) getEl('att-set-hours').value = attSettings.hours;
        if (getEl('att-set-late')) getEl('att-set-late').value = attSettings.late;
        if (getEl('att-set-leavedays')) getEl('att-set-leavedays').value = attSettings.leavedays || 2;
        if (getEl('att-set-deduct-rule')) getEl('att-set-deduct-rule').value = attSettings.deductRule;
        if (getEl('att-set-halfday')) getEl('att-set-halfday').value = attSettings.halfday;
        if (getEl('att-pref-salary')) getEl('att-pref-salary').checked = attSettings.showSalary;
        if (getEl('att-pref-deduction')) getEl('att-pref-deduction').checked = attSettings.showDeduction;
        if (getEl('att-pref-attpct')) getEl('att-pref-attpct').checked = attSettings.showAtt;
    }

    function closeSettingsModal() {
        if (settingsModal) settingsModal.classList.add('hidden');
    }

    if (settingsBtn && settingsModal) {
        settingsBtn.addEventListener('click', () => {
            applySettingsToForm();
            settingsModal.classList.remove('hidden');
        });
        settingsModal.addEventListener('click', (e) => {
            if (e.target === settingsModal) closeSettingsModal();
        });
    }
    if (settingsCloseBtn) {
        settingsCloseBtn.addEventListener('click', closeSettingsModal);
    }


    // Save Settings
    getEl('att-settings-save')?.addEventListener('click', () => {
        attSettings = {
            workdays: parseInt(getEl('att-set-workdays')?.value) || 30,
            hours: parseInt(getEl('att-set-hours')?.value) || 8,
            late: parseInt(getEl('att-set-late')?.value) || 15,
            leavedays: parseInt(getEl('att-set-leavedays')?.value) || 2,
            deductRule: getEl('att-set-deduct-rule')?.value || 'per-day',
            halfday: getEl('att-set-halfday')?.value || '50',
            showSalary: getEl('att-pref-salary')?.checked !== false,
            showDeduction: getEl('att-pref-deduction')?.checked !== false,
            showAtt: getEl('att-pref-attpct')?.checked !== false,
        };
        localStorage.setItem('pps-att-settings', JSON.stringify(attSettings));
        settingsModal.classList.add('hidden');
        renderAttendanceTable();
        alert('Settings saved successfully!');
    });

    // Reset Settings
    getEl('att-settings-reset')?.addEventListener('click', () => {
        attSettings = { ...defaultSettings };
        applySettingsToForm();
        localStorage.setItem('pps-att-settings', JSON.stringify(attSettings));
        renderAttendanceTable();
        alert('Settings reset to defaults.');
    });

    renderAttendanceTable();
    attendanceInitialized = true;
}

// Ensure it initializes when dashboard is shown or view switched
const originalShowView = window.showView;
window.showView = function (viewId) {
    originalShowView(viewId);
    if (viewId === 'admin-attendance') {
        initAttendanceModule();
    }
    if (viewId === 'admin-leave') {
        window.initAdminLeaveModule();
    }
    if (viewId === 'admin-bonuses') {
        initBonusesDeductionsModule();
    }
    if (viewId === 'employee-leave') {
        initEmployeeLeaveModule();
    }
};

// --- Leave Management Logic ---
let adminLeaveInitialized = false;
window.initAdminLeaveModule = function () {
    // Fix: Relocate modals to <body> if they're trapped inside hidden parent containers
    // (The payslip-modal area has malformed HTML that causes browser parsers to nest these modals inside it)
    ['leave-type-modal', 'apply-leave-modal', 'bonus-deduction-modal'].forEach(modalId => {
        const modal = getEl(modalId);
        if (modal && modal.parentElement !== document.body) {
            document.body.appendChild(modal);
        }
    });

    if (adminLeaveInitialized) {
        window.renderAdminLeaveTypes();
        window.renderAdminLeaveRequests();
        window.renderAdminLeaveCalendar();
        return;
    }

    // Setup Leave Type Form
    const typeForm = getEl('leave-type-form');
    if (typeForm) {
        typeForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const idInput = getEl('edit-leave-type-id').value.trim();
            const name = getEl('leave-type-name').value.trim();
            const code = getEl('leave-type-code').value.trim();
            const category = getEl('leave-type-category').value;
            const description = getEl('leave-type-desc').value.trim();
            const isPaid = category === 'Paid';

            // Validate required fields
            if (!name || !code) {
                window.showToast('Please fill in all required fields.', 'warning');
                return;
            }

            // Check for duplicate leave code (excluding current item when editing)
            const duplicateCode = leaveTypes.find(t => t.code.toLowerCase() === code.toLowerCase() && t.id !== idInput);
            if (duplicateCode) {
                window.showToast(`Leave ID "${code}" is already used by "${duplicateCode.name}". Please use a unique ID.`, 'error');
                return;
            }

            if (idInput) {
                // Edit existing leave type
                const type = leaveTypes.find(t => t.id === idInput);
                if (type) {
                    type.name = name;
                    type.code = code;
                    type.category = category;
                    type.isPaid = isPaid;
                    type.desc = description;
                }
                window.showToast(`"${name}" leave type updated successfully.`, 'success');
            } else {
                // Add new leave type
                const newId = window.getNextLeaveTypeId();
                leaveTypes.push({ id: newId, name, code, isPaid, category, desc: description });
                window.showToast(`"${name}" leave type created successfully.`, 'success');
            }

            window.saveLeaveData();
            window.closeLeaveTypeModal();
        });
    }

    window.renderAdminLeaveTypes();
    window.renderAdminLeaveRequests();
    window.renderAdminLeaveCalendar();
    adminLeaveInitialized = true;
};

window.renderAdminLeaveCalendar = function () {
    const container = getEl('admin-leave-calendar-container');
    if (!container) return;

    container.innerHTML = '';

    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    // Add Days of week headers
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    daysOfWeek.forEach(d => {
        container.innerHTML += `<div class="text-xs font-bold text-muted p-1">${d}</div>`;
    });

    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    for (let i = 0; i < firstDay; i++) {
        container.innerHTML += `<div class="p-2"></div>`;
    }

    // Filter ALL leaves for this month (not just approved)
    const monthLeaves = leaveRequests.filter(req => {
        const startDate = req.start_date || req.startDate;
        const endDate = req.end_date || req.endDate;
        const sd = new Date(startDate);
        const ed = new Date(endDate);
        return (sd.getMonth() === currentMonth || ed.getMonth() === currentMonth);
    });

    const statusColors = {
        'Approved': { bg: '#22c55e', text: '#ffffff', border: '#16a34a' },
        'Pending': { bg: '#f59e0b', text: '#ffffff', border: '#d97706' },
        'Rejected': { bg: '#ef4444', text: '#ffffff', border: '#dc2626' }
    };

    for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const currentDate = new Date(dateStr);
        let leavesOnDay = [];

        monthLeaves.forEach(req => {
            const startDate = req.start_date || req.startDate;
            const endDate = req.end_date || req.endDate;
            const sd = new Date(startDate);
            const ed = new Date(endDate);
            if (currentDate >= sd && currentDate <= ed) {
                const empId = req.employee_id || req.empId;
                const emp = employees.find(e => e.id === empId);
                const leaveType = req.leave_type || 'Leave';
                if (emp) leavesOnDay.push({ name: emp.name, status: req.status, leaveType });
            }
        });

        const isToday = day === today.getDate() && currentMonth === today.getMonth();
        let cellContent = `<div class="p-2 border rounded" style="min-height: 70px; display: flex; flex-direction: column; gap: 4px; ${isToday ? 'border-color: var(--primary); background: rgba(59,130,246,0.06);' : ''}">
            <div class="text-right text-xs font-bold ${isToday ? 'text-blue' : 'text-muted'}">${day}</div>
            <div style="display: flex; flex-direction: column; gap: 3px;">`;

        leavesOnDay.forEach(l => {
            const col = statusColors[l.status] || statusColors['Pending'];
            const firstName = l.name.split(' ')[0];
            cellContent += `<div style="background:${col.bg}; color:${col.text}; font-size:0.65rem; padding:2px 4px; border-radius:4px; border-left:3px solid ${col.border}; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;" 
                                 title="${l.name} — ${l.leaveType} (${l.status})">
                                 ${firstName}
                            </div>`;
        });

        cellContent += `</div></div>`;
        container.innerHTML += cellContent;
    }
};

window.renderAdminLeaveTypes = function () {
    const tbody = getEl('admin-leave-types-body');
    if (!tbody) return;

    if (leaveTypes.length === 0) {
        tbody.innerHTML = `<tr><td colspan="3" class="text-center py-4 text-muted">No leave types found.</td></tr>`;
        return;
    }

    tbody.innerHTML = '';
    leaveTypes.forEach(lt => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>
                <div class="type-cell">
                    <span class="type-name" title="${lt.name}">${lt.name}</span>
                    <span class="type-code">${lt.code}</span>
                    <span class="text-xs text-muted" style="display:block;margin-top:2px;">${lt.desc}</span>
                </div>
            </td>
            <td style="text-align: center;">
                <span class="badge ${lt.category === 'Paid' ? 'badge-green' : 'badge-red'}" style="font-size: 0.65rem; padding: 2px 6px;">${lt.category}</span>
            </td>
            <td>
                <div class="actions-cell">
                    <button class="btn edit-btn" data-action="edit-leave-type" data-id="${lt.id}">✎</button>
                    <button class="btn delete-btn" data-action="delete-leave-type" data-id="${lt.id}">🗑</button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
};

window.showAddLeaveRequestModal = function () {
    // Build employee select options
    const empOptions = employees.map(e => `<option value="${e.id}">${e.name} (${e.id})</option>`).join('');
    const typeOptions = leaveTypes.map(t => `<option value="${t.name}">${t.name}</option>`).join('');

    // Create modal dynamically
    let modal = getEl('add-leave-request-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'add-leave-request-modal';
        modal.className = 'modal-overlay';
        document.body.appendChild(modal);
    }
    modal.innerHTML = `
        <div class="modal" style="max-width: 480px; max-height: 90vh; display: flex; flex-direction: column; padding: 0;">
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 1.25rem 1.5rem; border-bottom: 1px solid var(--border); flex-shrink: 0;">
                <h2 style="font-size: 1.15rem; font-weight: 700; margin: 0;">Add Leave Request</h2>
                <button type="button" onclick="getEl('add-leave-request-modal').classList.add('hidden')" style="width:30px;height:30px;border-radius:50%;border:1px solid var(--border);background:var(--bg-alt);color:var(--text-muted);cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:1rem;">&#10005;</button>
            </div>
            <div style="padding: 1.25rem 1.5rem; display: flex; flex-direction: column; gap: 1rem; overflow-y: auto; flex: 1;">
                <div class="form-group">
                    <label class="form-label">Employee</label>
                    <select id="lr-employee" class="form-select">${empOptions}</select>
                </div>
                <div class="form-group">
                    <label class="form-label">Leave Type</label>
                    <select id="lr-type" class="form-select">${typeOptions}</select>
                </div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem;">
                    <div class="form-group">
                        <label class="form-label">Start Date</label>
                        <input type="date" id="lr-start" class="form-input" value="${new Date().toISOString().split('T')[0]}">
                    </div>
                    <div class="form-group">
                        <label class="form-label">End Date</label>
                        <input type="date" id="lr-end" class="form-input" value="${new Date().toISOString().split('T')[0]}">
                    </div>
                </div>
                <div class="form-group">
                    <label class="form-label">Reason</label>
                    <textarea id="lr-reason" class="form-input" rows="2" placeholder="Enter reason for leave..."></textarea>
                </div>
            </div>
            <div style="display: flex; justify-content: flex-end; gap: 0.75rem; padding: 1rem 1.5rem; border-top: 1px solid var(--border); flex-shrink: 0;">
                <button type="button" class="btn btn-outline" onclick="getEl('add-leave-request-modal').classList.add('hidden')">Cancel</button>
                <button type="button" class="btn btn-primary" onclick="submitLeaveRequest()">Submit Request</button>
            </div>
        </div>
    `;
    modal.classList.remove('hidden');
    modal.addEventListener('click', (e) => { if (e.target === modal) modal.classList.add('hidden'); });
};

window.submitLeaveRequest = function () {
    const empId = getEl('lr-employee')?.value;
    const leaveType = getEl('lr-type')?.value;
    const startDate = getEl('lr-start')?.value;
    const endDate = getEl('lr-end')?.value;
    const reason = getEl('lr-reason')?.value || '';

    if (!empId || !leaveType || !startDate || !endDate) {
        alert('Please fill all required fields.');
        return;
    }
    if (new Date(endDate) < new Date(startDate)) {
        alert('End date cannot be before start date.');
        return;
    }

    const newReq = {
        id: 'LR' + Date.now(),
        employee_id: empId,
        leave_type: leaveType,
        start_date: startDate,
        end_date: endDate,
        reason: reason,
        status: 'Pending',
        created_at: new Date().toISOString().split('T')[0]
    };

    leaveRequests.push(newReq);
    window.saveLeaveData();
    getEl('add-leave-request-modal')?.classList.add('hidden');
    window.renderAdminLeaveCalendar?.();
    alert('Leave request submitted successfully!');
};

window.showAddLeaveTypeModal = function (id = null) {
    const modal = getEl('leave-type-modal');
    if (!modal) return;

    const form = getEl('leave-type-form');
    if (form) form.reset();

    const submitBtn = getEl('leave-type-submit-btn');

    if (id) {
        // Edit mode — pre-fill all fields with existing leave type data
        const type = leaveTypes.find(t => t.id === id);
        if (type) {
            getEl('leave-type-modal-title').textContent = 'Edit Leave Type';
            getEl('leave-type-id-display').textContent = type.id;
            getEl('edit-leave-type-id').value = type.id;
            getEl('leave-type-name').value = type.name;
            getEl('leave-type-code').value = type.code || '';
            getEl('leave-type-category').value = type.category || (type.isPaid ? 'Paid' : 'Unpaid');
            getEl('leave-type-desc').value = type.desc || type.description || '';
            if (submitBtn) submitBtn.textContent = 'Update';
        }
    } else {
        // Add mode — auto-generate ID and leave code
        getEl('leave-type-modal-title').textContent = 'Add Leave Type';
        const newId = window.getNextLeaveTypeId();
        getEl('leave-type-id-display').textContent = newId;
        getEl('edit-leave-type-id').value = '';
        if (submitBtn) submitBtn.textContent = 'Create Leave';
    }

    modal.classList.remove('hidden');

    // Click outside modal to close
    modal.onclick = function (e) {
        if (e.target === modal) window.closeLeaveTypeModal();
    };
};

window.closeLeaveTypeModal = function () {
    const modal = getEl('leave-type-modal');
    if (modal) modal.classList.add('hidden');
};

window.deleteLeaveType = function (id) {
    if (confirm('Are you sure you want to delete this leave type? Past requests will not be affected.')) {
        leaveTypes = leaveTypes.filter(t => t.id !== id);
        window.saveLeaveData();
        if (window.showToast) window.showToast('Leave type deleted.', 'success');
    }
};

window.renderAdminLeaveRequests = function () {
    const tbody = getEl('admin-leave-requests-body');
    if (!tbody) return;

    // Sort logic (Pending first, then by date descending)
    const sorted = [...leaveRequests].sort((a, b) => {
        if (a.status === 'Pending' && b.status !== 'Pending') return -1;
        if (a.status !== 'Pending' && b.status === 'Pending') return 1;
        const dateA = new Date(a.created_at || a.appliedDate);
        const dateB = new Date(b.created_at || b.appliedDate);
        return dateB - dateA;
    });

    // Update count badge
    const countEl = getEl('leave-req-count');
    if (countEl) countEl.textContent = sorted.length;

    if (sorted.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" class="text-center py-4 text-muted" style="font-style: italic;">No leave requests yet. New requests will appear here.</td></tr>`;
        return;
    }

    tbody.innerHTML = '';
    sorted.forEach(req => {
        const empId = req.employee_id || req.empId;
        const emp = employees.find(e => e.id === empId) || { name: 'Unknown', dept: '' };
        const leaveTypeName = req.leave_type || (leaveTypes.find(t => t.id === req.typeId)?.name || 'Unknown');

        const startDate = req.start_date || req.startDate;
        const endDate = req.end_date || req.endDate;
        const sd = new Date(startDate);
        const ed = new Date(endDate);
        const days = Math.round((ed - sd) / (1000 * 60 * 60 * 24)) + 1;

        const fmtDate = (d) => d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
        const dateRange = days === 1 ? fmtDate(sd) : `${fmtDate(sd)} — ${fmtDate(ed)}`;

        let statusBadge = '';
        if (req.status === 'Pending') statusBadge = '<span class="badge badge-orange">Pending</span>';
        else if (req.status === 'Approved') statusBadge = '<span class="badge badge-green">Approved</span>';
        else statusBadge = '<span class="badge badge-red">Rejected</span>';

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td class="employee-cell">
                <div class="font-medium">${emp.name}</div>
                <div class="employee-id">${empId}</div>
            </td>
            <td><span class="text-sm">${leaveTypeName}</span></td>
            <td><span class="text-sm">${dateRange}</span></td>
            <td style="text-align: center;">${days} Day${days > 1 ? 's' : ''}</td>
            <td style="text-align: center;">${statusBadge}</td>
            <td>
                ${req.status === 'Pending' ? `
                    <div class="action-buttons">
                        <button class="btn approve-btn" onclick="updateLeaveStatus('${req.id}', 'Approved')">✔</button>
                        <button class="btn reject-btn" onclick="updateLeaveStatus('${req.id}', 'Rejected')">✖</button>
                    </div>
                ` : `
                    <span class="text-xs text-muted">Processed</span>
                `}
            </td>
        `;
        tbody.appendChild(tr);
    });
};

window.updateLeaveStatus = function (reqId, newStatus) {
    const req = leaveRequests.find(r => r.id === reqId);
    if (req) {
        req.status = newStatus;
        window.saveLeaveData();
        window.renderAdminLeaveRequests();
        window.renderAdminLeaveCalendar?.();
    }
};

window.renderBonusesDeductionsTable = function () {
    const tbody = getEl('bd-table-body');
    if (!tbody) return;

    const query = getEl('bd-search')?.value.toLowerCase() || '';
    const type = getEl('bd-type-filter')?.value || 'all';
    const cat = getEl('bd-category-filter')?.value || 'all';

    let filtered = bonusesDeductions.filter(item => {
        const matchesSearch = (item.empName || '').toLowerCase().includes(query) || (item.empId || '').toLowerCase().includes(query) || (item.title || '').toLowerCase().includes(query);
        const matchesType = type === 'all' || item.type === type;
        const matchesCat = cat === 'all' || item.category === cat;

        const monthFilterVal = getEl('bd-month-select-filter')?.value || 'all';
        const yearFilterVal = getEl('bd-year-select-filter')?.value || 'all';
        const [itemYear, itemMonth] = item.effectiveMonth.split('-');
        const matchesMonth = monthFilterVal === 'all' || itemMonth === monthFilterVal;
        const matchesYear = yearFilterVal === 'all' || itemYear === yearFilterVal;

        return matchesSearch && matchesType && matchesCat && matchesMonth && matchesYear;
    });

    window.updateBonusesDeductionsMetrics(filtered);
    filtered.sort((a, b) => b.effectiveMonth.localeCompare(a.effectiveMonth) || b.date.localeCompare(a.date));

    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" class="text-center py-6 text-muted">No records found matching your filters.</td></tr>`;
        const scrollContainer = getEl('bd-table-scroll-container');
        if (scrollContainer) scrollContainer.classList.remove('has-scroll');
        return;
    }

    tbody.innerHTML = '';
    filtered.forEach(item => {
        const tr = document.createElement('tr');
        const statusClass = item.status === 'Applied' ? 'badge-blue' : 'badge-orange';
        const emp = employees.find(e => e.id === item.empId) || {};
        const empEmail = (emp.email || 'N/A').toLowerCase();

        tr.innerHTML = `
            <td>
                <div class="font-bold text-sm" style="color: var(--text);">${item.empName}</div>
                <div class="text-xs text-muted leading-tight">${empEmail}</div>
                <div class="text-xs font-bold text-primary mt-1" style="background: var(--primary-light); display: inline-block; padding: 1px 6px; border-radius: 4px; letter-spacing: 0.02em;">${item.empId}</div>
            </td>
            <td>
                <div class="text-xs font-bold uppercase tracking-wider ${item.type === 'Bonus' ? 'text-green' : 'text-red'}" style="margin-bottom: 2px;">${item.type}</div>
                <div class="text-xs text-muted truncate" style="max-width: 150px;" title="${item.title}">${item.title}</div>
            </td>
            <td>
                <span class="text-xs font-medium px-2 py-0.5 rounded-full" style="background: var(--bg-alt); color: var(--text-secondary);">${item.category}</span>
            </td>
            <td><span class="font-bold text-sm" style="color: var(--text);">₹${item.amount.toLocaleString()}</span></td>
            <td><div class="text-xs font-medium">${item.effectiveMonth.split('-').reverse().join('/')}</div></td>
            <td><span class="badge ${statusClass}" style="font-size: 0.65rem; padding: 2px 8px; border-radius: 999px;">${item.status}</span></td>
            <td style="text-align: right;">
                <div style="display: flex; gap: 0.4rem; justify-content: flex-end;">
                    <button class="action-btn" onclick="showAddBonusDeductionModal('${item.id}')" title="Edit"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg></button>
                    <button class="action-btn" onclick="deleteBonusDeduction('${item.id}')" title="Delete"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg></button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });

    const scrollContainer = getEl('bd-table-scroll-container');
    if (scrollContainer) {
        // Apply has-scroll only if there are enough records to warrant it
        const shouldScroll = filtered.length > 5;
        scrollContainer.classList.toggle('has-scroll', shouldScroll);

        // Ensure the inner table-container doesn't also scroll
        const innerTable = scrollContainer.querySelector('.table-container');
        if (innerTable) {
            innerTable.style.overflowY = shouldScroll ? 'visible' : 'auto';
            innerTable.style.maxHeight = shouldScroll ? 'none' : '500px';
        }
    }

};

window.updateBonusesDeductionsMetrics = function (data) {
    const totalBonus = data.filter(item => item.type === 'Bonus').reduce((sum, item) => sum + item.amount, 0);
    const totalDeduction = data.filter(item => item.type === 'Deduction').reduce((sum, item) => sum + item.amount, 0);
    const net = totalBonus - totalDeduction;

    if (getEl('bd-total-bonus')) getEl('bd-total-bonus').textContent = `₹${totalBonus.toLocaleString()}`;
    if (getEl('bd-total-deduction')) getEl('bd-total-deduction').textContent = `₹${totalDeduction.toLocaleString()}`;
    if (getEl('bd-net-adjustment')) {
        getEl('bd-net-adjustment').textContent = `₹${Math.abs(net).toLocaleString()}`;
        // If net is positive, company is paying more bonuses (Blue/Info)
        // If net is negative, company has more deductions (Neutral/Muted or Success if saving)
        // User asked: Bonus -> green, Deduction -> red, Net -> neutral or blue
        getEl('bd-net-adjustment').className = 'text-3xl font-bold mt-2 ' + (net >= 0 ? 'text-blue' : 'text-muted');
    }
};

window.showAddBonusDeductionModal = function (id = null) {
    const modal = getEl('bonus-deduction-modal');
    if (!modal) return;

    getEl('bd-form').reset();
    getEl('bd-edit-id').value = id || '';
    getEl('bd-modal-title').textContent = id ? 'Edit Salary Adjustment' : 'Create New Salary Adjustment';

    const select = getEl('bd-employee-select');
    if (select) {
        select.innerHTML = '<option value="" disabled selected>Select Employee</option>';
        employees.forEach(emp => {
            select.innerHTML += `<option value="${emp.id}">${emp.name} (${emp.id})</option>`;
        });
    }

    if (id) {
        const item = bonusesDeductions.find(b => b.id === id);
        if (item) {
            getEl('bd-employee-select').value = item.empId;
            getEl('bd-type-select').value = item.type;
            getEl('bd-category-select').value = item.category || 'Other';
            getEl('bd-title').value = item.title;
            getEl('bd-amount').value = item.amount;

            // Split Effective Month (YYYY-MM)
            const [year, month] = item.effectiveMonth.split('-');
            if (getEl('bd-month-select')) getEl('bd-month-select').value = month;
            if (getEl('bd-year-select')) getEl('bd-year-select').value = year;

            getEl('bd-date').value = item.date;
        }
    } else {
        const now = new Date();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const year = String(now.getFullYear());

        if (getEl('bd-month-select')) getEl('bd-month-select').value = month;
        if (getEl('bd-year-select')) getEl('bd-year-select').value = year;

        getEl('bd-date').value = now.toISOString().split('T')[0];
    }

    modal.classList.remove('hidden');
};

window.closeBonusDeductionModal = function () {
    getEl('bonus-deduction-modal')?.classList.add('hidden');
};

window.deleteBonusDeduction = function (id) {
    const item = bonusesDeductions.find(b => b.id === id);
    if (!item) return;

    if (item.status === 'Applied') {
        alert('Cannot delete an adjustment that has already been applied to a processed payroll.');
        return;
    }

    if (confirm('Are you sure you want to delete this adjustment?')) {
        bonusesDeductions = bonusesDeductions.filter(b => b.id !== id);
        window.saveBonusesDeductions();
    }
};

let employeeLeaveInitialized = false;
function initEmployeeLeaveModule() {
    // Only init if an employee is logged in
    const userRole = localStorage.getItem('pps-role');
    const userEmail = localStorage.getItem('pps-user');
    if (userRole !== 'employee') return;

    const emp = employees.find(e => e.email === userEmail);
    if (!emp) return;

    if (employeeLeaveInitialized) {
        window.renderEmployeeLeaveBalance(emp.id);
        window.renderEmployeeLeaveHistory(emp.id);
        return;
    }

    // Setup Apply Leave Form
    const applyForm = getEl('apply-leave-form');
    if (applyForm) {
        applyForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const typeId = getEl('emp-leave-type-select').value;
            const startDate = getEl('leave-start-date').value;
            const endDate = getEl('leave-end-date').value;
            const reason = getEl('leave-reason').value;

            if (new Date(startDate) > new Date(endDate)) {
                alert('End Date must be after Start Date.');
                return;
            }

            const newId = 'LR' + String(leaveRequests.length + 1).padStart(4, '0');
            const leaveTypeObj = leaveTypes.find(t => t.id === typeId) || { name: 'Unknown' };
            const appliedDate = new Date().toISOString().split('T')[0];
            const createdAt = new Date().toLocaleString();
            
            const durationInput = getEl('leave-duration');
            const duration = durationInput ? durationInput.value : 'Full Day';
            const requestType = duration === 'Early Exit' ? 'EARLY_EXIT' : 'STANDARD';

            leaveRequests.push({
                id: newId,
                empId: emp.id,
                employee_id: emp.id,
                typeId,
                leave_type: leaveTypeObj.name,
                startDate,
                start_date: startDate,
                endDate,
                end_date: endDate,
                reason,
                duration,
                requestType,
                status: 'Pending',
                appliedDate,
                created_at: createdAt
            });

            window.saveLeaveData();
            window.closeApplyLeaveModal();
            alert('Leave request submitted successfully.');
        });
    }

    window.renderEmployeeLeaveBalance(emp.id);
    window.renderEmployeeLeaveHistory(emp.id);
    employeeLeaveInitialized = true;
}

window.renderEmployeeLeaveBalance = function (empId) {
    if (!empId) {
        const userEmail = localStorage.getItem('pps-user');
        const emp = employees.find(e => e.email === userEmail);
        if (emp) empId = emp.id; else return;
    }

    const container = getEl('emp-leave-balance');
    if (!container) return;

    // We only display Paid leave balance metrics for simplicity unless unpaid is requested
    const defaultLimits = {
        'Privilege Leave': 15,
        'Sick Leave': 10,
        'Casual Leave': 5
    };

    container.innerHTML = '';

    leaveTypes.filter(lt => lt.isPaid).forEach(lt => {
        const limit = defaultLimits[lt.name] || 15;

        // Count approved days for this leave type for this employee in the current year
        const usedDays = leaveRequests.filter(req => req.empId === empId && req.typeId === lt.id && req.status === 'Approved').reduce((acc, req) => {
            const sd = new Date(req.startDate);
            const ed = new Date(req.endDate);
            return acc + (Math.round((ed - sd) / (1000 * 60 * 60 * 24)) + 1);
        }, 0);

        const remaining = Math.max(0, limit - usedDays);
        const percent = Math.min(100, (usedDays / limit) * 100);

        container.innerHTML += `
            <div class="flex-column gap-1">
                <div class="flex-between text-sm">
                    <span class="font-medium">${lt.name}</span>
                    <span class="text-muted"><strong class="text-blue-dark">${usedDays}</strong> / ${limit} Used</span>
                </div>
                <div class="progress-bar"><div class="progress-fill ${percent > 80 ? 'bg-red' : 'bg-blue'}" style="width: ${percent}%"></div></div>
                <div class="text-xs text-muted text-right">${remaining} Days Remaining</div>
            </div>
        `;
    });
};

window.renderEmployeeLeaveHistory = function (empId) {
    if (!empId) {
        const userEmail = localStorage.getItem('pps-user');
        const emp = employees.find(e => e.email === userEmail);
        if (emp) empId = emp.id; else return;
    }

    const tbody = getEl('emp-leave-history');
    if (!tbody) return;

    const myReqs = leaveRequests.filter(r => r.empId === empId).sort((a, b) => new Date(b.appliedDate) - new Date(a.appliedDate));

    if (myReqs.length === 0) {
        tbody.innerHTML = `<tr><td colspan="3" class="text-center py-4 text-muted">No leave history found.</td></tr>`;
        return;
    }

    tbody.innerHTML = '';
    myReqs.forEach(req => {
        const type = leaveTypes.find(t => t.id === req.typeId) || { name: 'Unknown', isPaid: true };

        const sd = new Date(req.startDate);
        const ed = new Date(req.endDate);
        const days = Math.round((ed - sd) / (1000 * 60 * 60 * 24)) + 1;

        // Format dates nicely
        const sStr = sd.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
        const eStr = ed.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

        let statusBadge = '';
        if (req.status === 'Pending') statusBadge = '<span class="badge badge-orange">Pending</span>';
        else if (req.status === 'Approved') statusBadge = '<span class="badge badge-green">Approved</span>';
        else statusBadge = '<span class="badge badge-red">Rejected</span>';

        // Truncate Reason
        const shortReason = req.reason.length > 30 ? req.reason.substring(0, 30) + '...' : req.reason;

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>
                <div class="font-medium">${sStr} - ${eStr}</div>
                <div class="text-xs text-muted">Applied on ${req.appliedDate}</div>
            </td>
            <td>
                <div class="text-sm font-bold flex align-center gap-2">
                    ${type.name}
                    ${type.isPaid ? '<span class="text-xs text-green" title="Paid Level">&bull; Paid</span>' : '<span class="text-xs text-red" title="Unpaid Leave">&bull; Unpaid</span>'}
                </div>
                <div class="text-xs text-muted">${days} Day(s) - ${shortReason}</div>
            </td>
            <td>${statusBadge}</td>
        `;
        tbody.appendChild(tr);
    });
};

window.showApplyLeaveModal = function (options = {}) {
    const modal = getEl('apply-leave-modal');
    if (!modal) return;

    const form = getEl('apply-leave-form');
    if (form) form.reset();

    const select = getEl('emp-leave-type-select');
    if (select) {
        select.innerHTML = '<option value="" disabled selected>Select Leave Type</option>';
        leaveTypes.forEach(lt => {
            select.innerHTML += `<option value="${lt.id}">${lt.name} ${lt.isPaid ? '' : '(Unpaid)'}</option>`;
        });
    }

    const today = new Date().toISOString().split('T')[0];
    const startDateEl = getEl('leave-start-date');
    const endDateEl = getEl('leave-end-date');
    const durationEl = getEl('leave-duration');

    // Reset properties
    startDateEl.removeAttribute('readonly');
    endDateEl.removeAttribute('readonly');
    if (durationEl) {
        durationEl.removeAttribute('readonly');
        Array.from(durationEl.options).forEach(opt => opt.disabled = false);
    }
    
    // Set minimum dates
    startDateEl.setAttribute('min', today);
    endDateEl.setAttribute('min', today);

    // Apply Early Exit constraints
    if (options.isEarlyExit) {
        startDateEl.value = today;
        endDateEl.value = today;
        startDateEl.setAttribute('readonly', 'true');
        endDateEl.setAttribute('readonly', 'true');
        
        if (durationEl) {
            durationEl.value = 'Early Exit';
            durationEl.setAttribute('readonly', 'true');
            Array.from(durationEl.options).forEach(opt => {
                if (opt.value !== 'Early Exit') opt.disabled = true;
            });
        }
    }

    // Auto-update end date min based on start date selection
    startDateEl.addEventListener('change', (e) => {
        if (options.isEarlyExit) return;
        endDateEl.setAttribute('min', e.target.value);
        if (endDateEl.value && endDateEl.value < e.target.value) {
            endDateEl.value = e.target.value;
        }
    });

    modal.classList.remove('hidden');
};

window.closeApplyLeaveModal = function () {
    getEl('apply-leave-modal')?.classList.add('hidden');
};

// --- Reports Module Logic ---
window.initReportsModule = function () {
    const generateBtn = getEl('rep-generate-btn');
    const resetBtn = getEl('rep-reset-btn');
    const exportAllBtn = getEl('rep-export-all-btn');
    const typeSelect = getEl('rep-type-select');
    const typeDropdownText = getEl('rep-dropdown-text');
    const monthSelect = getEl('rep-month-select');
    const yearSelect = getEl('rep-year-select');

    // Custom Dropdown Logic
    const dropdown = getEl('rep-custom-dropdown');
    const dropdownBtn = getEl('rep-dropdown-btn');
    if (dropdown && dropdownBtn) {
        dropdownBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdown.classList.toggle('active');
        });

        // Handle Item Selection
        dropdown.querySelectorAll('.submenu .dropdown-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.stopPropagation();
                if (typeSelect) typeSelect.value = item.getAttribute('data-val');
                if (typeDropdownText) typeDropdownText.textContent = item.textContent;
                dropdown.classList.remove('active');
            });
        });

        // Close when clicking outside
        document.addEventListener('click', (e) => {
            if (!dropdown.contains(e.target)) {
                dropdown.classList.remove('active');
            }
        });
    }

    // Generate Report Action
    if (generateBtn) {
        generateBtn.addEventListener('click', () => {
            const type = typeSelect ? typeSelect.value : '';
            if (!type) {
                showToast('Please select a Report Type to generate.', 'error');
                return;
            }
            generateReport();
        });
    }

    // Modal Download Button Wiring
    const modalDownloadBtn = getEl('rep-modal-download-btn');
    if (modalDownloadBtn) {
        modalDownloadBtn.addEventListener('click', () => {
            const empId = modalDownloadBtn.getAttribute('data-emp-id');
            const reportType = modalDownloadBtn.getAttribute('data-report-type');
            if (empId && reportType) {
                downloadReport(empId, reportType, 'csv');
            }
        });
    }

    // Reset Filters Action
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            if (getEl('rep-search')) getEl('rep-search').value = '';
            if (monthSelect) monthSelect.value = 'all';
            if (yearSelect) yearSelect.value = 'all';
            if (typeSelect) typeSelect.value = '';
            if (getEl('rep-dropdown-text')) getEl('rep-dropdown-text').textContent = 'Select Report Type';

            // Hide table, show empty state
            getEl('rep-data-container')?.classList.add('hidden');
            getEl('rep-empty-state')?.classList.remove('hidden');
        });
    }

    // Export All / Download CSV Action
    if (exportAllBtn) {
        exportAllBtn.addEventListener('click', () => {
            const table = getEl('rep-data-container').querySelector('.data-table');
            if (!table || getEl('rep-data-container').classList.contains('hidden')) {
                showToast('Please generate a report first before exporting.', 'error');
                return;
            }

            let csvContent = "data:text/csv;charset=utf-8,";

            // Extract Headers
            const headerCells = table.querySelectorAll('thead th');
            let headers = [];
            headerCells.forEach((th, index) => {
                if (index < headerCells.length - 1) { // Skip 'Actions' column
                    headers.push('"' + th.textContent.trim().replace(/"/g, '""') + '"');
                }
            });
            csvContent += headers.join(",") + "\r\n";

            // Extract Rows
            const rows = table.querySelectorAll('tbody tr');
            rows.forEach(tr => {
                if (tr.querySelector('.text-muted')) return; // Skip empty state row
                const rowCells = tr.querySelectorAll('td');
                let rowData = [];
                rowCells.forEach((td, index) => {
                    if (index < rowCells.length - 1) { // Skip 'Actions'
                        // Extract plain text, handling nested divs (like Employee ID/Name)
                        let text = td.textContent.replace(/[\n\r]+/g, ' ').replace(/\s+/g, ' ').trim();
                        rowData.push('"' + text.replace(/"/g, '""') + '"');
                    }
                });
                csvContent += rowData.join(",") + "\r\n";
            });

            // Trigger Download
            const encodedUri = encodeURI(csvContent);
            const link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            const reportName = getEl('rep-dropdown-text') ? getEl('rep-dropdown-text').textContent.replace(/\s+/g, '_') : 'Report';
            link.setAttribute("download", reportName + "_" + new Date().getTime() + ".csv");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            showToast('Report exported successfully!', 'success');
        });
    }

    // Print Action
    const printBtn = getEl('rep-print-btn');
    if (printBtn) {
        printBtn.addEventListener('click', () => {
            window.print();
        });
    }
};

// ── Fix 4: Dynamic Report Preview ─────────────────────────────────────────
window.updateReportPreview = function (reportType) {
    const panel = getEl('rep-live-preview');
    const previewTitle = getEl('rep-preview-title');
    const previewSubtitle = getEl('rep-preview-subtitle');
    const previewBody = getEl('rep-preview-body');
    if (!panel || !previewBody) return;

    if (!reportType) {
        panel.classList.add('hidden');
        return;
    }

    // Show the preview panel
    panel.classList.remove('hidden');

    // Report type → label & description
    const typeLabels = {
        payroll_summary: { title: 'Monthly Payroll Summary', sub: 'Preview of gross salary, deductions & net pay for all employees.' },
        employee_payroll: { title: 'Employee Payroll Report', sub: 'Individual payroll breakdowns with TDS and net salary per employee.' },
        payslip: { title: 'Payslip Report', sub: 'Full payslip details for each employee.' },
        tds: { title: 'TDS Report', sub: 'Monthly TDS deductions and estimated annual tax per employee.' },
        form16: { title: 'Form 16 Report', sub: 'Form 16 summary — TDS certificate data per financial year.' },
        annual_salary: { title: 'Annual Salary Report', sub: 'Yearly CTC breakdown and total salary paid per employee.' },
        leave_summary: { title: 'Leave Summary', sub: 'Total, used, and remaining leave count for all employees.' },
        leave_balance: { title: 'Leave Balance', sub: 'Remaining leave balance breakdown by type per employee.' },
        bonus: { title: 'Bonus Report', sub: 'All bonus entries by employee and category.' },
        deduction: { title: 'Deduction Report', sub: 'All deduction entries with amounts and status.' },
        adjustment: { title: 'Adjustment Report', sub: 'Net bonus/deduction adjustments per employee.' },
    };
    const meta = typeLabels[reportType] || { title: 'Report Preview', sub: 'Preview of selected report.' };
    if (previewTitle) previewTitle.textContent = meta.title;
    if (previewSubtitle) previewSubtitle.textContent = meta.sub;

    // Determine category
    let category = 'payroll';
    if (reportType.includes('leave')) category = 'leave';
    else if (['tds', 'form16', 'annual_salary'].includes(reportType)) category = 'tax';
    else if (['bonus', 'deduction', 'adjustment'].includes(reportType)) category = 'bonus';

    // Build preview table (first 5 employees)
    const previewEmps = employees.slice(0, 5);
    let tableHtml = '<table class="data-table" style="width:100%;font-size:0.82rem;">';

    // Headers
    tableHtml += '<thead><tr><th>Employee</th>';
    if (category === 'payroll') {
        tableHtml += '<th>Gross Salary</th><th>Deductions</th><th>Net Salary</th>';
    } else if (category === 'tax') {
        if (reportType === 'annual_salary') {
            tableHtml += '<th>Annual CTC</th><th>Total Paid</th><th>Effective Tax</th>';
        } else {
            tableHtml += '<th>Monthly TDS</th><th>Annual Tax</th><th>FY</th>';
        }
    } else if (category === 'leave') {
        tableHtml += '<th>Total Leaves</th><th>Used</th><th>Remaining</th>';
    } else if (category === 'bonus') {
        tableHtml += '<th>Type</th><th>Category</th><th>Amount</th><th>Status</th>';
    }
    tableHtml += '</tr></thead><tbody>';

    if (category === 'bonus') {
        // Show bonus/deduction data from bonusesDeductions array
        const displayItems = bonusesDeductions.slice(0, 5);
        if (displayItems.length === 0) {
            tableHtml += '<tr><td colspan="5" class="text-center text-muted py-4">No bonus/deduction records found.</td></tr>';
        } else {
            displayItems.forEach(item => {
                const colorClass = item.type === 'Bonus' ? 'text-green' : 'text-red';
                const emp = employees.find(e => e.id === item.empId);
                tableHtml += `<tr>
                    <td><div class="font-medium">${item.empName || (emp ? emp.name : item.empId)}</div><div class="text-xs text-muted">${item.empId}</div></td>
                    <td><span class="badge ${item.type === 'Bonus' ? 'badge-green' : 'badge-red'}">${item.type}</span></td>
                    <td>${item.category}</td>
                    <td class="${colorClass} font-bold">₹${Number(item.amount).toLocaleString()}</td>
                    <td><span class="badge ${item.status === 'Applied' ? 'badge-blue' : 'badge-orange'}">${item.status}</span></td>
                </tr>`;
            });
        }
    } else {
        previewEmps.forEach(emp => {
            const base = emp.monthlySalary || 50000;
            tableHtml += '<tr>';
            tableHtml += `<td><div class="font-medium">${emp.name}</div><div class="text-xs text-muted">${emp.id}</div></td>`;

            if (category === 'payroll') {
                const ded = Math.round(base * 0.1);
                const net = base - ded;
                tableHtml += `<td>₹${base.toLocaleString()}</td>`;
                tableHtml += `<td class="text-red">-₹${ded.toLocaleString()}</td>`;
                tableHtml += `<td class="text-green font-bold">₹${net.toLocaleString()}</td>`;
            } else if (category === 'tax') {
                if (reportType === 'annual_salary') {
                    const annualCTC = emp.ctc || (base * 12 * 1.15);
                    const totalPaid = base * 12;
                    const tax = Math.round(annualCTC * 0.05);
                    tableHtml += `<td>₹${Math.round(annualCTC).toLocaleString()}</td>`;
                    tableHtml += `<td>₹${totalPaid.toLocaleString()}</td>`;
                    tableHtml += `<td class="text-red">₹${tax.toLocaleString()}</td>`;
                } else {
                    const monthlyTDS = Math.round((base * 12 * 0.05) / 12);
                    const annualTax = monthlyTDS * 12;
                    tableHtml += `<td class="text-red">₹${monthlyTDS.toLocaleString()}</td>`;
                    tableHtml += `<td>₹${annualTax.toLocaleString()}</td>`;
                    tableHtml += `<td>FY 2025-26</td>`;
                }
            } else if (category === 'leave') {
                const total = 24;
                const used = leaveRequests.filter(r => (r.employee_id === emp.id || r.empId === emp.id) && r.status === 'Approved').length;
                const remaining = Math.max(0, total - used);
                tableHtml += `<td>${total}</td>`;
                tableHtml += `<td>${used}</td>`;
                tableHtml += `<td class="font-bold">${remaining}</td>`;
            }
            tableHtml += '</tr>';
        });
    }

    tableHtml += '</tbody></table>';
    if (employees.length > 5) {
        tableHtml += `<p class="text-muted text-xs" style="padding:0.5rem 0.25rem;">Showing preview for 5 of ${employees.length} employees. Click "Generate Full Report" for all.</p>`;
    }

    previewBody.innerHTML = tableHtml;
};

window.generateReport = function () {
    const container = getEl('rep-data-container');
    const emptyState = getEl('rep-empty-state');
    const tbody = getEl('rep-table-body');
    const typeSelect = getEl('rep-type-select');

    if (!container || !emptyState || !tbody || !typeSelect) return;

    const reportType = typeSelect.value;
    const reportTitleText = getEl('rep-dropdown-text') ? getEl('rep-dropdown-text').textContent : 'Detailed Report';

    // Update generic metadata
    if (getEl('rep-table-title')) getEl('rep-table-title').textContent = reportTitleText;

    // Determine Read/Download capability
    let canView = ['payroll_summary', 'employee_payroll', 'leave_summary', 'leave_balance', 'bonus', 'deduction', 'adjustment'].includes(reportType);
    let canDownload = true;

    // Filters
    const searchVal = getEl('rep-search')?.value.toLowerCase() || '';
    const monthVal = getEl('rep-month-select')?.value;
    const yearVal = getEl('rep-year-select')?.value;

    // Determine Category
    let category = 'payroll';
    if (reportType.includes('leave')) category = 'leave';
    else if (reportType.includes('tds') || reportType.includes('form') || reportType.includes('annual')) category = 'tax';
    else if (['bonus', 'deduction', 'adjustment'].includes(reportType)) category = 'bonus';

    // Inject Headings
    const thead = getEl('rep-table-head');
    if (thead) {
        let headers = `<tr><th>Employee</th><th>Month / Year</th>`;
        if (category === 'payroll') headers += `<th>Gross Salary</th><th>Deductions</th><th>Net Salary</th>`;
        else if (category === 'tax') headers += `<th>Monthly TDS</th><th>Estimated Annual Tax</th>`;
        else if (category === 'leave') headers += `<th>Total Leaves</th><th>Used Leaves</th><th>Remaining Leaves</th>`;
        else if (category === 'bonus') headers += `<th>Total Bonuses</th><th>Total Deductions</th><th>Net Adjustment</th>`;
        headers += `<th style="text-align: right;">Row Actions</th></tr>`; // Explicit Actions
        thead.innerHTML = headers;
    }

    tbody.innerHTML = '';
    let totalAmount = 0;

    // Filter employees for payroll/tax/leave
    let filteredEmployees = employees.filter(emp => emp.name.toLowerCase().includes(searchVal) || emp.id.toLowerCase().includes(searchVal));

    if (filteredEmployees.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" class="text-center py-6 text-muted">No employees found matching your criteria.</td></tr>';
    } else {
        filteredEmployees.forEach(emp => {
            const tr = document.createElement('tr');

            let rowHtml = `
                <td>
                    <div class="font-bold" style="color: var(--text);">${emp.name}</div>
                    <div class="text-xs text-primary font-bold">${emp.id}</div>
                </td>
                <td>
                    <div class="text-xs font-medium">${monthVal === 'all' ? 'All Months' : getEl('rep-month-select')?.options[getEl('rep-month-select').selectedIndex].text} ${yearVal === 'all' ? '2026' : yearVal}</div>
                </td>
            `;

            let baseSalary = emp.monthlySalary || 45000;

            if (category === 'payroll') {
                let gross = baseSalary;
                let ded = Math.floor(gross * 0.1);
                let net = gross - ded;
                totalAmount += net;
                rowHtml += `
                    <td>₹${gross.toLocaleString()}</td>
                    <td class="text-red">-₹${ded.toLocaleString()}</td>
                    <td class="text-green font-bold">₹${net.toLocaleString()}</td>
                `;
            } else if (category === 'tax') {
                let tds = Math.floor((baseSalary * 12) * 0.05 / 12);
                let annual = tds * 12;
                totalAmount += annual;
                rowHtml += `
                    <td class="text-red font-bold">-₹${tds.toLocaleString()}</td>
                    <td>₹${annual.toLocaleString()}</td>
                `;
            } else if (category === 'leave') {
                let total = 24;
                // Realistic leaves from leaveRequests array
                let used = leaveRequests.filter(r => r.empId === emp.id && r.status === 'Approved').length;
                let rem = total - used;
                totalAmount += used;
                rowHtml += `
                    <td>${total}</td>
                    <td class="text-red">${used}</td>
                    <td class="text-green font-bold">${rem}</td>
                `;
            } else if (category === 'bonus') {
                // REAL DATA from bonusesDeductions
                const empBD = bonusesDeductions.filter(bd => {
                    const matchesEmp = bd.empId === emp.id;
                    const matchesMonth = monthVal === 'all' || bd.effectiveMonth.endsWith(monthVal);
                    const matchesYear = yearVal === 'all' || bd.effectiveMonth.startsWith(yearVal);

                    let matchesType = true;
                    if (reportType === 'bonus') matchesType = bd.type === 'Bonus';
                    else if (reportType === 'deduction') matchesType = bd.type === 'Deduction';

                    return matchesEmp && matchesMonth && matchesYear && matchesType;
                });

                let bonusSum = empBD.filter(b => b.type === 'Bonus').reduce((s, i) => s + i.amount, 0);
                let dedSum = empBD.filter(b => b.type === 'Deduction').reduce((s, i) => s + i.amount, 0);
                let net = bonusSum - dedSum;
                totalAmount += net;

                rowHtml += `
                    <td class="text-green" style="font-weight: 500;">+₹${bonusSum.toLocaleString()}</td>
                    <td class="text-red" style="font-weight: 500;">-₹${dedSum.toLocaleString()}</td>
                    <td class="font-bold ${net >= 0 ? 'text-blue' : 'text-red'}">${net >= 0 ? '+' : ''}₹${net.toLocaleString()}</td>
                `;
            }

            rowHtml += `
                <td style="text-align: right;">
                    <div class="flex-align gap-2" style="justify-content: flex-end;">
                        ${canView ? `<button class="action-btn" onclick="viewReport('${emp.id}', '${reportType}', '${emp.name}')" title="View Report"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg></button>` : ''}
                        ${canDownload ? `<button class="action-btn" onclick="downloadReport('${emp.id}', '${reportType}', 'pdf')" title="Download PDF"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg></button>` : ''}
                    </div>
                </td>
            `;

            tr.innerHTML = rowHtml;
            tbody.appendChild(tr);
        });
    }

    // Update Summary Cards
    if (getEl('rep-sum-emp')) getEl('rep-sum-emp').textContent = employees.length;
    if (getEl('rep-sum-amt')) {
        if (category === 'leave') getEl('rep-sum-amt').textContent = totalAmount + ' Days Used';
        else getEl('rep-sum-amt').textContent = (totalAmount >= 0 ? '' : '-') + '₹' + Math.abs(totalAmount).toLocaleString();
    }
    if (getEl('rep-sum-type')) getEl('rep-sum-type').textContent = reportTitleText;

    // Enable/Disable scrolling based on row count (> 4)
    const wrapper = getEl('rep-table-wrapper');
    if (wrapper) {
        if (filteredEmployees.length > 4) {
            wrapper.classList.add('has-scroll');
        } else {
            wrapper.classList.remove('has-scroll');
        }
    }

    // Toggle views
    emptyState?.classList.add('hidden');
    container?.classList.remove('hidden');

    // Auto-scroll to details if generated
    container?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    if (window.showToast) showToast('Report generated successfully.', 'success');
};

window.downloadReportAsCSV = function () {
    const type = getEl('rep-type-select')?.value || 'report';
    const filename = `${type}_${Date.now()}.csv`;
    const thead = getEl('rep-table-head');
    const tbody = getEl('rep-table-body');

    if (!tbody || tbody.rows.length === 0) {
        if (window.showToast) showToast('Please generate a report first.', 'error');
        return;
    }

    let csv = [];
    // Headers
    if (thead) {
        const headers = Array.from(thead.querySelectorAll('th')).map(th => th.textContent).filter(t => t !== 'Row Actions');
        csv.push(headers.join(','));
    }

    // Rows
    Array.from(tbody.rows).forEach(row => {
        // Exclude the last cell (Row Actions)
        const cells = Array.from(row.cells).slice(0, -1);
        const rowData = cells.map(cell => `"${cell.textContent.trim().replace(/\s+/g, ' ')}"`).join(',');
        csv.push(rowData);
    });

    const blob = new Blob([csv.join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    if (window.showToast) showToast('Report downloaded successfully!', 'success');
};

window.viewReport = function (empId, reportType, empName) {
    // Override for Payslip Report to use the professional template
    if (reportType === 'payslip') {
        const monthVal = getEl('rep-month-select')?.value;
        const yearVal = getEl('rep-year-select')?.value;
        const monthText = monthVal === 'all' ? 'March' : getEl('rep-month-select')?.options[getEl('rep-month-select').selectedIndex].text;
        const yearText = yearVal === 'all' ? '2026' : yearVal;
        const monthKey = `${monthText} ${yearText}`;

        window.showPayslip(empId, monthKey);
        return;
    }

    const modal = getEl('report-view-modal');
    if (!modal) return;

    const title = getEl('rep-modal-title');
    const subtitle = getEl('rep-modal-subtitle');
    const body = getEl('rep-modal-body');
    const reportName = getEl('rep-dropdown-text') ? getEl('rep-dropdown-text').textContent : 'Detailed Report';

    // Find Real Employee Data
    const emp = employees.find(e => e.id === empId) || defaultEmployees.find(e => e.id === empId);
    if (!emp) {
        showToast('Error: Employee data not found.', 'error');
        return;
    }

    if (title) title.textContent = 'Report Preview';
    if (subtitle) subtitle.innerHTML = `Document Type: <span class="font-bold text-primary">${reportName}</span>`;

    // Set data attributes for download button
    const downloadBtn = getEl('rep-modal-download-btn');
    if (downloadBtn) {
        downloadBtn.setAttribute('data-emp-id', empId);
        downloadBtn.setAttribute('data-report-type', reportType);
        downloadBtn.setAttribute('data-emp-name', emp.name);
    }

    const monthVal = getEl('rep-month-select')?.value;
    const yearVal = getEl('rep-year-select')?.value;
    const monthText = monthVal === 'all' ? 'Annual / All Months' : getEl('rep-month-select')?.options[getEl('rep-month-select').selectedIndex].text;
    const yearText = yearVal === 'all' ? '2026' : yearVal;

    // Filter Bonuses/Deductions
    const records = bonusesDeductions.filter(bd => {
        const matchesEmp = bd.empId === empId;
        const matchesMonth = monthVal === 'all' || bd.effectiveMonth.endsWith(monthVal);
        const matchesYear = yearVal === 'all' || bd.effectiveMonth.startsWith(yearVal);
        return matchesEmp && matchesMonth && matchesYear;
    });

    const bonuses = records.filter(r => r.type === 'Bonus').reduce((s, i) => s + i.amount, 0);
    const deductions = records.filter(r => r.type === 'Deduction').reduce((s, i) => s + i.amount, 0);

    // Calculate accurate Gross & Net
    const monthlySalary = emp.monthlySalary || 45000;
    const allowances = Math.round(monthlySalary * 0.15); // Fixed 15% allowance logic
    const grossBase = monthlySalary + allowances;
    const tds = Math.round(monthlySalary * 0.05); // Fixed 5% TDS for professional feel
    const netPayable = (grossBase + bonuses) - (deductions + tds);

    // Professional Document HTML
    if (body) {
        body.innerHTML = `
            <div class="report-document" id="printable-report">
                <div class="report-header">
                    <div class="company-logo-section">
                        <div style="width: 48px; height: 48px; background: #3b82f6; border-radius: 12px; display: flex; align-items: center; justify-content: center; color: white; font-weight: 800; font-size: 1.5rem; box-shadow: 0 4px 10px rgba(59, 130, 246, 0.4);">P</div>
                        <div class="company-info">
                            <h2 style="font-size: 1.6rem; margin-bottom: 2px;">PPS Payroll Systems</h2>
                            <p style="font-weight: 500; color: #475569 !important;">Premium Enterprise HRMS Solutions</p>
                            <p>contact@pps-payroll.com • www.ppssoftware.com</p>
                        </div>
                    </div>
                    <div class="report-title-section">
                        <h1 style="font-size: 1.5rem; letter-spacing: 0.02em;">${reportName}</h1>
                        <div class="report-id">REF NO: ${reportType.toUpperCase()}-${empId}-${Date.now().toString().slice(-4)}</div>
                        <div class="report-id" style="margin-top: 4px;">DATE: ${new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()}</div>
                    </div>
                </div>

                <!-- Professional Summary Cards within Report -->
                <div class="report-summary-cards">
                    <div class="rep-card">
                        <span class="rep-card-label">GROSS BASE</span>
                        <div class="rep-card-value">₹${grossBase.toLocaleString()}</div>
                    </div>
                    <div class="rep-card">
                        <span class="rep-card-label">TOTAL BONUSES</span>
                        <div class="rep-card-value text-green" style="color: #10b981 !important;">+₹${bonuses.toLocaleString()}</div>
                    </div>
                    <div class="rep-card">
                        <span class="rep-card-label">TOTAL DEDUCTIONS</span>
                        <div class="rep-card-value text-red" style="color: #ef4444 !important;">-₹${(tds + deductions).toLocaleString()}</div>
                    </div>
                    <div class="rep-card highlight">
                        <span class="rep-card-label">NET PAYABLE</span>
                        <div class="rep-card-value">₹${netPayable.toLocaleString()}</div>
                    </div>
                </div>

                <div class="report-doc-grid">
                    <div class="doc-section">
                        <div class="doc-section-head">Employee Details</div>
                        <div class="doc-info-row">
                            <span class="doc-info-label">Name:</span>
                            <span class="doc-info-value">${emp.name}</span>
                        </div>
                        <div class="doc-info-row">
                            <span class="doc-info-label">Emp ID:</span>
                            <span class="doc-info-value">${emp.id}</span>
                        </div>
                        <div class="doc-info-row">
                            <span class="doc-info-label">Position:</span>
                            <span class="doc-info-value">${emp.role}</span>
                        </div>
                    </div>
                    <div class="doc-section">
                        <div class="doc-section-head">Report Meta</div>
                        <div class="doc-info-row">
                            <span class="doc-info-label">Period:</span>
                            <span class="doc-info-value">${monthText} ${yearText}</span>
                        </div>
                        <div class="doc-info-row">
                            <span class="doc-info-label">Status:</span>
                            <span class="doc-info-value" style="color: #10b981 !important;">VERIFIED</span>
                        </div>
                        <div class="doc-info-row">
                            <span class="doc-info-label">Currency:</span>
                            <span class="doc-info-value">INR (₹)</span>
                        </div>
                    </div>
                </div>

                <div class="doc-section">
                    <div class="doc-section-head">Earnings & Deductions Ledger</div>
                    <table class="salary-doc-table">
                        <thead>
                            <tr>
                                <th style="width: 70%;">Description</th>
                                <th style="text-align: right;">Amount (₹)</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Monthly Basic Salary Contribution</td>
                                <td style="text-align: right;">₹${monthlySalary.toLocaleString()}</td>
                            </tr>
                            <tr>
                                <td>Standard Fixed Allowances</td>
                                <td style="text-align: right;">₹${allowances.toLocaleString()}</td>
                            </tr>
                            <tr style="background: #f8fafc; font-weight: 700;">
                                <td>GROSS SALARY (SUBTOTAL)</td>
                                <td style="text-align: right;">₹${grossBase.toLocaleString()}</td>
                            </tr>
                            <tr>
                                <td style="padding-left: 1.5rem; color: #10b981 !important;">Total Performance & Applied Bonuses</td>
                                <td style="text-align: right; color: #10b981 !important;">+₹${bonuses.toLocaleString()}</td>
                            </tr>
                            <tr>
                                <td style="padding-left: 1.5rem; color: #ef4444 !important;">Statutory Tax Deductions (TDS/PT)</td>
                                <td style="text-align: right; color: #ef4444 !important;">-₹${tds.toLocaleString()}</td>
                            </tr>
                            <tr>
                                <td style="padding-left: 1.5rem; color: #ef4444 !important;">Other Professional Deductions</td>
                                <td style="text-align: right; color: #ef4444 !important;">-₹${deductions.toLocaleString()}</td>
                            </tr>
                            <tr class="net-row" style="background: #eff6ff !important; border-top: 2px solid #3b82f6;">
                                <td style="padding: 1.25rem 1rem;"><strong>FINAL NET PAYABLE AMOUNT</strong></td>
                                <td style="text-align: right; padding: 1.25rem 1rem;"><strong>₹${netPayable.toLocaleString()}</strong></td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div class="report-footer-note">
                    <p>This is a computer-generated document and does not require a physical signature.</p>
                    <p style="margin-top: 4px;">For any queries, please reach out to the accounts department.</p>
                </div>
            </div>
        `;
    }

    if (modal) modal.classList.remove('hidden');
};

window.downloadReport = function (empId, reportType, format) {
    const element = document.getElementById('printable-report');
    const empName = getEl('rep-modal-download-btn')?.getAttribute('data-emp-name') || empId;

    if (!element) {
        showToast('Error: Preview content not found.', 'error');
        return;
    }

    if (format === 'pdf' || format === 'print') {
        if (window.html2pdf) {
            showToast('Generating Professional PDF...', 'success');

            const opt = {
                margin: 10,
                filename: `PPS_Report_${empName.replace(/\s+/g, '_')}_${new Date().getTime()}.pdf`,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2, useCORS: true, letterRendering: true, backgroundColor: '#ffffff' },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
            };

            html2pdf().set(opt).from(element).save().then(() => {
                showToast('Report Downloaded Successfully.', 'success');
            }).catch(err => {
                console.error('PDF Error:', err);
                showToast('PDF generation failed. Using print fallback...', 'warning');
                window.print();
            });
        } else {
            showToast('PDF library missing. Opening Print Dialog...', 'warning');
            window.print();
        }
    } else {
        showToast(`Preparing ${format.toUpperCase()} export...`, 'info');
        // CSV Fallback
        const table = document.querySelector('.salary-doc-table');
        if (!table) return;
        let csv = [];
        const rows = table.querySelectorAll('tr');
        rows.forEach(row => {
            const cols = row.querySelectorAll('td, th');
            let rowData = [];
            cols.forEach(col => rowData.push('"' + col.textContent.trim().replace(/"/g, '""') + '"'));
            csv.push(rowData.join(','));
        });
        const csvContent = "data:text/csv;charset=utf-8," + csv.join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `Report_${empName}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
};

// --- SaaS Profile Edit System ---
// Snapshot for cancel/revert
window._profileSnapshot = null;

window.toggleProfileEditMode = function () {
    const container = window.getEl('profile-container');
    if (!container) return;

    const isEditing = container.classList.contains('edit-mode-active');

    if (isEditing) {
        // --- Cancel / Exit Edit Mode ---
        // Revert editable fields to snapshot values
        if (window._profileSnapshot) {
            const s = window._profileSnapshot;
            if (getEl('prof-name-large')) getEl('prof-name-large').textContent = s.name;
            if (getEl('prof-phone')) getEl('prof-phone').textContent = s.phone;
            if (getEl('prof-loc')) getEl('prof-loc').textContent = s.location;
            // Revert avatar if changed
            const avatarImg = getEl('prof-avatar-img');
            const avatarText = getEl('prof-avatar-text');
            if (s.profileImage) {
                if (avatarImg) { avatarImg.src = s.profileImage; avatarImg.classList.remove('hidden'); avatarImg.style.display = 'block'; }
                if (avatarText) { avatarText.classList.add('hidden'); avatarText.style.display = 'none'; }
            } else {
                if (avatarImg) { avatarImg.classList.add('hidden'); avatarImg.style.display = 'none'; }
                if (avatarText) { avatarText.textContent = s.initials; avatarText.classList.remove('hidden'); avatarText.style.display = 'block'; }
            }
        }
        container.classList.remove('edit-mode-active');
        container.querySelectorAll('.profile-edit-ui').forEach(el => el.classList.add('hidden'));
        container.querySelectorAll('.profile-view-ui').forEach(el => el.classList.remove('hidden'));
        window._profileSnapshot = null;
    } else {
        // --- Enter Edit Mode ---
        // Find employee reliably by ID first, then by name, then fallback
        let currentEmp = null;
        if (window._currentEmpId) {
            currentEmp = employees.find(e => e.id === window._currentEmpId);
        }
        if (!currentEmp) {
            currentEmp = employees.find(e => e.name === window.currentUser?.displayName) || employees[0];
        }
        
        // Read current displayed values as the source of truth
        const nameText = getEl('prof-name-large') ? getEl('prof-name-large').textContent.trim() : (currentEmp ? currentEmp.name : '');
        const phoneText = getEl('prof-phone') ? getEl('prof-phone').textContent.trim() : (currentEmp ? currentEmp.phone : '');
        const locText = getEl('prof-loc') ? getEl('prof-loc').textContent.trim() : (currentEmp ? currentEmp.location : '');
        const initials = nameText.split(' ').filter(n => n).map(n => n[0]).join('').toUpperCase().substring(0, 2);
        
        // Store snapshot with empId for reliable lookup on save
        window._profileSnapshot = {
            empId: currentEmp ? currentEmp.id : null,
            name: nameText,
            phone: phoneText,
            location: locText,
            initials: initials,
            profileImage: currentEmp ? (currentEmp.profileImage || '') : ''
        };

        container.classList.add('edit-mode-active');
        container.querySelectorAll('.profile-view-ui').forEach(el => el.classList.add('hidden'));
        container.querySelectorAll('.profile-edit-ui').forEach(el => el.classList.remove('hidden'));

        // Pre-fill ALL editable inputs with current data (not empty)
        if (getEl('edit-prof-name')) getEl('edit-prof-name').value = nameText || '';
        if (getEl('edit-prof-phone')) getEl('edit-prof-phone').value = (phoneText && phoneText !== '---') ? phoneText : '';
        if (getEl('edit-prof-loc')) getEl('edit-prof-loc').value = (locText && locText !== '---') ? locText : '';
        
        // Pre-fill additional editable fields if they exist
        if (getEl('edit-prof-dob') && getEl('prof-dob')) getEl('edit-prof-dob').value = getEl('prof-dob').textContent.trim() || '';
        if (getEl('edit-prof-gender') && getEl('prof-gender')) getEl('edit-prof-gender').value = getEl('prof-gender').textContent.trim() || '';
        if (getEl('edit-prof-address') && getEl('prof-address')) getEl('edit-prof-address').value = getEl('prof-address').textContent.trim() || '';
        if (getEl('edit-prof-alt-phone') && getEl('prof-alt-phone')) getEl('edit-prof-alt-phone').value = getEl('prof-alt-phone').textContent.trim() || '';
        if (getEl('edit-prof-password')) getEl('edit-prof-password').value = '';
        if (getEl('edit-prof-update-phone') && getEl('prof-update-phone')) getEl('edit-prof-update-phone').value = getEl('prof-update-phone').textContent.trim() || '';
        if (getEl('edit-prof-update-address') && getEl('prof-update-address')) getEl('edit-prof-update-address').value = getEl('prof-update-address').textContent.trim() || '';
    }
};

window.saveProfileUpdates = function () {
    const newName = (getEl('edit-prof-name')?.value || '').trim();
    const newPhone = (getEl('edit-prof-phone')?.value || '').trim();
    const newLoc = (getEl('edit-prof-loc')?.value || '').trim();

    // --- Clear previous errors ---
    document.querySelectorAll('.prof-field-error').forEach(el => el.classList.add('hidden'));
    document.querySelectorAll('.saas-input').forEach(el => el.classList.remove('input-error'));

    // --- Validation ---
    let hasError = false;

    if (!newName) {
        const errEl = getEl('err-prof-name');
        const inputEl = getEl('edit-prof-name');
        if (errEl) errEl.classList.remove('hidden');
        if (inputEl) { inputEl.classList.add('input-error'); inputEl.focus(); }
        hasError = true;
    }

    // Phone: allow empty, but if provided validate format (digits, spaces, +, -, at least 10 digits)
    if (newPhone && !/^[+\d\s\-()]{10,}$/.test(newPhone)) {
        const errEl = getEl('err-prof-phone');
        const inputEl = getEl('edit-prof-phone');
        if (errEl) errEl.classList.remove('hidden');
        if (inputEl) inputEl.classList.add('input-error');
        hasError = true;
    }

    if (hasError) {
        window.showToast('Please fix the highlighted fields.', 'error');
        return;
    }

    // --- Save button loading state ---
    const saveBtn = getEl('save-profile-btn');
    const saveBtnText = getEl('save-btn-text');
    if (saveBtn) saveBtn.disabled = true;
    if (saveBtnText) saveBtnText.textContent = 'Saving...';

    // Simulate async save (production-ready pattern)
    setTimeout(() => {
        // Find employee reliably: use snapshot empId first, then _currentEmpId, then fallback
        let targetEmp = null;
        const snapshotId = window._profileSnapshot?.empId;
        
        if (snapshotId) {
            targetEmp = employees.find(e => e.id === snapshotId);
        }
        if (!targetEmp && window._currentEmpId) {
            targetEmp = employees.find(e => e.id === window._currentEmpId);
        }
        if (!targetEmp) {
            targetEmp = employees.find(e => e.name === window.currentUser?.displayName) || employees[0];
        }
        if (!targetEmp) {
            window.showToast('User session not found.', 'error');
            if (saveBtn) saveBtn.disabled = false;
            if (saveBtnText) saveBtnText.textContent = 'Save Changes';
            return;
        }

        // --- Update ONLY editable fields in global state ---
        targetEmp.name = newName;
        targetEmp.phone = newPhone;
        targetEmp.location = newLoc;
        
        // Profile image (already set by previewProfileImage, persist it)
        const avatarImg = getEl('prof-avatar-img');
        if (avatarImg && !avatarImg.classList.contains('hidden') && avatarImg.src && !avatarImg.src.endsWith('/')) {
            targetEmp.profileImage = avatarImg.src;
        }
        // DO NOT modify: employeeId, email, department, designation, joiningDate, bankDetails

        // Keep session in sync so future lookups work
        if (window.currentUser) {
            window.currentUser.displayName = newName;
            localStorage.setItem('pps-user-display', newName);
        }
        // Store stable ID for future lookups
        window._currentEmpId = targetEmp.id;

        // Persist employees to localStorage
        if (typeof window.saveEmployees === 'function') window.saveEmployees();

        // --- Sync UI everywhere ---
        // 1. Profile page view-mode fields
        if (getEl('prof-name-large')) getEl('prof-name-large').textContent = newName;
        if (getEl('prof-name')) getEl('prof-name').textContent = newName;
        if (getEl('prof-phone')) getEl('prof-phone').textContent = newPhone || '---';
        if (getEl('prof-loc')) getEl('prof-loc').textContent = newLoc || '---';

        // 2. Profile avatar initials
        const newInitials = newName.split(' ').filter(n => n).map(n => n[0]).join('').toUpperCase().substring(0, 2);
        const avatarText = getEl('prof-avatar-text');
        if (avatarText && (!avatarImg || avatarImg.classList.contains('hidden'))) {
            avatarText.textContent = newInitials;
        }

        // 3. Dashboard header bar (top-bar)
        if (getEl('user-name')) getEl('user-name').textContent = newName;
        const userAvatarEl = getEl('user-avatar');
        if (userAvatarEl) {
            if (targetEmp.profileImage) {
                userAvatarEl.innerHTML = `<img src="${targetEmp.profileImage}" style="width:100%;height:100%;border-radius:50%;object-fit:cover;">`;
            } else {
                userAvatarEl.textContent = newName.charAt(0).toUpperCase();
            }
        }

        // 4. Employee dashboard welcome hero
        if (getEl('welcome-employee-name')) getEl('welcome-employee-name').textContent = newName;

        // 5. Admin employee table (if admin view exists)
        if (typeof window.renderEmployeeTable === 'function') window.renderEmployeeTable();
        if (typeof window.updateDashboardStats === 'function') window.updateDashboardStats();

        // Clear snapshot so cancel doesn't revert after save
        window._profileSnapshot = null;

        // Switch back to view mode (without reverting since snapshot is null)
        const container = getEl('profile-container');
        if (container) {
            container.classList.remove('edit-mode-active');
            container.querySelectorAll('.profile-edit-ui').forEach(el => el.classList.add('hidden'));
            container.querySelectorAll('.profile-view-ui').forEach(el => el.classList.remove('hidden'));
        }

        // Reset save button
        if (saveBtn) saveBtn.disabled = false;
        if (saveBtnText) saveBtnText.textContent = 'Save Changes';

        window.showToast('Profile updated successfully!', 'success');
    }, 500); // 500ms simulated save delay for professional feel
};

window.previewProfileImage = function (event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function (e) {
        const result = e.target.result;
        
        // 1. Immediately update profile edit preview
        const avatarImg = getEl('prof-avatar-img');
        const avatarText = getEl('prof-avatar-text');
        if (avatarImg) { avatarImg.src = result; avatarImg.style.display = 'block'; avatarImg.classList.remove('hidden'); }
        if (avatarText) { avatarText.style.display = 'none'; avatarText.classList.add('hidden'); }

        // 2. Persist to localStorage directly (so it survives reloads & is available globally)
        localStorage.setItem('profileImage', result);

        // 3. Update global employee state
        let targetEmp = employees.find(emp => emp.name === window.currentUser?.displayName) || employees[0];
        if (targetEmp) targetEmp.profileImage = result;
        if (typeof window.saveEmployees === 'function') window.saveEmployees();

        // 4. Update Header Avatar
        const headerAvatar = getEl('user-avatar');
        if (headerAvatar) {
            headerAvatar.innerHTML = `<img src="${result}" style="width:100%;height:100%;border-radius:50%;object-fit:cover;">`;
        }

        // 5. Update Welcome Section Avatar
        const welcomeImg = getEl('emp-avatar-img-main');
        const welcomeText = getEl('emp-avatar-initials');
        if (welcomeImg) { welcomeImg.src = result; welcomeImg.style.display = 'block'; welcomeImg.classList.remove('hidden'); }
        if (welcomeText) { welcomeText.style.display = 'none'; welcomeText.classList.add('hidden'); }

        window.showToast('Profile photo updated successfully!', 'success');
    };
    reader.readAsDataURL(file);
};

window.openPayslipModal = function (monthStr, netStr) {
    const modal = document.getElementById('payslip-modal');
    if (!modal) return;
    
    const emp = (window._currentEmpId ? employees.find(e => e.id === window._currentEmpId) : null) 
        || employees.find(e => e.name === window.currentUser?.displayName) || employees[0];
    if (!emp) return;

    // Parse monthStr (e.g., "February 2026")
    const parts = monthStr.split(' ');
    const year = parseInt(parts[1]) || 2026;
    const monthMap = { 'January': 0, 'February': 1, 'March': 2, 'April': 3, 'May': 4, 'June': 5, 'July': 6, 'August': 7, 'September': 8, 'October': 9, 'November': 10, 'December': 11 };
    const month = monthMap[parts[0]] || 0;

    const breakdown = window.calculateSalaryBreakdown(emp, year, month);

    // Dynamically update Modal UI
    const elMonth = document.getElementById('ps-modal-month');
    const elName = document.getElementById('ps-modal-name');
    const elBasic = document.getElementById('ps-modal-basic');
    const elAllow = document.getElementById('ps-modal-allowances');
    const elOt = document.getElementById('ps-modal-overtime');
    const elDed = document.getElementById('ps-modal-deductions');
    const elNet = document.getElementById('ps-modal-net');
    
    // Stats elements (new)
    const elDays = document.getElementById('ps-modal-days');
    const elOtHrs = document.getElementById('ps-modal-ot-hrs');

    if (elMonth) elMonth.textContent = monthStr;
    if (elName) elName.textContent = emp.name;
    
    const fmt = (v) => '₹ ' + Math.round(v || 0).toLocaleString('en-IN');
    if (elBasic) elBasic.textContent = fmt(breakdown.monthlySalary);
    if (elAllow) elAllow.textContent = fmt(breakdown.hra + breakdown.special);
    if (elOt) elOt.textContent = '+ ' + fmt(breakdown.overtimePay);
    if (elDed) elDed.textContent = '- ' + fmt(breakdown.leaveDeduction);
    if (elNet) elNet.textContent = fmt(breakdown.net);
    
    if (elDays) elDays.textContent = `${breakdown.presentDays} / 22`;
    if (elOtHrs) elOtHrs.textContent = `${breakdown.overtimeHours} hrs`;

    modal.style.display = 'block';
    modal.classList.remove('hidden');
};

// Final Safety wrapper for initialization - moved to bottom to ensure all functions are defined
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}
