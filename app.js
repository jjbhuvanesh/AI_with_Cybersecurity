class PresentationController {
    constructor() {
        this.currentSlide = 1;
        this.totalSlides = 50;
        this.slides = document.querySelectorAll('.slide');
        this.prevBtn = document.getElementById('prev-btn');
        this.nextBtn = document.getElementById('next-btn');
        this.currentSlideSpan = document.getElementById('current-slide');
        this.totalSlidesSpan = document.getElementById('total-slides');
        this.progressFill = document.getElementById('progress-fill');
        
        this.init();
    }
    
    init() {
        // Set initial values
        this.currentSlideSpan.textContent = this.currentSlide;
        this.totalSlidesSpan.textContent = this.totalSlides;
        this.updateProgressBar();
        this.updateNavigationButtons();
        
        // Add event listeners with proper event handling
        this.prevBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.previousSlide();
        });
        
        this.nextBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.nextSlide();
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
        
        // Touch/swipe support for mobile
        this.setupTouchNavigation();
        
        // Click navigation on slides (optional)
        this.setupClickNavigation();
        
        // Ensure links work properly
        this.setupLinkHandling();
        
        console.log('AI with Cybersecurity Presentation initialized with', this.totalSlides, 'slides');
    }
    
    setupLinkHandling() {
        // Fix for LinkedIn and other external links
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[href]');
            if (link && link.href) {
                // Stop propagation to prevent slide navigation
                e.stopPropagation();
                
                // Handle external links
                if (link.href.startsWith('http') && !link.href.includes(window.location.hostname)) {
                    e.preventDefault();
                    window.open(link.href, '_blank', 'noopener,noreferrer');
                    console.log('🔗 External link opened:', link.href);
                }
            }
        });
    }
    
    setupTouchNavigation() {
        let touchStartX = 0;
        let touchEndX = 0;
        let touchStartY = 0;
        let touchEndY = 0;
        const minSwipeDistance = 50;
        
        document.addEventListener('touchstart', (e) => {
            // Don't capture touches on interactive elements
            if (e.target.closest('a') || e.target.closest('button') || e.target.closest('.navigation')) {
                return;
            }
            
            touchStartX = e.changedTouches[0].screenX;
            touchStartY = e.changedTouches[0].screenY;
        }, { passive: true });
        
        document.addEventListener('touchend', (e) => {
            // Don't capture touches on interactive elements
            if (e.target.closest('a') || e.target.closest('button') || e.target.closest('.navigation')) {
                return;
            }
            
            touchEndX = e.changedTouches[0].screenX;
            touchEndY = e.changedTouches[0].screenY;
            
            const deltaX = touchEndX - touchStartX;
            const deltaY = touchEndY - touchStartY;
            
            // Only process horizontal swipes (ignore vertical scrolling)
            if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipeDistance) {
                if (deltaX > 0) {
                    // Swipe right - go to previous slide
                    this.previousSlide();
                } else {
                    // Swipe left - go to next slide
                    this.nextSlide();
                }
            }
        }, { passive: true });
    }
    
    setupClickNavigation() {
        // Click navigation with proper exclusion of interactive elements
        document.addEventListener('click', (e) => {
            // Exclude navigation controls, links, and buttons from click navigation
            if (e.target.closest('.navigation') || 
                e.target.closest('a') || 
                e.target.closest('button') ||
                e.target.closest('[href]')) {
                return; // Let the link/button handle the click normally
            }
            
            const windowWidth = window.innerWidth;
            const clickX = e.clientX;
            
            // Click on right half advances, left half goes back
            if (clickX > windowWidth / 2) {
                this.nextSlide();
            } else {
                this.previousSlide();
            }
        });
    }
    
    handleKeyPress(e) {
        // Don't interfere with form elements
        const activeElement = document.activeElement;
        const isFormElement = activeElement && (
            activeElement.tagName === 'INPUT' ||
            activeElement.tagName === 'TEXTAREA' ||
            activeElement.tagName === 'SELECT' ||
            activeElement.contentEditable === 'true'
        );
        
        if (isFormElement) {
            return;
        }
        
        switch(e.key) {
            case 'ArrowLeft':
            case 'ArrowUp':
                e.preventDefault();
                this.previousSlide();
                break;
            case 'ArrowRight':
            case 'ArrowDown':
            case ' ': // Space bar
                e.preventDefault();
                this.nextSlide();
                break;
            case 'Home':
                e.preventDefault();
                this.goToSlide(1);
                break;
            case 'End':
                e.preventDefault();
                this.goToSlide(this.totalSlides);
                break;
            case 'f':
            case 'F':
                e.preventDefault();
                this.toggleFullscreen();
                break;
            case 'Escape':
                e.preventDefault();
                if (document.fullscreenElement) {
                    document.exitFullscreen();
                }
                break;
            // Quick navigation shortcuts
            case '1':
                e.preventDefault();
                this.goToSlide(1); // Title
                break;
            case '2':
                e.preventDefault();
                this.goToSlide(2); // About Speaker
                break;
            case '3':
                e.preventDefault();
                this.goToSlide(3); // Agenda
                break;
            case '4':
                e.preventDefault();
                this.goToSlide(48); // Women's Safety
                break;
            case '5':
                e.preventDefault();
                this.goToSlide(50); // Thank You
                break;
        }
    }
    
    nextSlide() {
        if (this.currentSlide < this.totalSlides) {
            this.goToSlide(this.currentSlide + 1);
        }
        console.log('Next slide requested, current:', this.currentSlide);
    }
    
    previousSlide() {
        if (this.currentSlide > 1) {
            this.goToSlide(this.currentSlide - 1);
        }
        console.log('Previous slide requested, current:', this.currentSlide);
    }
    
    goToSlide(slideNumber) {
        console.log(`Attempting to go to slide ${slideNumber} from ${this.currentSlide}`);
        
        if (slideNumber < 1 || slideNumber > this.totalSlides || slideNumber === this.currentSlide) {
            console.log('Invalid slide number or already on slide:', slideNumber);
            return;
        }
        
        // Remove active class from current slide
        const currentSlideElement = document.getElementById(`slide-${this.currentSlide}`);
        if (currentSlideElement) {
            currentSlideElement.classList.remove('active');
        }
        
        // Update current slide number
        this.currentSlide = slideNumber;
        
        // Add active class to new slide
        const newSlideElement = document.getElementById(`slide-${this.currentSlide}`);
        if (newSlideElement) {
            newSlideElement.classList.add('active');
            console.log('Successfully activated slide:', this.currentSlide);
        } else {
            console.error('Could not find slide element:', `slide-${this.currentSlide}`);
        }
        
        // Update UI elements
        this.currentSlideSpan.textContent = this.currentSlide;
        this.updateProgressBar();
        this.updateNavigationButtons();
        
        // Scroll to top of the slide content for better UX
        const slideContent = newSlideElement?.querySelector('.slide-content');
        if (slideContent) {
            slideContent.scrollTop = 0;
        }
        
        // Log current slide for debugging
        this.logCurrentSlideInfo();
        
        // Announce slide change for accessibility
        this.announceSlideChange();
    }
    
    updateProgressBar() {
        const progress = (this.currentSlide / this.totalSlides) * 100;
        this.progressFill.style.width = `${progress}%`;
    }
    
    updateNavigationButtons() {
        // Update previous button
        this.prevBtn.disabled = this.currentSlide === 1;
        
        // Update next button  
        this.nextBtn.disabled = this.currentSlide === this.totalSlides;
        
        // Update button text for better UX
        if (this.currentSlide === this.totalSlides) {
            this.nextBtn.textContent = 'End';
        } else {
            this.nextBtn.textContent = 'Next ›';
        }
        
        if (this.currentSlide === 1) {
            this.prevBtn.textContent = '‹ Start';
        } else {
            this.prevBtn.textContent = '‹ Previous';
        }
        
        console.log('Navigation buttons updated for slide:', this.currentSlide);
    }
    
    logCurrentSlideInfo() {
        const slideElement = document.getElementById(`slide-${this.currentSlide}`);
        const slideTitle = slideElement?.querySelector('h1')?.textContent || 'Unknown';
        console.log(`📍 Slide ${this.currentSlide}/${this.totalSlides}: "${slideTitle}"`);
        
        // Special logging for key slides
        if (this.currentSlide === 48) {
            console.log('🚺 Important: Cybersecurity Awareness for Indian Women - Safety information displayed');
            console.log('📞 Emergency numbers: 1930 (Cyber Crime), 112 (Police), 181 (Women\'s Helpline)');
        }
        if (this.currentSlide === 21 || this.currentSlide === 22 || this.currentSlide === 23) {
            console.log('⚠️ Real-world cyber attack case study - Learning from recent incidents');
        }
    }
    
    announceSlideChange() {
        const announcer = document.getElementById('slide-announcer');
        if (announcer) {
            const slideElement = document.getElementById(`slide-${this.currentSlide}`);
            const slideTitle = slideElement?.querySelector('h1')?.textContent || 'Unknown';
            announcer.textContent = `Slide ${this.currentSlide} of ${this.totalSlides}: ${slideTitle}`;
        }
    }
    
    toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.log('Fullscreen not supported or denied:', err);
            });
        } else {
            document.exitFullscreen().catch(err => {
                console.log('Exit fullscreen failed:', err);
            });
        }
    }
    
    // Public API methods for external control
    getCurrentSlide() {
        return this.currentSlide;
    }
    
    getTotalSlides() {
        return this.totalSlides;
    }
    
    jumpToSlide(slideNumber) {
        this.goToSlide(slideNumber);
    }
    
    // Presentation control methods
    startPresentation() {
        this.goToSlide(1);
        console.log('🎯 AI with Cybersecurity presentation started!');
        console.log('👨‍💻 Presenter: Bhuvanesh Jeyaprakash - Cloud Security Specialist at Oracle');
    }
    
    endPresentation() {
        this.goToSlide(this.totalSlides);
        console.log('🏁 Reached end of presentation - Thank you for attending!');
        console.log('🔗 Connect with Bhuvanesh on LinkedIn: linkedin.com/in/bhuvanesh-j-');
    }
    
    getSlideProgress() {
        return {
            current: this.currentSlide,
            total: this.totalSlides,
            percentage: Math.round((this.currentSlide / this.totalSlides) * 100)
        };
    }
    
    // Navigation to specific sections
    goToWomensSafety() {
        this.goToSlide(48);
        console.log('🚺 Navigated to Women\'s Cybersecurity Safety section');
    }
    
    goToCaseStudies() {
        this.goToSlide(20);
        console.log('📚 Navigated to recent cyber attack case studies');
    }
    
    goToCareerGuidance() {
        this.goToSlide(34);
        console.log('💼 Navigated to cybersecurity career guidance section');
    }
}

// Utility functions for enhanced presentation experience
class PresentationUtils {
    static addSlideAnimations() {
        // Enhanced slide transition animations
        const style = document.createElement('style');
        style.textContent = `
            .slide.active .slide-content > * {
                animation: slideContentFadeIn 0.6s ease forwards;
            }
            
            @keyframes slideContentFadeIn {
                from {
                    opacity: 0;
                    transform: translateY(20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            .slide.active .stat-card,
            .slide.active .agenda-item,
            .slide.active .trend-item,
            .slide.active .spec-item,
            .slide.active .helpline-item {
                animation: cardSlideUp 0.8s ease forwards;
                animation-delay: calc(var(--animation-delay, 0) * 0.1s);
            }
            
            @keyframes cardSlideUp {
                from {
                    opacity: 0;
                    transform: translateY(30px) scale(0.95);
                }
                to {
                    opacity: 1;
                    transform: translateY(0) scale(1);
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    static logKeyboardShortcuts() {
        console.log(`
🎯 AI with Cybersecurity Presentation Controls:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
NAVIGATION:
• Arrow Keys (←/→/↑/↓): Navigate slides
• Spacebar: Next slide  
• Click: Right half = Next, Left half = Previous
• Home: Jump to first slide (Title)
• End: Jump to last slide (Thank You)

PRESENTATION:
• F: Toggle fullscreen mode
• ESC: Exit fullscreen

QUICK ACCESS:
• 1: Title slide
• 2: About Speaker
• 3: Agenda
• 4: Women's Safety (Slide 48)
• 5: Thank You & Contact

MOBILE:
• Swipe left/right to navigate
• Touch navigation supported

PRESENTER: Bhuvanesh Jeyaprakash
ROLE: Cloud Security Specialist at Oracle Corporation
EXPERIENCE: 5 Years in Cybersecurity
LINKEDIN: linkedin.com/in/bhuvanesh-j-
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        `);
    }
    
    static addVisualFeedback() {
        // Add visual feedback for better user experience
        const style = document.createElement('style');
        style.textContent = `
            .nav-btn {
                position: relative;
                overflow: hidden;
            }
            
            .nav-btn:active {
                transform: scale(0.98);
            }
            
            .slide {
                cursor: default;
            }
            
            .slide:hover .slide-content {
                transform: translateY(-1px);
            }
            
            /* Ensure links and buttons are clickable */
            .final-linkedin,
            a[href],
            button {
                position: relative;
                z-index: 10;
                pointer-events: auto;
            }
            
            /* Presentation mode indicators */
            .presentation-mode-indicator {
                position: fixed;
                top: var(--space-16);
                right: var(--space-16);
                background: var(--color-surface);
                padding: var(--space-8) var(--space-12);
                border-radius: var(--radius-base);
                font-size: var(--font-size-sm);
                color: var(--color-text-secondary);
                border: 1px solid var(--color-border);
                z-index: 999;
                opacity: 0.7;
                transition: opacity var(--duration-fast);
            }
            
            .presentation-mode-indicator:hover {
                opacity: 1;
            }
            
            /* Special styling for women's safety slide */
            #slide-48 .women-safety {
                border: 2px solid var(--color-error);
                border-radius: var(--radius-lg);
                padding: var(--space-20);
                background: var(--color-bg-4);
            }
            
            /* Highlight important helpline numbers */
            .helpline-item strong {
                font-size: var(--font-size-2xl);
                display: block;
                margin: var(--space-8) 0;
                color: var(--color-error);
                font-weight: var(--font-weight-bold);
            }
        `;
        document.head.appendChild(style);
        
        // Add presentation mode indicator
        const indicator = document.createElement('div');
        indicator.className = 'presentation-mode-indicator';
        indicator.textContent = 'Press F for fullscreen • AI + Cybersecurity';
        document.body.appendChild(indicator);
        
        // Hide indicator in fullscreen
        document.addEventListener('fullscreenchange', () => {
            if (document.fullscreenElement) {
                indicator.style.display = 'none';
            } else {
                indicator.style.display = 'block';
            }
        });
    }
    
    static trackPresentationAnalytics() {
        // Simple analytics for presentation usage
        const analytics = {
            startTime: Date.now(),
            slideVisits: {},
            totalSlideSwitches: 0,
            specialSlideVisits: {
                womensSafety: 0,
                caseStudies: 0,
                careerGuidance: 0
            }
        };
        
        // Track slide visits
        const originalGoToSlide = window.presentation?.goToSlide;
        if (originalGoToSlide) {
            window.presentation.goToSlide = function(slideNumber) {
                analytics.slideVisits[slideNumber] = (analytics.slideVisits[slideNumber] || 0) + 1;
                analytics.totalSlideSwitches++;
                analytics.lastSlideTime = Date.now();
                
                // Track special slides
                if (slideNumber === 48) {
                    analytics.specialSlideVisits.womensSafety++;
                }
                if (slideNumber >= 20 && slideNumber <= 23) {
                    analytics.specialSlideVisits.caseStudies++;
                }
                if (slideNumber >= 34 && slideNumber <= 41) {
                    analytics.specialSlideVisits.careerGuidance++;
                }
                
                return originalGoToSlide.call(this, slideNumber);
            };
        }
        
        // Log analytics on page unload
        window.addEventListener('beforeunload', () => {
            const duration = Date.now() - analytics.startTime;
            console.log('📊 Presentation Analytics:', {
                duration: Math.round(duration / 1000) + 's',
                totalSlideSwitches: analytics.totalSlideSwitches,
                averageSlideTime: Math.round(duration / analytics.totalSlideSwitches / 1000) + 's',
                specialSlideVisits: analytics.specialSlideVisits,
                mostVisitedSlides: Object.entries(analytics.slideVisits)
                    .sort(([,a], [,b]) => b - a)
                    .slice(0, 5)
                    .map(([slide, visits]) => `Slide ${slide}: ${visits} visits`)
            });
        });
        
        return analytics;
    }
    
    static addAccessibilityFeatures() {
        // Add ARIA labels and keyboard navigation announcements
        document.addEventListener('DOMContentLoaded', () => {
            const slides = document.querySelectorAll('.slide');
            slides.forEach((slide, index) => {
                slide.setAttribute('aria-label', `Slide ${index + 1} of 50`);
                slide.setAttribute('role', 'img');
            });
            
            // Add screen reader announcements
            const srAnnouncer = document.createElement('div');
            srAnnouncer.className = 'sr-only';
            srAnnouncer.setAttribute('aria-live', 'polite');
            srAnnouncer.id = 'slide-announcer';
            document.body.appendChild(srAnnouncer);
            
            // Add skip to content link for screen readers
            const skipLink = document.createElement('a');
            skipLink.href = '#slide-1';
            skipLink.className = 'sr-only';
            skipLink.textContent = 'Skip to presentation content';
            document.body.insertBefore(skipLink, document.body.firstChild);
        });
    }
    
    static ensureLinkFunctionality() {
        // Ensure all links work properly without interference from slide navigation
        document.addEventListener('DOMContentLoaded', () => {
            const links = document.querySelectorAll('a[href]');
            console.log('Found', links.length, 'links to process');
            
            links.forEach((link, index) => {
                console.log(`Processing link ${index + 1}:`, link.href);
                
                // Ensure LinkedIn and other external links work properly
                if (link.href.startsWith('http')) {
                    link.target = '_blank';
                    link.rel = 'noopener noreferrer';
                    console.log('Set external link to open in new tab:', link.href);
                }
                
                link.addEventListener('click', (e) => {
                    console.log('Link clicked:', link.href);
                    
                    // Stop event propagation to prevent slide navigation
                    e.stopPropagation();
                    
                    // Log LinkedIn clicks specifically
                    if (link.href.includes('linkedin.com/in/bhuvanesh-j-')) {
                        console.log('🔗 LinkedIn profile clicked - Connecting with Bhuvanesh Jeyaprakash');
                    }
                }, true); // Use capture phase
            });
        });
    }
    
    static addCybersecurityElements() {
        // Add special effects for cybersecurity content
        document.addEventListener('DOMContentLoaded', () => {
            // Add animation delays to cards for staggered appearance
            const cardElements = document.querySelectorAll('.stat-card, .agenda-item, .spec-item, .helpline-item');
            cardElements.forEach((card, index) => {
                card.style.setProperty('--animation-delay', index % 4);
            });
            
            // Add special styling for attack-related content
            const attackCards = document.querySelectorAll('.attack-card, .risk-item, .threat-item');
            attackCards.forEach(card => {
                card.addEventListener('mouseenter', () => {
                    card.style.borderColor = 'var(--color-error)';
                });
                card.addEventListener('mouseleave', () => {
                    card.style.borderColor = 'var(--color-card-border)';
                });
            });
            
            // Add pulse effect to important helpline numbers
            const helplineNumbers = document.querySelectorAll('.helpline-item strong');
            helplineNumbers.forEach(number => {
                number.style.animation = 'pulse 2s infinite';
            });
            
            // Add pulse animation
            const pulseStyle = document.createElement('style');
            pulseStyle.textContent = `
                @keyframes pulse {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.05); }
                    100% { transform: scale(1); }
                }
                
                .helpline-item {
                    border: 2px solid var(--color-error);
                    background: var(--color-bg-4);
                }
                
                .helpline-item strong {
                    color: var(--color-error) !important;
                    font-weight: 700 !important;
                }
            `;
            document.head.appendChild(pulseStyle);
        });
    }
}

// Presentation sections for easy navigation
const PRESENTATION_SECTIONS = {
    TITLE: 1,
    SPEAKER: 2,
    AGENDA: 3,
    WHAT_IS_CYBERSEC: 4,
    CIA_TRIAD: 5,
    WHY_MATTERS: 6,
    MITRE_ATTACK: 7,
    DEFENSE_DEPTH: 8,
    ATTACK_METHODS: 9,
    CLOUD_FUNDAMENTALS: 10,
    SHARED_RESPONSIBILITY: 11,
    CLOUD_THREATS: 12,
    CLOUD_BEST_PRACTICES: 13,
    AI_SECURITY: 14,
    AI_THREATS: 15,
    ADVERSARIAL_ATTACKS: 16,
    DATA_POISONING: 17,
    PROMPT_INJECTION: 18,
    AI_PRIVACY: 19,
    RECENT_ATTACKS: 20,
    SEPAH_BANK: 21,
    UNFI_ATTACK: 22,
    PERFCTL_MALWARE: 23,
    NETWORK_MONITORING: 24,
    INCIDENT_RESPONSE: 25,
    DIGITAL_FORENSICS: 26,
    PENETRATION_TESTING: 27,
    VULNERABILITY_MGMT: 28,
    ACCESS_CONTROL: 29,
    CRYPTOGRAPHY: 30,
    SECURITY_GOVERNANCE: 31,
    IOT_SECURITY: 32,
    MOBILE_SECURITY: 33,
    CAREER_PATHS: 34,
    ENTRY_LEVEL: 35,
    MID_LEVEL: 36,
    SENIOR_LEVEL: 37,
    CERTIFICATIONS: 38,
    SKILLS_NEEDED: 39,
    CAREER_GROWTH: 40,
    SALARY_EXPECTATIONS: 41,
    GETTING_STARTED: 42,
    LEARNING_RESOURCES: 43,
    HANDS_ON_LABS: 44,
    PORTFOLIO: 45,
    NETWORKING: 46,
    INDUSTRY_TRENDS: 47,
    WOMENS_SAFETY: 48,
    QA_SESSION: 49,
    THANK_YOU: 50
};

// Initialize the presentation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Initializing AI with Cybersecurity Professional Presentation...');
    console.log('👨‍💻 Presenter: Bhuvanesh Jeyaprakash');
    console.log('🏢 Cloud Security Specialist at Oracle Corporation');
    console.log('📅 5 Years Experience in Cybersecurity');
    console.log('🔗 LinkedIn: linkedin.com/in/bhuvanesh-j-/');
    
    // Initialize the main presentation controller
    const presentation = new PresentationController();
    
    // Add enhanced features
    PresentationUtils.logKeyboardShortcuts();
    PresentationUtils.addSlideAnimations();
    PresentationUtils.addVisualFeedback();
    PresentationUtils.addAccessibilityFeatures();
    PresentationUtils.ensureLinkFunctionality();
    PresentationUtils.addCybersecurityElements();
    
    // Track analytics
    const analytics = PresentationUtils.trackPresentationAnalytics();
    
    // Make presentation controller globally accessible
    window.presentation = presentation;
    window.PRESENTATION_SECTIONS = PRESENTATION_SECTIONS;
    window.presentationAnalytics = analytics;
    
    // Helper functions for quick navigation
    window.goToSection = (sectionName) => {
        const slideNumber = PRESENTATION_SECTIONS[sectionName.toUpperCase()];
        if (slideNumber) {
            presentation.goToSlide(slideNumber);
        } else {
            console.log('Available sections:', Object.keys(PRESENTATION_SECTIONS));
        }
    };
    
    // Test navigation functionality immediately
    setTimeout(() => {
        console.log('🔧 Testing navigation functionality...');
        const nextBtn = document.getElementById('next-btn');
        const prevBtn = document.getElementById('prev-btn');
        
        if (nextBtn && prevBtn) {
            console.log('✅ Navigation buttons found');
            console.log('Next button enabled:', !nextBtn.disabled);
            console.log('Previous button enabled:', !prevBtn.disabled);
        } else {
            console.error('❌ Navigation buttons not found');
        }
        
        // Test slide elements
        for (let i = 1; i <= 5; i++) {
            const slide = document.getElementById(`slide-${i}`);
            if (slide) {
                console.log(`✅ Slide ${i} found:`, slide.querySelector('h1')?.textContent || 'No title');
            } else {
                console.error(`❌ Slide ${i} not found`);
            }
        }
        
        // Special check for women's safety slide
        const womensSafetySlide = document.getElementById('slide-48');
        if (womensSafetySlide) {
            const helplineItems = womensSafetySlide.querySelectorAll('.helpline-item');
            console.log('🚺 Women\'s Safety slide found with', helplineItems.length, 'helpline items');
        }
    }, 100);
    
    // Smooth fade-in effect
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
        console.log('✅ Presentation ready!');
        console.log('🎯 Navigate using buttons, keyboard controls, or clicks');
        console.log('📋 Type goToSection("WOMENS_SAFETY") to jump to specific sections');
        
        // Welcome message
        console.log(`
🎓 Welcome to AI with Cybersecurity Seminar!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📚 COMPREHENSIVE 50-SLIDE PRESENTATION COVERING:
• Cybersecurity fundamentals (CIA Triad, MITRE ATT&CK)
• Cloud security best practices and shared responsibility
• AI security threats and protection strategies
• Real-world attack case studies (Sepah Bank, UNFI, perfctl)
• Complete career guidance with salary information
• Essential certifications roadmap (Free (ISC)² CC to CISSP)
• Hands-on learning resources and portfolio building
• 🚺 Special focus: Cybersecurity awareness for Indian women

👨‍💻 PRESENTED BY: Bhuvanesh Jeyaprakash
🏢 ROLE: Cloud Security Specialist at Oracle Corporation
⏱️ EXPERIENCE: 5 Years in Cybersecurity
🔗 CONNECT: linkedin.com/in/bhuvanesh-j-/

🎯 ENHANCED WITH:
• Fixed navigation - Next button now works from slide 1
• Fixed LinkedIn links - Now properly open in new tabs
• Interactive navigation and keyboard shortcuts  
• Mobile-friendly swipe controls
• Real-time analytics tracking
• Accessibility features
• Special women's safety awareness (Slide 48)
• Emergency helplines: 1930 (Cyber Crime), 112 (Police), 181 (Women)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        `);
    }, 200);
    
    // Add resize handler for responsive adjustments
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            presentation.updateProgressBar();
            presentation.updateNavigationButtons();
        }, 250);
    });
    
    // Handle visibility changes (tab switching)
    document.addEventListener('visibilitychange', () => {
        if (!document.hidden) {
            presentation.updateProgressBar();
            presentation.updateNavigationButtons();
        }
    });
    
    // Add error handling
    window.addEventListener('error', (e) => {
        console.error('Presentation error:', e.error?.message || 'Unknown error');
    });
    
    // Performance monitoring
    if ('performance' in window) {
        window.addEventListener('load', () => {
            const loadTime = performance.now();
            console.log(`📊 Presentation loaded in ${Math.round(loadTime)}ms`);
        });
    }
    
    // Add helpful console commands
    console.log(`
🛠️  Available Console Commands:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• presentation.getCurrentSlide() - Get current slide number
• presentation.jumpToSlide(number) - Go to specific slide
• presentation.goToWomensSafety() - Jump to women's safety slide
• presentation.goToCaseStudies() - Jump to attack case studies
• presentation.goToCareerGuidance() - Jump to career section
• goToSection('WOMENS_SAFETY') - Jump to section by name
• presentation.getSlideProgress() - Get progress info
• presentation.startPresentation() - Go to first slide
• presentation.endPresentation() - Go to last slide

📍 IMPORTANT SLIDES:
• Slide 48: Cybersecurity for Indian Women (Emergency: 1930, 112, 181)
• Slides 20-23: Recent cyber attack case studies
• Slides 34-41: Complete career guidance
• Slides 38-39: Certifications and skills needed

🔧 BUG FIXES APPLIED:
• Fixed Next button navigation from slide 1
• Fixed LinkedIn links to open in new tabs properly
• Enhanced error logging and debugging
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    `);
});

// Export for potential module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { 
        PresentationController, 
        PresentationUtils, 
        PRESENTATION_SECTIONS 
    };
}