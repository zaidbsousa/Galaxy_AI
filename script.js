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
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Disable submit button and show loading state
            const submitButton = contactForm.querySelector('button[type="submit"]');
            submitButton.disabled = true;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            
            try {
                // Get form data
                const formData = {
                    name: document.getElementById('name').value,
                    email: document.getElementById('email').value,
                    phone: document.getElementById('phone').value,
                    message: document.getElementById('message').value
                };
                
                // Simulate form submission (replace with actual API call)
                await new Promise(resolve => setTimeout(resolve, 1500));
                
                // Show success message
                const successMessage = document.createElement('div');
                successMessage.className = 'form-success-message';
                successMessage.innerHTML = '<i class="fas fa-check-circle"></i> Thank you! We will contact you shortly.';
                contactForm.appendChild(successMessage);
                
                // Reset form
                contactForm.reset();
                
                // Remove success message after 5 seconds
                setTimeout(() => {
                    successMessage.remove();
                }, 5000);
                
                console.log('Form data that would be sent:', formData);
            } catch (error) {
                // Show error message
                const errorMessage = document.createElement('div');
                errorMessage.className = 'form-error-message';
                errorMessage.innerHTML = '<i class="fas fa-exclamation-circle"></i> Something went wrong. Please try again.';
                contactForm.appendChild(errorMessage);
                
                // Remove error message after 5 seconds
                setTimeout(() => {
                    errorMessage.remove();
                }, 5000);
            } finally {
                // Reset submit button
                submitButton.disabled = false;
                submitButton.textContent = 'Submit Inquiry';
            }
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

    // Function to animate counting
    function animateCounter(element) {
        const target = parseInt(element.getAttribute('data-target'));
        const duration = 2000; // 2 seconds
        const start = 0;
        const increment = target / (duration / 16); // 60fps
        let current = start;

        const updateCounter = () => {
            current += increment;
            if (current < target) {
                // For the dollar amount, format with $ and B
                if (element.getAttribute('data-target') === '3500') {
                    element.textContent = `$${Math.floor(current)}B`;
                } 
                // For percentage values (84, 40)
                else if (['84', '40'].includes(element.getAttribute('data-target'))) {
                    element.textContent = `${Math.floor(current)}%`;
                }
                // For the fraction (9/10)
                else if (element.getAttribute('data-target') === '9') {
                    element.textContent = Math.floor(current);
                }
                else {
                    element.textContent = Math.floor(current);
                }
                requestAnimationFrame(updateCounter);
            } else {
                // For the dollar amount, format with $ and B
                if (element.getAttribute('data-target') === '3500') {
                    element.textContent = `$${target}B`;
                }
                // For percentage values (84, 40)
                else if (['84', '40'].includes(element.getAttribute('data-target'))) {
                    element.textContent = `${target}%`;
                }
                // For the fraction (9/10)
                else if (element.getAttribute('data-target') === '9') {
                    element.textContent = target;
                }
                else {
                    element.textContent = target;
                }
            }
        };

        updateCounter();
    }

    // Function to check if element is in viewport
    function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    // Function to handle scroll events
    function handleScroll() {
        const statNumbers = document.querySelectorAll('.stat-number');
        statNumbers.forEach(number => {
            if (isInViewport(number) && !number.classList.contains('animated')) {
                number.classList.add('animated');
                animateCounter(number);
            }
        });
    }

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);

    // Initial check for elements in viewport
    handleScroll();

    const titleContainer = document.querySelector('.title-container');
    const titles = document.querySelectorAll('.title-text');
    let currentIndex = 0;

    function swapText() {
        titles[currentIndex].classList.remove('active');
        currentIndex = (currentIndex + 1) % titles.length;
        titles[currentIndex].classList.add('active');
    }

    // Initial swap after 3 seconds
    setTimeout(swapText, 3000);

    // Continue swapping every 5 seconds
    setInterval(swapText, 5000);

    // Go to Top Button Functionality
    const goToTopButton = document.getElementById('goToTop');

    // Show button when scrolling down 200px from the top
    window.addEventListener('scroll', () => {
        if (window.scrollY > 200) {
            goToTopButton.classList.add('visible');
        } else {
            goToTopButton.classList.remove('visible');
        }
    });

    // Smooth scroll to top when button is clicked
    goToTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Mobile Menu Functionality
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const nav = document.querySelector('.nav');

    mobileMenuToggle.addEventListener('click', () => {
        const isExpanded = mobileMenuToggle.getAttribute('aria-expanded') === 'true';
        mobileMenuToggle.setAttribute('aria-expanded', !isExpanded);
        mobileMenuToggle.classList.toggle('active');
        nav.classList.toggle('active');
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!nav.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
            mobileMenuToggle.setAttribute('aria-expanded', 'false');
            mobileMenuToggle.classList.remove('active');
            nav.classList.remove('active');
        }
    });

    // Add loading attribute to images below the fold
    const images = document.querySelectorAll('img[data-src]');
    images.forEach(img => {
        img.setAttribute('loading', 'lazy');
        img.src = img.dataset.src;
    });

    // Search and Filter Functionality
    const searchInput = document.getElementById('courseSearch');
    const levelFilter = document.getElementById('levelFilter');
    const durationFilter = document.getElementById('durationFilter');
    const clearButton = document.querySelector('.search-clear');
    const courseCards = document.querySelectorAll('.path-card');
    const noResultsMessage = document.querySelector('.no-results');

    function filterCourses() {
        const searchTerm = searchInput.value.toLowerCase();
        const selectedLevel = levelFilter.value;
        const selectedDuration = durationFilter.value;
        let visibleCount = 0;

        courseCards.forEach(card => {
            const courseImage = card.querySelector('.course-image');
            const courseName = courseImage ? courseImage.getAttribute('alt').toLowerCase() : '';
            const level = card.getAttribute('data-level') || '';
            const duration = card.getAttribute('data-duration') || '';
            
            const matchesSearch = courseName.includes(searchTerm);
            const matchesLevel = selectedLevel === '' || level === selectedLevel;
            const matchesDuration = selectedDuration === '' || duration === selectedDuration;

            if (matchesSearch && matchesLevel && matchesDuration) {
                card.classList.remove('hidden');
                visibleCount++;
            } else {
                card.classList.add('hidden');
            }
        });

        // Show/hide no results message
        if (visibleCount === 0) {
            noResultsMessage.classList.add('visible');
        } else {
            noResultsMessage.classList.remove('visible');
        }
    }

    // Event listeners
    searchInput.addEventListener('input', filterCourses);
    levelFilter.addEventListener('change', filterCourses);
    durationFilter.addEventListener('change', filterCourses);

    clearButton.addEventListener('click', function() {
        searchInput.value = '';
        filterCourses();
    });

    // Initial filter
    filterCourses();
});
