// ==========================================
// ANIME REGISTRATION PLATFORM - MAIN JS
// ==========================================

// Language translations
const translations = {
    en: {
        welcome: "Welcome To Our Anime Register",
        start: "Start",
        login: "Login",
        signup: "Sign Up",
        username: "Username",
        password: "Password",
        rememberMe: "Remember Me",
        dontHaveAccount: "Don't have an account?",
        alreadyHaveAccount: "Already have an account?",
        signup_button: "Sign Up",
        login_button: "Login",
    },
    so: {
        welcome: "Kusoo Dhawaaw Kabarka Warehouse Anime",
        start: "Bilow",
        login: "Soo Gal",
        signup: "Iska Reji",
        username: "Magaca Isticmaalaha",
        password: "Sirta Koorta",
        rememberMe: "Iga Xusuuso",
        dontHaveAccount: "Maad qabnin Akoon?",
        alreadyHaveAccount: "Waxaad horay u qabtaa Akoon?",
        signup_button: "Iska Reji",
        login_button: "Soo Gal",
    },
    ar: {
        welcome: "أهلا بك في منصة تسجيل الرسوم المتحركة",
        start: "ابدأ",
        login: "تسجيل الدخول",
        signup: "إنشاء حساب",
        username: "اسم المستخدم",
        password: "كلمة المرور",
        rememberMe: "تذكرني",
        dontHaveAccount: "ليس لديك حساب؟",
        alreadyHaveAccount: "لديك حساب بالفعل؟",
        signup_button: "إنشاء حساب",
        login_button: "تسجيل الدخول",
    }
};

let currentLanguage = localStorage.getItem('language') || 'en';
let currentTheme = localStorage.getItem('theme') || 'dark';

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    setTheme(currentTheme);
    setLanguage(currentLanguage);
    setupEventListeners();
}

function setupEventListeners() {
    // Theme toggle if exists
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }

    // Language selector if exists
    const languageSelect = document.getElementById('languageSelect');
    if (languageSelect) {
        languageSelect.addEventListener('change', function(e) {
            setLanguage(e.target.value);
        });
    }
}

function goToLogin() {
    window.location.href = 'login.html';
}

function goToSignup() {
    window.location.href = 'signup.html';
}

function goToDashboard() {
    const user = getUser();
    if (user) {
        window.location.href = 'dashboard.html';
    } else {
        window.location.href = 'login.html';
    }
}

// Theme Management
function setTheme(theme) {
    currentTheme = theme;
    localStorage.setItem('theme', theme);
    
    const html = document.documentElement;
    if (theme === 'light') {
        html.style.colorScheme = 'light';
        document.body.classList.add('light-mode');
    } else {
        html.style.colorScheme = 'dark';
        document.body.classList.remove('light-mode');
    }
}

function toggleTheme() {
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
}

// Language Management
function setLanguage(lang) {
    currentLanguage = lang;
    localStorage.setItem('language', lang);
    document.documentElement.lang = lang;
    
    // Set text direction for Arabic
    if (lang === 'ar') {
        document.documentElement.dir = 'rtl';
    } else {
        document.documentElement.dir = 'ltr';
    }
    
    updatePageText();
}

function getTranslation(key) {
    return translations[currentLanguage][key] || translations['en'][key] || key;
}

function updatePageText() {
    // Update all elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        element.textContent = getTranslation(key);
    });
}

// Session Management
function setUser(userData) {
    localStorage.setItem('user', JSON.stringify(userData));
}

function getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
}

function clearSession() {
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
}

function logout() {
    clearSession();
    window.location.href = 'index.html';
}

// API Helper
const API_BASE = 'http://localhost:5000/api';

async function apiCall(endpoint, method = 'GET', data = null) {
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`
        }
    };

    if (data) {
        options.body = JSON.stringify(data);
    }

    try {
        const response = await fetch(`${API_BASE}${endpoint}`, options);
        
        if (!response.ok) {
            if (response.status === 401) {
                clearSession();
                window.location.href = 'login.html';
            }
            throw new Error(`API Error: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('API Call Error:', error);
        throw error;
    }
}

// Validation helpers
function isValidUsername(username) {
    return username.length >= 3 && /^[a-zA-Z0-9_]+$/.test(username);
}

function isValidPassword(password) {
    return password.length >= 6;
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhoneNumber(phone) {
    return /^[0-9+\-\s()]+$/.test(phone) && phone.length >= 10;
}

// Utility functions
function showNotification(message, type = 'info') {
    const notifId = 'notification-' + Date.now();
    const notif = document.createElement('div');
    notif.id = notifId;
    notif.className = `notification notification-${type}`;
    notif.innerHTML = `
        <div class="notification-content">
            <span>${message}</span>
            <button onclick="document.getElementById('${notifId}').remove()" class="notification-close">&times;</button>
        </div>
    `;
    
    document.body.appendChild(notif);
    
    setTimeout(() => {
        const elem = document.getElementById(notifId);
        if (elem) elem.remove();
    }, 5000);
}

function showLoader() {
    const loader = document.createElement('div');
    loader.id = 'page-loader';
    loader.className = 'page-loader';
    loader.innerHTML = '<div class="loading"></div>';
    document.body.appendChild(loader);
}

function hideLoader() {
    const loader = document.getElementById('page-loader');
    if (loader) loader.remove();
}

// Check authentication
function requireAuth() {
    const user = getUser();
    if (!user) {
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

function requireAdminAuth() {
    const admin = localStorage.getItem('admin');
    if (!admin) {
        window.location.href = 'admin-login.html';
        return false;
    }
    return true;
}

// Export for use in other scripts
window.app = {
    goToLogin,
    goToSignup,
    goToDashboard,
    setTheme,
    toggleTheme,
    setLanguage,
    getTranslation,
    setUser,
    getUser,
    logout,
    apiCall,
    showNotification,
    showLoader,
    hideLoader,
    requireAuth,
    requireAdminAuth
};
