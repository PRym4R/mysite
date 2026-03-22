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
document.addEventListener('DOMContentLoaded', () => {
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
