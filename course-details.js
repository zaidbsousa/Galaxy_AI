// API Base URL
const BASE_URL = 'https://www.aicerts.ai/wp-json/wp/v2';

// Get course ID from URL parameters
const urlParams = new URLSearchParams(window.location.search);
const courseId = urlParams.get('id');

// Helper to decode HTML entities
function decodeHtmlEntities(str) {
    const txt = document.createElement('textarea');
    txt.innerHTML = str;
    return txt.value;
}

// Function to fetch course details
async function getCourseDetails(courseId) {
    try {
        console.log(`Fetching course details for ID: ${courseId}`);
        const response = await fetch(`${BASE_URL}/courses/${courseId}`, {
            method: 'GET',
            headers: {
                // Keep this a simple cross-origin GET — adding Content-Type triggers a CORS preflight the AI Certs WAF rejects.
                'Accept': 'application/json'
            }
        });
        
        if (!response.ok) {
            console.error(`API Error: ${response.status} ${response.statusText}`);
            const errorText = await response.text();
            console.error('Error response:', errorText);
            throw new Error(`API Error: ${response.status} - ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('Full API Response:', data);
        console.log('ACF Data:', data.acf);
        console.log('Prerequisites Field:', data.acf?.prerequisite);
        
        // Validate the response data
        if (!data || !data.title || !data.acf) {
            console.error('Invalid API response format:', data);
            throw new Error('Invalid API response format');
        }
        
        return data;
    } catch (error) {
        console.error('Error fetching course details:', error);
        if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
            throw new Error('Network error: Unable to connect to the API. Please check your internet connection.');
        }
        throw error;
    }
}

// Function to fetch course badge image
async function getCourseBadge(mediaId) {
    if (!mediaId) {
        console.warn('No media ID provided for badge image');
        return null;
    }

    try {
        console.log(`Fetching badge image for media ID: ${mediaId}`);
        const response = await fetch(`${BASE_URL}/media/${mediaId}`, {
            method: 'GET',
            headers: {
                // Keep this a simple cross-origin GET — adding Content-Type triggers a CORS preflight the AI Certs WAF rejects.
                'Accept': 'application/json'
            }
        });
        
        if (!response.ok) {
            console.error(`API Error: ${response.status} ${response.statusText}`);
            throw new Error(`API Error: ${response.status} - ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('Badge image data received:', data);
        
        if (!data || !data.source_url) {
            console.warn('Invalid badge image data:', data);
            return null;
        }
        
        return data.source_url;
    } catch (error) {
        console.error('Error fetching course badge:', error);
        return null; // Return null instead of throwing to allow the page to load without the badge
    }
}

// Function to fetch tool image
async function getToolImage(mediaId) {
    if (!mediaId) {
        console.warn('No media ID provided for tool image');
        return null;
    }

    try {
        console.log(`Fetching tool image for media ID: ${mediaId}`);
        const response = await fetch(`${BASE_URL}/media/${mediaId}`, {
            method: 'GET',
            headers: {
                // Keep this a simple cross-origin GET — adding Content-Type triggers a CORS preflight the AI Certs WAF rejects.
                'Accept': 'application/json'
            }
        });
        
        if (!response.ok) {
            console.error(`API Error: ${response.status} ${response.statusText}`);
            return null;
        }
        
        const data = await response.json();
        return data.source_url;
    } catch (error) {
        console.error('Error fetching tool image:', error);
        return null;
    }
}

// Function to display course details
async function displayCourseDetails() {
    try {
        // Show loading state with skeleton
        document.querySelector('.course-details-container').innerHTML = `
            <div class="loading-skeleton">
                <div class="skeleton-hero">
                    <div class="skeleton-badge"></div>
                    <div class="skeleton-content">
                        <div class="skeleton-title"></div>
                        <div class="skeleton-meta"></div>
                        <div class="skeleton-tagline"></div>
                        <div class="skeleton-list">
                            <div class="skeleton-item"></div>
                            <div class="skeleton-item"></div>
                            <div class="skeleton-item"></div>
                        </div>
                        <div class="skeleton-actions"></div>
                    </div>
                </div>
                <div class="skeleton-section">
                    <div class="skeleton-heading"></div>
                    <div class="skeleton-modules">
                        <div class="skeleton-module"></div>
                        <div class="skeleton-module"></div>
                        <div class="skeleton-module"></div>
                    </div>
                </div>
                <div class="skeleton-section">
                    <div class="skeleton-heading"></div>
                    <div class="skeleton-tools">
                        <div class="skeleton-tool"></div>
                        <div class="skeleton-tool"></div>
                        <div class="skeleton-tool"></div>
                    </div>
                </div>
            </div>
        `;
        
        // Get course details
        const courseDetails = await getCourseDetails(courseId);
        
        // Get badge image URL
        const badgeUrl = await getCourseBadge(courseDetails.featured_media);
        
        // Extract data from API response
        const examObjectives = courseDetails.acf?.exam_objectives || 'Not specified';
        const passingScore = courseDetails.acf?.passing_score || 'N/A';
        const examinationTime = courseDetails.acf?.examination_time || 'N/A';
        const modulesCount = courseDetails.acf?.modules || 'N/A';
        // Extract duration from second li only (Self-Paced part)
        let duration = 'Self-Paced';
        const rawDuration = courseDetails.acf?.at_a_glance_overview?.duration;
        if (rawDuration) {
            const temp = document.createElement('div');
            temp.innerHTML = rawDuration;
            const listItems = temp.querySelectorAll('li');
            if (listItems.length >= 2) {
                duration = listItems[1].textContent.trim();
            } else if (listItems.length === 1) {
                duration = listItems[0].textContent.trim();
            }
        }
        const tools = courseDetails.acf?.tools_data || [];
        const certificationModules = courseDetails.acf?.certification_modules || [];
        
        // Handle prerequisites: extract only <span data-contrast="auto"> text from each <li>, decode HTML entities, and build a clean <ul> list
        const rawPrerequisite = courseDetails.acf?.prerequisite || '';
        let prerequisiteItems = [];
        if (rawPrerequisite) {
            // Decode HTML entities if needed
            const temp = document.createElement('div');
            temp.innerHTML = decodeHtmlEntities ? decodeHtmlEntities(rawPrerequisite) : rawPrerequisite;
            prerequisiteItems = Array.from(temp.querySelectorAll('li')).map(li => {
                const span = li.querySelector('span[data-contrast="auto"]');
                return span ? span.textContent.trim() : li.textContent.trim();
            });
        }
        const prerequisitesHTML = prerequisiteItems.length
            ? `<ul>${prerequisiteItems.map(p => `<li>${p}</li>`).join('')}</ul>`
            : 'None specified';
        
        console.log('Final prerequisites value:', prerequisitesHTML);
        
        // Use tool_image directly from the API for each tool
        const toolsWithImages = tools.map(tool => ({
            ...tool,
            imageUrl: tool.tool_image || null
        }));
        
        // Render certification modules as a modern multi-open accordion
        const modulesHtml = certificationModules.map((module, idx) => {
          // Extract module number and title
          let numberMatch = module.certification_module_title.match(/^(Module \d+:)/i);
          let moduleNumber = numberMatch ? numberMatch[1] : '';
          let moduleTitleRest = module.certification_module_title.replace(/^(Module \d+:)/i, '').trim();
          return `
            <div class=\"module-accordion\">\n\
              <button \n\
                class=\"module-accordion-header\" \n\
                type=\"button\" \n\
                aria-expanded=\"false\" \n\
                aria-controls=\"module-panel-${idx}\" \n\
                id=\"module-header-${idx}\">\n\
                <span class=\"module-accordion-title\">\n\
                  ${moduleNumber ? `<span class=\"module-number\">${moduleNumber}</span>` : ''}${moduleTitleRest}
                </span>\n\
                <span class=\"module-accordion-arrow\"></span>\n\
              </button>\n\
              <div \n\
                class=\"module-accordion-panel\" \n\
                id=\"module-panel-${idx}\" \n\
                role=\"region\" \n\
                aria-labelledby=\"module-header-${idx}\">\n\
                <div class=\"module-accordion-description\">${module.certification_module_description}</div>\n\
              </div>\n\
            </div>\n\
          `;
        }).join('');
        
        // Extract about_certification and parse as HTML
        const aboutCertificationRaw = courseDetails.acf?.about_certification || '';
        let aboutItems = [];
        if (aboutCertificationRaw) {
            const temp = document.createElement('div');
            temp.innerHTML = decodeHtmlEntities ? decodeHtmlEntities(aboutCertificationRaw) : aboutCertificationRaw;
            aboutItems = Array.from(temp.querySelectorAll('li')).map(li => li.innerHTML.trim());
        }
        const aboutHTML = aboutItems.length
          ? `<ul class="about-cert-list">${aboutItems.map(item => `<li>${item}</li>`).join('')}</ul>`
          : '';

        // Hero section HTML
        const heroHtml = `
          <div class="course-hero">
            <div class="course-hero-badge">
              ${badgeUrl ? `<img src="${badgeUrl}" alt="Course Badge" class="course-badge-img">` : ''}
            </div>
            <div class="course-hero-info">
              <div class="course-hero-title-row">
                <h1 class="course-hero-title">
                  <span class="ai-plus-highlight">AI<sup>+</sup></span> ${courseDetails.title.rendered.replace('AI+','').replace('™','')}<sup>™</sup>
                </h1>
                <span class="course-code-label"># ${courseDetails.acf?.certificate_code || ''}</span>
              </div>
              <div class="course-meta">
                <div class="meta-item" id="courseLevel">
                    <i class="fas fa-signal"></i>
                    <span>${courseDetails.acf?.level || 'Beginner'}</span>
                </div>
                <div class="meta-item" id="courseDuration">
                    <i class="fas fa-clock"></i>
                    <span>${duration}</span>
                </div>
              </div>
              <div class="course-hero-tagline">${courseDetails.acf?.course_tagline || ''}</div>
              <div class="course-hero-actions">
                <a href="#contact-form" class="btn btn-primary">Enroll Now</a>
                <a href="${courseDetails.link || '#'}" class="btn btn-secondary" target="_blank">Download Program Guide</a>
              </div>
            </div>
          </div>
        `;
        
        // Create HTML content
        const html = `
            ${heroHtml}
            
            <div class="course-section">
                <h2>About this Course</h2>
                ${aboutHTML}
            </div>
            
            <div class="course-section">
                <h2>Course Modules</h2>
                <div class="modules-accordion-list">
                  ${modulesHtml}
                </div>
            </div>
            
            <div class="course-section">
                <h2>Tools Covered</h2>
                <div class="tools-grid">
                    ${toolsWithImages.map(tool => `
                        <div class="tool-item">
                            ${tool.imageUrl ? `<img src="${tool.imageUrl}" alt="${tool.name}" class="tool-image">` : ''}
                            <span class="tool-name">${tool.name}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div class="course-section">
                <h2>Course Details</h2>
                <div class="exam-cards-row">
                  <div class="exam-card">
                    <div class="exam-card-icon"><i class="fas fa-star"></i></div>
                    <div class="exam-card-title">Passing Score</div>
                    <div class="exam-card-desc" id="passingScore">${passingScore}</div>
                  </div>
                  <div class="exam-card">
                    <div class="exam-card-icon"><i class="fas fa-info-circle"></i></div>
                    <div class="exam-card-title">Exam Info</div>
                    <div class="exam-card-desc" id="examinationTime">${examinationTime}</div>
                  </div>
                  <div class="exam-card">
                    <div class="exam-card-icon"><i class="fas fa-list-ul"></i></div>
                    <div class="exam-card-title">Modules</div>
                    <div class="exam-card-desc" id="modulesCount">${modulesCount}</div>
                  </div>
                  <div class="exam-card">
                    <div class="exam-card-icon"><i class="fas fa-clock"></i></div>
                    <div class="exam-card-title">Duration</div>
                    <div class="exam-card-desc" id="courseDuration">${duration}</div>
                  </div>
                </div>
            </div>

            <div class="course-section" id="contact-form">
                <h2>Get in Touch</h2>
                <div class="contact-form-container">
                    <form id="contactForm" class="contact-form" action="process-form.php" method="POST">
                        <div class="form-group">
                            <label for="name" class="form-label">Full Name</label>
                            <input type="text" id="name" name="name" class="form-control" placeholder="Enter your full name" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="email" class="form-label">Email Address</label>
                            <input type="email" id="email" name="email" class="form-control" placeholder="Enter your email address" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="phone" class="form-label">Phone Number</label>
                            <input type="tel" id="phone" name="phone" class="form-control" placeholder="Enter your phone number" required>
                        </div>

                        <div class="form-group">
                            <label for="city" class="form-label">City</label>
                            <input type="text" id="city" name="city" class="form-control" placeholder="Enter your city" required>
                        </div>

                        <div class="form-group">
                            <label for="category" class="form-label">Course Category</label>
                            <select id="category" name="category" class="form-control" required>
                                <option value="">Select a category</option>
                                <option value="essentials">Essentials Courses</option>
                                <option value="design">Design Courses</option>
                                <option value="specialized">Specialized Courses</option>
                                <option value="tech">Tech Courses</option>
                                <option value="business">Business Courses</option>
                                <option value="blockchain">Blockchain & Bitcoin Courses</option>
                            </select>
                        </div>

                        <div class="form-group">
                            <label for="course" class="form-label">Course</label>
                            <select id="course" name="course" class="form-control" required>
                                <option value="">Select a course</option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label for="message" class="form-label">Message</label>
                            <textarea id="message" name="message" class="form-control" placeholder="Tell us about your interests or questions"></textarea>
                        </div>
                        
                        <div class="form-group">
                            <button type="submit" class="btn btn-primary btn-large">Submit Inquiry</button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        
        // Update the container with the course information
        document.querySelector('.course-details-container').innerHTML = html;
        
        // After rendering, add the accordion logic
        setTimeout(() => {
          document.querySelectorAll('.module-accordion-header').forEach((btn, idx) => {
            btn.addEventListener('click', function() {
              const panel = document.getElementById(`module-panel-${idx}`);
              const expanded = btn.getAttribute('aria-expanded') === 'true';
              btn.setAttribute('aria-expanded', !expanded);
              panel.style.maxHeight = expanded ? null : panel.scrollHeight + 'px';
              btn.querySelector('.module-accordion-arrow').classList.toggle('open', !expanded);
            });
            // Start collapsed
            document.getElementById(`module-panel-${idx}`).style.maxHeight = null;
          });
        }, 0);
        
        // Pre-fill the form with course information
        const categorySelect = document.getElementById('category');
        const courseSelect = document.getElementById('course');
        
        // Find the category for the current course
        let currentCategory = '';
        for (const category in window.courses) {
            const course = window.courses[category].find(c => c.id === courseId);
            if (course) {
                currentCategory = category;
                break;
            }
        }
        
        if (currentCategory && categorySelect && courseSelect) {
            categorySelect.value = currentCategory;
            populateCourses(currentCategory, courseSelect, courseId);
        }

        // Attach the form submit event listener here
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
                    const formData = new FormData(contactForm);
                    
                    // Send form data
                    const response = await fetch('process-form.php', {
                        method: 'POST',
                        body: formData
                    });
                    const data = await response.json();
                    if (data.status === 'success') {
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
                    } else {
                        throw new Error(data.message || 'Something went wrong');
                    }
                } catch (error) {
                    // Show error message
                    const errorMessage = document.createElement('div');
                    errorMessage.className = 'form-error-message';
                    errorMessage.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${error.message || 'Something went wrong. Please try again.'}`;
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
        
    } catch (error) {
        console.error('Error in displayCourseDetails:', error);
        // Show error state with more specific error message
        document.querySelector('.course-details-container').innerHTML = `
            <div class="error">
                <p>${error.message || 'Failed to load course details. Please try again later.'}</p>
                <button onclick="displayCourseDetails()">Retry</button>
            </div>
        `;
    }
}

function populateCourses(category, courseSelect, selectedCourseId) {
    courseSelect.innerHTML = '<option value="">Select a course</option>';
    if (window.courses && window.courses[category]) {
        window.courses[category].forEach(course => {
            const option = document.createElement('option');
            option.value = course.id;
            option.textContent = course.name;
            if (selectedCourseId && course.id === selectedCourseId) {
                option.selected = true;
            }
            courseSelect.appendChild(option);
        });
    }
}

// Initialize the page
if (courseId) {
    displayCourseDetails();
} else {
    document.querySelector('.course-details-container').innerHTML = `
        <div class="error">
            <p>No course ID provided. Please select a course from the main page.</p>
            <a href="index.html" class="btn btn-primary">Back to Courses</a>
        </div>
    `;
}

document.addEventListener('DOMContentLoaded', function() {
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

    // Handle category and course selection
    const categorySelect = document.getElementById('category');
    const courseSelect = document.getElementById('course');

    if (categorySelect && courseSelect) {
        categorySelect.addEventListener('change', function() {
            populateCourses(this.value, courseSelect);
        });
    }
}); 
