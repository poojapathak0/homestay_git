// Enhance form validation and mobile menu functionality
document.addEventListener('DOMContentLoaded', function() {
    // Improved mobile menu functionality
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('nav');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            nav.classList.toggle('active');
            this.classList.toggle('active');
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!event.target.closest('nav') && !event.target.closest('.menu-toggle')) {
                nav.classList.remove('active');
                menuToggle.classList.remove('active');
            }
        });
    }
    
    // Enhanced form validation for contact form
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        // Add input animation effects
        const animatedInputs = document.querySelectorAll('.input-animate');
        
        animatedInputs.forEach(input => {
            // Handle focus events
            input.addEventListener('focus', function() {
                this.parentElement.classList.add('focused');
            });
            
            input.addEventListener('blur', function() {
                if (!this.value) {
                    this.parentElement.classList.remove('focused');
                }
            });
            
            // If input already has a value (e.g. on page reload)
            if (input.value) {
                input.parentElement.classList.add('focused');
            }
        });
        
        // Real-time validation
        const requiredInputs = contactForm.querySelectorAll('[required]');
        
        requiredInputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateInput(this);
            });
            
            input.addEventListener('input', function() {
                if (this.classList.contains('error')) {
                    validateInput(this);
                }
            });
        });
        
        // Validate individual input
        function validateInput(input) {
            if (!input.value.trim()) {
                input.classList.add('error');
                return false;
            } else if (input.type === 'email' && !validateEmail(input.value)) {
                input.classList.add('error');
                return false;
            } else {
                input.classList.remove('error');
                return true;
            }
        }
        
        // Email validation helper
        function validateEmail(email) {
            const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return re.test(email);
        }
        
        // Form submission with enhanced validation
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            let isValid = true;
            
            // Check all required fields
            requiredInputs.forEach(input => {
                if (!validateInput(input)) {
                    isValid = false;
                }
            });
            
            // Check privacy consent
            const privacyConsent = document.getElementById('privacy_consent');
            if (privacyConsent && !privacyConsent.checked) {
                privacyConsent.classList.add('error');
                isValid = false;
            }
            
            if (!isValid) {
                showFormMessage('error', 'Please complete all required fields correctly.');
                return;
            }
            
            // Show loading indicator
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;
            
            // Simulate form submission (replace with actual form submission)
            setTimeout(function() {
                showFormMessage('success', 'Your message has been sent successfully! We will contact you soon.');
                contactForm.reset();
                
                // Reset button
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
                
                // Reset all focused states
                document.querySelectorAll('.form-group.focused').forEach(group => {
                    group.classList.remove('focused');
                });
                
                // Redirect to thank you page after a delay
                setTimeout(function() {
                    window.location.href = 'thank-you.html';
                }, 2000);
            }, 1500);
        });
        
        // Show form message
        function showFormMessage(type, message) {
            const messageEl = contactForm.querySelector('.form-status-message');
            messageEl.textContent = message;
            messageEl.className = 'form-status-message ' + type;
            
            // Scroll to message
            messageEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }
    
    // FAQ Accordion functionality
    const faqItems = document.querySelectorAll('.faq-item');
    
    if (faqItems.length > 0) {
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            
            question.addEventListener('click', () => {
                // Close all other FAQs
                faqItems.forEach(otherItem => {
                    if (otherItem !== item && otherItem.classList.contains('active')) {
                        otherItem.classList.remove('active');
                    }
                });
                
                // Toggle current FAQ
                item.classList.toggle('active');
            });
        });
    }
});