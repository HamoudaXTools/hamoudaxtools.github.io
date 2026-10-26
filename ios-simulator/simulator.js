/* ============================================
   iOS Simulator - JavaScript Application
   Professional iPhone Experience
   ============================================ */

// App Data - All 15+ iOS Apps
const appData = {
    weather: { name: 'Weather', url: 'weather-app.html', color: '#47bfff' },
    clock: { name: 'Clock', url: 'apps/clock.html', color: '#000000' },
    calculator: { name: 'Calculator', url: 'apps/calculator.html', color: '#1a1a1a' },
    photos: { name: 'Photos', url: 'apps/photos.html', color: '#ff6b6b' },
    camera: { name: 'Camera', url: 'apps/camera.html', color: '#3a3a3a' },
    notes: { name: 'Notes', url: 'apps/notes.html', color: '#fff176' },
    settings: { name: 'Settings', url: 'apps/settings.html', color: '#8e8e93' },
    safari: { name: 'Safari', url: 'apps/safari.html', color: '#007aff' },
    music: { name: 'Music', url: 'apps/music.html', color: '#fc5c7d' },
    maps: { name: 'Maps', url: 'apps/maps.html', color: '#34c759' },
    messages: { name: 'Messages', url: 'apps/messages.html', color: '#34c759' },
    mail: { name: 'Mail', url: 'apps/mail.html', color: '#007aff' },
    appstore: { name: 'App Store', url: 'apps/appstore.html', color: '#007aff' },
    files: { name: 'Files', url: 'apps/files.html', color: '#007aff' },
    health: { name: 'Health', url: 'apps/health.html', color: '#ff2d55' },
    wallet: { name: 'Wallet', url: 'apps/wallet.html', color: '#1c1c1e' },
    phone: { name: 'Phone', url: null, color: '#34c759' }
};

// DOM Elements
const elements = {
    // Screens
    lockScreen: document.getElementById('lock-screen'),
    homeScreen: document.getElementById('home-screen'),
    appView: document.getElementById('app-view'),
    appIframe: document.getElementById('app-iframe'),
    appLoading: document.getElementById('app-loading'),
    controlCenter: document.getElementById('control-center'),
    
    // Lock Screen
    lockTime: document.getElementById('lock-time'),
    lockDate: document.getElementById('lock-date'),
    
    // Status Bar
    statusTime: document.getElementById('status-time'),
    
    // Dynamic Island
    dynamicIsland: document.getElementById('dynamic-island'),
    islandIndicator: document.getElementById('island-indicator'),
    
    // Home Indicator
    homeIndicator: document.getElementById('home-indicator'),
    
    // Toast
    toast: document.getElementById('toast'),
    toastMessage: document.getElementById('toast-message')
};

// State
let isLocked = true;
let isInApp = false;
let isControlCenterOpen = false;
let currentApp = null;
let touchStartY = 0;
let touchStartX = 0;

// Initialize
function init() {
    updateDateTime();
    setInterval(updateDateTime, 1000);
    updateClockIcon();
    setInterval(updateClockIcon, 1000);
    
    setupEventListeners();
    
    // Show lock screen initially
    showLockScreen();
}

// Update Date Time
function updateDateTime() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const timeStr = `${hours}:${minutes}`;
    
    if (elements.lockTime) elements.lockTime.textContent = timeStr;
    if (elements.statusTime) elements.statusTime.textContent = timeStr;
    
    // Lock screen date
    const options = { weekday: 'long', month: 'long', day: 'numeric' };
    const dateStr = now.toLocaleDateString('en-US', options);
    if (elements.lockDate) elements.lockDate.textContent = dateStr;
}

// Update Clock Icon
function updateClockIcon() {
    const now = new Date();
    const hours = now.getHours() % 12;
    const minutes = now.getMinutes();
    
    const hourHand = document.querySelector('.clock-hand.hour');
    const minuteHand = document.querySelector('.clock-hand.minute');
    
    if (hourHand) {
        const hourDeg = (hours * 30) + (minutes * 0.5);
        hourHand.style.transform = `translateX(-50%) rotate(${hourDeg}deg)`;
    }
    
    if (minuteHand) {
        const minuteDeg = minutes * 6;
        minuteHand.style.transform = `translateX(-50%) rotate(${minuteDeg}deg)`;
    }
}

// Setup Event Listeners
function setupEventListeners() {
    // Lock Screen - Swipe up to unlock
    elements.lockScreen?.addEventListener('touchstart', handleLockTouchStart);
    elements.lockScreen?.addEventListener('touchend', handleLockTouchEnd);
    elements.lockScreen?.addEventListener('click', handleLockClick);
    
    // Lock Screen Widget
    document.getElementById('lock-weather-widget')?.addEventListener('click', (e) => {
        e.stopPropagation();
        unlock();
        setTimeout(() => openApp('weather'), 600);
    });
    
    // App Icons
    document.querySelectorAll('.app-icon').forEach(icon => {
        icon.addEventListener('click', (e) => {
            const appId = icon.dataset.app;
            if (appId) {
                openApp(appId);
            }
        });
    });
    
    // Home Indicator - Go back to home
    elements.homeIndicator?.addEventListener('click', goHome);
    
    // Home Indicator - Swipe up for control center (when in home)
    elements.homeIndicator?.addEventListener('touchstart', handleHomeIndicatorTouchStart);
    elements.homeIndicator?.addEventListener('touchend', handleHomeIndicatorTouchEnd);
    
    // Control Center - Close on click outside
    elements.controlCenter?.addEventListener('click', (e) => {
        if (e.target === elements.controlCenter) {
            closeControlCenter();
        }
    });
    
    // Control Center Handle
    document.querySelector('.control-handle')?.addEventListener('click', closeControlCenter);
    
    // Control buttons
    setupControlButtons();
    
    // Keyboard shortcuts
    document.addEventListener('keydown', handleKeyboard);
    
    // App iframe loaded
    elements.appIframe?.addEventListener('load', () => {
        setTimeout(() => {
            if (elements.appLoading) elements.appLoading.style.display = 'none';
        }, 500);
    });
}

// Handle Lock Touch Start
function handleLockTouchStart(e) {
    touchStartY = e.touches[0].clientY;
}

// Handle Lock Touch End
function handleLockTouchEnd(e) {
    const touchEndY = e.changedTouches[0].clientY;
    const diff = touchStartY - touchEndY;
    
    if (diff > 100) {
        unlock();
    }
}

// Handle Lock Click
function handleLockClick() {
    // Double click to unlock
    if (this.lastClick && Date.now() - this.lastClick < 300) {
        unlock();
    }
    this.lastClick = Date.now();
}

// Handle Home Indicator Touch
function handleHomeIndicatorTouchStart(e) {
    touchStartY = e.touches[0].clientY;
}

function handleHomeIndicatorTouchEnd(e) {
    const touchEndY = e.changedTouches[0].clientY;
    const diff = touchStartY - touchEndY;
    
    if (diff > 50 && !isInApp) {
        openControlCenter();
    } else if (isInApp) {
        goHome();
    }
}

// Handle Keyboard
function handleKeyboard(e) {
    if (e.key === 'Escape') {
        if (isControlCenterOpen) {
            closeControlCenter();
        } else if (isInApp) {
            goHome();
        }
    }
    
    if (e.key === 'Enter' && isLocked) {
        unlock();
    }
}

// Show Lock Screen
function showLockScreen() {
    isLocked = true;
    elements.lockScreen.style.display = 'flex';
    elements.lockScreen.classList.remove('unlocking');
    elements.homeScreen.style.display = 'none';
    elements.appView.style.display = 'none';
}

// Unlock
function unlock() {
    if (!isLocked) return;
    
    // Add unlocking animation
    elements.lockScreen.classList.add('unlocking');
    
    // Haptic feedback (visual)
    if (elements.homeIndicator) {
        elements.homeIndicator.style.transform = 'translateX(-50%) scaleX(0.8)';
        setTimeout(() => {
            elements.homeIndicator.style.transform = 'translateX(-50%)';
        }, 150);
    }
    
    // Show home screen after animation
    setTimeout(() => {
        isLocked = false;
        elements.lockScreen.style.display = 'none';
        elements.homeScreen.style.display = 'flex';
        showToast('📱 Welcome!');
    }, 500);
}

// Open App
function openApp(appId) {
    const app = appData[appId];
    if (!app) return;
    
    currentApp = appId;
    
    // If app has URL (Weather app), open it in iframe
    if (app.url) {
        isInApp = true;
        
        // Show app view with loading
        elements.appView.style.display = 'block';
        elements.appLoading.style.display = 'flex';
        elements.appLoading.querySelector('.app-loading-icon').style.borderTopColor = app.color;
        elements.appLoading.querySelector('p').textContent = `Opening ${app.name}...`;
        
        // Load iframe
        elements.appIframe.src = app.url;
        
        // Show Dynamic Island indicator
        elements.islandIndicator?.classList.add('active');
        
        // Animation
        elements.appView.style.animation = 'appOpen 0.4s ease forwards';
    } else {
        // Show coming soon toast
        showToast(`📱 ${app.name} - Coming Soon!`);
    }
}

// Go Home
function goHome() {
    if (!isInApp) {
        // If control center is open, close it
        if (isControlCenterOpen) {
            closeControlCenter();
        }
        return;
    }
    
    isInApp = false;
    currentApp = null;
    
    // Hide app view with animation
    elements.appView.style.animation = 'appClose 0.3s ease forwards';
    
    setTimeout(() => {
        elements.appView.style.display = 'none';
        elements.appIframe.src = '';
        elements.islandIndicator?.classList.remove('active');
    }, 300);
    
    showToast('🏠 Home');
}

// Open Control Center
function openControlCenter() {
    if (isControlCenterOpen) return;
    
    isControlCenterOpen = true;
    elements.controlCenter.classList.add('active');
    elements.dynamicIsland.classList.add('expanded');
}

// Close Control Center
function closeControlCenter() {
    if (!isControlCenterOpen) return;
    
    isControlCenterOpen = false;
    elements.controlCenter.classList.remove('active');
    elements.dynamicIsland.classList.remove('expanded');
}

// Setup Control Buttons
function setupControlButtons() {
    // Wifi toggle
    document.getElementById('wifi-btn')?.addEventListener('click', function() {
        this.classList.toggle('active');
        showToast(this.classList.contains('active') ? '📶 Wi-Fi On' : '📵 Wi-Fi Off');
    });
    
    // Bluetooth toggle
    document.getElementById('bluetooth-btn')?.addEventListener('click', function() {
        this.classList.toggle('active');
        showToast(this.classList.contains('active') ? '🔵 Bluetooth On' : '⚪ Bluetooth Off');
    });
    
    // Airplane toggle
    document.getElementById('airplane-btn')?.addEventListener('click', function() {
        this.classList.toggle('active');
        showToast(this.classList.contains('active') ? '✈️ Airplane Mode On' : '📱 Airplane Mode Off');
    });
    
    // Flashlight toggle
    document.getElementById('flashlight-btn')?.addEventListener('click', function() {
        this.classList.toggle('active');
        showToast(this.classList.contains('active') ? '🔦 Flashlight On' : '🔦 Flashlight Off');
    });
    
    // Lock Screen buttons
    document.querySelector('.lock-screen .flashlight-btn')?.addEventListener('click', (e) => {
        e.stopPropagation();
        showToast('🔦 Flashlight On');
    });
    
    document.querySelector('.lock-screen .camera-btn')?.addEventListener('click', (e) => {
        e.stopPropagation();
        showToast('📷 Camera - Coming Soon!');
    });
}

// Show Toast
function showToast(message) {
    elements.toastMessage.textContent = message;
    elements.toast.classList.add('show');
    
    setTimeout(() => {
        elements.toast.classList.remove('show');
    }, 2000);
}

// Add animations via JS
const style = document.createElement('style');
style.textContent = `
    @keyframes appOpen {
        from {
            transform: scale(0.9);
            opacity: 0;
        }
        to {
            transform: scale(1);
            opacity: 1;
        }
    }
    
    @keyframes appClose {
        from {
            transform: scale(1);
            opacity: 1;
        }
        to {
            transform: scale(0.9);
            opacity: 0;
        }
    }
    
    .app-icon:active .icon-img {
        filter: brightness(0.7);
    }
    
    /* Wobble effect for long press (future feature) */
    .app-icon.editing .icon-img {
        animation: wobble 0.3s ease-in-out infinite;
    }
    
    @keyframes wobble {
        0%, 100% { transform: rotate(-2deg); }
        50% { transform: rotate(2deg); }
    }
`;
document.head.appendChild(style);

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', init);

// Fetch weather for lock screen widget
async function updateLockScreenWeather() {
    try {
        // Get user's location
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(async (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                
                // Fetch weather
                const response = await fetch(
                    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code&timezone=auto`
                );
                const data = await response.json();
                
                if (data.current) {
                    const temp = Math.round(data.current.temperature_2m);
                    const code = data.current.weather_code;
                    
                    // Update widget
                    const widgetTemp = document.querySelector('.widget-temp');
                    const widgetIcon = document.querySelector('.widget-icon');
                    
                    if (widgetTemp) widgetTemp.textContent = `${temp}°`;
                    if (widgetIcon) widgetIcon.textContent = getWeatherEmoji(code);
                    
                    // Also update home screen weather icon temp
                    const tempDisplay = document.querySelector('.temp-display');
                    if (tempDisplay) tempDisplay.textContent = `${temp}°`;
                }
            }, () => {
                // Use default
            }, { timeout: 5000 });
        }
    } catch (error) {
        console.log('Weather fetch error:', error);
    }
}

function getWeatherEmoji(code) {
    if (code === 0 || code === 1) return '☀️';
    if (code === 2) return '⛅';
    if (code === 3) return '☁️';
    if (code >= 45 && code <= 48) return '🌫️';
    if (code >= 51 && code <= 67) return '🌧️';
    if (code >= 71 && code <= 77) return '❄️';
    if (code >= 80 && code <= 82) return '🌧️';
    if (code >= 85 && code <= 86) return '🌨️';
    if (code >= 95) return '⛈️';
    return '☀️';
}

// Update weather on load
setTimeout(updateLockScreenWeather, 1000);
