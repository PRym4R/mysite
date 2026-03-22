// Translations
const translations = {
    ru: {
        nav: {
            about: 'Обо мне',
            contact: 'Контакты'
        },
        hero: {
            contact: 'Контакты'
        },
        about: {
            title: 'Обо мне',
            age_label: 'лет',
            os_label: 'ОС',
            de_label: 'Окружение',
            learning_label: 'Изучаю',
            game_label: 'Игра',
            hobby_label: 'Хобби'
        },
        contact: {
            title: 'Контакты',
            telegram: 'Telegram',
            discord: 'Discord',
            instagram: 'Instagram',
            youtube: 'YouTube'
        }
    },
    ua: {
        nav: {
            about: 'Про мене',
            contact: 'Контакти'
        },
        hero: {
            contact: 'Контакти'
        },
        about: {
            title: 'Про мене',
            age_label: 'років',
            os_label: 'ОС',
            de_label: 'Оточення',
            learning_label: 'Вивчаю',
            game_label: 'Гра',
            hobby_label: 'Хобі'
        },
        contact: {
            title: 'Контакти',
            telegram: 'Telegram',
            discord: 'Discord',
            instagram: 'Instagram',
            youtube: 'YouTube'
        }
    },
    en: {
        nav: {
            about: 'About Me',
            contact: 'Contact'
        },
        hero: {
            contact: 'Contact'
        },
        about: {
            title: 'About Me',
            age_label: 'years old',
            os_label: 'OS',
            de_label: 'Environment',
            learning_label: 'Learning',
            game_label: 'Game',
            hobby_label: 'Hobby'
        },
        contact: {
            title: 'Contact',
            telegram: 'Telegram',
            discord: 'Discord',
            instagram: 'Instagram',
            youtube: 'YouTube'
        }
    }
};

const langNames = {
    ru: 'RU',
    ua: 'UA',
    en: 'EN'
};

// Current language
let currentLang = 'ru';

// Detect language by IP
async function detectLanguageByIP() {
    try {
        // Try ip-api.com first (no CORS for HTTP, but works in many cases)
        let response = await fetch('http://ip-api.com/json/?fields=countryCode');
        let data = await response.json();
        
        if (data.countryCode) {
            return getLanguageByCountry(data.countryCode);
        }
        
        // Fallback to ipapi.co
        response = await fetch('https://ipapi.co/json/');
        data = await response.json();
        
        if (data.country_code) {
            return getLanguageByCountry(data.country_code);
        }
        
        return 'en';
    } catch (error) {
        console.error('IP detection failed:', error);
        // If fetch fails (likely CORS on file://), use a geo-location hint
        // or default to English
        return 'en';
    }
}

// Map country code to language
function getLanguageByCountry(countryCode) {
    if (countryCode === 'UA') {
        return 'ua';
    } else if (countryCode === 'RU') {
        return 'ru';
    } else {
        return 'en';
    }
}

// Apply translations
function applyTranslations(lang) {
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(el => {
        const key = el.getAttribute('data-i18n');
        const keys = key.split('.');
        let translation = translations[lang];
        
        for (const k of keys) {
            if (translation && translation[k]) {
                translation = translation[k];
            } else {
                translation = null;
                break;
            }
        }
        
        if (translation) {
            el.textContent = translation;
            
            // Update scramble data-value for animated elements
            if (el.classList.contains('scramble')) {
                el.setAttribute('data-value', translation);
            }
        }
    });
    
    // Update HTML lang attribute
    document.documentElement.lang = lang;
    
    // Update language selector button
    const langDisplay = document.getElementById('currentLang');
    if (langDisplay) {
        langDisplay.textContent = langNames[lang];
    }
    
    currentLang = lang;
    
    // Save to localStorage
    localStorage.setItem('preferredLang', lang);
}

// Language selector functionality
function setupLanguageSelector() {
    const langSelector = document.getElementById('langSelector');
    const langOrder = ['ru', 'ua', 'en'];
    
    langSelector?.addEventListener('click', () => {
        const currentIndex = langOrder.indexOf(currentLang);
        const nextIndex = (currentIndex + 1) % langOrder.length;
        const nextLang = langOrder[nextIndex];
        applyTranslations(nextLang);
        
        // Re-trigger scramble effect for updated elements
        document.querySelectorAll('.section .scramble').forEach(el => {
            scrambleText(el);
        });
    });
}

// Navbar scroll effect
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
    navbar.style.background = window.scrollY > 50
        ? 'rgba(10, 10, 15, 0.95)'
        : 'rgba(10, 10, 15, 0.7)';
});

// Mobile nav
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

navToggle?.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    navToggle.classList.toggle('active');
});

document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navLinks?.classList.remove('active');
        navToggle?.classList.remove('active');
    });
});

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            window.scrollTo({
                top: target.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Scramble text effect
const chars = '!@#$%^&*()_+-=[]{}|;:,.<>?ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

function scrambleText(element) {
    const original = element.dataset.value;
    if (!original) return;

    let iterations = 0;
    const totalIterations = original.length + 8;

    const interval = setInterval(() => {
        element.textContent = original
            .split('')
            .map((char, index) => {
                if (index < iterations) {
                    return original[index];
                }
                return chars[Math.floor(Math.random() * chars.length)];
            })
            .join('');

        iterations += 0.4;

        if (iterations >= totalIterations) {
            clearInterval(interval);
            element.textContent = original;
        }
    }, 45);
}

// Initialize on load
document.addEventListener('DOMContentLoaded', async () => {
    // Check for saved language preference first
    const savedLang = localStorage.getItem('preferredLang');
    
    if (savedLang && translations[savedLang]) {
        applyTranslations(savedLang);
    } else {
        // Detect language by IP
        const detectedLang = await detectLanguageByIP();
        applyTranslations(detectedLang);
    }
    
    // Setup language selector
    setupLanguageSelector();
    
    // Hero elements with delay
    const heroScrambles = document.querySelectorAll('.hero .scramble');
    heroScrambles.forEach((el, index) => {
        setTimeout(() => {
            scrambleText(el);
        }, 300 + index * 150);
    });

    // Section titles and info blocks on scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const scrambles = entry.target.querySelectorAll('.scramble');
                scrambles.forEach((el, index) => {
                    setTimeout(() => {
                        scrambleText(el);
                    }, index * 100);
                });
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    document.querySelectorAll('.section').forEach(section => {
        observer.observe(section);
    });
});

// Mobile nav styles
const style = document.createElement('style');
style.textContent = `
    @media (max-width: 768px) {
        .nav-links.active {
            display: flex;
            flex-direction: column;
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: rgba(10, 10, 15, 0.98);
            padding: 20px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        }
        .nav-toggle.active span:nth-child(1) {
            transform: rotate(45deg) translate(5px, 5px);
        }
        .nav-toggle.active span:nth-child(2) {
            opacity: 0;
        }
        .nav-toggle.active span:nth-child(3) {
            transform: rotate(-45deg) translate(7px, -6px);
        }
    }
`;
document.head.appendChild(style);
