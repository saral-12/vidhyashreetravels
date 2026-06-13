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
    // Homepage Slider & Carousel System
    // -------------------------------------------------------------
    const bgSlides = document.querySelectorAll('.bg-slides .bg-slide');
    const textSlides = document.querySelectorAll('.text-slide-item');
    const carouselCards = document.querySelectorAll('.carousel-card');
    const prevBtn = document.getElementById('btn-prev-slide');
    const nextBtn = document.getElementById('btn-next-slide');
    const progressFill = document.getElementById('progress-fill');
    const currentSlideNum = document.getElementById('current-slide-num');

    if (carouselCards.length > 0) {
        let currentSlide = 0;
        const totalSlides = carouselCards.length;

        function updateSlider(index) {
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

            // 4. Update Progress Bar
            if (progressFill) {
                const progressPercentage = ((currentSlide + 1) / totalSlides) * 100;
                progressFill.style.width = `${progressPercentage}%`;
            }

            // 5. Update Slide Count
            if (currentSlideNum) {
                currentSlideNum.textContent = `0${currentSlide + 1}`;
            }
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                updateSlider(currentSlide - 1);
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                updateSlider(currentSlide + 1);
            });
        }

        carouselCards.forEach((card) => {
            card.addEventListener('click', () => {
                const index = parseInt(card.getAttribute('data-slide-index'), 10);
                updateSlider(index);
            });
        });

        // Sync initial view
        updateSlider(0);
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
            let activeDest = null;
            const activeTextSlide = document.querySelector('.text-slide-item.active');
            if (activeTextSlide) {
                const subtitleElem = activeTextSlide.querySelector('.subtitle');
                if (subtitleElem) {
                    activeDest = subtitleElem.textContent.replace('Embark On The Journey Of A Lifetime', '').trim();
                }
            }
            openBookingModal(activeDest);
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

    // Home Page Save Badge Alert
    const saveAdventureBtn = document.getElementById('btn-save-adventure');
    if (saveAdventureBtn) {
        saveAdventureBtn.addEventListener('click', () => {
            const activeTextSlide = document.querySelector('.text-slide-item.active');
            if (activeTextSlide) {
                const titleElem = activeTextSlide.querySelector('.main-title');
                const currentTitle = titleElem ? titleElem.textContent.replace('\n', ' ').trim() : 'Destination';
                alert(`"${currentTitle}" has been saved to your Bookmarks list!`);
            }
        });
    }
});
