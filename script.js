document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.getElementById('navLinks');
    const mobileMenu = document.getElementById('mobileMenu');
    const headerNavLinks = document.querySelectorAll('.nav-links a');
    const logoLink = document.querySelector('.logo');
    const loaderContainer = document.querySelector('.loader-container');

    const hideLoader = () => {
        if (loaderContainer) {
            loaderContainer.classList.add('hidden');
        }
    };

    window.addEventListener('load', hideLoader);

    window.showPage = function(pageId) {
        let targetUrl;
        
        switch(pageId) {
            case 'home':
                targetUrl = 'index.html';
                break;
            case 'content':
                targetUrl = 'content.html';
                break;
            case 'join':
                targetUrl = 'join.html';
                break;
            case 'contact':
                targetUrl = 'contact.html';
                break;
            default:
                targetUrl = 'index.html';
        }
        
        window.location.href = targetUrl;
    };

    const setActiveNavLink = () => {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        
        headerNavLinks.forEach(link => {
            link.classList.remove('active-link');
            
            const linkPage = link.getAttribute('onclick');
            if (linkPage) {
                if ((currentPage === 'index.html' && linkPage.includes("'home'")) ||
                    (currentPage === '' && linkPage.includes("'home'")) ||
                    (currentPage === 'content.html' && linkPage.includes("'content'")) ||
                    (currentPage === 'join.html' && linkPage.includes("'join'")) ||
                    (currentPage === 'contact.html' && linkPage.includes("'contact'"))) {
                    link.classList.add('active-link');
                }
            }
        });
    };

    mobileMenu.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        mobileMenu.classList.toggle('open');
    });

    headerNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                mobileMenu.classList.remove('open');
            }
        });
    });

    if (logoLink) {
        logoLink.addEventListener('click', (event) => {
            event.preventDefault();
            showPage('home');
        });
    }

    setActiveNavLink();

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetElement = document.querySelector(this.getAttribute('href'));
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    window.submitContactForm = function(event) {
        event.preventDefault();
        alert('تم إرسال رسالتك بنجاح! شكراً لك.');
        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
            contactForm.reset();
        }
    };

    // ---------------------- Slider Logic Start ----------------------
    const sliderWrapper = document.querySelector('.slider-wrapper');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');

    if (sliderWrapper && prevBtn && nextBtn) {
        const cards = Array.from(sliderWrapper.querySelectorAll('.slider-card'));
        
        const findCenteredCardIndex = () => {
            const wrapperCenter = sliderWrapper.scrollLeft + sliderWrapper.offsetWidth / 2;
            let closestIndex = 0;
            let minDiff = Infinity;

            cards.forEach((card, index) => {
                const cardCenter = card.offsetLeft + card.offsetWidth / 2;
                const diff = Math.abs(cardCenter - wrapperCenter);
                if (diff < minDiff) {
                    minDiff = diff;
                    closestIndex = index;
                }
            });
            return closestIndex;
        };

        nextBtn.addEventListener('click', () => {
            const currentIndex = findCenteredCardIndex();
            const nextIndex = (currentIndex + 1) % cards.length;
            const nextCard = cards[nextIndex];
            const targetPos = nextCard.offsetLeft - (sliderWrapper.offsetWidth / 2) + (nextCard.offsetWidth / 2);

            sliderWrapper.scrollTo({
                left: targetPos,
                behavior: 'smooth'
            });
        });

        prevBtn.addEventListener('click', () => {
            const currentIndex = findCenteredCardIndex();
            const prevIndex = (currentIndex - 1 + cards.length) % cards.length;
            const prevCard = cards[prevIndex];
            const targetPos = prevCard.offsetLeft - (sliderWrapper.offsetWidth / 2) + (prevCard.offsetWidth / 2);

            sliderWrapper.scrollTo({
                left: targetPos,
                behavior: 'smooth'
            });
        });
    }
    // ---------------------- Slider Logic End ----------------------

    window.addEventListener('popstate', () => {
        setActiveNavLink();
    });

    headerNavLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const onclick = link.getAttribute('onclick');
            if (onclick) {
                eval(onclick);
            }
        });
    });
});

const form = document.getElementById('contactForm');
const formMessage = document.getElementById('formMessage');
const formMessageText = document.getElementById('formMessageText');
const formMessageIcon = document.getElementById('formMessageIcon');

if (form) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(form);
        const action = form.getAttribute('action');

        try {
            const response = await fetch(action, {
                method: 'POST',
                body: formData,
                headers: { 'Accept': 'application/json' }
            });

            if (response.ok) {
                showFormMessage("تم إرسال رسالتك بنجاح! شكراً لك.", "fas fa-check-circle", false);
                form.reset();
            } else {
                showFormMessage("حدث خطأ، حاول مرة أخرى!", "fas fa-times-circle", true);
            }
        } catch (error) {
            showFormMessage("حدث خطأ، حاول مرة أخرى!", "fas fa-times-circle", true);
        }
    });
}

function showFormMessage(message, iconClass, isError) {
    if (formMessageText && formMessageIcon && formMessage) {
        formMessageText.textContent = message;
        formMessageIcon.className = iconClass;
        formMessage.style.backgroundColor = isError ? "#E74C3C" : "#4CAF50";
        formMessage.style.display = "block";
        setTimeout(() => formMessage.classList.add("show"), 50);
        setTimeout(() => {
            formMessage.classList.remove("show");
            setTimeout(() => formMessage.style.display = "none", 300);
        }, 3000);
    }
}