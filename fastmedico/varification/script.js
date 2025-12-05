// Store the verification code and email globally
let currentVerificationCode = '';
let countdownInterval;

// Check which page we're on
const isLoginPage = window.location.pathname.includes('index.html') || window.location.pathname === '/';
const isSignupPage = window.location.pathname.includes('signup.html');

// Login form submission - Simple redirect without validation
if (isLoginPage) {
    document.getElementById('login-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const button = this.querySelector('button[type="submit"]');
        const originalText = button.textContent;
        
        // Show loading state
        button.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Signing In...';
        button.disabled = true;
        
        // Simulate API login - No validation, just redirect
        setTimeout(() => {
            // Get email for dashboard
            const email = document.getElementById('login-email').value || 'user@example.com';
            
            // Store user data for dashboard
            localStorage.setItem('userEmail', email);
            localStorage.setItem('isLoggedIn', 'true');
            
            // Redirect to Dashboard.html in the same folder
            window.location.href = '/Dashboard.html';
        }, 1000);
    });
}

// Signup page functionality
if (isSignupPage) {
    // Form navigation
    document.getElementById('back-to-signup').addEventListener('click', function(e) {
        e.preventDefault();
        showForm('signup-form');
        document.getElementById('demo-code').classList.add('hidden');
    });

    function showForm(formId) {
        const forms = ['signup-form', 'verification-form', 'success-message'];
        forms.forEach(id => {
            const form = document.getElementById(id);
            if (id === formId) {
                form.classList.remove('hidden');
            } else {
                form.classList.add('hidden');
            }
        });
    }

    // Signup form submission
    document.getElementById('signup-form-element').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;
        const confirmPassword = document.getElementById('signup-confirm-password').value;
        const termsChecked = document.getElementById('terms-checkbox').checked;
        
        // Validate form
        if (password !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }
        
        if (!termsChecked) {
            alert('Please agree to the Terms & Conditions');
            return;
        }
        
        const button = this.querySelector('button[type="submit"]');
        const originalText = button.textContent;
        
        // Show loading state
        button.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Creating Account...';
        button.disabled = true;
        
        // Simulate API call to create account and send verification code
        setTimeout(() => {
            // Store email for verification
            document.getElementById('verification-email').textContent = email;
            
            // Generate a random 6-digit verification code
            currentVerificationCode = Math.floor(100000 + Math.random() * 900000).toString();
            
            // Show demo code (in real app, this would be sent via email)
            document.getElementById('demo-code-value').textContent = currentVerificationCode;
            document.getElementById('demo-code').classList.remove('hidden');
            
            // Show verification form
            showForm('verification-form');
            
            // Reset button
            button.innerHTML = originalText;
            button.disabled = false;
            
            // Clear verification inputs
            document.querySelectorAll('.verification-input').forEach(input => {
                input.value = '';
            });
            
            // Start countdown for resend code
            startCountdown();
        }, 1500);
    });

    // Verification code input handling
    document.querySelectorAll('.verification-input').forEach(input => {
        input.addEventListener('input', function() {
            const value = this.value;
            const index = parseInt(this.getAttribute('data-index'));
            
            // Auto-focus next input
            if (value && index < 6) {
                const nextInput = document.querySelector(`.verification-input[data-index="${index + 1}"]`);
                if (nextInput) nextInput.focus();
            }
            
            // Enable paste functionality
            if (value.length > 1) {
                // Handle paste event
                const pasteValue = value.substring(0, 6);
                for (let i = 0; i < pasteValue.length; i++) {
                    const digit = pasteValue[i];
                    const inputField = document.querySelector(`.verification-input[data-index="${i + 1}"]`);
                    if (inputField) {
                        inputField.value = digit;
                    }
                }
                // Focus last input
                const lastIndex = Math.min(pasteValue.length, 6);
                const lastInput = document.querySelector(`.verification-input[data-index="${lastIndex}"]`);
                if (lastInput) lastInput.focus();
            }
        });
        
        // Handle backspace
        input.addEventListener('keydown', function(e) {
            if (e.key === 'Backspace' && !this.value && parseInt(this.getAttribute('data-index')) > 1) {
                const prevInput = document.querySelector(`.verification-input[data-index="${parseInt(this.getAttribute('data-index')) - 1}"]`);
                if (prevInput) prevInput.focus();
            }
        });
    });

    // Verification form submission
    document.getElementById('verification-form-element').addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get the entered code
        let enteredCode = '';
        document.querySelectorAll('.verification-input').forEach(input => {
            enteredCode += input.value;
        });
        
        // Validate code
        if (enteredCode.length !== 6) {
            alert('Please enter the complete 6-digit verification code.');
            return;
        }
        
        const button = this.querySelector('button[type="submit"]');
        const originalText = button.textContent;
        
        // Show loading state
        button.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Verifying...';
        button.disabled = true;
        
        // Simulate API verification
        setTimeout(() => {
            if (enteredCode === currentVerificationCode) {
                // Success - show success message
                showForm('success-message');
                document.getElementById('demo-code').classList.add('hidden');
                
                // Store user data for auto-login
                const email = document.getElementById('signup-email').value;
                localStorage.setItem('userEmail', email);
                localStorage.setItem('isLoggedIn', 'true');
                
                // Clear countdown
                clearInterval(countdownInterval);
            } else {
                alert('Invalid verification code. Please try again.');
            }
            
            // Reset button
            button.innerHTML = originalText;
            button.disabled = false;
        }, 1500);
    });

    // Resend code functionality
    document.getElementById('resend-code').addEventListener('click', function() {
        if (!this.disabled) {
            // Generate new verification code
            currentVerificationCode = Math.floor(100000 + Math.random() * 900000).toString();
            
            // Update demo code display
            document.getElementById('demo-code-value').textContent = currentVerificationCode;
            
            // Show success message
            alert('A new verification code has been sent to your email.');
            
            // Clear verification inputs
            document.querySelectorAll('.verification-input').forEach(input => {
                input.value = '';
            });
            
            // Focus first input
            const firstInput = document.querySelector('.verification-input[data-index="1"]');
            if (firstInput) firstInput.focus();
            
            // Restart countdown
            startCountdown();
        }
    });
}

// Countdown timer for resend code
function startCountdown() {
    const resendButton = document.getElementById('resend-code');
    const countdownElement = document.getElementById('countdown');
    let timeLeft = 60;
    
    // Clear existing interval
    if (countdownInterval) {
        clearInterval(countdownInterval);
    }
    
    resendButton.disabled = true;
    
    countdownInterval = setInterval(() => {
        timeLeft--;
        countdownElement.textContent = timeLeft;
        
        if (timeLeft <= 0) {
            clearInterval(countdownInterval);
            resendButton.disabled = false;
            countdownElement.textContent = '60';
        }
    }, 1000);
}

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is already logged in (for login page)
    if (isLoginPage) {
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        if (isLoggedIn === 'true') {
            // If user is already logged in, redirect to dashboard
            window.location.href = 'Dashboard.html';
        }
    }
});