/* ============================================
   Weather iOS - JavaScript Application
   Enhanced Version with Search & Advanced Features
   ============================================ */

// Weather Code Mappings (WMO Weather interpretation codes)
const weatherCodes = {
    0: { condition: 'Clear sky', icon: 'sun', gradient: 'day' },
    1: { condition: 'Mainly clear', icon: 'sun', gradient: 'day' },
    2: { condition: 'Partly cloudy', icon: 'partly-cloudy', gradient: 'day' },
    3: { condition: 'Overcast', icon: 'cloudy', gradient: 'cloudy' },
    45: { condition: 'Foggy', icon: 'fog', gradient: 'cloudy' },
    48: { condition: 'Rime fog', icon: 'fog', gradient: 'cloudy' },
    51: { condition: 'Light drizzle', icon: 'drizzle', gradient: 'rainy' },
    53: { condition: 'Moderate drizzle', icon: 'drizzle', gradient: 'rainy' },
    55: { condition: 'Dense drizzle', icon: 'drizzle', gradient: 'rainy' },
    56: { condition: 'Freezing drizzle', icon: 'drizzle', gradient: 'rainy' },
    57: { condition: 'Dense freezing drizzle', icon: 'drizzle', gradient: 'rainy' },
    61: { condition: 'Slight rain', icon: 'rain', gradient: 'rainy' },
    63: { condition: 'Moderate rain', icon: 'rain', gradient: 'rainy' },
    65: { condition: 'Heavy rain', icon: 'heavy-rain', gradient: 'rainy' },
    66: { condition: 'Freezing rain', icon: 'rain', gradient: 'rainy' },
    67: { condition: 'Heavy freezing rain', icon: 'heavy-rain', gradient: 'rainy' },
    71: { condition: 'Slight snow', icon: 'snow', gradient: 'cloudy' },
    73: { condition: 'Moderate snow', icon: 'snow', gradient: 'cloudy' },
    75: { condition: 'Heavy snow', icon: 'heavy-snow', gradient: 'cloudy' },
    77: { condition: 'Snow grains', icon: 'snow', gradient: 'cloudy' },
    80: { condition: 'Slight rain showers', icon: 'rain', gradient: 'rainy' },
    81: { condition: 'Moderate rain showers', icon: 'rain', gradient: 'rainy' },
    82: { condition: 'Violent rain showers', icon: 'heavy-rain', gradient: 'rainy' },
    85: { condition: 'Slight snow showers', icon: 'snow', gradient: 'cloudy' },
    86: { condition: 'Heavy snow showers', icon: 'heavy-snow', gradient: 'cloudy' },
    95: { condition: 'Thunderstorm', icon: 'thunderstorm', gradient: 'rainy' },
    96: { condition: 'Thunderstorm with hail', icon: 'thunderstorm', gradient: 'rainy' },
    99: { condition: 'Thunderstorm with heavy hail', icon: 'thunderstorm', gradient: 'rainy' }
};

// Thai to English location mapping
const thaiLocationMap = {
    // Bangkok districts
    'รังสิต': { name: 'Rangsit', lat: 13.9667, lon: 100.5833 },
    'กรุงเทพ': { name: 'Bangkok', lat: 13.7563, lon: 100.5018 },
    'กรุงเทพมหานคร': { name: 'Bangkok', lat: 13.7563, lon: 100.5018 },
    'บางนา': { name: 'Bang Na', lat: 13.6671, lon: 100.5952 },
    'บางกะปิ': { name: 'Bang Kapi', lat: 13.7650, lon: 100.6477 },
    'ลาดพร้าว': { name: 'Lat Phrao', lat: 13.8167, lon: 100.5833 },
    'บางแค': { name: 'Bang Khae', lat: 13.7136, lon: 100.4053 },
    'มีนบุรี': { name: 'Min Buri', lat: 13.8109, lon: 100.7291 },
    'หนองจอก': { name: 'Nong Chok', lat: 13.8492, lon: 100.8611 },
    'สาทร': { name: 'Sathorn', lat: 13.7167, lon: 100.5333 },
    'สุขุมวิท': { name: 'Sukhumvit', lat: 13.7372, lon: 100.5603 },
    'สีลม': { name: 'Silom', lat: 13.7262, lon: 100.5234 },
    'ปทุมวัน': { name: 'Pathum Wan', lat: 13.7430, lon: 100.5332 },
    'ดินแดง': { name: 'Din Daeng', lat: 13.7700, lon: 100.5500 },
    'จตุจักร': { name: 'Chatuchak', lat: 13.8333, lon: 100.5667 },
    'ดอนเมือง': { name: 'Don Mueang', lat: 13.9125, lon: 100.6006 },
    'หลักสี่': { name: 'Lak Si', lat: 13.8833, lon: 100.5667 },
    'บางเขน': { name: 'Bang Khen', lat: 13.8667, lon: 100.5833 },
    'สายไหม': { name: 'Sai Mai', lat: 13.9167, lon: 100.6500 },
    'คลองสามวา': { name: 'Khlong Sam Wa', lat: 13.8833, lon: 100.7167 },
    'อ่อนนุช': { name: 'On Nut', lat: 13.7050, lon: 100.6011 },
    'พระโขนง': { name: 'Phra Khanong', lat: 13.7022, lon: 100.5914 },
    'บางจาก': { name: 'Bang Chak', lat: 13.6917, lon: 100.6092 },
    'อุดมสุข': { name: 'Udom Suk', lat: 13.6817, lon: 100.6100 },
    
    // Other provinces/cities
    'เชียงใหม่': { name: 'Chiang Mai', lat: 18.7883, lon: 98.9853 },
    'เชียงราย': { name: 'Chiang Rai', lat: 19.9105, lon: 99.8406 },
    'ภูเก็ต': { name: 'Phuket', lat: 7.8804, lon: 98.3923 },
    'พัทยา': { name: 'Pattaya', lat: 12.9236, lon: 100.8825 },
    'หาดใหญ่': { name: 'Hat Yai', lat: 7.0086, lon: 100.4747 },
    'ขอนแก่น': { name: 'Khon Kaen', lat: 16.4322, lon: 102.8236 },
    'นครราชสีมา': { name: 'Nakhon Ratchasima', lat: 14.9799, lon: 102.0978 },
    'โคราช': { name: 'Nakhon Ratchasima', lat: 14.9799, lon: 102.0978 },
    'อุดรธานี': { name: 'Udon Thani', lat: 17.4156, lon: 102.7872 },
    'สุราษฎร์ธานี': { name: 'Surat Thani', lat: 9.1382, lon: 99.3217 },
    'นครศรีธรรมราช': { name: 'Nakhon Si Thammarat', lat: 8.4304, lon: 99.9631 },
    'สงขลา': { name: 'Songkhla', lat: 7.1997, lon: 100.5950 },
    'ระยอง': { name: 'Rayong', lat: 12.6833, lon: 101.2500 },
    'ชลบุรี': { name: 'Chon Buri', lat: 13.3622, lon: 100.9847 },
    'อยุธยา': { name: 'Ayutthaya', lat: 14.3692, lon: 100.5877 },
    'เพชรบุรี': { name: 'Phetchaburi', lat: 13.1119, lon: 99.9397 },
    'หัวหิน': { name: 'Hua Hin', lat: 12.5686, lon: 99.9578 },
    'กระบี่': { name: 'Krabi', lat: 8.0863, lon: 98.9063 },
    'สมุย': { name: 'Ko Samui', lat: 9.5120, lon: 100.0136 },
    'เกาะสมุย': { name: 'Ko Samui', lat: 9.5120, lon: 100.0136 },
    'พังงา': { name: 'Phang Nga', lat: 8.4510, lon: 98.5253 },
    'ตราด': { name: 'Trat', lat: 12.2428, lon: 102.5119 },
    'เกาะช้าง': { name: 'Ko Chang', lat: 12.0500, lon: 102.3500 },
    'แม่ฮ่องสอน': { name: 'Mae Hong Son', lat: 19.2990, lon: 97.9686 },
    'ลำปาง': { name: 'Lampang', lat: 18.2888, lon: 99.4989 },
    'ลำพูน': { name: 'Lamphun', lat: 18.5742, lon: 99.0087 },
    'น่าน': { name: 'Nan', lat: 18.7844, lon: 100.7780 },
    'แพร่': { name: 'Phrae', lat: 18.1445, lon: 100.1399 },
    'พิษณุโลก': { name: 'Phitsanulok', lat: 16.8211, lon: 100.2659 },
    'นครสวรรค์': { name: 'Nakhon Sawan', lat: 15.7030, lon: 100.1373 },
    'ปทุมธานี': { name: 'Pathum Thani', lat: 14.0208, lon: 100.5250 },
    'นนทบุรี': { name: 'Nonthaburi', lat: 13.8622, lon: 100.5144 },
    'สมุทรปราการ': { name: 'Samut Prakan', lat: 13.5990, lon: 100.5998 },
    'นครปฐม': { name: 'Nakhon Pathom', lat: 13.8196, lon: 100.0642 },
    'สุพรรณบุรี': { name: 'Suphan Buri', lat: 14.4744, lon: 100.1177 },
    'กาญจนบุรี': { name: 'Kanchanaburi', lat: 14.0227, lon: 99.5328 },
    'ราชบุรี': { name: 'Ratchaburi', lat: 13.5283, lon: 99.8134 },
    'ประจวบคีรีขันธ์': { name: 'Prachuap Khiri Khan', lat: 11.8126, lon: 99.7976 },
    'ชุมพร': { name: 'Chumphon', lat: 10.4930, lon: 99.1800 },
    'ฉะเชิงเทรา': { name: 'Chachoengsao', lat: 13.6904, lon: 101.0779 },
    'ปราจีนบุรี': { name: 'Prachin Buri', lat: 14.0509, lon: 101.3715 },
    'สระแก้ว': { name: 'Sa Kaeo', lat: 13.8244, lon: 102.0645 },
    'จันทบุรี': { name: 'Chanthaburi', lat: 12.6113, lon: 102.1039 },
    'ลพบุรี': { name: 'Lop Buri', lat: 14.7995, lon: 100.6534 },
    'สระบุรี': { name: 'Saraburi', lat: 14.5289, lon: 100.9104 },
    'นครนายก': { name: 'Nakhon Nayok', lat: 14.2069, lon: 101.2133 },
    'สิงห์บุรี': { name: 'Sing Buri', lat: 14.8872, lon: 100.4003 },
    'อ่างทอง': { name: 'Ang Thong', lat: 14.5896, lon: 100.4549 },
    'ชัยนาท': { name: 'Chai Nat', lat: 15.1851, lon: 100.1251 },
    'อุทัยธานี': { name: 'Uthai Thani', lat: 15.3795, lon: 100.0245 },
    'กำแพงเพชร': { name: 'Kamphaeng Phet', lat: 16.4827, lon: 99.5226 },
    'ตาก': { name: 'Tak', lat: 16.8840, lon: 99.1259 },
    'สุโขทัย': { name: 'Sukhothai', lat: 17.0070, lon: 99.8265 },
    'อุตรดิตถ์': { name: 'Uttaradit', lat: 17.6256, lon: 100.0993 },
    'เลย': { name: 'Loei', lat: 17.4860, lon: 101.7223 },
    'หนองคาย': { name: 'Nong Khai', lat: 17.8783, lon: 102.7420 },
    'บึงกาฬ': { name: 'Bueng Kan', lat: 18.3609, lon: 103.6464 },
    'สกลนคร': { name: 'Sakon Nakhon', lat: 17.1545, lon: 104.1348 },
    'นครพนม': { name: 'Nakhon Phanom', lat: 17.3944, lon: 104.7695 },
    'มุกดาหาร': { name: 'Mukdahan', lat: 16.5436, lon: 104.7235 },
    'กาฬสินธุ์': { name: 'Kalasin', lat: 16.4314, lon: 103.5058 },
    'ร้อยเอ็ด': { name: 'Roi Et', lat: 16.0567, lon: 103.6525 },
    'มหาสารคาม': { name: 'Maha Sarakham', lat: 16.1847, lon: 103.3009 },
    'ยโสธร': { name: 'Yasothon', lat: 15.7944, lon: 104.1453 },
    'อำนาจเจริญ': { name: 'Amnat Charoen', lat: 15.8656, lon: 104.6258 },
    'อุบลราชธานี': { name: 'Ubon Ratchathani', lat: 15.2448, lon: 104.8473 },
    'ศรีสะเกษ': { name: 'Si Sa Ket', lat: 15.1186, lon: 104.3220 },
    'สุรินทร์': { name: 'Surin', lat: 14.8818, lon: 103.4936 },
    'บุรีรัมย์': { name: 'Buri Ram', lat: 14.9930, lon: 103.1029 },
    'ชัยภูมิ': { name: 'Chaiyaphum', lat: 15.8068, lon: 102.0316 },
    'ตรัง': { name: 'Trang', lat: 7.5563, lon: 99.6114 },
    'พัทลุง': { name: 'Phatthalung', lat: 7.6167, lon: 100.0833 },
    'สตูล': { name: 'Satun', lat: 6.6238, lon: 100.0673 },
    'ปัตตานี': { name: 'Pattani', lat: 6.8664, lon: 101.2508 },
    'ยะลา': { name: 'Yala', lat: 6.5400, lon: 101.2803 },
    'นราธิวาส': { name: 'Narathiwat', lat: 6.4318, lon: 101.8232 },
    
    // Common search terms
    'ฟิวเจอร์พาร์ค': { name: 'Future Park Rangsit', lat: 13.9892, lon: 100.6158 },
    'สยาม': { name: 'Siam', lat: 13.7466, lon: 100.5347 },
    'อารีย์': { name: 'Ari', lat: 13.7856, lon: 100.5450 },
    'ทองหล่อ': { name: 'Thong Lo', lat: 13.7325, lon: 100.5828 },
    'เอกมัย': { name: 'Ekkamai', lat: 13.7221, lon: 100.5858 },
    'อโศก': { name: 'Asok', lat: 13.7380, lon: 100.5603 },
    'พร้อมพงษ์': { name: 'Phrom Phong', lat: 13.7313, lon: 100.5694 },
    'นานา': { name: 'Nana', lat: 13.7433, lon: 100.5556 },
    'เพลินจิต': { name: 'Phloen Chit', lat: 13.7439, lon: 100.5458 },
    'ชิดลม': { name: 'Chit Lom', lat: 13.7444, lon: 100.5406 },
    'ราชดำริ': { name: 'Ratchadamri', lat: 13.7417, lon: 100.5389 },
    'ศาลาแดง': { name: 'Sala Daeng', lat: 13.7286, lon: 100.5344 },
    'ช่องนนทรี': { name: 'Chong Nonsi', lat: 13.7231, lon: 100.5294 },
    'สุรศักดิ์': { name: 'Surasak', lat: 13.7222, lon: 100.5189 },
    'สะพานตากสิน': { name: 'Saphan Taksin', lat: 13.7186, lon: 100.5039 },
    'วงเวียนใหญ่': { name: 'Wongwian Yai', lat: 13.7214, lon: 100.4942 },
    'ตลาดพลู': { name: 'Talat Phlu', lat: 13.7183, lon: 100.4764 },
    'บางหว้า': { name: 'Bang Wa', lat: 13.7206, lon: 100.4572 },
    'หมอชิต': { name: 'Mo Chit', lat: 13.8025, lon: 100.5536 },
    'สะพานควาย': { name: 'Saphan Khwai', lat: 13.7939, lon: 100.5492 },
    'อนุสาวรีย์': { name: 'Anusawari', lat: 13.7931, lon: 100.5453 },
    'พหลโยธิน': { name: 'Phahon Yothin', lat: 13.8125, lon: 100.5617 },
    'รัชโยธิน': { name: 'Ratchayothin', lat: 13.8317, lon: 100.5678 },
    'เสนานิคม': { name: 'Sena Nikhom', lat: 13.8406, lon: 100.5703 },
    'กรมทหารราบที่11': { name: 'Kor Mor 11', lat: 13.8489, lon: 100.5711 },
    'บางบัว': { name: 'Bang Bua', lat: 13.8581, lon: 100.5722 },
    'วัชรพล': { name: 'Wachira Phayaban', lat: 13.8661, lon: 100.5753 },
    'คูคต': { name: 'Khu Khot', lat: 13.9386, lon: 100.6333 },
    
    // International cities in Thai
    'โตเกียว': { name: 'Tokyo', lat: 35.6762, lon: 139.6503 },
    'โอซาก้า': { name: 'Osaka', lat: 34.6937, lon: 135.5023 },
    'เกียวโต': { name: 'Kyoto', lat: 35.0116, lon: 135.7681 },
    'โซล': { name: 'Seoul', lat: 37.5665, lon: 126.9780 },
    'สิงคโปร์': { name: 'Singapore', lat: 1.3521, lon: 103.8198 },
    'กัวลาลัมเปอร์': { name: 'Kuala Lumpur', lat: 3.1390, lon: 101.6869 },
    'ฮ่องกง': { name: 'Hong Kong', lat: 22.3193, lon: 114.1694 },
    'ไทเป': { name: 'Taipei', lat: 25.0330, lon: 121.5654 },
    'ปักกิ่ง': { name: 'Beijing', lat: 39.9042, lon: 116.4074 },
    'เซี่ยงไฮ้': { name: 'Shanghai', lat: 31.2304, lon: 121.4737 },
    'ลอนดอน': { name: 'London', lat: 51.5074, lon: -0.1278 },
    'ปารีส': { name: 'Paris', lat: 48.8566, lon: 2.3522 },
    'นิวยอร์ก': { name: 'New York', lat: 40.7128, lon: -74.0060 },
    'ลอสแอนเจลิส': { name: 'Los Angeles', lat: 34.0522, lon: -118.2437 },
    'ซิดนีย์': { name: 'Sydney', lat: -33.8688, lon: 151.2093 },
    'ดูไบ': { name: 'Dubai', lat: 25.2048, lon: 55.2708 },
};

// Day names
const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const fullDayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// DOM Elements
const elements = {
    statusTime: document.getElementById('status-time'),
    loadingState: document.getElementById('loading-state'),
    mainWeather: document.getElementById('main-weather'),
    scrollContent: document.getElementById('scroll-content'),
    screen: document.getElementById('screen'),
    dynamicIsland: document.getElementById('dynamic-island'),
    islandInfo: document.getElementById('island-info'),
    
    // Search
    searchBtn: document.getElementById('search-btn'),
    searchOverlay: document.getElementById('search-overlay'),
    closeSearch: document.getElementById('close-search'),
    searchInput: document.getElementById('search-input'),
    searchClear: document.getElementById('search-clear'),
    searchResults: document.getElementById('search-results'),
    savedList: document.getElementById('saved-list'),
    
    // Weather info
    cityName: document.getElementById('city-name'),
    locationDesc: document.getElementById('location-desc'),
    tempValue: document.getElementById('temp-value'),
    weatherIconLarge: document.getElementById('weather-icon-large'),
    conditionText: document.getElementById('condition-text'),
    highTemp: document.getElementById('high-temp'),
    lowTemp: document.getElementById('low-temp'),
    
    // Quick info
    quickHumidity: document.getElementById('quick-humidity'),
    quickWind: document.getElementById('quick-wind'),
    quickUv: document.getElementById('quick-uv'),
    
    // Forecasts
    hourlyScroll: document.getElementById('hourly-scroll'),
    dailyList: document.getElementById('daily-list'),
    
    // Map
    mapLocation: document.getElementById('map-location'),
    
    // Details
    uvValue: document.getElementById('uv-value'),
    uvLabel: document.getElementById('uv-label'),
    uvProgress: document.getElementById('uv-progress'),
    sunrise: document.getElementById('sunrise'),
    sunset: document.getElementById('sunset'),
    sunDot: document.getElementById('sun-dot'),
    windValue: document.getElementById('wind-value'),
    windArrow: document.getElementById('wind-arrow'),
    humidityValue: document.getElementById('humidity-value'),
    humidityFill: document.getElementById('humidity-fill'),
    feelsLike: document.getElementById('feels-like'),
    feelsLikeDesc: document.getElementById('feels-like-desc'),
    thermoFill: document.getElementById('thermo-fill'),
    visibility: document.getElementById('visibility'),
    visibilityLabel: document.getElementById('visibility-label'),
    pressure: document.getElementById('pressure'),
    pressureLabel: document.getElementById('pressure-label'),
    gaugeNeedle: document.getElementById('gauge-needle'),
    aqiValue: document.getElementById('aqi-value'),
    aqiLabel: document.getElementById('aqi-label'),
    aqiProgress: document.getElementById('aqi-progress'),
    alertsCard: document.getElementById('alerts-card'),
    alertContent: document.getElementById('alert-content'),
    
    // Footer
    lastUpdate: document.getElementById('last-update'),
    refreshBtn: document.getElementById('refresh-btn'),
    
    // Toast
    toast: document.getElementById('toast'),
    toastMessage: document.getElementById('toast-message')
};

// Weather App Class
class WeatherApp {
    constructor() {
        this.latitude = null;
        this.longitude = null;
        this.locationName = 'Bangkok';
        this.isCurrentLocation = true;
        this.savedLocations = this.loadSavedLocations();
        this.searchTimeout = null;
        
        this.init();
    }

    async init() {
        this.updateClock();
        setInterval(() => this.updateClock(), 1000);
        
        this.setupEventListeners();
        this.renderSavedLocations();
        
        await this.getLocation();
        this.setupAutoRefresh();
    }

    setupEventListeners() {
        // Search button
        elements.searchBtn?.addEventListener('click', () => this.openSearch());
        elements.closeSearch?.addEventListener('click', () => this.closeSearch());
        
        // Search input
        elements.searchInput?.addEventListener('input', (e) => this.handleSearchInput(e));
        elements.searchClear?.addEventListener('click', () => this.clearSearch());
        
        // City chips
        document.querySelectorAll('.city-chip').forEach(chip => {
            chip.addEventListener('click', () => {
                const city = chip.dataset.city;
                const lat = parseFloat(chip.dataset.lat);
                const lon = parseFloat(chip.dataset.lon);
                this.selectLocation(city, lat, lon, false);
            });
        });
        
        // Refresh button
        elements.refreshBtn?.addEventListener('click', () => this.refresh());
        
        // Close search on escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.closeSearch();
        });
    }

    updateClock() {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        elements.statusTime.textContent = `${hours}:${minutes}`;
        
        // Update Dynamic Island
        if (elements.islandInfo) {
            elements.islandInfo.textContent = `${hours}:${minutes}`;
        }
    }

    openSearch() {
        elements.searchOverlay?.classList.add('active');
        elements.searchInput?.focus();
    }

    closeSearch() {
        elements.searchOverlay?.classList.remove('active');
        this.clearSearch();
    }

    clearSearch() {
        if (elements.searchInput) elements.searchInput.value = '';
        if (elements.searchResults) elements.searchResults.innerHTML = '';
        elements.searchClear?.classList.remove('visible');
    }

    async handleSearchInput(e) {
        const query = e.target.value.trim();
        
        if (query.length > 0) {
            elements.searchClear?.classList.add('visible');
        } else {
            elements.searchClear?.classList.remove('visible');
            elements.searchResults.innerHTML = '';
            return;
        }
        
        // Debounce search
        clearTimeout(this.searchTimeout);
        this.searchTimeout = setTimeout(() => this.searchLocations(query), 300);
    }

    async searchLocations(query) {
        if (query.length < 2) return;
        
        try {
            elements.searchResults.innerHTML = '<div class="search-loading">🔍 Searching...</div>';
            
            // Check Thai location mapping first
            const thaiResults = this.searchThaiLocations(query);
            
            if (thaiResults.length > 0) {
                this.renderThaiResults(thaiResults);
                return;
            }
            
            // If no Thai match, try API search
            const response = await fetch(
                `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=8&language=en&format=json`
            );
            const data = await response.json();
            
            if (data.results && data.results.length > 0) {
                this.renderSearchResults(data.results);
            } else {
                elements.searchResults.innerHTML = '<div class="search-empty">😔 No locations found. Try English name or select from Popular Cities</div>';
            }
        } catch (error) {
            console.error('Search error:', error);
            elements.searchResults.innerHTML = '<div class="search-error">❌ Search failed. Please try again.</div>';
        }
    }

    searchThaiLocations(query) {
        const results = [];
        const queryLower = query.toLowerCase();
        
        for (const [thai, data] of Object.entries(thaiLocationMap)) {
            // Match Thai text or English name
            if (thai.includes(query) || data.name.toLowerCase().includes(queryLower)) {
                results.push({
                    thaiName: thai,
                    ...data
                });
            }
        }
        
        // Sort by relevance (exact match first)
        results.sort((a, b) => {
            const aExact = a.thaiName === query || a.name.toLowerCase() === queryLower;
            const bExact = b.thaiName === query || b.name.toLowerCase() === queryLower;
            if (aExact && !bExact) return -1;
            if (!aExact && bExact) return 1;
            return 0;
        });
        
        return results.slice(0, 8);
    }

    renderThaiResults(results) {
        const html = results.map(result => `
            <div class="search-result-item" 
                 data-city="${result.name}" 
                 data-lat="${result.lat}" 
                 data-lon="${result.lon}">
                <span class="result-icon">🇹🇭</span>
                <div class="result-info">
                    <div class="result-city">${result.name}</div>
                    <div class="result-country">${result.thaiName} • Thailand</div>
                </div>
            </div>
        `).join('');
        
        elements.searchResults.innerHTML = html;
        
        // Add click listeners
        elements.searchResults.querySelectorAll('.search-result-item').forEach(item => {
            item.addEventListener('click', () => {
                const city = item.dataset.city;
                const lat = parseFloat(item.dataset.lat);
                const lon = parseFloat(item.dataset.lon);
                this.selectLocation(city, lat, lon, false);
            });
        });
    }

    renderSearchResults(results) {
        const html = results.map(result => {
            const flag = this.getCountryFlag(result.country_code);
            return `
                <div class="search-result-item" 
                     data-city="${result.name}" 
                     data-lat="${result.latitude}" 
                     data-lon="${result.longitude}"
                     data-country="${result.country || ''}">
                    <span class="result-icon">${flag}</span>
                    <div class="result-info">
                        <div class="result-city">${result.name}</div>
                        <div class="result-country">${result.admin1 || ''} ${result.country || ''}</div>
                    </div>
                </div>
            `;
        }).join('');
        
        elements.searchResults.innerHTML = html;
        
        // Add click listeners
        elements.searchResults.querySelectorAll('.search-result-item').forEach(item => {
            item.addEventListener('click', () => {
                const city = item.dataset.city;
                const lat = parseFloat(item.dataset.lat);
                const lon = parseFloat(item.dataset.lon);
                this.selectLocation(city, lat, lon, false);
            });
        });
    }

    getCountryFlag(countryCode) {
        if (!countryCode) return '🌍';
        const codePoints = countryCode
            .toUpperCase()
            .split('')
            .map(char => 127397 + char.charCodeAt(0));
        return String.fromCodePoint(...codePoints);
    }

    async selectLocation(name, lat, lon, isCurrent = false) {
        this.locationName = name;
        this.latitude = lat;
        this.longitude = lon;
        this.isCurrentLocation = isCurrent;
        
        this.closeSearch();
        
        // Show loading
        elements.loadingState.style.display = 'flex';
        elements.mainWeather.style.display = 'none';
        elements.scrollContent.style.display = 'none';
        
        await this.fetchWeather();
        
        // Save location
        if (!isCurrent) {
            this.addSavedLocation(name, lat, lon);
        }
    }

    loadSavedLocations() {
        try {
            const saved = localStorage.getItem('weatherLocations');
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    }

    saveSavedLocations() {
        try {
            localStorage.setItem('weatherLocations', JSON.stringify(this.savedLocations));
        } catch (e) {
            console.error('Failed to save locations:', e);
        }
    }

    addSavedLocation(name, lat, lon) {
        // Check if already exists
        const exists = this.savedLocations.some(loc => 
            loc.name === name && Math.abs(loc.lat - lat) < 0.01
        );
        
        if (!exists) {
            this.savedLocations.unshift({ name, lat, lon });
            // Keep only last 5 locations
            if (this.savedLocations.length > 5) {
                this.savedLocations.pop();
            }
            this.saveSavedLocations();
            this.renderSavedLocations();
            this.showToast('📍 Location saved!');
        }
    }

    removeSavedLocation(index) {
        this.savedLocations.splice(index, 1);
        this.saveSavedLocations();
        this.renderSavedLocations();
        this.showToast('🗑️ Location removed');
    }

    renderSavedLocations() {
        if (!elements.savedList) return;
        
        if (this.savedLocations.length === 0) {
            elements.savedList.innerHTML = '<p style="color: rgba(255,255,255,0.5); font-size: 14px;">No saved locations yet</p>';
            return;
        }
        
        const html = this.savedLocations.map((loc, index) => `
            <div class="saved-item" data-index="${index}">
                <div class="saved-info">
                    <span>📍</span>
                    <span>${loc.name}</span>
                </div>
                <button class="delete-btn" data-index="${index}">✕</button>
            </div>
        `).join('');
        
        elements.savedList.innerHTML = html;
        
        // Add click listeners
        elements.savedList.querySelectorAll('.saved-item').forEach(item => {
            item.addEventListener('click', (e) => {
                if (e.target.classList.contains('delete-btn')) {
                    e.stopPropagation();
                    const index = parseInt(e.target.dataset.index);
                    this.removeSavedLocation(index);
                } else {
                    const index = parseInt(item.dataset.index);
                    const loc = this.savedLocations[index];
                    this.selectLocation(loc.name, loc.lat, loc.lon, false);
                }
            });
        });
    }

    showToast(message) {
        elements.toastMessage.textContent = message;
        elements.toast.classList.add('show');
        
        setTimeout(() => {
            elements.toast.classList.remove('show');
        }, 3000);
    }

    async refresh() {
        elements.refreshBtn.classList.add('refreshing');
        await this.fetchWeather();
        elements.refreshBtn.classList.remove('refreshing');
        this.showToast('✓ Weather updated!');
    }

    async getLocation() {
        if ('geolocation' in navigator) {
            try {
                const position = await new Promise((resolve, reject) => {
                    navigator.geolocation.getCurrentPosition(resolve, reject, {
                        enableHighAccuracy: true,
                        timeout: 10000,
                        maximumAge: 300000
                    });
                });
                this.latitude = position.coords.latitude;
                this.longitude = position.coords.longitude;
                this.isCurrentLocation = true;
                elements.locationDesc.textContent = 'My Location';
                await this.getLocationName();
                await this.fetchWeather();
            } catch (error) {
                console.log('Geolocation error:', error);
                this.useDefaultLocation();
            }
        } else {
            this.useDefaultLocation();
        }
    }

    async useDefaultLocation() {
        this.latitude = 13.7563;
        this.longitude = 100.5018;
        this.locationName = 'Bangkok';
        this.isCurrentLocation = false;
        elements.locationDesc.textContent = 'Default Location';
        await this.fetchWeather();
    }

    async getLocationName() {
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${this.latitude}&lon=${this.longitude}&zoom=10`
            );
            const data = await response.json();
            
            if (data.address) {
                this.locationName = data.address.city || 
                                   data.address.town || 
                                   data.address.municipality ||
                                   data.address.county ||
                                   data.address.state ||
                                   'Unknown';
            }
        } catch (error) {
            console.log('Reverse geocoding error:', error);
        }
    }

    async fetchWeather() {
        try {
            const url = `https://api.open-meteo.com/v1/forecast?` +
                `latitude=${this.latitude}` +
                `&longitude=${this.longitude}` +
                `&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,surface_pressure,wind_speed_10m,wind_direction_10m,uv_index` +
                `&hourly=temperature_2m,weather_code,precipitation_probability` +
                `&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_probability_max` +
                `&timezone=auto` +
                `&forecast_days=10`;

            const response = await fetch(url);
            const data = await response.json();

            this.updateUI(data);
        } catch (error) {
            console.error('Weather fetch error:', error);
            elements.loadingState.innerHTML = `
                <div style="text-align: center; color: rgba(255,255,255,0.7); padding: 40px;">
                    <div style="font-size: 48px; margin-bottom: 20px;">⚠️</div>
                    <p style="font-size: 16px; margin-bottom: 10px;">Unable to load weather</p>
                    <p style="font-size: 13px;">Please check your connection</p>
                    <button onclick="location.reload()" style="margin-top: 20px; padding: 12px 24px; background: rgba(255,255,255,0.15); border: none; border-radius: 20px; color: white; cursor: pointer;">
                        Retry
                    </button>
                </div>
            `;
        }
    }

    updateUI(data) {
        const current = data.current;
        const hourly = data.hourly;
        const daily = data.daily;

        // Hide loading, show content
        elements.loadingState.style.display = 'none';
        elements.mainWeather.style.display = 'block';
        elements.scrollContent.style.display = 'block';

        // Update main weather
        elements.cityName.textContent = this.locationName;
        elements.locationDesc.textContent = this.isCurrentLocation ? 'My Location' : 'Selected Location';
        elements.tempValue.textContent = Math.round(current.temperature_2m);
        
        const weatherInfo = weatherCodes[current.weather_code] || { condition: 'Unknown', icon: 'sun', gradient: 'day' };
        elements.conditionText.textContent = weatherInfo.condition;
        
        // Update large weather icon
        if (elements.weatherIconLarge) {
            elements.weatherIconLarge.querySelector('.icon-container').innerHTML = this.getWeatherIcon(weatherInfo.icon, 120);
        }

        // High/Low temps
        elements.highTemp.textContent = Math.round(daily.temperature_2m_max[0]);
        elements.lowTemp.textContent = Math.round(daily.temperature_2m_min[0]);

        // Quick info bar
        elements.quickHumidity.textContent = `${current.relative_humidity_2m}%`;
        elements.quickWind.textContent = `${Math.round(current.wind_speed_10m)} km/h`;
        elements.quickUv.textContent = `UV ${Math.round(current.uv_index || 0)}`;

        // Update screen gradient based on time & weather
        this.updateScreenGradient(current.weather_code, weatherInfo.gradient);

        // Update map
        if (elements.mapLocation) {
            elements.mapLocation.textContent = this.locationName;
        }

        // Hourly forecast
        this.updateHourlyForecast(hourly);

        // Daily forecast (10 days)
        this.updateDailyForecast(daily);

        // Weather details
        this.updateDetails(current, daily);

        // Last update time
        const now = new Date();
        elements.lastUpdate.textContent = `Last updated: ${now.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit' 
        })}`;
    }

    updateScreenGradient(weatherCode, gradientType) {
        const screen = elements.screen;
        const hour = new Date().getHours();
        
        // Remove all mode classes
        screen.classList.remove('night-mode', 'sunset-mode', 'rainy-mode');
        
        // Check for rain/storm first
        if (gradientType === 'rainy') {
            screen.classList.add('rainy-mode');
            return;
        }
        
        // Night mode (8 PM - 6 AM)
        if (hour >= 20 || hour < 6) {
            screen.classList.add('night-mode');
        } 
        // Sunset mode (5 PM - 8 PM)
        else if (hour >= 17 && hour < 20) {
            screen.classList.add('sunset-mode');
        }
    }

    updateHourlyForecast(hourly) {
        const now = new Date();
        const currentHour = now.getHours();
        
        let html = '';
        for (let i = 0; i < 24; i++) {
            const hourIndex = currentHour + i;
            if (hourIndex >= hourly.time.length) break;
            
            const time = new Date(hourly.time[hourIndex]);
            const temp = Math.round(hourly.temperature_2m[hourIndex]);
            const code = hourly.weather_code[hourIndex];
            const weatherInfo = weatherCodes[code] || { icon: 'sun' };
            
            const timeLabel = i === 0 ? 'Now' : time.getHours().toString().padStart(2, '0');
            
            html += `
                <div class="hourly-item">
                    <span class="hourly-time">${timeLabel}</span>
                    <div class="hourly-icon">${this.getWeatherIcon(weatherInfo.icon, 36)}</div>
                    <span class="hourly-temp">${temp}°</span>
                </div>
            `;
        }
        elements.hourlyScroll.innerHTML = html;
    }

    updateDailyForecast(daily) {
        let html = '';
        const tempRange = {
            min: Math.min(...daily.temperature_2m_min),
            max: Math.max(...daily.temperature_2m_max)
        };

        const daysToShow = Math.min(daily.time.length, 10);
        
        for (let i = 0; i < daysToShow; i++) {
            const date = new Date(daily.time[i]);
            const dayName = i === 0 ? 'Today' : (i === 1 ? 'Tomorrow' : dayNames[date.getDay()]);
            const high = Math.round(daily.temperature_2m_max[i]);
            const low = Math.round(daily.temperature_2m_min[i]);
            const code = daily.weather_code[i];
            const weatherInfo = weatherCodes[code] || { icon: 'sun' };
            
            // Calculate bar position
            const range = tempRange.max - tempRange.min;
            const barStart = range > 0 ? ((low - tempRange.min) / range) * 100 : 0;
            const barWidth = range > 0 ? ((high - low) / range) * 100 : 50;

            html += `
                <div class="daily-item">
                    <span class="daily-day">${dayName}</span>
                    <div class="daily-icon">${this.getWeatherIcon(weatherInfo.icon, 36)}</div>
                    <div class="daily-temps">
                        <span class="daily-low">${low}°</span>
                        <div class="temp-bar">
                            <div class="temp-bar-fill" style="left: ${barStart}%; width: ${Math.max(barWidth, 10)}%;"></div>
                        </div>
                        <span class="daily-high">${high}°</span>
                    </div>
                </div>
            `;
        }
        elements.dailyList.innerHTML = html;
    }

    updateDetails(current, daily) {
        // UV Index
        const uv = Math.round(current.uv_index || 0);
        elements.uvValue.textContent = uv;
        elements.uvLabel.textContent = this.getUVLabel(uv);
        elements.uvProgress.style.left = `calc(${Math.min(uv / 11 * 100, 95)}% - 6px)`;

        // Sunrise/Sunset
        if (daily.sunrise && daily.sunrise[0]) {
            const sunrise = new Date(daily.sunrise[0]);
            elements.sunrise.textContent = sunrise.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
        }
        if (daily.sunset && daily.sunset[0]) {
            const sunset = new Date(daily.sunset[0]);
            elements.sunset.textContent = sunset.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
        }

        // Calculate sun position
        if (daily.sunrise && daily.sunset) {
            const now = new Date();
            const sunrise = new Date(daily.sunrise[0]);
            const sunset = new Date(daily.sunset[0]);
            const dayLength = sunset - sunrise;
            const elapsed = now - sunrise;
            const progress = Math.max(0, Math.min(1, elapsed / dayLength));
            
            // Position sun dot on arc (0-180 degrees)
            const angle = progress * 180;
            const radius = 48; // half of sun-path width minus padding
            const x = 50 + Math.cos((180 - angle) * Math.PI / 180) * 45;
            const y = 100 - Math.sin((180 - angle) * Math.PI / 180) * 40;
            
            if (elements.sunDot) {
                elements.sunDot.style.left = `${x}%`;
                elements.sunDot.style.top = `${Math.min(y, 95)}%`;
            }
        }

        // Wind
        const windSpeed = Math.round(current.wind_speed_10m);
        const windDir = current.wind_direction_10m;
        elements.windValue.innerHTML = `${windSpeed} <small>km/h</small>`;
        elements.windArrow.style.transform = `translate(-50%, -50%) rotate(${windDir}deg)`;

        // Humidity
        const humidity = current.relative_humidity_2m;
        elements.humidityValue.textContent = `${humidity}%`;
        elements.humidityFill.style.height = `${humidity}%`;

        // Feels Like
        const feelsLike = Math.round(current.apparent_temperature);
        const actualTemp = Math.round(current.temperature_2m);
        elements.feelsLike.textContent = `${feelsLike}°`;
        
        if (feelsLike > actualTemp + 2) {
            elements.feelsLikeDesc.textContent = 'Humidity makes it feel warmer';
        } else if (feelsLike < actualTemp - 2) {
            elements.feelsLikeDesc.textContent = 'Wind makes it feel cooler';
        } else {
            elements.feelsLikeDesc.textContent = 'Similar to actual temperature';
        }

        // Thermometer
        const tempPercent = Math.max(0, Math.min(100, (actualTemp + 10) / 50 * 100));
        if (elements.thermoFill) {
            elements.thermoFill.style.height = `${tempPercent}%`;
        }

        // Visibility (estimate based on weather)
        const weatherCode = current.weather_code;
        let visibility = 10;
        if (weatherCode >= 45 && weatherCode <= 48) visibility = 2; // Fog
        else if (weatherCode >= 61 && weatherCode <= 67) visibility = 5; // Rain
        else if (weatherCode >= 71 && weatherCode <= 77) visibility = 3; // Snow
        
        elements.visibility.textContent = `${visibility}+ km`;
        elements.visibilityLabel.textContent = visibility >= 10 ? 'Clear conditions' : 'Reduced visibility';

        // Update visibility bars
        const visBars = document.querySelectorAll('.vis-bar');
        visBars.forEach((bar, i) => {
            if (i < Math.ceil(visibility / 2)) {
                bar.classList.add('active');
            } else {
                bar.classList.remove('active');
            }
        });

        // Pressure
        const pressure = Math.round(current.surface_pressure);
        elements.pressure.textContent = `${pressure} hPa`;
        
        let pressureLabel = 'Normal';
        if (pressure < 1000) pressureLabel = 'Low';
        else if (pressure > 1020) pressureLabel = 'High';
        elements.pressureLabel.textContent = pressureLabel;

        // Gauge needle (rotate based on pressure, 980-1040 range)
        const pressurePercent = (pressure - 980) / (1040 - 980);
        const needleAngle = -90 + (pressurePercent * 180);
        if (elements.gaugeNeedle) {
            elements.gaugeNeedle.style.transform = `translate(-50%, -100%) rotate(${needleAngle}deg)`;
        }

        // AQI (simulated based on weather conditions)
        let aqi = 25; // Default good
        if (weatherCode === 0 || weatherCode === 1) aqi = 15 + Math.random() * 20;
        else if (weatherCode === 3) aqi = 35 + Math.random() * 20;
        else aqi = 20 + Math.random() * 30;
        
        aqi = Math.round(aqi);
        elements.aqiValue.textContent = aqi;
        elements.aqiLabel.textContent = this.getAQILabel(aqi);
        elements.aqiProgress.style.left = `calc(${Math.min(aqi / 150 * 100, 95)}% - 7px)`;

        // Weather alerts (show if extreme conditions)
        if (weatherCode >= 95 || (daily.uv_index_max && daily.uv_index_max[0] >= 8)) {
            this.showWeatherAlert(weatherCode, daily);
        } else {
            elements.alertsCard.style.display = 'none';
        }
    }

    showWeatherAlert(weatherCode, daily) {
        let alertHtml = '';
        
        if (weatherCode >= 95) {
            alertHtml += `
                <div class="alert-item">
                    <span class="alert-icon">⛈️</span>
                    <div class="alert-text">
                        <h4>Thunderstorm Warning</h4>
                        <p>Stay indoors and avoid open areas</p>
                    </div>
                </div>
            `;
        }
        
        if (daily.uv_index_max && daily.uv_index_max[0] >= 8) {
            alertHtml += `
                <div class="alert-item">
                    <span class="alert-icon">☀️</span>
                    <div class="alert-text">
                        <h4>High UV Warning</h4>
                        <p>Use sunscreen and limit sun exposure</p>
                    </div>
                </div>
            `;
        }
        
        if (alertHtml) {
            elements.alertContent.innerHTML = alertHtml;
            elements.alertsCard.style.display = 'block';
        }
    }

    getUVLabel(uv) {
        if (uv <= 2) return 'Low';
        if (uv <= 5) return 'Moderate';
        if (uv <= 7) return 'High';
        if (uv <= 10) return 'Very High';
        return 'Extreme';
    }

    getAQILabel(aqi) {
        if (aqi <= 25) return 'Excellent';
        if (aqi <= 50) return 'Good';
        if (aqi <= 75) return 'Moderate';
        if (aqi <= 100) return 'Unhealthy for Sensitive';
        if (aqi <= 125) return 'Unhealthy';
        return 'Very Unhealthy';
    }

    getWeatherIcon(type, size = 32) {
        const icons = {
            'sun': `
                <svg viewBox="0 0 100 100" width="${size}" height="${size}">
                    <defs>
                        <linearGradient id="sunGrad${size}" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" style="stop-color:#FFE066"/>
                            <stop offset="100%" style="stop-color:#FFB800"/>
                        </linearGradient>
                        <filter id="glow${size}">
                            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                            <feMerge>
                                <feMergeNode in="coloredBlur"/>
                                <feMergeNode in="SourceGraphic"/>
                            </feMerge>
                        </filter>
                    </defs>
                    <circle cx="50" cy="50" r="22" fill="url(#sunGrad${size})" filter="url(#glow${size})"/>
                    <g stroke="#FFD93D" stroke-width="3" stroke-linecap="round" opacity="0.9">
                        <line x1="50" y1="18" x2="50" y2="8"><animate attributeName="opacity" values="0.6;1;0.6" dur="2s" repeatCount="indefinite"/></line>
                        <line x1="50" y1="92" x2="50" y2="82"><animate attributeName="opacity" values="0.6;1;0.6" dur="2s" repeatCount="indefinite" begin="0.25s"/></line>
                        <line x1="18" y1="50" x2="8" y2="50"><animate attributeName="opacity" values="0.6;1;0.6" dur="2s" repeatCount="indefinite" begin="0.5s"/></line>
                        <line x1="92" y1="50" x2="82" y2="50"><animate attributeName="opacity" values="0.6;1;0.6" dur="2s" repeatCount="indefinite" begin="0.75s"/></line>
                        <line x1="27" y1="27" x2="20" y2="20"><animate attributeName="opacity" values="0.6;1;0.6" dur="2s" repeatCount="indefinite" begin="1s"/></line>
                        <line x1="80" y1="80" x2="73" y2="73"><animate attributeName="opacity" values="0.6;1;0.6" dur="2s" repeatCount="indefinite" begin="1.25s"/></line>
                        <line x1="27" y1="73" x2="20" y2="80"><animate attributeName="opacity" values="0.6;1;0.6" dur="2s" repeatCount="indefinite" begin="1.5s"/></line>
                        <line x1="80" y1="20" x2="73" y2="27"><animate attributeName="opacity" values="0.6;1;0.6" dur="2s" repeatCount="indefinite" begin="1.75s"/></line>
                    </g>
                </svg>
            `,
            'partly-cloudy': `
                <svg viewBox="0 0 100 100" width="${size}" height="${size}">
                    <defs>
                        <linearGradient id="pcSun${size}" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" style="stop-color:#FFE066"/>
                            <stop offset="100%" style="stop-color:#FFB800"/>
                        </linearGradient>
                    </defs>
                    <circle cx="70" cy="30" r="20" fill="url(#pcSun${size})"/>
                    <g>
                        <ellipse cx="45" cy="62" rx="38" ry="24" fill="#e8e8e8">
                            <animate attributeName="cx" values="45;47;45" dur="4s" repeatCount="indefinite"/>
                        </ellipse>
                        <ellipse cx="22" cy="68" rx="20" ry="16" fill="#f2f2f2"/>
                        <ellipse cx="62" cy="65" rx="24" ry="19" fill="#fff"/>
                    </g>
                </svg>
            `,
            'cloudy': `
                <svg viewBox="0 0 100 100" width="${size}" height="${size}">
                    <g>
                        <ellipse cx="50" cy="55" rx="40" ry="26" fill="#c8c8c8">
                            <animate attributeName="cx" values="50;52;50" dur="5s" repeatCount="indefinite"/>
                        </ellipse>
                        <ellipse cx="28" cy="62" rx="24" ry="20" fill="#d8d8d8"/>
                        <ellipse cx="70" cy="58" rx="26" ry="22" fill="#e0e0e0"/>
                        <ellipse cx="50" cy="48" rx="30" ry="20" fill="#e8e8e8"/>
                    </g>
                </svg>
            `,
            'fog': `
                <svg viewBox="0 0 100 100" width="${size}" height="${size}">
                    <g opacity="0.9">
                        <line x1="15" y1="30" x2="85" y2="30" stroke="#d0d0d0" stroke-width="8" stroke-linecap="round">
                            <animate attributeName="x1" values="15;20;15" dur="3s" repeatCount="indefinite"/>
                        </line>
                        <line x1="20" y1="48" x2="80" y2="48" stroke="#e0e0e0" stroke-width="8" stroke-linecap="round">
                            <animate attributeName="x2" values="80;75;80" dur="4s" repeatCount="indefinite"/>
                        </line>
                        <line x1="15" y1="66" x2="85" y2="66" stroke="#d0d0d0" stroke-width="8" stroke-linecap="round">
                            <animate attributeName="x1" values="15;18;15" dur="3.5s" repeatCount="indefinite"/>
                        </line>
                        <line x1="25" y1="84" x2="75" y2="84" stroke="#e0e0e0" stroke-width="6" stroke-linecap="round"/>
                    </g>
                </svg>
            `,
            'drizzle': `
                <svg viewBox="0 0 100 100" width="${size}" height="${size}">
                    <ellipse cx="50" cy="35" rx="38" ry="24" fill="#a0a0a0"/>
                    <ellipse cx="25" cy="42" rx="20" ry="17" fill="#b0b0b0"/>
                    <ellipse cx="72" cy="38" rx="24" ry="19" fill="#b8b8b8"/>
                    <g fill="#64b5f6" opacity="0.8">
                        <circle cx="30" cy="65" r="3"><animate attributeName="cy" values="60;85;60" dur="1.5s" repeatCount="indefinite"/><animate attributeName="opacity" values="0;1;0" dur="1.5s" repeatCount="indefinite"/></circle>
                        <circle cx="50" cy="70" r="3"><animate attributeName="cy" values="65;90;65" dur="1.5s" repeatCount="indefinite" begin="0.3s"/><animate attributeName="opacity" values="0;1;0" dur="1.5s" repeatCount="indefinite" begin="0.3s"/></circle>
                        <circle cx="70" cy="65" r="3"><animate attributeName="cy" values="60;85;60" dur="1.5s" repeatCount="indefinite" begin="0.6s"/><animate attributeName="opacity" values="0;1;0" dur="1.5s" repeatCount="indefinite" begin="0.6s"/></circle>
                    </g>
                </svg>
            `,
            'rain': `
                <svg viewBox="0 0 100 100" width="${size}" height="${size}">
                    <ellipse cx="50" cy="32" rx="40" ry="25" fill="#707070"/>
                    <ellipse cx="25" cy="40" rx="22" ry="18" fill="#808080"/>
                    <ellipse cx="72" cy="36" rx="26" ry="20" fill="#888888"/>
                    <g stroke="#42a5f5" stroke-width="3" stroke-linecap="round">
                        <line x1="25" y1="58" x2="20" y2="78"><animate attributeName="y1" values="58;62;58" dur="0.8s" repeatCount="indefinite"/><animate attributeName="y2" values="78;85;78" dur="0.8s" repeatCount="indefinite"/></line>
                        <line x1="42" y1="62" x2="37" y2="82"><animate attributeName="y1" values="62;66;62" dur="0.8s" repeatCount="indefinite" begin="0.2s"/><animate attributeName="y2" values="82;89;82" dur="0.8s" repeatCount="indefinite" begin="0.2s"/></line>
                        <line x1="58" y1="58" x2="53" y2="78"><animate attributeName="y1" values="58;62;58" dur="0.8s" repeatCount="indefinite" begin="0.4s"/><animate attributeName="y2" values="78;85;78" dur="0.8s" repeatCount="indefinite" begin="0.4s"/></line>
                        <line x1="75" y1="62" x2="70" y2="82"><animate attributeName="y1" values="62;66;62" dur="0.8s" repeatCount="indefinite" begin="0.6s"/><animate attributeName="y2" values="82;89;82" dur="0.8s" repeatCount="indefinite" begin="0.6s"/></line>
                    </g>
                </svg>
            `,
            'heavy-rain': `
                <svg viewBox="0 0 100 100" width="${size}" height="${size}">
                    <ellipse cx="50" cy="28" rx="42" ry="24" fill="#505050"/>
                    <ellipse cx="22" cy="36" rx="22" ry="18" fill="#606060"/>
                    <ellipse cx="76" cy="32" rx="26" ry="20" fill="#585858"/>
                    <g stroke="#2196f3" stroke-width="4" stroke-linecap="round">
                        <line x1="18" y1="52" x2="10" y2="82"><animate attributeName="y1" values="52;58;52" dur="0.6s" repeatCount="indefinite"/></line>
                        <line x1="35" y1="55" x2="27" y2="85"><animate attributeName="y1" values="55;61;55" dur="0.6s" repeatCount="indefinite" begin="0.15s"/></line>
                        <line x1="52" y1="52" x2="44" y2="82"><animate attributeName="y1" values="52;58;52" dur="0.6s" repeatCount="indefinite" begin="0.3s"/></line>
                        <line x1="68" y1="55" x2="60" y2="85"><animate attributeName="y1" values="55;61;55" dur="0.6s" repeatCount="indefinite" begin="0.45s"/></line>
                        <line x1="85" y1="52" x2="77" y2="82"><animate attributeName="y1" values="52;58;52" dur="0.6s" repeatCount="indefinite" begin="0.6s"/></line>
                    </g>
                </svg>
            `,
            'snow': `
                <svg viewBox="0 0 100 100" width="${size}" height="${size}">
                    <ellipse cx="50" cy="32" rx="40" ry="25" fill="#a8a8a8"/>
                    <ellipse cx="25" cy="40" rx="22" ry="18" fill="#b8b8b8"/>
                    <ellipse cx="72" cy="36" rx="26" ry="20" fill="#c0c0c0"/>
                    <g fill="white">
                        <circle cx="28" cy="65" r="5"><animate attributeName="cy" values="60;85;60" dur="3s" repeatCount="indefinite"/><animate attributeName="opacity" values="0;1;0" dur="3s" repeatCount="indefinite"/></circle>
                        <circle cx="50" cy="72" r="6"><animate attributeName="cy" values="65;90;65" dur="3s" repeatCount="indefinite" begin="0.5s"/><animate attributeName="opacity" values="0;1;0" dur="3s" repeatCount="indefinite" begin="0.5s"/></circle>
                        <circle cx="72" cy="68" r="5"><animate attributeName="cy" values="62;87;62" dur="3s" repeatCount="indefinite" begin="1s"/><animate attributeName="opacity" values="0;1;0" dur="3s" repeatCount="indefinite" begin="1s"/></circle>
                        <circle cx="38" cy="82" r="4"><animate attributeName="cy" values="75;95;75" dur="3s" repeatCount="indefinite" begin="1.5s"/><animate attributeName="opacity" values="0;1;0" dur="3s" repeatCount="indefinite" begin="1.5s"/></circle>
                        <circle cx="62" cy="85" r="5"><animate attributeName="cy" values="78;98;78" dur="3s" repeatCount="indefinite" begin="2s"/><animate attributeName="opacity" values="0;1;0" dur="3s" repeatCount="indefinite" begin="2s"/></circle>
                    </g>
                </svg>
            `,
            'heavy-snow': `
                <svg viewBox="0 0 100 100" width="${size}" height="${size}">
                    <ellipse cx="50" cy="28" rx="42" ry="24" fill="#888888"/>
                    <ellipse cx="22" cy="36" rx="22" ry="18" fill="#989898"/>
                    <ellipse cx="76" cy="32" rx="26" ry="20" fill="#a0a0a0"/>
                    <g fill="white">
                        <circle cx="18" cy="58" r="6"><animate attributeName="cy" values="55;90;55" dur="2.5s" repeatCount="indefinite"/></circle>
                        <circle cx="38" cy="65" r="7"><animate attributeName="cy" values="60;95;60" dur="2.5s" repeatCount="indefinite" begin="0.3s"/></circle>
                        <circle cx="58" cy="60" r="6"><animate attributeName="cy" values="55;90;55" dur="2.5s" repeatCount="indefinite" begin="0.6s"/></circle>
                        <circle cx="78" cy="68" r="6"><animate attributeName="cy" values="62;97;62" dur="2.5s" repeatCount="indefinite" begin="0.9s"/></circle>
                        <circle cx="28" cy="80" r="5"><animate attributeName="cy" values="72;100;72" dur="2.5s" repeatCount="indefinite" begin="1.2s"/></circle>
                        <circle cx="50" cy="85" r="6"><animate attributeName="cy" values="78;100;78" dur="2.5s" repeatCount="indefinite" begin="1.5s"/></circle>
                        <circle cx="68" cy="82" r="5"><animate attributeName="cy" values="75;100;75" dur="2.5s" repeatCount="indefinite" begin="1.8s"/></circle>
                    </g>
                </svg>
            `,
            'thunderstorm': `
                <svg viewBox="0 0 100 100" width="${size}" height="${size}">
                    <ellipse cx="50" cy="25" rx="44" ry="22" fill="#404040"/>
                    <ellipse cx="20" cy="32" rx="24" ry="18" fill="#505050"/>
                    <ellipse cx="78" cy="28" rx="26" ry="18" fill="#484848"/>
                    <polygon points="55,45 42,68 52,68 38,95 62,62 50,62 64,45" fill="#FFD93D">
                        <animate attributeName="opacity" values="1;0.3;1" dur="0.5s" repeatCount="indefinite"/>
                    </polygon>
                    <g stroke="#42a5f5" stroke-width="3" stroke-linecap="round" opacity="0.7">
                        <line x1="22" y1="52" x2="17" y2="72"/>
                        <line x1="78" y1="52" x2="73" y2="72"/>
                    </g>
                </svg>
            `
        };

        return icons[type] || icons['sun'];
    }

    setupAutoRefresh() {
        // Refresh weather every 15 minutes
        setInterval(() => {
            this.fetchWeather();
        }, 15 * 60 * 1000);
    }
}

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    new WeatherApp();
});

// Add some CSS for search loading/empty states
const style = document.createElement('style');
style.textContent = `
    .search-loading, .search-empty, .search-error {
        text-align: center;
        padding: 30px;
        color: rgba(255, 255, 255, 0.6);
        font-size: 14px;
    }
    .refreshing svg {
        animation: spin 1s linear infinite;
    }
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style);
