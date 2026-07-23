/* ==========================================================================
   COLMEIA - INTERACTIVE SCRIPT
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Header scroll shadow effect
  const header = document.querySelector('.site-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // 2. Animated Stats Counter
  const statNumbers = document.querySelectorAll('.stat-number');
  let animated = false;

  function animateCounters() {
    const statsSection = document.querySelector('.stats-banner');
    if (!statsSection) return;

    const sectionPos = statsSection.getBoundingClientRect().top;
    const screenPos = window.innerHeight / 1.2;

    if (sectionPos < screenPos && !animated) {
      animated = true;
      statNumbers.forEach(stat => {
        const targetText = stat.innerText;
        const hasPlus = targetText.includes('+');
        const hasPercent = targetText.includes('%');
        const hasM = targetText.includes('M');

        let rawNumber = parseFloat(targetText.replace(/[^0-9.]/g, ''));
        if (isNaN(rawNumber)) return;

        let current = 0;
        const duration = 2000;
        const stepTime = 30;
        const steps = duration / stepTime;
        const increment = rawNumber / steps;

        const timer = setInterval(() => {
          current += increment;
          if (current >= rawNumber) {
            current = rawNumber;
            clearInterval(timer);
          }

          let formatted = Math.floor(current);
          if (hasM) formatted = Math.floor(current);

          let resultStr = '';
          if (hasPlus) resultStr += '+';
          resultStr += formatted;
          if (hasM) resultStr += 'M';
          if (hasPercent) resultStr += '%';

          stat.innerText = resultStr;
        }, stepTime);
      });
    }
  }

  window.addEventListener('scroll', animateCounters);
  animateCounters(); // Trigger on load if already in view

  // 3. Smooth scrolling for internal anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const headerOffset = 84;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // 4. Mobile Menu Toggle
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = navMenu.style.display === 'flex';
      if (isOpen) {
        navMenu.style.display = 'none';
      } else {
        navMenu.style.display = 'flex';
        navMenu.style.flexDirection = 'column';
        navMenu.style.position = 'absolute';
        navMenu.style.top = '84px';
        navMenu.style.left = '0';
        navMenu.style.width = '100%';
        navMenu.style.backgroundColor = '#FFFFFF';
        navMenu.style.padding = '24px';
        navMenu.style.boxShadow = '0 12px 24px rgba(0,0,0,0.1)';
      }
    });
  }

  // 5. Scroll Reveal Intersection Observer for Micro-Animations
  const revealElements = document.querySelectorAll('.service-card, .process-card, .case-card, .testimonial-card, .stat-item, .section-title, .hero-content');
  
  revealElements.forEach((el, index) => {
    el.classList.add('reveal');
    // Stagger delay for cards in grids
    const delayClass = `reveal-delay-${(index % 5) + 1}`;
    el.classList.add(delayClass);
  });

  const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.reveal').forEach(el => {
    revealObserver.observe(el);
  });
});
