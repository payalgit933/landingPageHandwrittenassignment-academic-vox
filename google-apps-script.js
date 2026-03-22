// Custom JavaScript for IGNOU Assignments Website

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing...');
    
    try {
        // Initialize all functionality
        initSmoothScrolling();
        initScrollAnimations();
        initNavbarScroll();
        initHeroQueryForm();
        console.log('All functions initialized successfully');
    } catch (error) {
        console.error('Error during initialization:', error);
    }
});


// Check for common hosting issues
function checkHostingIssues() {
    console.log('Checking for hosting issues...');
    
    // Check if jQuery is loaded (some hosts load it automatically)
    if (typeof $ !== 'undefined') {
        console.log('jQuery detected:', $.fn.jquery);
    }
    
    // Check if Bootstrap is loaded
    if (typeof bootstrap !== 'undefined') {
        console.log('Bootstrap detected');
    } else {
        console.log('Bootstrap not detected');
    }
    
    // Check for any JavaScript errors
    window.addEventListener('error', function(e) {
        console.error('JavaScript error detected:', e.error);
    });
    
}

// Run hosting check
checkHostingIssues();



// Smooth scrolling for navigation links
function initSmoothScrolling() {
    // Get all navigation links
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                // Calculate offset for fixed navbar
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetSection.offsetTop - navbarHeight;
                
                // Smooth scroll to target
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Scroll animations for elements
function initScrollAnimations() {
    // Create intersection observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    // Add fade-in class to elements and observe them
    const animateElements = document.querySelectorAll('.feature-card, .service-card, .section-title');
    animateElements.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
}

// Navbar scroll effect
function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('navbar-scrolled');
        } else {
            navbar.classList.remove('navbar-scrolled');
        }
    });
}

// Form submission handling
function initContactForm() {
    const contactForm = document.querySelector('form[action*="formspree"]');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const formObject = {};
            
            formData.forEach((value, key) => {
                formObject[key] = value;
            });
            
            // Show loading state
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Sending...';
            submitBtn.disabled = true;
            
            // Simulate form submission (replace with actual Formspree integration)
            setTimeout(() => {
                // Reset button
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                
                // Show success message
                showNotification('Message sent successfully! We\'ll get back to you soon.', 'success');
                
                // Reset form
                this.reset();
            }, 2000);
        });
    }
}

// Notification system
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    notification.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

// Utility function to validate email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Utility function to validate phone number
function isValidPhone(phone) {
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
    return phoneRegex.test(phone);
}

// Add click tracking for analytics (if needed)
function trackClick(element, action) {
    // This function can be used to track user interactions
    // Replace with your analytics code
    console.log(`User clicked ${element} - Action: ${action}`);
}

// Hero Query Form Functionality
function initHeroQueryForm() {
    const queryForm = document.querySelector('.query-form');
    
    if (queryForm) {
        queryForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const name = document.getElementById('name').value;
            const phone = document.getElementById('phone').value;
            const email = document.getElementById('email').value;
            const enrollment = document.getElementById('enrollment').value;
            const requirements = document.getElementById('requirements').value;
            
            // Show loading state
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Sending...';
            submitBtn.disabled = true;
            
            // Prepare data for Google Sheets
            const formData = {
                name: name,
                phone: phone,
                email: email,
                enrollment: enrollment,
                requirements: requirements,
                timestamp: new Date().toLocaleString()
            };
            
            // Send to Google Sheets via Google Apps Script
            const scriptURL = 'https://script.google.com/macros/s/AKfycbyTMkjftzESqt_kte_vmmCjx5Ju0QnIUy1usW9lIsdYb0Kx_ApDxOwIS7NkrtN1P3DI/exec'; // Replace with your Apps Script URL
            
            fetch(scriptURL, {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            })
            .then(() => {
                // Redirect to thank you page
                window.location.href = 'thank-you.html';
            })
            .catch((error) => {
                console.error('Error:', error);
                showNotification('There was an error submitting the form. Please try again.', 'error');
            })
            .finally(() => {
                // Reset button
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            });
        });
    }
}
// Contact Form Functionality
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const name = document.getElementById('contactName').value;
            const email = document.getElementById('contactEmail').value;
            const phone = document.getElementById('contactPhone').value;
            const enrollment = document.getElementById('contactEnrollment').value;
            const message = document.getElementById('contactMessage').value;
            
            // Show loading state
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Sending...';
            submitBtn.disabled = true;
            
            // Prepare data for Google Sheets
            const formData = {
                name: name,
                email: email,
                phone: phone,
                enrollment: enrollment,
                message: message,
                timestamp: new Date().toLocaleString(),
                formType: 'Contact Form'
            };
            
            // Send to Google Sheets via Google Apps Script
            const scriptURL = 'https://script.google.com/macros/s/AKfycbyTMkjftzESqt_kte_vmmCjx5Ju0QnIUy1usW9lIsdYb0Kx_ApDxOwIS7NkrtN1P3DI/exec'; // Replace with your Apps Script URL
            
            fetch(scriptURL, {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            })
            .then(() => {
                // Show success message
                showNotification('Message sent successfully! We\'ll get back to you soon.', 'success');
                
                // Reset form
                this.reset();
            })
            .catch((error) => {
                console.error('Error:', error);
                showNotification('There was an error sending your message. Please try again.', 'error');
            })
            .finally(() => {
                // Reset button
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            });
        });
    }
}

// Initialize contact form when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    initContactForm();
});

// Add some interactive effects
document.addEventListener('DOMContentLoaded', function() {
    
    // Add hover effects to service cards
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Add click tracking to CTA buttons
    const ctaButtons = document.querySelectorAll('.btn[href*="tel"], .btn[href*="wa.me"], .btn[href*="mailto"]');
    ctaButtons.forEach(button => {
        button.addEventListener('click', function() {
            const action = this.href.includes('tel') ? 'phone' : 
                          this.href.includes('wa.me') ? 'whatsapp' : 'email';
            trackClick(this.textContent.trim(), action);
        });
    });
    
});

// Add loading animation for better UX
window.addEventListener('load', function() {
    // Remove any loading overlays if present
    const loader = document.querySelector('.loader');
    if (loader) {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.remove();
        }, 500);
    }
});

// Handle form validation
function validateForm(form) {
    const name = form.querySelector('input[name="name"]');
    const email = form.querySelector('input[name="email"]');
    const message = form.querySelector('textarea[name="message"]');
    
    let isValid = true;
    
    // Validate name
    if (!name.value.trim()) {
        showFieldError(name, 'Name is required');
        isValid = false;
    } else {
        clearFieldError(name);
    }
    
    // Validate email
    if (!email.value.trim()) {
        showFieldError(email, 'Email is required');
        isValid = false;
    } else if (!isValidEmail(email.value)) {
        showFieldError(email, 'Please enter a valid email address');
        isValid = false;
    } else {
        clearFieldError(email);
    }
    
    // Validate message
    if (!message.value.trim()) {
        showFieldError(message, 'Message is required');
        isValid = false;
    } else {
        clearFieldError(message);
    }
    
    return isValid;
}

// Show field error
function showFieldError(field, message) {
    clearFieldError(field);
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error text-danger small mt-1';
    errorDiv.textContent = message;
    
    field.parentNode.appendChild(errorDiv);
    field.classList.add('is-invalid');
}

// Clear field error
function clearFieldError(field) {
    const errorDiv = field.parentNode.querySelector('.field-error');
    if (errorDiv) {
        errorDiv.remove();
    }
    field.classList.remove('is-invalid');
}
