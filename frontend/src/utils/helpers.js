// --- Global Utilities & Navigation ---
window.getEl = (id) => document.getElementById(id);
window.queryAll = (selector) => document.querySelectorAll(selector);

// --- Global Data & State ---
const defaultEmployees = [];

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

// --- Unified User Data & Session Management ---
// Completely separates Admin and Employee storage while providing a unified API

window.getUser = function () {
    const role = localStorage.getItem('pps-role') || 'admin';
    if (role === 'admin') {
        try {
            const saved = localStorage.getItem('pps-admin-user');
            if (saved) return JSON.parse(saved);
        } catch (e) {
            console.warn('Failed to parse admin user from localStorage:', e);
        }
        return {
            name: 'Admin User',
            email: 'admin@pps.com',
            phone: '',
            address: '',
            profileImage: ''
        };
    } else {
        const empId = localStorage.getItem('pps-current-emp-id');
        let emp = null;
        if (typeof window.employees !== 'undefined' && window.employees) {
            emp = window.employees.find(e => e.id === empId);
        }
        if (!emp) {
            try {
                const saved = localStorage.getItem('pps-employee-user');
                if (saved) return JSON.parse(saved);
            } catch (e) { }
            return {
                name: 'Employee User', email: 'employee@pps.com', profileImage: ''
            };
        }
        return emp;
    }
};

window.saveUser = function (userData) {
    const role = localStorage.getItem('pps-role') || 'admin';
    if (role === 'admin') {
        localStorage.setItem('pps-admin-user', JSON.stringify(userData));
    } else {
        localStorage.setItem('pps-employee-user', JSON.stringify(userData));
        if (typeof window.employees !== 'undefined' && window.employees) {
            const empId = localStorage.getItem('pps-current-emp-id');
            const targetEmp = window.employees.find(e => e.id === empId);
            if (targetEmp) {
                targetEmp.name = userData.name || targetEmp.name;
                targetEmp.phone = userData.phone || targetEmp.phone;
                // Employees use 'location' in the default object structure instead of 'address'
                targetEmp.location = userData.location || userData.address || targetEmp.location;
                if (userData.profileImage) targetEmp.profileImage = userData.profileImage;
                if (typeof window.saveEmployees === 'function') window.saveEmployees();
            }
        }
    }
};

// Syncs ALL UI elements (Nav, Welcome Hero, Profile Forms, Dropdown) with current role data
window.syncUserUI = function () {
    const user = window.getUser();
    const role = localStorage.getItem('pps-role') || 'admin';
    const name = user.name || (role === 'admin' ? 'Admin User' : 'Employee');
    const initials = name.split(' ').filter(n => n).map(n => n[0]).join('').toUpperCase().substring(0, 2) || 'A';
    const profileImg = user.profileImage || '';

    // Helper: set avatar (text or image)
    const setAvatarPair = (textEl, imgEl) => {
        if (profileImg) {
            if (imgEl) { imgEl.src = profileImg; imgEl.style.display = 'block'; imgEl.classList.remove('hidden'); }
            if (textEl) { textEl.style.display = 'none'; textEl.classList.add('hidden'); }
        } else {
            if (imgEl) { imgEl.style.display = 'none'; imgEl.classList.add('hidden'); }
            if (textEl) { textEl.textContent = initials; textEl.style.display = 'block'; textEl.classList.remove('hidden'); }
        }
    };

    // 1. Top nav bar
    const userNameEl = getEl('user-name');
    const userAvatarEl = getEl('user-avatar');
    if (userNameEl) userNameEl.textContent = name;
    if (userAvatarEl) {
        if (profileImg) {
            userAvatarEl.innerHTML = `<img src="${profileImg}" style="width:100%;height:100%;border-radius:50%;object-fit:cover;">`;
        } else {
            userAvatarEl.textContent = initials;
        }
    }

    // 2. Profile Dropdown
    const dropdownAvatarText = getEl('dropdown-avatar');
    if (dropdownAvatarText && !profileImg) {
        dropdownAvatarText.textContent = name.charAt(0).toUpperCase();
    }
    const dropdownAvatarImg = getEl('dropdown-avatar-img'); // (Optional check if we added an img to dropdown)
    const dropdownUserName = getEl('dropdown-user-name');
    if (dropdownUserName) dropdownUserName.textContent = name;
    const dropdownUserRole = getEl('dropdown-user-role');
    if (dropdownUserRole) dropdownUserRole.textContent = role === 'admin' ? 'Administrator' : 'Employee';

    // Dynamic formatted date for welcome hero cards
    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    if (getEl('admin-hero-date-text')) getEl('admin-hero-date-text').textContent = formattedDate;
    if (getEl('emp-hero-date-text')) getEl('emp-hero-date-text').textContent = formattedDate;

    if (role === 'admin') {
        // Admin Welcome section
        if (getEl('welcome-user')) getEl('welcome-user').textContent = name;
        const roleBadge = getEl('welcome-role-badge');
        if (roleBadge) roleBadge.textContent = 'Administrator';
        setAvatarPair(getEl('admin-welcome-avatar-text'), getEl('admin-welcome-avatar-img'));

        // Admin profile page
        if (getEl('admin-prof-display-name')) getEl('admin-prof-display-name').textContent = name;
        if (getEl('admin-prof-display-email')) getEl('admin-prof-display-email').textContent = user.email || '';
        setAvatarPair(getEl('admin-prof-avatar-text'), getEl('admin-prof-avatar-img'));

        // Admin profile edit form
        if (getEl('admin-edit-name')) getEl('admin-edit-name').value = name;
        if (getEl('admin-edit-email')) getEl('admin-edit-email').value = user.email || '';
        if (getEl('admin-edit-phone')) getEl('admin-edit-phone').value = user.phone || '';
        if (getEl('admin-edit-address')) getEl('admin-edit-address').value = user.address || '';
        if (getEl('admin-edit-dob')) getEl('admin-edit-dob').value = user.dob || '';
        if (getEl('admin-edit-gender')) getEl('admin-edit-gender').value = user.gender || '';

    } else {
        // Employee Dashboard Welcome Hero
        if (getEl('welcome-employee-name')) getEl('welcome-employee-name').textContent = name;

        // Employee Profile static display inside edit page
        if (getEl('prof-name-large')) getEl('prof-name-large').textContent = name;
        if (getEl('prof-name')) getEl('prof-name').textContent = name;
        if (getEl('prof-phone')) getEl('prof-phone').textContent = user.phone || '---';
        if (getEl('prof-loc')) getEl('prof-loc').textContent = user.location || user.address || '---';

        // Sync avatars across pages
        setAvatarPair(getEl('prof-avatar-text'), getEl('prof-avatar-img'));
        setAvatarPair(getEl('emp-avatar-initials'), getEl('emp-avatar-img-main'));
    }

    // Keep currentUser in sync
    if (window.currentUser) {
        window.currentUser.displayName = name;
    }
};

// Admin UI action hooks (save UI interaction)
window.saveAdminProfile = function () {
    const name = (getEl('admin-edit-name')?.value || '').trim();
    const email = (getEl('admin-edit-email')?.value || '').trim();
    const phone = (getEl('admin-edit-phone')?.value || '').trim();
    const address = (getEl('admin-edit-address')?.value || '').trim();
    const dob = (getEl('admin-edit-dob')?.value || '').trim();
    const gender = (getEl('admin-edit-gender')?.value || '').trim();

    if (!name) {
        window.showToast('Name cannot be empty.', 'error');
        getEl('admin-edit-name')?.focus();
        return;
    }

    const btn = getEl('admin-save-profile-btn');
    const btnText = getEl('admin-save-btn-text');
    if (btn) btn.disabled = true;
    if (btnText) btnText.textContent = 'Saving...';

    setTimeout(() => {
        const profile = window.getUser();
        profile.name = name;
        profile.email = email;
        profile.phone = phone;
        profile.address = address;
        profile.dob = dob;
        profile.gender = gender;

        window.saveUser(profile);
        window.syncUserUI();

        if (btn) btn.disabled = false;
        if (btnText) btnText.textContent = 'Save Changes';
        window.showToast('Profile updated successfully!', 'success');
    }, 400);
};

window.previewAdminPhoto = function (event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
        // Compress image using canvas before storing to avoid localStorage QuotaExceededError
        const img = new Image();
        img.onload = function () {
            const canvas = document.createElement('canvas');
            const MAX_SIZE = 300;
            let width = img.width;
            let height = img.height;

            if (width > height) {
                if (width > MAX_SIZE) { height = Math.round(height *= MAX_SIZE / width); width = MAX_SIZE; }
            } else {
                if (height > MAX_SIZE) { width = Math.round(width *= MAX_SIZE / height); height = MAX_SIZE; }
            }
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);

            const result = canvas.toDataURL('image/jpeg', 0.8);
            try {
                const profile = window.getUser();
                profile.profileImage = result;
                window.saveUser(profile);
                window.syncUserUI();
                window.showToast('Profile photo updated!', 'success');
            } catch (err) {
                window.showToast('Failed to save image. It may still be too large.', 'error');
                console.error(err);
            }
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
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
            window._currentEmpId = null;
            localStorage.removeItem('pps-role');
            localStorage.removeItem('pps-current-emp-id');

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

    const adminNav = getEl('admin-nav');
    const employeeNav = getEl('employee-nav');

    if (role === 'admin') {
        if (adminNav) adminNav.style.display = 'flex';
        if (employeeNav) employeeNav.style.display = 'none';

        // Save/update admin profile in localStorage from login data
        const profile = window.getUser();
        profile.name = userName;
        // Capture email from auth form if available (first-time login)
        const loginEmail = getEl('email')?.value?.trim();
        if (loginEmail) profile.email = loginEmail;
        // Use the new saveUser utility
        window.saveUser(profile);

        // Sync all UI visually
        window.syncUserUI();
        window.showView('admin-overview');
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
    // Find employee: prefer runtime ID, then localStorage ID, then name match, then fallback
    let emp = null;
    if (window._currentEmpId) {
        emp = employees.find(e => e.id === window._currentEmpId);
    }
    if (!emp) {
        const storedEmpId = localStorage.getItem('pps-current-emp-id');
        if (storedEmpId) {
            emp = employees.find(e => e.id === storedEmpId);
        }
    }
    if (!emp) {
        emp = employees.find(e => e.name === userName) || employees[0];
    }
    if (!emp) return;

    // Store stable ID for all profile functions (runtime + persistent)
    window._currentEmpId = emp.id;
    localStorage.setItem('pps-current-emp-id', emp.id);

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
        window.onEmpAttMonthChange = function () {
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

    // 5. Payslip History Table Sync (Live Data)
    const tableBody = getEl('emp-payslips-table-body');
    if (tableBody) {
        tableBody.innerHTML = '<tr><td colspan="5" class="text-center py-6 text-muted"><div class="spinner"></div> Loading payslips...</td></tr>';
        
        window.apiClient.get(`/payroll?employeeId=${emp.id}`).then(response => {
            if (response && response.success) {
                const payrollsList = response.data || [];
                if (payrollsList.length === 0) {
                    tableBody.innerHTML = '<tr><td colspan="5" class="text-center py-6 text-muted">No payslips found.</td></tr>';
                    return;
                }
                
                const monthNames = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
                tableBody.innerHTML = payrollsList.map(p => {
                    const monthLabel = typeof p.month === 'number' ? (monthNames[p.month] || p.month) : p.month;
                    const yearLabel = p.financialYear ? p.financialYear.split('-')[0] : (p.year || new Date().getFullYear());
                    const finalNet = p.netPay !== undefined ? p.netPay : (p.net || 0);
                    return `
                        <tr style="height: 64px;">
                            <td class="font-medium" style="padding: 1rem;">${monthLabel} ${yearLabel}</td>
                            <td style="padding: 1rem;">${new Date(p.createdAt || new Date()).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                            <td class="font-bold text-primary" style="padding: 1rem;">₹ ${finalNet.toLocaleString()}</td>
                            <td style="padding: 1rem;"><span class="badge badge-green">${p.status || 'Paid'}</span></td>
                            <td class="text-center" style="padding: 1rem;">
                                <button class="payslip-view-btn" onclick="window.showEmployeePayslip('${emp.id}', '${p.month}', null, '${p.year || yearLabel}')">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                        <circle cx="12" cy="12" r="3"></circle>
                                    </svg>
                                    View
                                </button>
                            </td>
                        </tr>
                    `;
                }).join('');
            } else {
                throw new Error('Failed to fetch payslips');
            }
        }).catch(err => {
            tableBody.innerHTML = '<tr><td colspan="5" class="text-center py-6 text-red">Failed to load payslips.</td></tr>';
            console.error('Payslip API Error:', err);
        });
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

window.showEmployeePayslip = function (empId, month, customNet, customYear) {
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
    const monthStr = String(month);
    
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

window.closePayslipModal = function () {
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

window.renderEmployeeTasks = async function (empId) {
    const container = getEl('emp-tasks-container');
    if (!container) return;

    container.innerHTML = '<div class="p-6 text-center text-muted"><div class="spinner"></div> Loading tasks...</div>';

    try {
        const response = await window.apiClient.get(`/tasks/employee/${empId}`);
        if (!response || !response.success) throw new Error('Failed to fetch tasks');
        
        const tasks = response.data || [];
        const pendingTasks = tasks.filter(t => t.status === 'Pending' || t.status === 'In Progress');

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
            const badgeColor = task.priority === 'High' ? 'badge-red' : (task.priority === 'Medium' ? 'badge-orange' : 'badge-green');
            html += `
                <div class="flex-align p-4 border-b hover:bg-gray-50 transition-colors animate-fade-in" id="task-row-${task._id}">
                    <div class="flex-1">
                        <div class="font-medium text-sm">${task.title}</div>
                        <div class="text-xs text-muted mt-1">Priority: <span class="badge ${badgeColor}" style="padding: 2px 6px; font-size: 0.65rem;">${task.priority}</span></div>
                    </div>
                    <button class="btn btn-primary compact-btn text-xs" onclick="window.completeTask('${empId}', '${task._id}')" style="margin-left: 1rem;">
                        Completed
                    </button>
                </div>
            `;
        });

        container.innerHTML = html;
    } catch (err) {
        container.innerHTML = '<div class="p-6 text-center text-red">Failed to load tasks.</div>';
        console.error(err);
    }
};

window.completeTask = async function (empId, taskId) {
    try {
        const response = await window.apiClient.patch(`/tasks/${taskId}/complete`);
        if (response && response.success) {
            window.showToast('Task marked as completed!', 'success');
            
            // Re-render
            window.renderEmployeeTasks(empId);
            
            // Animate out row
            const row = getEl(`task-row-${taskId}`);
            if (row) {
                row.style.opacity = '0';
                setTimeout(() => row.remove(), 300);
            }
            
            // Sync dashboard stats
            window.updateDashboardStats();
            if (typeof window.loadEmployees === 'function') await window.loadEmployees();
        }
    } catch (err) {
        window.showToast('Failed to complete task', 'error');
        console.error(err);
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
window.holidays = [];

window.loadHolidays = async function () {
    try {
        const response = await window.apiClient.get('/holidays');
        if (response && response.success) {
            window.holidays = response.data.map(h => ({
                ...h,
                date: h.date ? new Date(h.date).toISOString().split('T')[0] : ''
            }));
        } else {
            window.holidays = [];
        }
    } catch (err) {
        console.error('Failed to load holidays:', err);
        window.holidays = [];
    }
};

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

window.simulateCheckIn = async function () {
    const emp = (window._currentEmpId ? employees.find(e => e.id === window._currentEmpId) : null)
        || employees.find(e => e.name === window.currentUser?.displayName) || employees[0];
    if (!emp) return;

    try {
        const response = await window.apiClient.post('/attendance/checkin', { employeeId: emp.id });
        if (response && response.success) {
            window.showToast('Checked in successfully', 'success');
            
            // Re-render UI
            window.renderEmployeeAttendanceHistory(emp);
            
            // Sync checkin/checkout buttons via the profile setup
            if (window.selectEmployee) window.selectEmployee(emp);
        } else {
            throw new Error(response?.message || 'Failed to check in');
        }
    } catch (err) {
        window.showToast(err.message || 'Check-in failed', 'error');
    }
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
    try {
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

            // Re-render UI
            window.renderEmployeeAttendanceHistory(emp);
            
            if (window.selectEmployee) window.selectEmployee(emp);
        } else {
            throw new Error('No check-in time recorded. Cannot check out.');
        }
    }
    } catch (err) {
        // Handle 6-hour minimum working hours error
        if (err.message && err.message.includes('6 working hours')) {
            const modal = document.getElementById('early-exit-block-modal');
            if (modal) {
                modal.classList.remove('hidden');
                modal.style.display = '';
            }
            window.showToast('You must complete 6 working hours or apply for leave.', 'error');
        } else {
            window.showToast(err.message || 'Check-out failed', 'error');
        }

        localStorage.setItem(`pps-attendance-today-${emp.id}`, JSON.stringify(todayRecord));

        // Save to persistent attendance history
        let history = JSON.parse(localStorage.getItem(`pps-attendance-history-${emp.id}`) || '[]');
        history = history.filter(r => r.date !== todayDateStr);
        history.unshift(todayRecord);
        localStorage.setItem(`pps-attendance-history-${emp.id}`, JSON.stringify(history));
    }
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

window.renderEmployeeAttendanceHistory = async function (emp) {
    if (!emp) return;
    const tbody = getEl('emp-attendance-history-body');
    if (!tbody) return;

    // Determine selected month from dropdown
    const monthSelect = document.querySelector('#employee-attendance .form-select');
    const now = new Date();
    let targetYear = now.getFullYear();
    let targetMonth = now.getMonth() + 1; // 1-indexed for API
    
    if (monthSelect && monthSelect.value) {
        const parts = monthSelect.value.split('-');
        if (parts.length === 2) {
            targetYear = parseInt(parts[0], 10);
            targetMonth = parseInt(parts[1], 10) + 1; // Dropdown is 0-indexed string? Wait. parts[1] is 00-11, add 1.
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

    try {
        const response = await window.apiClient.get(`/attendance?employeeId=${emp.id}&month=${targetMonth}&year=${targetYear}`);
        if (!response || !response.success) throw new Error('Failed to fetch attendance');
        
        const summary = response.data?.summary || { present: 0, absent: 0, late: 0 };
        const records = response.data?.records || [];

        // Update stat cards
        if (getEl('emp-att-present')) getEl('emp-att-present').textContent = summary.present || 0;
        if (getEl('emp-att-absent')) getEl('emp-att-absent').textContent = summary.absent || 0;
        if (getEl('emp-att-late')) getEl('emp-att-late').textContent = summary.late || 0;
        
        const total = (summary.present || 0) + (summary.absent || 0) + (summary.late || 0);
        const score = total > 0 ? ((((summary.present || 0) + (summary.late || 0)) / total) * 100).toFixed(1) : '0.0';
        if (getEl('emp-att-score')) getEl('emp-att-score').textContent = score + '%';

        // Render table rows
        if (records.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="text-center text-muted py-4">No attendance records for this month.</td></tr>';
            return;
        }

        const todayDateStr = now.toISOString().split('T')[0];

        tbody.innerHTML = records.map(r => {
            const dateObj = new Date(r.date);
            const dateDisplay = dateObj.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
            
            // r.date from API is YYYY-MM-DD
            const isToday = r.date === todayDateStr;

            let badgeClass = 'badge-green';
            if (r.status === 'Absent') badgeClass = 'badge-red';
            else if (r.status === 'Late') badgeClass = 'badge-orange';

            // Format Overtime Display
            let otDisplay = '--:--';
            if (r.overtimeHours && r.overtimeHours > 0) {
                const oh = Math.floor(r.overtimeHours);
                const om = Math.round((r.overtimeHours - oh) * 60);
                otDisplay = `<span class="text-green font-bold">+${oh}h ${om}m</span>`;
            }

            return `<tr${isToday ? ' style="background: rgba(59,130,246,0.04);"' : ''}>
                <td>${dateDisplay}${isToday ? ' <span class="badge badge-blue" style="font-size:0.6rem;padding:1px 5px;">TODAY</span>' : ''}</td>
                <td>${r.checkIn ? (isNaN(Date.parse(r.checkIn)) ? r.checkIn : new Date(r.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })) : '--:--'}</td>
                <td>${r.checkOut ? (isNaN(Date.parse(r.checkOut)) ? r.checkOut : new Date(r.checkOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })) : '--:--'}</td>
                <td><span class="badge ${badgeClass}">${r.status}</span></td>
                <td>${r.workHours ? r.workHours.toFixed(1) + 'h' : '00:00:00'}</td>
                <td>${otDisplay}</td>
            </tr>`;
        }).join('');
    } catch (err) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center text-red py-4">Failed to load attendance history.</td></tr>';
        console.error(err);
    }
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
    } else if (viewId === 'admin-profile') {
        // Sync user profile UI whenever navigating to profile page
        if (window.syncUserUI) window.syncUserUI();
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

window.saveProfileSettings = async function () {
    const name = getEl('profile-name-input')?.value;
    const email = getEl('profile-email-input')?.value;
    const btn = event?.target;
    if (btn) btn.disabled = true;

    try {
        const payload = {};
        if (name) payload.name = name;
        if (email) payload.email = email;

        const response = await window.apiClient.put('/auth/profile', payload);
        if (response && response.success) {
            if (name) localStorage.setItem('pps-profile-name', name);
            if (email) localStorage.setItem('pps-profile-email', email);
            if (name) localStorage.setItem('pps-user-name', name);

            if (window.showToast) window.showToast('Profile information saved to database!', 'success');
            else alert('Profile information saved successfully!');
            
            // Sync UI
            if (window.syncUserUI) window.syncUserUI();
        } else {
            throw new Error(response?.message || 'Failed to update profile');
        }
    } catch (err) {
        console.error(err);
        if (window.showToast) window.showToast('Error: ' + err.message, 'error');
        else alert('Error: ' + err.message);
    } finally {
        if (btn) btn.disabled = false;
    }
};

window.saveCompanySettings = async function () {
    const name = getEl('setting-company-name')?.value;
    const address = getEl('setting-company-address')?.value;
    const btn = event?.target;
    if (btn) btn.disabled = true;

    try {
        const payload = {};
        if (name) payload.companyName = name;
        if (address) payload.companyAddress = address;

        const response = await window.apiClient.put('/settings', payload);
        if (response && response.success) {
            // Also store locally for fast UI render before API load
            if (name) localStorage.setItem('pps-company-name', name);
            if (address) localStorage.setItem('pps-company-address', address);
            
            if (window.showToast) window.showToast('Company information saved to database!', 'success');
            else alert('Company information saved successfully!');
        } else {
            throw new Error(response?.message || 'Failed to save settings');
        }
    } catch (err) {
        console.error(err);
        if (window.showToast) window.showToast('Error: ' + err.message, 'error');
        else alert('Error: ' + err.message);
    } finally {
        if (btn) btn.disabled = false;
    }
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

window.updateDashboardStats = async function () {
    if (!getEl('admin-overview') || getEl('admin-overview').style.display === 'none') return;

    try {
        const response = await window.apiClient.get('/dashboard/stats');
        if (response && response.success) {
            const stats = response.data;
            const totalCard = document.getElementById('dash-total-emp');
            const presentCard = document.getElementById('dash-present-today');
            const scoreCard = document.getElementById('dash-att-score');
            const presenceTotal = document.querySelector('.stat-presence-total');
            const onLeaveCard = document.getElementById('dash-on-leave'); // if it exists
            
            if (totalCard) totalCard.textContent = stats.totalEmployees || 0;
            if (presentCard) presentCard.textContent = stats.presentToday || 0;
            if (scoreCard) scoreCard.textContent = stats.avgPerformance + '%';
            if (presenceTotal) presenceTotal.textContent = `/ ${stats.totalEmployees || 0} total`;
            if (onLeaveCard) onLeaveCard.textContent = stats.onLeaveEmployees || 0;
        }
    } catch (err) {
        console.error('Failed to load dashboard stats:', err);
    }
};

window.getNextId = function () {
    if (!employees || employees.length === 0) return 'PPS001';
    
    // Only parse ids that start with 'PPS' to avoid parsing ObjectIds (like "69e...")
    const ids = employees
        .map(e => {
            const tempId = String(e.employeeId || e.id || "");
            if (tempId.startsWith('PPS')) {
                return parseInt(tempId.replace('PPS', ''), 10) || 0;
            }
            return 0;
        });
    const max = Math.max(...ids, 0);
    return `PPS${String(max + 1).padStart(3, '0')}`;
};

window.getNextLeaveTypeId = function () {
    if (!leaveTypes || leaveTypes.length === 0) return 'LT001';
    
    const ids = leaveTypes
        .map(lt => {
            const tempId = String(lt.id || "");
            if (tempId.startsWith('LT')) {
                return parseInt(tempId.replace('LT', ''), 10) || 0;
            }
            return 0;
        });
    const max = Math.max(...ids, 0);
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
        const match = (amountText || "").replace(/[^\d.]/g, '');
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

        // --- Sync Admin Profile on Init ---
        const role = localStorage.getItem('pps-role');
        if (role === 'admin') {
            window.syncAdminProfileUI();
        }
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
            // Toggle demo credentials hint
            const adminHint = getEl('demo-admin-hint');
            const empHint = getEl('demo-emp-hint');
            if (adminHint) adminHint.style.display = 'none';
            if (empHint) empHint.style.display = 'inline';
        } else {
            if (authTitle) authTitle.textContent = 'Admin Sign In';
            if (authSubtitle) authSubtitle.textContent = 'Access your account to manage payroll.';
            if (authSubmitBtn) authSubmitBtn.textContent = 'Sign In as Administrator';
            if (adminGroup) adminGroup.style.display = 'flex';
            if (empGroup) empGroup.style.display = 'none';
            if (authView) authView.setAttribute('data-current-role', 'admin');
            // Toggle demo credentials hint
            const adminHint = getEl('demo-admin-hint');
            const empHint = getEl('demo-emp-hint');
            if (adminHint) adminHint.style.display = 'inline';
            if (empHint) empHint.style.display = 'none';
        }

        if (modal) modal.classList.add('hidden');
        const views = ['landing-view', 'dashboard-view', 'auth-view'];
        views.forEach(v => { const el = getEl(v); if (el) el.style.display = (v === 'auth-view' ? 'flex' : 'none'); });
        document.body.classList.add('auth-active');
        hydrateCredentials(role);
        window.scrollTo(0, 0);
    }

    // Auth Submission — calls real backend API
    async function handleAuthSubmit() {
        const authView = getEl('auth-view');
        const role = authView ? (authView.getAttribute('data-current-role') || 'admin') : 'admin';
        const email = getEl('email')?.value.trim();
        const password = getEl('password')?.value.trim();
        const rememberMe = getEl('remember-me')?.checked;

        let formName = '';
        if (role === 'employee') {
            formName = getEl('employee-name')?.value.trim();
        } else {
            formName = getEl('admin-user')?.value.trim();
        }

        // Only email and password are required — name is optional display preference
        if (!email || !password) {
            window.showToast('Please enter your email and password to sign in.', 'warning');
            return;
        }

        const submitBtn = getEl('auth-submit-btn');
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="spinner-sm"></span> Signing in...';
        }

        try {
            // 1. Call backend auth API
            const endpoint = role === 'admin' ? '/auth/admin/login' : '/auth/employee/login';
            const response = await window.apiClient.post(endpoint, { email, password });
            
            if (response && response.success && response.data) {
                const { token, user } = response.data;
                
                // 2. Store auth token for subsequent API calls
                if (token) {
                    localStorage.setItem('pps-auth-token', token);
                }
                
                // Server-returned name is always authoritative; fall back to form input, then email prefix
                const displayName = user?.name || formName || email.split('@')[0];
                
                // 3. Store session info for page refresh restoration
                localStorage.setItem('pps-role', role);
                localStorage.setItem('pps-user-name', displayName);
                
                // 4. Remember Me Logic
                if (rememberMe) {
                    window.AuthStorage.saveCredentials(role, displayName, email);
                } else {
                    window.AuthStorage.clearCredentials(role);
                }
                
                // 5. Store employee ID if employee login
                if (role === 'employee' && user?.employeeId) {
                    window._currentEmpId = user.employeeId;
                    localStorage.setItem('pps-current-emp-id', user.employeeId);
                }
                
                // 6. Load all module data from database
                await window.loadAllModuleData();
                
                // 7. Show dashboard
                window.showDashboardView(role, displayName);
                window.showToast(`Welcome back, ${displayName}!`, 'success');
                
                // Clear password for security
                if (getEl('password')) getEl('password').value = '';
            } else {
                throw new Error(response?.message || 'Authentication failed');
            }
        } catch (err) {
            console.error('Login error:', err);
            window.showToast(err.message || 'Sign in failed. Please check your credentials.', 'error');
        } finally {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = role === 'employee' ? 'Sign In as Employee' : 'Sign In as Administrator';
            }
        }
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
        confirmDeleteBtn.addEventListener('click', async () => {
            if (rowToDelete) {
                try {
                    confirmDeleteBtn.disabled = true;
                    // Delete via API
                    await window.apiClient.delete('/employees/' + rowToDelete);
                    if (window.showToast) window.showToast('Employee deleted successfully.', 'success');
                    
                    // Re-fetch and update UI exclusively from backend
                    await window.loadEmployees();
                } catch (err) {
                    console.error('Delete error', err);
                    if (window.showToast) window.showToast('Failed to delete employee.', 'error');
                } finally {
                    confirmDeleteBtn.disabled = false;
                    rowToDelete = null;
                }
            }
            if (deleteModal) deleteModal.classList.add('hidden');
        });
    }

    if (cancelDeleteBtn) cancelDeleteBtn.addEventListener('click', () => { if (deleteModal) deleteModal.classList.add('hidden'); });
    if (deleteModal) deleteModal.addEventListener('click', (e) => { if (e.target === deleteModal) deleteModal.classList.add('hidden'); });

    if (addEmployeeForm) {
        addEmployeeForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = getEl('new-emp-name').value.trim();
            const email = getEl('new-emp-email').value.trim();
            const role = getEl('new-emp-role').value.trim();
            const department = getEl('new-emp-dept').value;
            const status = getEl('new-emp-status').value;
            const ctc = parseInt(getEl('new-emp-ctc').value) || 0;
            const editId = editEmpIndexInput ? editEmpIndexInput.value : '';

            const payload = { 
                name, email, role, dept: department, status, ctc,
                monthlySalary: Math.round(ctc / 12 / 1.15),
                dailyWage: Math.round(ctc / 12 / 30),
                password: 'password123' // default password for new
            };

            const submitBtn = document.querySelector('#add-employee-form button[type="submit"]');
            if (submitBtn) submitBtn.disabled = true;

            try {
                if (editId) {
                    await window.apiClient.put('/employees/' + editId, payload);
                    if (window.showToast) window.showToast('Employee updated successfully.', 'success');
                } else {
                    payload.employeeId = window.getNextId(); // Keep generating ID for payload
                    await window.apiClient.post('/employees', payload);
                    if (window.showToast) window.showToast('Employee added successfully.', 'success');
                }

                // Strictly update from backend
                await window.loadEmployees();

                if (employeeModal) employeeModal.classList.add('hidden');
                addEmployeeForm.reset();
                isEditing = false;
            } catch (err) {
                console.error('Error saving employee:', err);
                if (window.showToast) window.showToast('Failed to save employee. ' + err.message, 'error');
            } finally {
                if (submitBtn) submitBtn.disabled = false;
            }
        });
    }

    const assignTaskForm = getEl('assign-task-form');
    if (assignTaskForm) {
        assignTaskForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = assignTaskForm.querySelector('button[type="submit"]');
            if (submitBtn) submitBtn.disabled = true;

            const empId = getEl('task-assign-emp-id').value;
            const title = getEl('new-task-title').value.trim();
            const desc = getEl('new-task-desc').value.trim();
            const priority = getEl('new-task-priority').value;

            if (!empId || !title) {
                if (submitBtn) submitBtn.disabled = false;
                window.showToast('Employee and Task Title are required', 'warning');
                return;
            }

            try {
                const response = await window.apiClient.post('/tasks', {
                    employeeId: empId,
                    title: title,
                    description: desc,
                    priority: priority
                });

                if (response && response.success) {
                    assignTaskForm.reset();
                    getEl('task-assign-emp-id').value = empId; // retain context across submissions
                    
                    window.renderAdminTaskList(empId);
                    if (typeof window.loadEmployees === 'function') await window.loadEmployees();
                    
                    window.showToast('Task assigned successfully!', 'success');
                } else {
                    throw new Error(response.message || 'Failed to assign task');
                }
            } catch (err) {
                console.error(err);
                window.showToast(err.message || 'Failed to assign task. Please try again.', 'error');
            } finally {
                if (submitBtn) submitBtn.disabled = false;
            }
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

    // --- Profile Dropdown System ---
    const profileTrigger = getEl('profile-menu-trigger');
    const profileDropdown = getEl('profile-dropdown');
    const profileWrapper = getEl('profile-menu-wrapper');

    if (profileTrigger && profileDropdown && profileWrapper) {
        // Toggle dropdown open/close
        profileTrigger.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = profileWrapper.classList.contains('open');

            if (isOpen) {
                profileDropdown.classList.remove('visible');
                profileWrapper.classList.remove('open');
            } else {
                // Sync dropdown data with current user
                const userName = getEl('user-name')?.textContent || 'User';
                const userAvatar = getEl('user-avatar');
                const dropdownName = getEl('dropdown-user-name');
                const dropdownAvatar = getEl('dropdown-avatar');
                const dropdownRole = getEl('dropdown-user-role');

                if (dropdownName) dropdownName.textContent = userName;
                if (dropdownRole) dropdownRole.textContent = (window.currentUser?.role === 'admin') ? 'Administrator' : 'Employee';
                if (dropdownAvatar) {
                    if (userAvatar && userAvatar.querySelector('img')) {
                        dropdownAvatar.innerHTML = userAvatar.querySelector('img').outerHTML;
                    } else {
                        dropdownAvatar.textContent = userName.charAt(0).toUpperCase();
                    }
                }

                profileDropdown.classList.remove('hidden');
                // Force reflow for animation
                profileDropdown.offsetHeight;
                profileDropdown.classList.add('visible');
                profileWrapper.classList.add('open');
            }
        });

        // Close on outside click
        document.addEventListener('click', (e) => {
            if (!profileWrapper.contains(e.target) && profileWrapper.classList.contains('open')) {
                profileDropdown.classList.remove('visible');
                profileWrapper.classList.remove('open');
            }
        });

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && profileWrapper.classList.contains('open')) {
                profileDropdown.classList.remove('visible');
                profileWrapper.classList.remove('open');
            }
        });

        // "My Profile" button
        const dropdownProfile = getEl('dropdown-my-profile');
        if (dropdownProfile) {
            dropdownProfile.addEventListener('click', () => {
                const role = window.currentUser?.role || localStorage.getItem('pps-role');
                if (role === 'admin') {
                    window.showView('admin-profile');
                } else {
                    window.showView('employee-profile');
                }
                profileDropdown.classList.remove('visible');
                profileWrapper.classList.remove('open');
            });
        }

        // "Settings" button
        const dropdownSettings = getEl('dropdown-settings');
        if (dropdownSettings) {
            dropdownSettings.addEventListener('click', () => {
                window.showView('shared-settings');
                profileDropdown.classList.remove('visible');
                profileWrapper.classList.remove('open');
            });
        }

        // "Sign Out" button
        const dropdownLogout = getEl('dropdown-logout');
        if (dropdownLogout) {
            dropdownLogout.addEventListener('click', (e) => {
                e.preventDefault();
                profileDropdown.classList.remove('visible');
                profileWrapper.classList.remove('open');
                window.handleLogout();
            });
        }
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

        // New welcome hero card date elements
        const adminHeroDate = document.getElementById('admin-hero-date-text');
        if (adminHeroDate) adminHeroDate.textContent = dateString;
        const empHeroDate = document.getElementById('emp-hero-date-text');
        if (empHeroDate) empHeroDate.textContent = dateString;

        // Legacy date elements (backwards compat)
        const adminDateText = document.getElementById('dashboard-date-admin-text');
        if (adminDateText) adminDateText.textContent = dateString;
        const emplDate = document.getElementById('dashboard-date-empl');
        if (emplDate) emplDate.textContent = dateString;
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
        runBtn.addEventListener('click', async () => {
            if (!dateInput || !dateInput.value) {
                alert('Please select a date.');
                return;
            }

            const dayParts = dateInput.value.split('-'); // YYYY-MM-DD
            const d = new Date(dayParts[0], dayParts[1] - 1, dayParts[2]);

            if (isNaN(d.getTime())) {
                alert('Invalid Date selected.');
                return;
            }

            const yearOnly = d.getFullYear();
            const monthNum = d.getMonth() + 1;
            const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            const monthLabel = monthNames[d.getMonth()] + " " + String(yearOnly).slice(-4);
            const fyStr = window.getFinancialYear(d);

            if (!confirm(`Are you sure you want to run payroll for ${monthNames[d.getMonth()]} ${yearOnly}? This will overwrite any existing pending records for this month.`)) {
                return;
            }

            runBtn.disabled = true;
            runBtn.innerHTML = '<div class="spinner"></div> Running...';

            try {
                const response = await window.apiClient.post('/payroll/run', {
                    month: monthNum,
                    year: yearOnly,
                    processedBy: window.currentUser?._id || window._currentEmpId || null
                });

                if (response && response.success) {
                    if (window.showToast) {
                        showToast(`Payroll for ${monthLabel} generated successfully!`, 'success');
                    } else {
                        alert(`Payroll for ${monthLabel} generated successfully!`);
                    }

                    // Refresh payroll table
                    window.renderPayrollTable(monthNames[d.getMonth()], fyStr, true);
                } else {
                    throw new Error(response?.message || 'Failed to generate payroll');
                }
            } catch (err) {
                console.error(err);
                if (window.showToast) {
                    showToast(err.message || 'Error generating payroll. Please try again.', 'error');
                } else {
                    alert('Error: ' + err.message);
                }
            } finally {
                runBtn.disabled = false;
                runBtn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg> Run Payroll';
            }
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
    // Payrolls are now saved via API calls (POST /api/payroll/run)
    // This function just triggers UI refresh
    window.updatePayrollSummary();
};

window.loadPayrolls = async function () {
    console.log('Loading Payrolls from API...');
    try {
        const response = await window.apiClient.get('/payroll');
        if (response && response.success) {
            payrolls = response.data.map(p => ({
                ...p,
                id: p._id || p.id,
                empId: p.employeeId || p.empId,
                empName: p.employeeName || p.empName,
                empRole: p.employee?.role || '',
                basic: p.basicSalary || p.basic || 0,
                allowances: (p.hra || 0) + (p.ta || 0) + (p.da || 0),
                bonus: p.bonus || 0,
                gross: p.grossEarnings || p.gross || 0,
                tds: p.tds || 0,
                otherDeductions: (p.lossOfPay || 0) + (p.otherDeductions || 0),
                totalDeductions: p.totalDeductions || 0,
                net: p.netPay || p.net || 0,
                status: p.status || 'Processed',
                // Build frontend-compatible month label
                month: p.month && p.year ? (() => {
                    const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
                    return monthNames[p.month - 1] + ' ' + p.year;
                })() : (p.month || ''),
                financialYear: p.year ? (() => {
                    const m = p.month || 1;
                    const y = p.year;
                    return m >= 4 ? `FY ${y}-${String(y+1).slice(-2)}` : `FY ${y-1}-${String(y).slice(-2)}`;
                })() : (p.financialYear || ''),
                dateObj: p.year && p.month ? `${p.year}-${String(p.month).padStart(2,'0')}-01` : (p.dateObj || ''),
                dateFormatted: p.year && p.month ? `01 ${String(p.month).padStart(2,'0')} ${p.year}` : (p.dateFormatted || ''),
            }));
            console.log(`Loaded ${payrolls.length} payroll records from database.`);
        }
    } catch (err) {
        console.error('Failed to load payrolls from API:', err);
        payrolls = [];
    }
};

window.renderPayrollTable = async function (searchMonth = '', searchFY = '', forceShow = false) {
    const tbody = getEl('payroll-table-body');
    if (!tbody) return;

    tbody.innerHTML = '<tr><td colspan="8" class="text-center py-6 text-muted"><div class="spinner"></div> Loading payroll records...</td></tr>';

    try {
        const query = (getEl('payroll-search')?.value || '').toLowerCase();
        
        let monthNum = null;
        let yearNum = null;

        // If searchMonth like 'February', map to month number
        if (searchMonth) {
            const mMap = { 'january':1, 'february':2, 'march':3, 'april':4, 'may':5, 'june':6, 'july':7, 'august':8, 'september':9, 'october':10, 'november':11, 'december':12 };
            monthNum = mMap[searchMonth.toLowerCase().trim()];
        }
        
        if (searchFY) {
            yearNum = parseInt(searchFY.split('-')[0], 10);
        }

        let endpoint = '/payroll?';
        if (monthNum) endpoint += `month=${monthNum}&`;
        if (yearNum) endpoint += `year=${yearNum}&`;

        const response = await window.apiClient.get(endpoint);
        if (!response || !response.success) throw new Error('Failed to fetch payroll');

        let records = response.data || [];

        // Apply text query filter
        if (query) {
            records = records.filter(p => {
                const pMonth = (p.month || '').toString().toLowerCase();
                const mName = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'][p.month - 1] || '';
                return (p.employeeName && p.employeeName.toLowerCase().includes(query)) ||
                       (p.employeeId && p.employeeId.toLowerCase().includes(query)) ||
                       mName.includes(query);
            });
        }

        // Limit to 10 if not forcing all
        if (!searchMonth && !searchFY && !query && !forceShow) {
            records = records.slice(0, 10);
        }

        if (typeof window.updatePayrollSummary === 'function') {
            window.updatePayrollSummary(searchFY, searchMonth, query, records);
        }

        if (records.length === 0) {
            tbody.innerHTML = `<tr><td colspan="8" class="text-center py-6 text-muted">No payroll data found.</td></tr>`;
            const tfoot = getEl('payroll-table-foot');
            if (tfoot) tfoot.classList.add('hidden');
            return;
        }

        const monthsArray = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

        tbody.innerHTML = records.map(p => {
            const mName = monthsArray[p.month - 1] || p.month;
            const created = new Date(p.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
            
            return `
                <tr>
                    <td data-label="Employee">
                        <div class="font-medium">${p.employeeName || 'Unknown'}</div>
                        <div class="text-xs text-muted">${p.employeeId}</div>
                    </td>
                    <td data-label="Month">
                        <div class="font-medium">${mName} ${p.year}</div>
                        <div class="text-xs text-muted">${created}</div>
                    </td>
                    <td data-label="Gross Salary">₹${(p.grossEarnings || 0).toLocaleString()}</td>
                    <td data-label="Tax (TDS)" class="text-red">₹${(p.tds || 0).toLocaleString()}</td>
                    <td data-label="Total Deduction">₹${(p.totalDeductions || 0).toLocaleString()}</td>
                    <td data-label="Net Salary"><span class="font-bold text-green">₹${(p.netPay || 0).toLocaleString()}</span></td>
                    <td data-label="Status"><span class="badge badge-green">${p.status || 'Paid'}</span></td>
                    <td>
                        <div style="display: flex; gap: 0.5rem; justify-content: flex-end;">
                            <button class="btn btn-secondary compact-btn text-xs" onclick="window.showPayslip('${p.employeeId}', '${mName} ${p.year}')">Payslip</button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');

        // Handle Table Footer Totals
        const tfoot = getEl('payroll-table-foot');
        if (tfoot) {
            const totals = records.reduce((acc, curr) => {
                acc.gross += (parseFloat(curr.grossEarnings) || 0);
                acc.tds += (parseFloat(curr.tds) || 0);
                acc.deduction += (parseFloat(curr.totalDeductions) || 0);
                acc.net += (parseFloat(curr.netPay) || 0);
                return acc;
            }, { gross: 0, tds: 0, deduction: 0, net: 0 });

            if (getEl('foot-total-gross')) getEl('foot-total-gross').textContent = `₹${totals.gross.toLocaleString()}`;
            if (getEl('foot-total-tds')) getEl('foot-total-tds').textContent = `₹${totals.tds.toLocaleString()}`;
            if (getEl('foot-total-deduction')) getEl('foot-total-deduction').textContent = `₹${totals.deduction.toLocaleString()}`;
            if (getEl('foot-total-net')) getEl('foot-total-net').textContent = `₹${totals.net.toLocaleString()}`;
            tfoot.classList.remove('hidden');
        }
    } catch (err) {
        tbody.innerHTML = `<tr><td colspan="8" class="text-center py-6 text-red">Error loading payroll data.</td></tr>`;
        console.error('Payroll API Error:', err);
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

    // Synthetic record if missing — pass the employee object (not a number)
    if (!p) {
        const breakdown = window.calculateSalaryBreakdown(emp);
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

    const companyName = localStorage.getItem('pps-company-name') || 'Prime Payroll Solution';
    const companyAddress = localStorage.getItem('pps-company-address') || '123 Tech Hub, HITEC City, Hyderabad, 500081';

    // --- USE ACTUAL PAYROLL RECORD VALUES (matches the payroll table exactly) ---
    const grossVal = p.gross || 0;
    const basicVal = p.basic || Math.round(grossVal * 0.5);
    const allowVal = p.allowances || Math.round(grossVal * 0.4);
    const bonusVal = p.bonus || 0;

    // Derive individual earnings from the record's basic + allowances
    const hraVal = Math.round(basicVal * 0.4);
    const eduVal = 2500;
    const ltaVal = Math.round(basicVal * 0.1);
    const conveyance = 1600;
    const entertainmentVal = 1500;
    const personalAllowance = allowVal - hraVal - eduVal - ltaVal - conveyance - entertainmentVal;

    // Deductions — use ONLY values from the payroll record so line items sum to the total
    const tdsVal = p.tds || 0;
    const otherDed = p.otherDeductions || 0;
    const totalDeductions = p.totalDeductions || 0;
    const netVal = p.net || (grossVal - totalDeductions);

    // Build payslip data — pass pre-calculated values so Payslip.jsx uses them directly
    const payslipData = {
        name: p.empName,
        id: p.empId,
        position: p.empRole || (emp ? emp.role : 'Professional'),
        department: emp ? (emp.dept || 'Engineering') : 'Engineering',
        period: p.financialYear ? `${p.month} | ${p.financialYear}` : p.month,
        companyName: companyName,
        companyAddress: companyAddress,
        // Payment context
        bankName: emp ? (emp.bankName || 'HDFC Bank') : 'HDFC Bank',
        accountNumber: emp ? (emp.accountNumber || 'XXXX XXXX ' + String(emp.id).replace(/\D/g, '').slice(-4).padStart(4, '0')) : 'XXXX XXXX 0000',
        paymentDate: p.dateFormatted || new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
        // Pre-calculated earnings (matches payroll table's gross)
        calculatedEarnings: {
            basic: basicVal,
            hra: hraVal,
            educationAllowance: eduVal,
            lta: ltaVal,
            personalAllowance: Math.max(personalAllowance, 0),
            entertainmentReimbursement: entertainmentVal,
            conveyance: conveyance,
            bonus: bonusVal,
            grossTotal: grossVal
        },
        calculatedDeductions: {
            tds: tdsVal,
            pf: 0,
            esi: 0,
            professionalTax: 0,
            otherDeductions: otherDed,
            loans: 0,
            perquisites: 0,
            totalDeductions: totalDeductions
        },
        netSalary: netVal,
        // Trigger Payslip.jsx (A4 template) — boolean flag instead of CTC
        useA4Template: true
    };

    // Also keep legacy localStorage for payslip.html iframe fallback
    localStorage.setItem('pps-current-payslip', JSON.stringify(payslipData));

    // Use the React PayslipModal via bridge if available, else fall back to iframe modal
    if (typeof window.openPayslipSystemModal === 'function') {
        setTimeout(() => {
            window.openPayslipSystemModal(payslipData);
            window.showToast('Payslip generated successfully.', 'success');
        }, 300);
    } else {
        // Fallback: iframe-based modal
        const iframe = getEl('payslip-iframe');
        if (iframe) {
            iframe.src = 'payslip.html?t=' + Date.now();
        }
        setTimeout(() => {
            getEl('payslip-print-modal')?.classList.remove('hidden');
            getEl('payslip-print-modal') && (getEl('payslip-print-modal').style.display = 'flex');
            window.autoScalePayslip();
            window.showToast('Payslip generated successfully.', 'success');
        }, 400);
    }

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

window.initPayrollChart = async function () {
    const canvas = document.getElementById('payrollChart');
    if (!canvas || !window.Chart) return;
    
    let labels = ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'];
    let dataPts = [28.4, 29.1, 31.5, 33.2, 34.6, 35.8];

    try {
        const response = await window.apiClient.get('/dashboard/payroll-chart');
        if (response && response.success && response.data) {
            // response.data is an array of { label, month, year, total }
            // API returns latest month last (reversed from 5 months ago to now)
            labels = response.data.map(d => d.label);
            dataPts = response.data.map(d => parseFloat((d.total / 100000).toFixed(2))); // convert to Lakhs
        }
    } catch(e) {
        console.error('Failed to load payroll chart data', e);
    }

    if (window.payrollChart) window.payrollChart.destroy();
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const ctx = canvas.getContext('2d');
    const gradient = ctx.createLinearGradient(0, 0, 0, 220);
    gradient.addColorStop(0, 'rgba(59,130,246,0.95)');
    gradient.addColorStop(1, 'rgba(96,165,250,0.6)');
    
    window.payrollChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{ label: 'Payroll (₹ Lakhs)', data: dataPts, backgroundColor: gradient, borderRadius: 8 }]
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
    // Employees are now saved via API calls (POST/PUT /api/employees)
    // This function just triggers UI refresh
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
    window.renderEmployeePayslipsTable(emp.id);
    if (window.renderEmployeeUpcomingHolidays) window.renderEmployeeUpcomingHolidays();
};

window.renderEmployeeUpcomingHolidays = function () {
    const container = document.querySelector('#employee-overview .right-panel .flex-column.gap-1');
    if (!container) return;

    if (!window.holidays || window.holidays.length === 0) {
        container.innerHTML = '<div class="text-sm text-muted">No upcoming holidays</div>';
        return;
    }

    const today = new Date();
    // Filter holidays that are in the future, sort by date, take top 3
    const upcoming = window.holidays
        .filter(h => new Date(h.date) >= today)
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .slice(0, 3);

    if (upcoming.length === 0) {
        container.innerHTML = '<div class="text-sm text-muted">No upcoming holidays</div>';
        return;
    }

    container.innerHTML = upcoming.map(h => {
        const d = new Date(h.date);
        const monthStr = d.toLocaleString('en-US', { month: 'short' }).toUpperCase();
        const dayNum = d.getDate();
        const weekdayStr = d.toLocaleString('en-US', { weekday: 'long' });

        return `
            <div class="holiday-item saas-event-row transition-colors" style="border: none;">
                <div class="holiday-date saas-date-badge flex-column flex-align bg-bg-alt rounded-md border text-center">
                    <span class="date-month text-primary uppercase font-bold" style="font-size: 10px;">${monthStr}</span>
                    <span class="date-day font-bold" style="font-size: 15px;">${dayNum}</span>
                </div>
                <div class="holiday-text">
                    <div class="font-semibold text-[13px] text-text">${h.name}</div>
                    <div class="text-[12px] font-medium text-muted mt-0.5">${weekdayStr}</div>
                </div>
            </div>
        `;
    }).join('');
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
                    <button class="btn btn-outline compact-btn text-xs" onclick="showEmployeePayslip('${p.empId}', '${p.month}')">Payslip</button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
};

/**
 * ============================================
 * CENTRALIZED DATA LOADER
 * ============================================
 * Loads ALL module data from MongoDB Atlas in parallel.
 * Called once after login and once on session restore.
 * This is the SINGLE SOURCE OF TRUTH — no localStorage fallbacks.
 */
window.loadAllModuleData = async function () {
    console.log('[PPS] Loading all module data from database...');
    
    // Load employees first (other modules depend on it)
    await window.loadEmployees();
    
    // Load remaining modules in parallel for speed
    await Promise.allSettled([
        window.loadPayrolls(),
        window.loadLeaveTypes(),
        window.loadLeaveRequests(),
        window.loadBonusesDeductions(),
        window.loadHolidays(),
    ]);
    
    // Initialize modules that need post-load setup
    if (window.initPayrollModule) window.initPayrollModule();
    if (window.initAttendanceModule) window.initAttendanceModule();
    
    // Update dashboard stats from API
    if (window.updateDashboardStats) window.updateDashboardStats();
    
    // Sync user profile UI
    if (window.syncUserUI) window.syncUserUI();
    
    console.log('[PPS] All module data loaded successfully');
};

window.loadEmployees = async function () {
    console.log('Loading Employees from API...');
    try {
        const response = await window.apiClient.get('/employees');
        if (response && response.success) {
            // Map backend data: normalize `id` so frontend logic works flawlessly with employeeId
            employees = response.data.map(emp => ({
                ...emp,
                id: emp.employeeId || emp.id || emp._id
            }));
            window.totalEmployeesCount = response.count || employees.length; // Use backend count exactly!
            console.log(`Loaded ${employees.length} employees from database. Count from backend: ${window.totalEmployeesCount}`);
            
            // Re-render UI now that we have data
            if (window.renderEmployeeTable) window.renderEmployeeTable();
            if (window.updateDashboardStats) window.updateDashboardStats();
        }
    } catch (err) {
        console.error('Failed to load employees:', err);
    }
};

window.loadLeaveTypes = async function () {
    console.log('Loading Leave Types from API...');
    try {
        const ltResponse = await window.apiClient.get('/leaves/types');
        if (ltResponse && ltResponse.success && ltResponse.data.length > 0) {
            leaveTypes = ltResponse.data.map(lt => ({
                ...lt,
                id: lt._id || lt.id,
                code: lt.name ? lt.name.split(' ').map(w => w[0]).join('') : 'XX',
                category: lt.isPaid ? 'Paid' : 'Unpaid',
                desc: lt.description || lt.name,
            }));
            console.log(`Loaded ${leaveTypes.length} leave types from database.`);
        } else {
            leaveTypes = [];
        }
    } catch (err) {
        console.error('Failed to load leave types from API:', err);
        leaveTypes = [];
    }
};

window.loadLeaveRequests = async function () {
    console.log('Loading Leave Requests from API...');
    try {
        const lrResponse = await window.apiClient.get('/leaves');
        if (lrResponse && lrResponse.success) {
            leaveRequests = lrResponse.data.map(lr => ({
                ...lr,
                id: lr._id || lr.id,
                employee_id: lr.employeeId || lr.employee_id,
                leave_type: lr.leaveType || lr.leave_type,
                start_date: lr.fromDate ? new Date(lr.fromDate).toISOString().split('T')[0] : (lr.start_date || ''),
                end_date: lr.toDate ? new Date(lr.toDate).toISOString().split('T')[0] : (lr.end_date || ''),
                reason: lr.reason || '',
                status: lr.status || 'Pending',
                created_at: lr.createdAt || lr.created_at || '',
            }));
            console.log(`Loaded ${leaveRequests.length} leave requests from database.`);
        } else {
            leaveRequests = [];
        }
    } catch (err) {
        console.error('Failed to load leave requests from API:', err);
        leaveRequests = [];
    }
};



window.loadBonusesDeductions = async function () {
    console.log('Loading Bonuses & Deductions from API...');
    try {
        const response = await window.apiClient.get('/bonuses');
        if (response && response.success) {
            bonusesDeductions = response.data.map(bd => ({
                ...bd,
                id: bd._id || bd.id,
                empId: bd.employeeId || bd.empId,
                empName: bd.employeeName || bd.empName,
                title: bd.description || bd.title || bd.category || '',
                effectiveMonth: bd.month && bd.year ? `${bd.year}-${String(bd.month).padStart(2,'0')}` : (bd.effectiveMonth || ''),
                date: bd.createdAt ? bd.createdAt.split('T')[0] : (bd.date || ''),
            }));
            console.log(`Loaded ${bonusesDeductions.length} bonus/deduction records from database.`);
        }
    } catch (err) {
        console.error('Failed to load bonuses/deductions from API:', err);
        bonusesDeductions = [];
    }
};

window.saveBonusesDeductions = function () {
    // Bonuses/deductions are now saved via API calls
    // This function just triggers UI refresh
    if (window.renderBonusesDeductionsTable) window.renderBonusesDeductionsTable();
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
        bdForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = bdForm.querySelector('button[type="submit"]');
            if (submitBtn) submitBtn.disabled = true;

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
            const date = getEl('bd-date').value;

            try {
                const payload = {
                    employeeId: empId,
                    type,
                    category,
                    description: title,
                    amount,
                    month: parseInt(m, 10),
                    year: parseInt(y, 10)
                };

                let response;
                if (id) {
                    response = await window.apiClient.put(`/bonuses/${id}`, payload);
                } else {
                    response = await window.apiClient.post('/bonuses', payload);
                }

                if (response && response.success) {
                    window.closeBonusDeductionModal();
                    if (window.showToast) window.showToast('Salary adjustment saved successfully.', 'success');
                    if (window.loadBonusesDeductions) await window.loadBonusesDeductions();
                    window.renderBonusesDeductionsTable();
                } else {
                    throw new Error(response?.message || 'Failed to save record');
                }
            } catch (err) {
                console.error(err);
                if (window.showToast) window.showToast('Failed to save adjustment: ' + err.message, 'error');
                else alert('Failed to save: ' + err.message);
            } finally {
                if (submitBtn) submitBtn.disabled = false;
            }
        });
    }

    window.renderBonusesDeductionsTable();
    bdInitialized = true;
}



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

window.renderAttendanceTable = async function (filterData) {
    const tbody = getEl('attendance-table-body');
    if (!tbody) return;

    if (!filterData) {
        if (typeof window.loadEmployees === 'function' && (!employees || employees.length === 0)) {
            await window.loadEmployees();
        }
        filterData = employees;
    }

    tbody.innerHTML = '<tr><td colspan="8" class="text-center py-6 text-muted"><div class="spinner"></div> Loading attendance data...</td></tr>';

    try {
        const currentAttMonth = getEl('att-month-filter')?.value || '';
        let month = new Date().getMonth() + 1;
        let year = new Date().getFullYear();
        
        if (currentAttMonth) {
            const parts = currentAttMonth.split('-');
            if (parts.length === 2) {
                year = parseInt(parts[0], 10);
                month = parseInt(parts[1], 10);
            }
        }

        const response = await window.apiClient.get(`/attendance/summary?month=${month}&year=${year}`);
        if (!response || !response.success) throw new Error('Failed to fetch attendance summary');
        
        const summaries = response.data || [];
        const summaryMap = {};
        summaries.forEach(s => summaryMap[s._id] = s);
        
        // Store globally to synchronize detail modal
        window.lastAttendanceSummaries = summaryMap;

        tbody.innerHTML = '';
        filterData.forEach(emp => {
            const sum = summaryMap[emp.id] || { present: 0, absent: 0, halfDay: 0, paidLeave: 0, unpaidLeave: 0, totalRecords: 0 };
            
            // Calculate pseudo metrics for UI display purposes based on DB data
            const totalWorking = emp.totalWorking || 26;
            const daysWorked = sum.present + (sum.halfDay * 0.5) + sum.paidLeave;
            const attPct = totalWorking > 0 ? Math.min(100, Math.round((daysWorked / totalWorking) * 100)) : 0;
            
            const ms = emp.monthlySalary || Math.round(emp.ctc / 12 / 1.15) || 0;
            const dailyWage = ms / totalWorking;
            const deduction = Math.round((sum.absent + sum.unpaidLeave) * dailyWage) || 0;
            const grossSalary = currentSalaryType === 'monthly' ? ms : (dailyWage * totalWorking);
            const netSalary = grossSalary - deduction;

            const tr = document.createElement('tr');
            tr.className = 'emp-att-row animate-fade-in';
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

        if (typeof updateAttSummary === 'function') updateAttSummary();
    } catch (err) {
        tbody.innerHTML = '<tr><td colspan="8" class="text-center py-6 text-red">Failed to load attendance data.</td></tr>';
        console.error(err);
    }
}

// Backward-compatible aliases for payroll module
function calculateAttPercentage(emp) { return calculateAttPercentageForMonth(emp, ''); }
function calculateEstimatedDeduction(emp, type) { return calculateDeductionForMonth(emp, type, ''); }

window.showAttendanceDetailModal = function (id) {
    const emp = employees.find(e => e.id === id);
    if (!emp) return;

    const modal = getEl('attendance-detail-modal');
    
    let att;
    let deduction = 0;
    let attPct = 0;

    if (window.lastAttendanceSummaries && window.lastAttendanceSummaries[id]) {
        const sum = window.lastAttendanceSummaries[id];
        att = {
            present: sum.present || 0,
            absent: sum.absent || 0,
            halfDay: sum.halfDay || 0,
            paidLeave: sum.paidLeave || 0,
            unpaidLeave: sum.unpaidLeave || 0,
            sickLeave: sum.sickLeave || 0,
            wfh: sum.wfh || 0,
            totalWorking: emp.totalWorking || 26,
            holidays: sum.holidays || 0
        };
        const totalWorking = emp.totalWorking || 26;
        const daysWorked = att.present + (att.halfDay * 0.5) + att.paidLeave;
        attPct = totalWorking > 0 ? Math.min(100, Math.round((daysWorked / totalWorking) * 100)) : 0;
        
        const ms = emp.monthlySalary || Math.round(emp.ctc / 12 / 1.15) || 0;
        const dailyWage = ms / totalWorking;
        deduction = Math.round((att.absent + att.unpaidLeave) * dailyWage) || 0;
    } else {
        att = getMonthlyAttendance(emp, currentAttMonth);
        deduction = calculateDeductionForMonth(emp, currentSalaryType, currentAttMonth);
        attPct = calculateAttPercentageForMonth(emp, currentAttMonth);
    }

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

window.renderAdminTaskList = async function (empId) {
    const listContainer = getEl('admin-task-list-container');
    const countsEl = getEl('task-modal-counts');
    if (!listContainer) return;

    listContainer.innerHTML = '<div class="text-center text-muted p-4"><div class="spinner"></div> Loading tasks...</div>';

    try {
        const response = await window.apiClient.get(`/tasks/employee/${empId}`);
        if (!response || !response.success) throw new Error('Failed to fetch tasks');
        
        const tasks = response.data || [];
        
        if (tasks.length === 0) {
            listContainer.innerHTML = '<div class="text-center text-muted p-4">No tasks assigned yet.</div>';
            if (countsEl) countsEl.textContent = '0 / 0 Completed';
            return;
        }

        const completedCount = tasks.filter(t => t.status === 'Completed').length;
        if (countsEl) countsEl.textContent = `${completedCount} / ${tasks.length} Completed`;

        // Sort: pending first
        const sortedTasks = [...tasks].sort((a, b) => {
            const aCompleted = a.status === 'Completed';
            const bCompleted = b.status === 'Completed';
            if (aCompleted === bCompleted) return 0;
            return aCompleted ? 1 : -1;
        });

        let html = '';
        sortedTasks.forEach(task => {
            const badgeColor = task.priority === 'High' ? 'badge-red' : (task.priority === 'Medium' ? 'badge-orange' : 'badge-blue');
            const isCompleted = task.status === 'Completed';
            const statusBadge = isCompleted ? '<span class="badge badge-green">Completed</span>' : '<span class="badge badge-yellow">Pending</span>';

            html += `
                <div class="p-3 mb-3 border rounded-lg ${isCompleted ? 'bg-gray-50 opacity-70' : 'bg-white'}">
                    <div class="flex-between">
                        <div class="font-medium text-sm ${isCompleted ? 'line-through text-muted' : ''}">${task.title}</div>
                        ${statusBadge}
                    </div>
                    ${task.description ? `<div class="text-xs text-muted mt-1">${task.description}</div>` : ''}
                    <div class="text-xs mt-2">
                        <span class="text-muted mr-1">Priority:</span>
                        <span class="badge ${badgeColor}" style="padding: 2px 6px; font-size: 0.6rem;">${task.priority}</span>
                    </div>
                </div>
            `;
        });
        listContainer.innerHTML = html;
    } catch (err) {
        listContainer.innerHTML = '<div class="text-center text-red p-4">Failed to load tasks.</div>';
        console.error(err);
    }
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
        typeForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = typeForm.querySelector('button[type="submit"]');
            if (submitBtn) submitBtn.disabled = true;

            const idInput = getEl('edit-leave-type-id').value.trim();
            const name = getEl('leave-type-name').value.trim();
            const code = getEl('leave-type-code').value.trim();
            const category = getEl('leave-type-category').value;
            const description = getEl('leave-type-desc').value.trim();
            const isPaid = category === 'Paid';

            if (!name || !code) {
                window.showToast('Please fill in all required fields.', 'warning');
                if (submitBtn) submitBtn.disabled = false;
                return;
            }

            try {
                const payload = {
                    name,
                    code,
                    category,
                    isPaid,
                    description
                };

                let response;
                if (idInput) {
                    response = await window.apiClient.put(`/leaves/types/${idInput}`, payload);
                } else {
                    response = await window.apiClient.post('/leaves/types', payload);
                }

                if (response && response.success) {
                    window.showToast(`"${name}" leave type saved successfully.`, 'success');
                    window.closeLeaveTypeModal();
                    
                    // Trigger UI refresh
                    if (window.loadLeaveTypes) await window.loadLeaveTypes();
                    window.renderAdminLeaveTypes();
                } else {
                    throw new Error(response?.message || 'Failed to save leave type');
                }
            } catch (err) {
                console.error(err);
                if (window.showToast) window.showToast(err.message, 'error');
                else alert('Failed to save leave type: ' + err.message);
            } finally {
                if (submitBtn) submitBtn.disabled = false;
            }
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

window.submitLeaveRequest = async function () {
    const submitBtn = event?.currentTarget || null;
    if (submitBtn) submitBtn.disabled = true;

    const empId = getEl('lr-employee')?.value;
    const leaveTypeId = getEl('lr-type')?.value;
    const startDate = getEl('lr-start')?.value;
    const endDate = getEl('lr-end')?.value;
    const reason = getEl('lr-reason')?.value || '';

    if (!empId || !leaveTypeId || !startDate || !endDate) {
        alert('Please fill all required fields.');
        if (submitBtn) submitBtn.disabled = false;
        return;
    }
    if (new Date(endDate) < new Date(startDate)) {
        alert('End date cannot be before start date.');
        if (submitBtn) submitBtn.disabled = false;
        return;
    }

    try {
        const payload = {
            employeeId: empId,
            leaveTypeId,
            startDate,
            endDate,
            reason,
            requestType: 'STANDARD',
            duration: 'Full Day'
        };

        const response = await window.apiClient.post('/leaves', payload);
        if (response && response.success) {
            getEl('add-leave-request-modal')?.classList.add('hidden');
            if (window.showToast) window.showToast('Leave request submitted successfully!', 'success');
            
            // Refresh
            if (window.loadLeaveRequests) await window.loadLeaveRequests();
            window.renderAdminLeaveRequests();
            window.renderAdminLeaveCalendar?.();
        } else {
            throw new Error(response?.message || 'Failed to submit leave');
        }
    } catch (err) {
        console.error(err);
        if (window.showToast) window.showToast('Error: ' + err.message, 'error');
        else alert('Error: ' + err.message);
    } finally {
        if (submitBtn) submitBtn.disabled = false;
    }
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

window.deleteLeaveType = async function (id) {
    if (confirm('Are you sure you want to delete this leave type? Past requests will not be affected.')) {
        try {
            const response = await window.apiClient.delete(`/leaves/types/${id}`);
            if (response && response.success) {
                if (window.showToast) window.showToast('Leave type deleted.', 'success');
                if (window.loadLeaveTypes) await window.loadLeaveTypes();
                window.renderAdminLeaveTypes();
            } else {
                throw new Error(response?.message || 'Failed to delete leave type');
            }
        } catch (err) {
            console.error(err);
            if (window.showToast) window.showToast('Error: ' + err.message, 'error');
            else alert('Error: ' + err.message);
        }
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

        const startDate = req.fromDate || req.start_date || req.startDate;
        const endDate = req.toDate || req.end_date || req.endDate;
        const sd = new Date(startDate);
        const ed = new Date(endDate);
        const days = req.totalDays || Math.round((ed - sd) / (1000 * 60 * 60 * 24)) + 1;

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

window.updateLeaveStatus = async function (reqId, newStatus) {
    if (!confirm(`Are you sure you want to mark this leave as ${newStatus}?`)) return;

    try {
        const response = await window.apiClient.patch(`/leaves/${reqId}/status`, { status: newStatus });
        if (response && response.success) {
            if (window.showToast) window.showToast(`Leave marked as ${newStatus}`, 'success');
            
            // Refresh
            if (window.loadLeaveRequests) await window.loadLeaveRequests();
            window.renderAdminLeaveRequests();
            window.renderAdminLeaveCalendar?.();
        } else {
            throw new Error(response?.message || 'Failed to update leave status');
        }
    } catch (err) {
        console.error(err);
        if (window.showToast) window.showToast('Error updating status: ' + err.message, 'error');
        else alert('Error updating status: ' + err.message);
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
                    <button class="action-btn" onclick="deleteSalaryAdjustment('${item.id}')" title="Delete"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg></button>
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

window.deleteSalaryAdjustment = async function (id) {
    const item = bonusesDeductions.find(b => b.id === id);
    if (!item) return;

    if (item.status === 'Applied') {
        alert('Cannot delete an adjustment that has already been applied to a processed payroll.');
        return;
    }

    if (confirm('Are you sure you want to delete this adjustment?')) {
        try {
            const response = await window.apiClient.delete(`/bonuses/${id}`);
            if (response && response.success) {
                if (window.loadBonusesDeductions) await window.loadBonusesDeductions();
                if (window.renderBonusesDeductionsTable) window.renderBonusesDeductionsTable();
                if (window.showToast) window.showToast('Deleted successfully', 'success');
            } else {
                throw new Error(response?.message || 'Failed to delete record');
            }
        } catch (err) {
            console.error(err);
            alert('Failed to delete: ' + err.message);
        }
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

    const applyForm = getEl('apply-leave-form');
    if (applyForm) {
        applyForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = applyForm.querySelector('button[type="submit"]');
            if (submitBtn) submitBtn.disabled = true;

            const typeId = getEl('emp-leave-type-select').value;
            const startDate = getEl('leave-start-date').value;
            const endDate = getEl('leave-end-date').value;
            const reason = getEl('leave-reason').value;

            if (new Date(startDate) > new Date(endDate)) {
                alert('End Date must be after Start Date.');
                if (submitBtn) submitBtn.disabled = false;
                return;
            }

            const newId = 'LR' + String(leaveRequests.length + 1).padStart(4, '0');
            const leaveTypeObj = leaveTypes.find(t => t.id === typeId) || { name: 'Unknown' };
            const appliedDate = new Date().toISOString().split('T')[0];
            const createdAt = new Date().toLocaleString();

            const durationInput = getEl('leave-duration');
            const duration = durationInput ? durationInput.value : 'Full Day';
            const requestType = duration === 'Early Exit' ? 'EARLY_EXIT' : 'STANDARD';

            try {
                const lType = leaveTypes.find(lt => lt.id === typeId);
                const leaveTypeName = lType ? lType.name : 'Casual Leave';
                
                const startD = new Date(startDate);
                const endD = new Date(endDate);
                let days = Math.round((endD - startD) / (1000 * 60 * 60 * 24)) + 1;
                if (duration === 'Half Day' || duration === 'Early Exit') {
                    days = 0.5;
                }

                const payload = {
                    employeeId: emp.id,
                    employeeName: emp.name,
                    leaveType: leaveTypeName,
                    fromDate: startDate,
                    toDate: endDate,
                    totalDays: days,
                    isHalfDay: days === 0.5,
                    reason
                };

                const response = await window.apiClient.post('/leaves', payload);
                if (response && response.success) {
                    window.closeApplyLeaveModal();
                    if (window.showToast) window.showToast('Leave request submitted successfully.', 'success');
                    
                    // Trigger UI refresh
                    if (window.loadLeaveRequests) await window.loadLeaveRequests();
                    window.renderEmployeeLeaveBalance(emp.id);
                    window.renderEmployeeLeaveHistory(emp.id);
                } else {
                    throw new Error(response?.message || 'Failed to submit leave');
                }
            } catch (err) {
                console.error(err);
                if (window.showToast) window.showToast(err.message, 'error');
                else alert('Failed to submit leave: ' + err.message);
            } finally {
                if (submitBtn) submitBtn.disabled = false;
            }
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

window.renderEmployeeLeaveHistory = async function (empId) {
    if (!empId) {
        const userEmail = localStorage.getItem('pps-user');
        const emp = employees.find(e => e.email === userEmail);
        if (emp) empId = emp.id; else return;
    }

    const tbody = getEl('emp-leave-history');
    if (!tbody) return;

    tbody.innerHTML = '<tr><td colspan="3" class="text-center py-4 text-muted"><div class="spinner"></div> Loading leaves...</td></tr>';

    try {
        const response = await window.apiClient.get(`/leaves/employee/${empId}`);
        if (!response || !response.success) throw new Error('Failed to fetch leaves');
        
        const myReqs = response.data || [];

        if (myReqs.length === 0) {
            tbody.innerHTML = '<tr><td colspan="3" class="text-center py-4 text-muted">No leave history found.</td></tr>';
            return;
        }

        tbody.innerHTML = '';
        myReqs.forEach(req => {
            const typeName = req.leaveType || 'Unknown';
            const isPaid = !typeName.toLowerCase().includes('unpaid');

            const sd = new Date(req.fromDate || req.startDate);
            const ed = new Date(req.toDate || req.endDate);

            // Format dates nicely
            const sStr = sd.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
            const eStr = ed.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

            let statusBadge = '';
            if (req.status === 'Pending') statusBadge = '<span class="badge badge-orange">Pending</span>';
            else if (req.status === 'Approved') statusBadge = '<span class="badge badge-green">Approved</span>';
            else statusBadge = '<span class="badge badge-red">Rejected</span>';

            // Truncate Reason
            const shortReason = req.reason && req.reason.length > 30 ? req.reason.substring(0, 30) + '...' : (req.reason || 'No reason provided');

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>
                    <div class="font-medium">${sStr} - ${eStr}</div>
                    <div class="text-xs text-muted">Applied on ${new Date(req.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                </td>
                <td>
                    <div class="text-sm font-bold flex align-center gap-2">
                        ${typeName}
                        ${isPaid ? '<span class="text-xs text-green" title="Paid Leave">&bull; Paid</span>' : '<span class="text-xs text-red" title="Unpaid Leave">&bull; Unpaid</span>'}
                    </div>
                    <div class="text-xs text-muted">${req.totalDays || 0} Day(s) - ${shortReason}</div>
                </td>
                <td>${statusBadge}</td>
            `;
            tbody.appendChild(tr);
        });
    } catch (err) {
        tbody.innerHTML = '<tr><td colspan="3" class="text-center py-4 text-red">Failed to load leave history.</td></tr>';
        console.error(err);
    }
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

        // Use unified saveUser
        window.saveUser({
            name: newName,
            phone: newPhone,
            location: newLoc,
            profileImage: targetEmp.profileImage
        });

        // Store stable ID for future lookups
        window._currentEmpId = targetEmp.id;
        localStorage.setItem('pps-current-emp-id', targetEmp.id);

        // --- Sync UI everywhere using unified UI sync ---
        window.syncUserUI();

        // Admin employee table (if admin view exists)
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
        const img = new Image();
        img.onload = function () {
            const canvas = document.createElement('canvas');
            const MAX_SIZE = 300;
            let width = img.width;
            let height = img.height;

            if (width > height) {
                if (width > MAX_SIZE) { height = Math.round(height *= MAX_SIZE / width); width = MAX_SIZE; }
            } else {
                if (height > MAX_SIZE) { width = Math.round(width *= MAX_SIZE / height); height = MAX_SIZE; }
            }
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);

            const result = canvas.toDataURL('image/jpeg', 0.8);

            // 1. Immediately update profile edit preview
            const avatarImg = getEl('prof-avatar-img');
            const avatarText = getEl('prof-avatar-text');
            if (avatarImg) { avatarImg.src = result; avatarImg.style.display = 'block'; avatarImg.classList.remove('hidden'); }
            if (avatarText) { avatarText.style.display = 'none'; avatarText.classList.add('hidden'); }

            try {
                // 2. Use unified saveUser to persist correctly
                window.saveUser({ profileImage: result });
                // 3. Sync UI everywhere
                window.syncUserUI();
                window.showToast('Profile photo updated successfully!', 'success');
            } catch (err) {
                window.showToast('Storage quota exceeded. Could not save photo.', 'error');
                console.error(err);
            }
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
};

window.openPayslipModal = function (monthStr, netStr) {
    const emp = (window._currentEmpId ? employees.find(e => e.id === window._currentEmpId) : null)
        || employees.find(e => e.name === window.currentUser?.displayName) || employees[0];
    if (!emp) return;

    // If React modal bridge is available, use the A4 payslip with matching salary values
    if (typeof window.openPayslipSystemModal === 'function') {
        const companyName = localStorage.getItem('pps-company-name') || 'Prime Payroll Solution';
        const companyAddress = localStorage.getItem('pps-company-address') || '123 Tech Hub, HITEC City, Hyderabad, 500081';

        // Parse month to get breakdown
        const parts = monthStr.split(' ');
        const year = parseInt(parts[1]) || 2026;
        const monthMap = { 'January': 0, 'February': 1, 'March': 2, 'April': 3, 'May': 4, 'June': 5, 'July': 6, 'August': 7, 'September': 8, 'October': 9, 'November': 10, 'December': 11 };
        const month = monthMap[parts[0]] || 0;
        const breakdown = window.calculateSalaryBreakdown(emp, year, month);

        // Use same formula as payroll generation for consistency
        const basicVal = Math.round(emp.monthlySalary * 0.5);
        const allowVal = Math.round(emp.monthlySalary * 0.4);
        const bonusVal = Math.round(emp.monthlySalary * 0.1);
        const grossVal = basicVal + allowVal + bonusVal;
        const hraVal = Math.round(basicVal * 0.4);
        const tdsVal = grossVal > 50000 ? Math.round(grossVal * 0.10) : (grossVal > 30000 ? Math.round(grossVal * 0.05) : 0);
        
        // Match the payroll record logic: only TDS + attendance/leave deductions are part of totalDeductions
        const otherDed = breakdown.leaveDeduction || 0;
        const totalDed = tdsVal + otherDed;

        window.openPayslipSystemModal({
            name: emp.name,
            id: emp.id,
            position: emp.role,
            department: emp.dept || 'Engineering',
            period: monthStr,
            companyName: companyName,
            companyAddress: companyAddress,
            bankName: emp.bankName || 'HDFC Bank',
            accountNumber: emp.accountNumber || 'XXXX XXXX ' + String(emp.id).replace(/\D/g, '').slice(-4).padStart(4, '0'),
            paymentDate: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
            calculatedEarnings: {
                basic: basicVal,
                hra: hraVal,
                educationAllowance: 2500,
                lta: Math.round(basicVal * 0.1),
                personalAllowance: Math.max(allowVal - hraVal - 2500 - Math.round(basicVal * 0.1) - 1600 - 1500, 0),
                entertainmentReimbursement: 1500,
                conveyance: 1600,
                bonus: bonusVal,
                grossTotal: grossVal
            },
            calculatedDeductions: {
                tds: tdsVal,
                pf: 0,
                esi: 0,
                professionalTax: 0,
                otherDeductions: otherDed,
                loans: 0,
                perquisites: 0,
                totalDeductions: totalDed
            },
            netSalary: grossVal - totalDed,
            useA4Template: true
        });
        return;
    }

    // Fallback: old DOM-based modal
    const modal = document.getElementById('payslip-modal');
    if (!modal) return;

    const parts2 = monthStr.split(' ');
    const year2 = parseInt(parts2[1]) || 2026;
    const monthMap2 = { 'January': 0, 'February': 1, 'March': 2, 'April': 3, 'May': 4, 'June': 5, 'July': 6, 'August': 7, 'September': 8, 'October': 9, 'November': 10, 'December': 11 };
    const month2 = monthMap2[parts2[0]] || 0;

    const breakdown2 = window.calculateSalaryBreakdown(emp, year2, month2);

    const elMonth = document.getElementById('ps-modal-month');
    const elName = document.getElementById('ps-modal-name');
    const elBasic = document.getElementById('ps-modal-basic');
    const elAllow = document.getElementById('ps-modal-allowances');
    const elOt = document.getElementById('ps-modal-overtime');
    const elDed = document.getElementById('ps-modal-deductions');
    const elNet = document.getElementById('ps-modal-net');
    const elDays = document.getElementById('ps-modal-days');
    const elOtHrs = document.getElementById('ps-modal-ot-hrs');

    if (elMonth) elMonth.textContent = monthStr;
    if (elName) elName.textContent = emp.name;

    const fmt = (v) => '₹ ' + Math.round(v || 0).toLocaleString('en-IN');
    if (elBasic) elBasic.textContent = fmt(breakdown2.monthlySalary);
    if (elAllow) elAllow.textContent = fmt(breakdown2.hra + breakdown2.special);
    if (elOt) elOt.textContent = '+ ' + fmt(breakdown2.overtimePay);
    if (elDed) elDed.textContent = '- ' + fmt(breakdown2.leaveDeduction);
    if (elNet) elNet.textContent = fmt(breakdown2.net);

    if (elDays) elDays.textContent = `${breakdown2.presentDays} / 22`;
    if (elOtHrs) elOtHrs.textContent = `${breakdown2.overtimeHours} hrs`;

    modal.style.display = 'block';
    modal.classList.remove('hidden');
};

// Final Safety wrapper for initialization - moved to bottom to ensure all functions are defined
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}
