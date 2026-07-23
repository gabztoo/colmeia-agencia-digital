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

  // 4. Mobile Menu Toggle with Smooth Class State & Link Auto-Close
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('is-open');
      mobileToggle.classList.toggle('is-active');
    });

    // Close mobile menu when clicking any nav link
    navMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('is-open');
        mobileToggle.classList.remove('is-active');
      });
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

  // 6. Interactive Multi-Step Qualification Funnel Modal
  const funnelModal = document.getElementById('funnelModal');
  const funnelBackdrop = document.getElementById('funnelBackdrop');
  const closeFunnelBtn = document.getElementById('closeFunnelBtn');
  const funnelBackBtn = document.getElementById('funnelBackBtn');
  const funnelProgress = document.getElementById('funnelProgress');
  const stepIndicator = document.getElementById('stepIndicator');
  const funnelSteps = document.querySelectorAll('.funnel-step');
  const funnelForm = document.getElementById('funnelForm');

  let currentStep = 1;
  const answers = {
    objetivo: '',
    faturamento: '',
    orcamento: '',
    urgencia: ''
  };

  function openFunnelModal() {
    if (!funnelModal) return;
    funnelModal.classList.add('is-active');
    funnelModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeFunnelModal() {
    if (!funnelModal) return;
    funnelModal.classList.remove('is-active');
    funnelModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function updateStepView() {
    funnelSteps.forEach(step => {
      const stepNum = parseInt(step.getAttribute('data-step'), 10);
      if (stepNum === currentStep) {
        step.classList.add('active');
      } else {
        step.classList.remove('active');
      }
    });

    if (stepIndicator) {
      stepIndicator.innerText = `Etapa ${currentStep} de 5`;
    }
    if (funnelProgress) {
      funnelProgress.style.width = `${(currentStep / 5) * 100}%`;
    }

    if (funnelBackBtn) {
      funnelBackBtn.style.display = currentStep > 1 ? 'block' : 'none';
    }

    // Populate Step 5 Live Recap Tags
    if (currentStep === 5) {
      const recapObj = document.getElementById('recapObjetivo');
      const recapFat = document.getElementById('recapFaturamento');
      const recapOrc = document.getElementById('recapOrcamento');
      const recapUrg = document.getElementById('recapUrgencia');

      if (recapObj) recapObj.innerText = answers.objetivo ? `🎯 ${answers.objetivo.split('(')[0]}` : '🎯 Objetivo';
      if (recapFat) recapFat.innerText = answers.faturamento ? `🟢 ${answers.faturamento.split('(')[0]}` : '🟢 Fase Atual';
      if (recapOrc) recapOrc.innerText = answers.orcamento ? `💰 ${answers.orcamento}` : '💰 Orçamento';
      if (recapUrg) recapUrg.innerText = answers.urgencia ? `🔥 ${answers.urgencia.split('(')[0]}` : '🔥 Urgência';
    }
  }

  // Universal Event Listener to Open Funnel Modal on ALL Action Buttons
  const allFunnelTriggers = document.querySelectorAll(`
    .header-cta-btn,
    .btn,
    .scroll-hint-btn,
    a[href="#contato"],
    a[href*="wa.me"],
    [data-open-funnel="true"]
  `);

  allFunnelTriggers.forEach(btn => {
    // Avoid triggering funnel on close button or inside modal submit button
    if (btn.closest('.funnel-modal')) return;

    btn.addEventListener('click', (e) => {
      // Prevent default navigation / jumping
      e.preventDefault();
      openFunnelModal();
    });
  });

  if (closeFunnelBtn) closeFunnelBtn.addEventListener('click', closeFunnelModal);
  if (funnelBackdrop) funnelBackdrop.addEventListener('click', closeFunnelModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && funnelModal && funnelModal.classList.contains('is-active')) {
      closeFunnelModal();
    }
  });

  // Phone input auto-masking: (XX) XXXXX-XXXX
  const phoneInput = document.getElementById('funnelPhone');
  if (phoneInput) {
    phoneInput.addEventListener('input', (e) => {
      let v = e.target.value.replace(/\D/g, '');
      if (v.length > 11) v = v.substring(0, 11);
      if (v.length > 6) {
        e.target.value = `(${v.substring(0, 2)}) ${v.substring(2, 7)}-${v.substring(7)}`;
      } else if (v.length > 2) {
        e.target.value = `(${v.substring(0, 2)}) ${v.substring(2)}`;
      } else if (v.length > 0) {
        e.target.value = `(${v}`;
      } else {
        e.target.value = '';
      }
    });
  }

  // Handle Option Click (1-click auto advance)
  document.querySelectorAll('.funnel-option-card').forEach(card => {
    card.addEventListener('click', function () {
      const key = this.getAttribute('data-key');
      const value = this.getAttribute('data-value');

      if (key && value) {
        answers[key] = value;
      }

      const parentGrid = this.closest('.funnel-options-grid');
      if (parentGrid) {
        parentGrid.querySelectorAll('.funnel-option-card').forEach(item => item.classList.remove('selected'));
      }
      this.classList.add('selected');

      setTimeout(() => {
        if (currentStep < 5) {
          currentStep++;
          updateStepView();
        }
      }, 220);
    });
  });

  // Handle Back Button
  if (funnelBackBtn) {
    funnelBackBtn.addEventListener('click', () => {
      if (currentStep > 1) {
        currentStep--;
        updateStepView();
      }
    });
  }

  // Handle Form Submission -> Format WhatsApp Message
  if (funnelForm) {
    funnelForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('funnelName')?.value.trim() || '';
      const company = document.getElementById('funnelCompany')?.value.trim() || '';
      const phone = document.getElementById('funnelPhone')?.value.trim() || '';

      const whatsappNumber = '5521991014422';

      const text = `Olá, equipe Colmeia! Preenchi o formulário de Diagnóstico no site:

👤 *Nome:* ${name}
🏢 *Empresa:* ${company}
📱 *WhatsApp:* ${phone}

🎯 *Objetivo:* ${answers.objetivo || 'Não informado'}
🟢 *Faturamento/Fase:* ${answers.faturamento || 'Não informado'}
💰 *Investimento Mensal:* ${answers.orcamento || 'Não informado'}
🔥 *Urgência:* ${answers.urgencia || 'Não informado'}

Gostaria de agendar meu atendimento estratégico!`;

      const encodedText = encodeURIComponent(text);
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedText}`;

      window.open(whatsappUrl, '_blank');
      closeFunnelModal();
    });
  }
});
