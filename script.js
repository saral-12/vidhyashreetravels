document.addEventListener('DOMContentLoaded', () => {
    // -------------------------------------------------------------
    // Slider & Carousel System
    // -------------------------------------------------------------
    const bgSlides = document.querySelectorAll('.bg-slide');
    const textSlides = document.querySelectorAll('.text-slide-item');
    const carouselCards = document.querySelectorAll('.carousel-card');
    const prevBtn = document.getElementById('btn-prev-slide');
    const nextBtn = document.getElementById('btn-next-slide');
    const progressFill = document.getElementById('progress-fill');
    const currentSlideNum = document.getElementById('current-slide-num');

    let currentSlide = 0;
    const totalSlides = carouselCards.length;

    function updateSlider(index) {
        // Handle wrapping boundary
        if (index < 0) {
            currentSlide = totalSlides - 1;
        } else if (index >= totalSlides) {
            currentSlide = 0;
        } else {
            currentSlide = index;
        }

        // 1. Update Background Slides
        bgSlides.forEach((slide, i) => {
            if (i === currentSlide) {
                slide.classList.add('active');
            } else {
                slide.classList.remove('active');
            }
        });

        // 2. Update Text Content
        textSlides.forEach((slide, i) => {
            if (i === currentSlide) {
                slide.classList.add('active');
            } else {
                slide.classList.remove('active');
            }
        });

        // 3. Update Cards Focus
        carouselCards.forEach((card, i) => {
            if (i === currentSlide) {
                card.classList.add('active');
            } else {
                card.classList.remove('active');
            }
        });

        // 4. Update Progress Bar Line Width
        const progressPercentage = ((currentSlide + 1) / totalSlides) * 100;
        progressFill.style.width = `${progressPercentage}%`;

        // 5. Update Numeric Indicator
        currentSlideNum.textContent = `0${currentSlide + 1}`;
    }

    // Prev & Next Buttons Triggers
    prevBtn.addEventListener('click', () => {
        updateSlider(currentSlide - 1);
    });

    nextBtn.addEventListener('click', () => {
        updateSlider(currentSlide + 1);
    });

    // Clicking Cards Directly
    carouselCards.forEach((card) => {
        card.addEventListener('click', () => {
            const index = parseInt(card.getAttribute('data-slide-index'), 10);
            updateSlider(index);
        });
    });

    // Initial load sync
    updateSlider(0);


    // -------------------------------------------------------------
    // Header & Mobile Nav System
    // -------------------------------------------------------------
    const menuToggle = document.getElementById('btn-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');

    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when a nav link is clicked
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });


    // -------------------------------------------------------------
    // Content Panels System (About, Packages, Contact)
    // -------------------------------------------------------------
    const navLinks = document.querySelectorAll('.nav-link');
    const contentPanels = document.querySelectorAll('.content-panel');

    function closeAllPanels() {
        contentPanels.forEach(panel => panel.classList.remove('active'));
        navLinks.forEach(link => link.classList.remove('active'));
    }

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const target = link.getAttribute('data-target');
            
            // If home link, just close all panels and set home active
            if (target === 'home') {
                e.preventDefault();
                closeAllPanels();
                link.classList.add('active');
                return;
            }

            const panel = document.getElementById(`${target}-panel`);
            if (panel) {
                e.preventDefault();
                const wasActive = panel.classList.contains('active');
                closeAllPanels();

                if (!wasActive) {
                    panel.classList.add('active');
                    link.classList.add('active');
                } else {
                    // Re-activate home if the current active panel is toggled off
                    document.querySelector('.nav-link[data-target="home"]').classList.add('active');
                }
            }
        });
    });

    // Logo Click resets to Home
    document.getElementById('header-logo').addEventListener('click', (e) => {
        e.preventDefault();
        closeAllPanels();
        document.querySelector('.nav-link[data-target="home"]').classList.add('active');
    });

    // Panel Close Buttons
    document.querySelectorAll('.panel-close').forEach(closeBtn => {
        closeBtn.addEventListener('click', () => {
            closeAllPanels();
            document.querySelector('.nav-link[data-target="home"]').classList.add('active');
        });
    });



    // -------------------------------------------------------------
    // Booking / Inquiry Modal System
    // -------------------------------------------------------------
    const bookingModal = document.getElementById('booking-modal');
    const startAdventureBtn = document.getElementById('btn-start-adventure');
    const closeBookingBtn = document.getElementById('btn-close-booking');
    const bookingForm = document.getElementById('booking-form');
    const successMessage = document.getElementById('success-inquiry');
    const destinationSelect = document.getElementById('trip-destination');

    function openBookingModal(defaultDestination = null) {
        if (defaultDestination) {
            // Find option matching the destination name and select it
            for (let i = 0; i < destinationSelect.options.length; i++) {
                if (destinationSelect.options[i].value === defaultDestination || 
                    destinationSelect.options[i].text.includes(defaultDestination)) {
                    destinationSelect.selectedIndex = i;
                    break;
                }
            }
        }
        
        // Reset form states
        bookingForm.style.display = 'flex';
        successMessage.style.display = 'none';
        bookingModal.classList.add('active');
    }

    startAdventureBtn.addEventListener('click', () => {
        // Open with whatever slide is currently selected
        const currentTitle = textSlides[currentSlide].querySelector('.subtitle').textContent.replace('Embark On The Journey Of A Lifetime', '').trim();
        openBookingModal(currentTitle);
    });

    closeBookingBtn.addEventListener('click', () => {
        bookingModal.classList.remove('active');
    });

    bookingModal.addEventListener('click', (e) => {
        if (e.target === bookingModal) {
            bookingModal.classList.remove('active');
        }
    });

    // Handle book button clicks from packages grid
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('package-book')) {
            const dest = e.target.getAttribute('data-destination');
            closeAllPanels();
            openBookingModal(dest);
        }
    });

    // Form Submission Handler
    bookingForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('user-name').value;
        const email = document.getElementById('user-email').value;
        const phone = document.getElementById('user-phone').value;
        const destination = destinationSelect.value;
        const date = document.getElementById('travel-date').value;
        const notes = document.getElementById('user-message').value;

        const inquiryData = {
            name,
            email,
            phone,
            destination,
            date,
            notes,
            timestamp: new Date().toISOString()
        };

        // Save to local storage
        let inquiries = JSON.parse(localStorage.getItem('travel_inquiries') || '[]');
        inquiries.push(inquiryData);
        localStorage.setItem('travel_inquiries', JSON.stringify(inquiries));

        // UI transitions to success state
        bookingForm.style.opacity = '0';
        setTimeout(() => {
            bookingForm.style.display = 'none';
            successMessage.style.display = 'flex';
            bookingForm.reset();
            bookingForm.style.opacity = '1';
        }, 300);

        // Auto-close modal after a few seconds
        setTimeout(() => {
            bookingModal.classList.remove('active');
        }, 4000);
    });

    // Booking bookmark action trigger
    document.getElementById('btn-save-adventure').addEventListener('click', () => {
        const currentTitle = textSlides[currentSlide].querySelector('.main-title').textContent.replace('\n', ' ').trim();
        alert(`"${currentTitle}" has been saved to your Bookmarks list!`);
    });
});
