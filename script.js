// JavaScript for Galaxy AI Courses Website

// Course data
const courses = {
    essentials: [
        { id: 'ai-fundamentals', name: 'AI Fundamentals' },
        { id: 'chatgpt-essentials', name: 'ChatGPT Essentials' },
        { id: 'ai-prompt-engineering', name: 'AI Prompt Engineering' },
        { id: 'ai-ethics', name: 'AI Ethics & Governance' },
        { id: 'ai-project-management', name: 'AI Project Management' }
    ],
    design: [
        { id: 'ai-for-designers', name: 'AI for Designers' },
        { id: 'ai-image-generation', name: 'AI Image Generation' }
    ],
    specialized: [
        { id: 'ai-healthcare', name: 'AI for Healthcare' },
        { id: 'ai-education', name: 'AI for Education' },
        { id: 'ai-finance', name: 'AI for Finance' },
        { id: 'ai-legal', name: 'AI for Legal' }
    ],
    tech: [
        { id: 'ai-developers', name: 'AI for Developers' },
        { id: 'ai-data-analysis', name: 'AI Data Analysis' },
        { id: 'ai-cybersecurity', name: 'AI for Cybersecurity' },
        { id: 'ai-cloud-computing', name: 'AI for Cloud Computing' },
        { id: 'ai-devops', name: 'AI for DevOps' },
        { id: 'ai-blockchain', name: 'AI for Blockchain' },
        { id: 'ai-iot', name: 'AI for IoT' },
        { id: 'ai-robotics', name: 'AI for Robotics' },
        { id: 'ai-game-dev', name: 'AI for Game Development' },
        { id: 'ai-mobile-apps', name: 'AI for Mobile Apps' },
        { id: 'ai-web-dev', name: 'AI for Web Development' },
        { id: 'ai-software-testing', name: 'AI for Software Testing' },
        { id: 'ai-system-architecture', name: 'AI for System Architecture' }
    ],
    business: [
        { id: 'ai-business', name: 'AI for Business' },
        { id: 'ai-marketing', name: 'AI for Marketing' },
        { id: 'ai-sales', name: 'AI for Sales' },
        { id: 'ai-hr', name: 'AI for HR' },
        { id: 'ai-customer-service', name: 'AI for Customer Service' },
        { id: 'ai-supply-chain', name: 'AI for Supply Chain' },
        { id: 'ai-project-management', name: 'AI for Project Management' },
        { id: 'ai-business-analytics', name: 'AI for Business Analytics' }
    ]
};

document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Form submission handling
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                message: document.getElementById('message').value
            };
            
            // Display loading state
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.textContent;
            submitButton.textContent = 'Sending...';
            submitButton.disabled = true;
            
            // Simulate form submission (in a real implementation, this would be an actual API call)
            setTimeout(() => {
                // Reset form
                contactForm.reset();
                
                // Show success message
                const formGroup = submitButton.parentElement;
                const successMessage = document.createElement('div');
                successMessage.className = 'form-success-message';
                successMessage.textContent = 'Thank you! Your inquiry has been sent to ai@galaxy.ps';
                successMessage.style.color = '#28a745';
                successMessage.style.marginTop = '10px';
                formGroup.appendChild(successMessage);
                
                // Reset button
                submitButton.textContent = originalButtonText;
                submitButton.disabled = false;
                
                // Remove success message after 5 seconds
                setTimeout(() => {
                    successMessage.remove();
                }, 5000);
                
                console.log('Form data that would be sent:', formData);
            }, 1500);
        });
    }
    
    // Add animation classes on scroll
    const animatedElements = document.querySelectorAll('.feature-card, .inclusion-item, .experience-step, .path-card, .stat-card, .benefit-item');
    
    function checkScroll() {
        animatedElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementTop < windowHeight * 0.9) {
                element.classList.add('animate-slide-up');
            }
        });
    }
    
    // Initial check
    checkScroll();
    
    // Check on scroll
    window.addEventListener('scroll', checkScroll);
    
    // Mobile navigation toggle (for responsive design)
    const createMobileNav = () => {
        const header = document.querySelector('.header');
        const nav = document.querySelector('.nav');
        
        if (header && nav && !document.querySelector('.mobile-nav-toggle')) {
            const mobileNavToggle = document.createElement('button');
            mobileNavToggle.className = 'mobile-nav-toggle';
            mobileNavToggle.innerHTML = '<i class="fas fa-bars"></i>';
            header.querySelector('.header-content').appendChild(mobileNavToggle);
            
            mobileNavToggle.addEventListener('click', function() {
                nav.classList.toggle('active');
                this.innerHTML = nav.classList.contains('active') 
                    ? '<i class="fas fa-times"></i>' 
                    : '<i class="fas fa-bars"></i>';
            });
            
            // Add mobile nav styles
            const style = document.createElement('style');
            style.textContent = `
                @media (max-width: 768px) {
                    .nav {
                        position: absolute;
                        top: 100%;
                        left: 0;
                        width: 100%;
                        background-color: var(--white);
                        box-shadow: 0 10px 20px rgba(0,0,0,0.1);
                        padding: 20px;
                        display: none;
                    }
                    
                    .nav.active {
                        display: block;
                    }
                    
                    .nav-list {
                        flex-direction: column;
                        align-items: flex-start;
                    }
                    
                    .mobile-nav-toggle {
                        display: block;
                        background: none;
                        border: none;
                        font-size: 1.5rem;
                        color: var(--dark-gray);
                        cursor: pointer;
                    }
                }
                
                @media (min-width: 769px) {
                    .mobile-nav-toggle {
                        display: none;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    };
    
    // Initialize mobile navigation
    createMobileNav();
    
    // Handle window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth <= 768) {
            createMobileNav();
        }
    });
    
    // Check if mobile nav should be initialized on load
    if (window.innerWidth <= 768) {
        createMobileNav();
    }

    // Header scroll effect
    const header = document.querySelector('.header');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Handle category and course selection
    const categorySelect = document.getElementById('category');
    const courseSelect = document.getElementById('course');

    categorySelect.addEventListener('change', function() {
        // Clear previous courses
        courseSelect.innerHTML = '<option value="">Select a course</option>';
        
        // Get selected category
        const selectedCategory = this.value;
        
        if (selectedCategory) {
            // Add courses for selected category
            courses[selectedCategory].forEach(course => {
                const option = document.createElement('option');
                option.value = course.id;
                option.textContent = course.name;
                courseSelect.appendChild(option);
            });
        }
    });
});
