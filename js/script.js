document.addEventListener("DOMContentLoaded", function() {
    var navLinks = document.querySelectorAll('.navbar-nav .nav-link .lk');
    var navCollapse = document.querySelector('.navbar-collapse');
    const nav = document.querySelector('.navbar');
    const toggler = document.querySelector('.custom-toggler');
    const navbarCollapse = document.getElementById('navbarNav');

    navLinks.forEach(function(navLink) {
        navLink.addEventListener('click', function() {
            var bsCollapse = new bootstrap.Collapse(navCollapse, {
                toggle: false
            });
            bsCollapse.hide();
        });
    });

    const toggleScrolled = () => {
        if (window.scrollY > 0) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    };
    toggleScrolled();
    window.addEventListener('scroll', toggleScrolled, { passive: true });

    document.querySelectorAll('.tcl').forEach(link => {
        let clicked = false;

        link.addEventListener('click', function(e) {
            if (!clicked) {
                e.preventDefault(); 
                clicked = true;
            } else {
            // Second click: allow default behavior
            }
        });
    });

    navbarCollapse.addEventListener('show.bs.collapse', () => {
        toggler.classList.add('active');
    });

    navbarCollapse.addEventListener('hide.bs.collapse', () => {
        toggler.classList.remove('active');
    });

    function initializeSlider(sliderContainer) {
        const sliderContent = sliderContainer.querySelector('.slider-content');
        const sliderSlides = sliderContainer.querySelectorAll('.slider-slide');
        const sliderDotsContainer = sliderContainer.querySelector('.slider-dots');
        const prevButton = sliderContainer.querySelector('.slider-prev');
        const nextButton = sliderContainer.querySelector('.slider-next');
        
        let currentSlide = 0;
        let slidesPerView = 3;
        
        // Check if this is the second slider
        const isSecondSlider = sliderContainer.id === 'slider2' || 
                            Array.from(document.querySelectorAll('.slider-container')).indexOf(sliderContainer) === 1;
        
        // Function to update slides per view based on screen width
        function updateSlidesPerView() {
            if (isSecondSlider) {
                // Always show 1 slide for the second slider
                slidesPerView = 1;
            } else if (window.innerWidth <= 768) {
                slidesPerView = 1;
            } else if (window.innerWidth <= 992) {
                slidesPerView = 2;
            } else {
                slidesPerView = 3;
            }
            
            // Update slide widths
            sliderSlides.forEach(slide => {
                slide.style.flex = `0 0 ${100 / slidesPerView}%`;
            });
            
            // Recalculate and reposition slider
            goToSlide(currentSlide);
        }
        
        // Initial setup
        updateSlidesPerView();
        
        // Create dots dynamically for each slider
        sliderSlides.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.classList.add('slider-dot');
            if (index === 0) {
                dot.classList.add('active');
            }
            dot.addEventListener('click', () => {
                goToSlide(index);
            });
            sliderDotsContainer.appendChild(dot);
        });
        
        // Handle touch gestures for mobile devices
        let touchStartX = 0;
        let touchEndX = 0;
        
        sliderContainer.addEventListener('touchstart', (event) => {
            touchStartX = event.touches[0].clientX;
        });
        
        sliderContainer.addEventListener('touchend', (event) => {
            touchEndX = event.changedTouches[0].clientX;
            handleSwipeGesture();
        });
        
        function handleSwipeGesture() {
            const swipeDistance = touchEndX - touchStartX;
            const minSwipeDistance = 50; // Minimum distance to trigger a swipe
            
            if (swipeDistance > minSwipeDistance) {
                goToSlide(currentSlide - 1);
            } else if (swipeDistance < -minSwipeDistance) {
                goToSlide(currentSlide + 1);
            }
        }
        
        // Navigate to a specific slide
        function goToSlide(slideIndex) {
            if (isSecondSlider) {
                // For second slider with 1 slide per view
                if (slideIndex < 0) {
                    slideIndex = sliderSlides.length - 1;
                } else if (slideIndex >= sliderSlides.length) {
                    slideIndex = 0;
                }
            } else {
                // For other sliders with multiple slides per view
                if (slideIndex < 0) {
                    slideIndex = sliderSlides.length - slidesPerView;
                } else if (slideIndex >= sliderSlides.length - slidesPerView + 1) {
                    slideIndex = 0;
                }
            }
            
            currentSlide = slideIndex;
            
            const translateX = -slideIndex * (100 / slidesPerView);
            sliderContent.style.transform = `translateX(${translateX}%)`;
            
            // Update the active dot
            const dots = sliderDotsContainer.querySelectorAll('.slider-dot');
            dots.forEach((dot, index) => {
                // For second slider with 1 slide per view, highlight the current slide
                // For other sliders, highlight the first visible slide
                const dotIndex = isSecondSlider ? index : index;
                dot.classList.toggle('active', dotIndex === currentSlide);
            });
        }
        
        // Add click events for Next and Prev buttons
        prevButton.addEventListener('click', () => {
            goToSlide(currentSlide - 1);
        });
        
        nextButton.addEventListener('click', () => {
            goToSlide(currentSlide + 1);
        });
        
        // Auto-slide functionality
        let autoSlideInterval;
        
        function startAutoSlide() {
            autoSlideInterval = setInterval(() => {
                goToSlide(currentSlide + 1);
            }, 5000); // Adjust interval as needed
        }
        
        function stopAutoSlide() {
            clearInterval(autoSlideInterval);
        }
        
        // Start auto-slide initially
        startAutoSlide();
        
        // Pause auto-slide on interaction and resume after interaction
        sliderContainer.addEventListener('mouseenter', stopAutoSlide);
        sliderContainer.addEventListener('mouseleave', startAutoSlide);
        
        sliderContainer.addEventListener('touchstart', stopAutoSlide);
        sliderContainer.addEventListener('touchend', startAutoSlide);
        
        // Support keyboard navigation
        document.addEventListener('keydown', (event) => {
            if (event.key === 'ArrowLeft') {
                event.preventDefault(); // Prevent default scrolling behavior
                goToSlide(currentSlide - 1);
            } else if (event.key === 'ArrowRight') {
                event.preventDefault(); // Prevent default scrolling behavior
                goToSlide(currentSlide + 1);
            }
        });
        
        // Update on window resize
        window.addEventListener('resize', () => {
            updateSlidesPerView();
        });
    }
    // Initialize all sliders on the page
    const sliderContainers = document.querySelectorAll('.slider-container');
    sliderContainers.forEach((sliderContainer, index) => {
        // Add an ID to identify the second slider
        if (index === 1) {
            sliderContainer.id = 'slider2';
        }
        initializeSlider(sliderContainer);
    });

    const multiSelect = document.querySelector(".multi-select");
    const trigger = multiSelect.querySelector(".multi-select-trigger");
    const dropdown = multiSelect.querySelector(".multi-select-dropdown");

    trigger.addEventListener("click", () => {
        dropdown.style.display =
            dropdown.style.display === "block" ? "none" : "block";
    });

    document.addEventListener("click", (e) => {
        if (!multiSelect.contains(e.target)) {
            dropdown.style.display = "none";
        }
    });

    const checkboxes = dropdown.querySelectorAll("input[type='checkbox']");
    checkboxes.forEach(cb => {
        cb.addEventListener("change", () => {
            const selected = Array.from(checkboxes)
                .filter(c => c.checked)
                .map(c => c.parentElement.textContent.trim());

            trigger.textContent = selected.length
                ? selected.join(", ")
                : "Select Services";
        });
    });

    const counters = document.querySelectorAll(".counter .count");

    const animateCounter = (el) => {
        const target = parseInt(el.textContent.replace(/\D/g, ""), 10);
        const suffix = el.textContent.replace(/[0-9]/g, ""); // handles + or other symbols
        let current = 0;

        const duration = 2000; // ms
        const startTime = performance.now();

        const update = (now) => {
            const progress = Math.min((now - startTime) / duration, 1);
            current = Math.floor(progress * target);
            el.textContent = current + suffix;

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                el.textContent = target + suffix; // final correction
            }
        };

        requestAnimationFrame(update);
    };

    const observer = new IntersectionObserver(
        (entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    obs.unobserve(entry.target); // fire once, no replays
                }
            });
        },
        {
            threshold: 0.5 // 50% visibility = intentional engagement
        }
    );

    counters.forEach(counter => observer.observe(counter));

    const parallaxSections = document.querySelectorAll(
        "#home-2, #sg"
    );

    window.addEventListener("scroll", () => {
        parallaxSections.forEach(el => {
            const rect = el.getBoundingClientRect();
            const offset = rect.top * -0.3;

            el.style.setProperty(
                "--parallax-shift",
                `${offset}px`
            );
        });
    });

});
document.addEventListener('DOMContentLoaded', () => {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const answer = item.querySelector('.faq-answer');
        const icon = item.querySelector('.faq-icon');
        const question = item.querySelector('.faq-question');

        if (!answer || !icon || !question) return;

        if (item.classList.contains('active')) {
            answer.style.maxHeight = answer.scrollHeight + 'px';
            icon.textContent = '-';
        } else {
            answer.style.maxHeight = null;
            icon.textContent = '+';
        }

        question.addEventListener('click', () => {
            const open = document.querySelector('.faq-item.active');

            if (open && open !== item) {
                open.classList.remove('active');
                open.querySelector('.faq-icon').textContent = '+';
                open.querySelector('.faq-answer').style.maxHeight = null;
            }

            item.classList.toggle('active');

            if (item.classList.contains('active')) {
                answer.style.maxHeight = answer.scrollHeight + 'px';
                icon.textContent = '-';
            } else {
                answer.style.maxHeight = null;
                icon.textContent = '+';
            }
        });
    });
});
