// Navigation handling
document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger-menu');
    const mobileNav = document.querySelector('.mobile-nav');
    const navLinks = document.querySelectorAll('.mobile-nav a');

    // Toggle mobile menu
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        mobileNav.style.display = hamburger.classList.contains('active') ? 'block' : 'none';
        if (hamburger.classList.contains('active')) {
            setTimeout(() => mobileNav.classList.add('active'), 10);
        } else {
            mobileNav.classList.remove('active');
        }
    });

    // Close mobile menu when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            mobileNav.classList.remove('active');
            setTimeout(() => {
                mobileNav.style.display = 'none';
            }, 300);
        });
    });

    // Handle window resize
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            hamburger.classList.remove('active');
            mobileNav.classList.remove('active');
            mobileNav.style.display = 'none';
        }
    });

    // Add active class to current navigation link
    function updateActiveLink() {
        const currentRoute = window.location.pathname.substring(1) || 'home';
        document.querySelectorAll('[data-route]').forEach(link => {
            if (link.getAttribute('data-route') === currentRoute) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    // Update active link when route changes
    window.addEventListener('popstate', updateActiveLink);
    document.addEventListener('click', (e) => {
        if (e.target.matches('[data-route]')) {
            updateActiveLink();
        }
    });

    // Initial active link update
    updateActiveLink();
}); 