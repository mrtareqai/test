// Global Variables
let currentLanguage = 'en';
let soundEnabled = true;
let audioContext = null;

// Initialize the website
document.addEventListener('DOMContentLoaded', function() {
    initializeWebsite();
    createMagicalElements();
    initializeCursorTrail();
    initializeScrollAnimations();
    animateCounters();
    
    // Add loading animations
    document.querySelectorAll('.feature-card, .stat-card').forEach((el, index) => {
        el.classList.add('loading');
        el.style.animationDelay = `${index * 0.1}s`;
    });
});

// Initialize Website
function initializeWebsite() {
    // Initialize audio context on first user interaction
    document.addEventListener('click', initializeAudio, { once: true });
    
    // Set up service worker for PWA
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js').catch(console.error);
    }
    
    // Load saved language preference
    const savedLang = localStorage.getItem('language') || 'en';
    if (savedLang !== currentLanguage) {
        toggleLanguage();
    }
}

// Audio Functions
function initializeAudio() {
    try {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
        console.log('Audio not supported');
        soundEnabled = false;
    }
}

function playSound(frequency = 800, duration = 200, type = 'sine') {
    if (!audioContext || !soundEnabled) return;
    
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    oscillator.type = type;
    
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration / 1000);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration / 1000);
}

function playMagicalChime() {
    playSound(523, 150); // C5
    setTimeout(() => playSound(659, 150), 100); // E5
    setTimeout(() => playSound(784, 200), 200); // G5
}

function playSuccessSound() {
    playSound(523, 100); // C5
    setTimeout(() => playSound(659, 100), 80); // E5
    setTimeout(() => playSound(784, 100), 160); // G5
    setTimeout(() => playSound(1047, 200), 240); // C6
}

// Language Functions
function toggleLanguage() {
    currentLanguage = currentLanguage === 'en' ? 'ar' : 'en';
    
    // Update text content
    document.querySelectorAll('[data-en]').forEach(element => {
        const text = element.getAttribute(`data-${currentLanguage}`);
        if (text) {
            element.textContent = text;
        }
    });
    
    // Update language toggle button
    const langText = document.getElementById('lang-text');
    if (langText) {
        langText.textContent = currentLanguage === 'en' ? 'العربية' : 'English';
    }
    
    // Update document direction
    document.documentElement.dir = currentLanguage === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = currentLanguage;
    
    // Save language preference
    localStorage.setItem('language', currentLanguage);
    
    // Play sound
    playMagicalChime();
}

// Navigation Functions
function navigateTo(page) {
    playMagicalChime();
    setTimeout(() => {
        window.location.href = page;
    }, 300);
}

// Character Animations
function playRobotAnimation() {
    const robotSpeech = document.getElementById('robot-speech');
    const robotArm = document.querySelector('.robot-arm-left');
    
    if (robotSpeech && robotArm) {
        robotSpeech.style.opacity = '1';
        robotArm.style.animation = 'wiggle 0.5s ease-in-out';
        
        playSound(800, 200);
        
        setTimeout(() => {
            robotSpeech.style.opacity = '0';
            robotArm.style.animation = '';
        }, 2000);
    }
}

function playCatAnimation() {
    const catHearts = document.getElementById('cat-hearts');
    const catTail = document.querySelector('.cat-tail');
    
    if (catHearts && catTail) {
        catHearts.style.opacity = '1';
        catHearts.style.animation = 'bounce 0.5s ease-in-out infinite';
        catTail.style.animation = 'wiggle 0.5s ease-in-out infinite';
        
        playSound(600, 300);
        
        setTimeout(() => {
            catHearts.style.opacity = '0';
            catHearts.style.animation = '';
            catTail.style.animation = '';
        }, 2000);
    }
}

// Sound Toggle
function toggleSound() {
    soundEnabled = !soundEnabled;
    const soundIcon = document.getElementById('sound-icon');
    if (soundIcon) {
        soundIcon.textContent = soundEnabled ? '🔊' : '🔇';
    }
    
    if (soundEnabled) {
        playMagicalChime();
    }
}

// Magical Elements
function createMagicalElements() {
    const container = document.getElementById('magical-elements');
    if (!container) return;
    
    const elements = ['⭐', '💖', '🌟', '✨', '🎈', '🦄', '🌈', '☀️'];
    
    for (let i = 0; i < 8; i++) {
        const element = document.createElement('div');
        element.className = 'magic-particle';
        element.textContent = elements[Math.floor(Math.random() * elements.length)];
        element.style.left = Math.random() * 100 + '%';
        element.style.top = Math.random() * 100 + '%';
        element.style.animationDelay = Math.random() * 4 + 's';
        element.style.animationDuration = (3 + Math.random() * 2) + 's';
        
        container.appendChild(element);
    }
}

// Cursor Trail
function initializeCursorTrail() {
    const trailContainer = document.getElementById('cursor-trail');
    if (!trailContainer) return;
    
    let trailElements = [];
    
    document.addEventListener('mousemove', (e) => {
        // Create trail particle
        const particle = document.createElement('div');
        particle.className = 'trail-particle';
        particle.style.left = e.clientX - 3 + 'px';
        particle.style.top = e.clientY - 3 + 'px';
        
        trailContainer.appendChild(particle);
        trailElements.push(particle);
        
        // Remove old particles
        if (trailElements.length > 10) {
            const oldParticle = trailElements.shift();
            if (oldParticle && oldParticle.parentNode) {
                oldParticle.parentNode.removeChild(oldParticle);
            }
        }
        
        // Remove particle after animation
        setTimeout(() => {
            if (particle && particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        }, 1000);
    });
}

// Scroll Animations
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, observerOptions);
    
    // Observe elements for scroll animations
    document.querySelectorAll('.stat-card, .feature-card').forEach(el => {
        el.classList.add('scroll-animate');
        observer.observe(el);
    });
}

// Counter Animation
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    const animateCounter = (counter) => {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        
        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            counter.textContent = Math.floor(current) + '+';
        }, 16);
    };
    
    // Animate counters when they come into view
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    });
    
    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
}

// Button Click Effects
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('magical-btn') || e.target.closest('.magical-btn')) {
        playMagicalChime();
        
        // Create ripple effect
        const button = e.target.classList.contains('magical-btn') ? e.target : e.target.closest('.magical-btn');
        const rect = button.getBoundingClientRect();
        const ripple = document.createElement('div');
        
        ripple.style.position = 'absolute';
        ripple.style.borderRadius = '50%';
        ripple.style.background = 'rgba(255, 255, 255, 0.6)';
        ripple.style.transform = 'scale(0)';
        ripple.style.animation = 'ripple 0.6s linear';
        ripple.style.left = (e.clientX - rect.left - 10) + 'px';
        ripple.style.top = (e.clientY - rect.top - 10) + 'px';
        ripple.style.width = '20px';
        ripple.style.height = '20px';
        
        button.appendChild(ripple);
        
        setTimeout(() => {
            if (ripple.parentNode) {
                ripple.parentNode.removeChild(ripple);
            }
        }, 600);
    }
});

// Add ripple animation to CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Hover Effects
document.addEventListener('mouseover', (e) => {
    if (e.target.classList.contains('nav-item') || 
        e.target.classList.contains('feature-card') || 
        e.target.classList.contains('stat-card')) {
        playSound(400, 100);
    }
});

// Page Visibility API for animations
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause animations when page is not visible
        document.body.style.animationPlayState = 'paused';
    } else {
        // Resume animations when page becomes visible
        document.body.style.animationPlayState = 'running';
    }
});

// Keyboard Navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
        // Add focus styles for keyboard navigation
        document.body.classList.add('keyboard-navigation');
    }
});

document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-navigation');
});

// Error Handling
window.addEventListener('error', (e) => {
    console.log('Oops! Something magical happened! 😊', e.error);
});

// Performance Optimization
if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
        // Preload other pages
        const pages = ['about.html', 'classrooms.html', 'register.html', 'contact.html'];
        pages.forEach(page => {
            const link = document.createElement('link');
            link.rel = 'prefetch';
            link.href = page;
            document.head.appendChild(link);
        });
    });
}