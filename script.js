document.addEventListener('DOMContentLoaded', () => {
    // -------------------------------------------------------------
    // Header & Mobile Nav System
    // -------------------------------------------------------------
    const menuToggle = document.getElementById('btn-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (menuToggle && navMenu) {
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
    }


    // -------------------------------------------------------------
    // Homepage Auto-Playing Photo Slideshow System
    // -------------------------------------------------------------
    const bgSlides = document.querySelectorAll('.bg-slides .bg-slide');
    const indicatorDots = document.querySelectorAll('#slideshow-dots .indicator-dot');

    if (bgSlides.length > 0) {
        let currentSlide = 0;
        const totalSlides = bgSlides.length;
        let slideTimer;

        function showSlide(index) {
            // Remove active class from current slide and dot
            bgSlides[currentSlide].classList.remove('active');
            if (indicatorDots.length > 0 && indicatorDots[currentSlide]) {
                indicatorDots[currentSlide].classList.remove('active');
            }

            // Set new active slide index
            currentSlide = index;

            // Add active class to new slide and dot
            bgSlides[currentSlide].classList.add('active');
            if (indicatorDots.length > 0 && indicatorDots[currentSlide]) {
                indicatorDots[currentSlide].classList.add('active');
            }
        }

        function nextSlide() {
            const nextIndex = (currentSlide + 1) % totalSlides;
            showSlide(nextIndex);
        }

        function startTimer() {
            slideTimer = setInterval(nextSlide, 5000); // Transitions every 5 seconds
        }

        function resetTimer() {
            clearInterval(slideTimer);
            startTimer();
        }

        // Add manual navigation click listeners to indicator dots
        indicatorDots.forEach(dot => {
            dot.addEventListener('click', () => {
                const index = parseInt(dot.getAttribute('data-slide-index'), 10);
                if (!isNaN(index) && index >= 0 && index < totalSlides) {
                    showSlide(index);
                    resetTimer();
                }
            });
        });

        // Initialize slideshow
        startTimer();
    }


    // -------------------------------------------------------------
    // Packages Page Filter System
    // -------------------------------------------------------------
    const filterBtns = document.querySelectorAll('.filter-btn');
    const packageCards = document.querySelectorAll('.package-showcase-card');

    if (filterBtns.length > 0 && packageCards.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Toggle active filter button style
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const category = btn.getAttribute('data-filter');

                // Filter cards visibility
                packageCards.forEach(card => {
                    if (category === 'all' || card.getAttribute('data-category') === category) {
                        card.style.display = 'flex';
                        card.style.animation = 'scaleUp 0.4s ease forwards';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }


    // -------------------------------------------------------------
    // Booking / Inquiry Modal System (Shared across home & packages)
    // -------------------------------------------------------------
    const bookingModal = document.getElementById('booking-modal');
    const startAdventureBtn = document.getElementById('btn-start-adventure');
    const closeBookingBtn = document.getElementById('btn-close-booking');
    const bookingForm = document.getElementById('booking-form');
    const successMessage = document.getElementById('success-inquiry');
    const destinationSelect = document.getElementById('trip-destination');

    function openBookingModal(defaultDestination = null) {
        if (!bookingModal) return;

        if (defaultDestination && destinationSelect) {
            for (let i = 0; i < destinationSelect.options.length; i++) {
                if (destinationSelect.options[i].value === defaultDestination || 
                    destinationSelect.options[i].text.includes(defaultDestination)) {
                    destinationSelect.selectedIndex = i;
                    break;
                }
            }
        }
        
        if (bookingForm) bookingForm.style.display = 'flex';
        if (successMessage) successMessage.style.display = 'none';
        bookingModal.classList.add('active');
    }

    if (startAdventureBtn) {
        startAdventureBtn.addEventListener('click', () => {
            openBookingModal(null);
        });
    }

    if (closeBookingBtn) {
        closeBookingBtn.addEventListener('click', () => {
            bookingModal.classList.remove('active');
        });
    }

    if (bookingModal) {
        bookingModal.addEventListener('click', (e) => {
            if (e.target === bookingModal) {
                bookingModal.classList.remove('active');
            }
        });
    }

    // Capture book clicks on package catalog
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('book-now-trigger')) {
            const dest = e.target.getAttribute('data-destination');
            openBookingModal(dest);
        }
    });

    // Handle Form Submission
    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('user-name').value;
            const email = document.getElementById('user-email').value;
            const phone = document.getElementById('user-phone').value;
            const destination = destinationSelect ? destinationSelect.value : '';
            const date = document.getElementById('travel-date').value;
            const notes = document.getElementById('user-message').value;

            const inquiryData = {
                name,
                email,
                phone,
                destination,
                date,
                notes,
                type: 'booking_inquiry',
                timestamp: new Date().toISOString()
            };

            // Save locally
            let inquiries = JSON.parse(localStorage.getItem('travel_inquiries') || '[]');
            inquiries.push(inquiryData);
            localStorage.setItem('travel_inquiries', JSON.stringify(inquiries));

            // UI feedback
            bookingForm.style.opacity = '0';
            setTimeout(() => {
                bookingForm.style.display = 'none';
                if (successMessage) successMessage.style.display = 'flex';
                bookingForm.reset();
                bookingForm.style.opacity = '1';
            }, 300);

            // Auto Close modal
            setTimeout(() => {
                bookingModal.classList.remove('active');
            }, 4000);
        });
    }


    // -------------------------------------------------------------
    // Contact Page Form System
    // -------------------------------------------------------------
    const contactForm = document.getElementById('contact-page-form');
    const contactSuccess = document.getElementById('success-contact-page');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('contact-name').value;
            const email = document.getElementById('contact-email').value;
            const phone = document.getElementById('contact-phone').value;
            const message = document.getElementById('contact-message').value;

            const inquiryData = {
                name,
                email,
                phone,
                message,
                type: 'contact_page_form',
                timestamp: new Date().toISOString()
            };

            // Save locally
            let inquiries = JSON.parse(localStorage.getItem('travel_inquiries') || '[]');
            inquiries.push(inquiryData);
            localStorage.setItem('travel_inquiries', JSON.stringify(inquiries));

            // UI feedback
            contactForm.style.opacity = '0';
            setTimeout(() => {
                contactForm.style.display = 'none';
                if (contactSuccess) contactSuccess.style.display = 'flex';
                contactForm.reset();
                contactForm.style.opacity = '1';
            }, 300);
        });
    }

    // Home Page Save Badge Alert removed (CTA buttons simplified)
});
