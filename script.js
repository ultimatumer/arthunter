// Arthunter interactive scripts — 2026 cleanup
document.addEventListener('DOMContentLoaded', () => {
  const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false;

  // ---------- Mobile navigation ----------
  const navToggle = document.querySelector('.nav-toggle');
  const nav = document.getElementById('primary-nav') || document.querySelector('.nav-links');

  function setNavOpen(isOpen){
    document.body.classList.toggle('is-nav-open', isOpen);
    if (navToggle) navToggle.setAttribute('aria-expanded', String(isOpen));
  }

  if (navToggle && nav){
    navToggle.addEventListener('click', () => {
      const isOpen = document.body.classList.contains('is-nav-open');
      setNavOpen(!isOpen);
    });

    // Close menu when a link is clicked (mobile)
    nav.addEventListener('click', (e) => {
      const target = e.target;
      if (target && target.tagName === 'A' && document.body.classList.contains('is-nav-open')){
        setNavOpen(false);
      }
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && document.body.classList.contains('is-nav-open')){
        setNavOpen(false);
        navToggle.focus();
      }
    });

    // Close when resizing up to desktop
    window.addEventListener('resize', () => {
      if (window.innerWidth > 860 && document.body.classList.contains('is-nav-open')){
        setNavOpen(false);
      }
    });
  }

  // ---------- Courses data (shared) ----------
  const courses = [
    {
      id: 1,
      name: 'Основы акварели',
      level: 'beginner',
      medium: 'Watercolor',
      time: '1-2',
      image: 'images/course1.png',
      description: 'Освойте базовые техники работы с акварелью и создайте свою первую картину под руководством Анны Смироновой.',
      url: 'course-watercolor.html',
      teacher: 'Анна Смиронова',
      teacherImg: 'images/teacher_anna.png'
    },
    {
      id: 2,
      name: 'Пастельные пейзажи',
      level: 'intermediate',
      medium: 'Pastel',
      time: '1-2',
      image: 'images/course2.png',
      description: 'Мягкие переходы, свет и воздух: пастельные пейзажи под руководством Михаила Козлова.',
      url: 'course-pastel.html',
      teacher: 'Михаил Козлов',
      teacherImg: 'images/teacher_mikhail.png'
    },
    {
      id: 3,
      name: 'Цифровая иллюстрация',
      level: 'beginner',
      medium: 'Digital',
      time: '1-2',
      image: 'images/course3.png',
      description: 'Погрузитесь в мир цифрового творчества: работайте со слоями, кистями и цветом на планшете вместе с Софией Ли.',
      url: 'course-digital.html',
      teacher: 'София Ли',
      teacherImg: 'images/teacher_sofia.png'
    },
    {
      id: 4,
      name: 'Профессиональный курс',
      level: 'advanced',
      medium: 'Watercolor',
      time: '3+',
      image: 'images/course1.png',
      description: 'Авторский курс для продвинутых художников: углублённые техники акварели и пастели.',
      url: 'course-pro.html',
      teacher: 'Кураторы Arthunter',
      teacherImg: 'images/teacher_pro.png'
    }
  ];

  // Display mappings (RU)
  const levelNames = { beginner: 'Новичок', intermediate: 'Средний', advanced: 'Продвинутый' };
  const mediumNames = { Watercolor: 'Акварель', Pastel: 'Пастель', Digital: 'Цифровой' };
  const timeNames = { '1-2': '1–2', '3+': '3+' };
  const toLevelRU = (v) => levelNames[v] || v;
  const toMediumRU = (v) => mediumNames[v] || v;
  const toTimeRU = (v) => timeNames[v] || v;

  // ---------- Path finder (index) ----------
  function updateSuggestions(){
    const suggestionsContainer = document.getElementById('suggestions');
    const mediumSelect = document.getElementById('medium-select');
    const timeRange = document.getElementById('time-range');
    if (!suggestionsContainer || !mediumSelect || !timeRange) return;

    const level = document.querySelector('input[name="level"]:checked')?.value || '';
    const medium = mediumSelect.value;
    const timeCategory = timeRange.value === '1' ? '1-2' : '3+';

    const filtered = courses.filter(course => {
      const levelMatch = level === '' || course.level === level;
      const mediumMatch = medium === 'Any' || course.medium === medium;
      const timeMatch = course.time === timeCategory;
      return levelMatch && mediumMatch && timeMatch;
    });

    suggestionsContainer.innerHTML = '';
    if (filtered.length === 0){
      const msg = document.createElement('p');
      msg.textContent = 'По выбранным параметрам пока нет подходящих курсов.';
      suggestionsContainer.appendChild(msg);
      return;
    }

    filtered.forEach(course => {
      const card = document.createElement('a');
      card.className = 'course-item-card';
      card.href = course.url;
      card.innerHTML = `
        <div class="course-img-wrapper">
          <img src="${course.image}" alt="${course.name}" loading="lazy">
        </div>
        <div class="course-item-content">
          <h3>${course.name}</h3>
          <p>Уровень: ${toLevelRU(course.level)} • Материал: ${toMediumRU(course.medium)} • Время: ${toTimeRU(course.time)}&nbsp;ч.</p>
          <div class="teacher-mini">
            <img src="${course.teacherImg}" alt="${course.teacher}" loading="lazy">
            <span>${course.teacher}</span>
          </div>
        </div>
      `;
      suggestionsContainer.appendChild(card);
    });
  }

  const levelInputs = document.querySelectorAll('input[name="level"]');
  levelInputs.forEach(input => input.addEventListener('change', updateSuggestions));
  document.getElementById('medium-select')?.addEventListener('change', updateSuggestions);
  document.getElementById('time-range')?.addEventListener('input', updateSuggestions);
  updateSuggestions();

  // ---------- Courses page list ----------
  function updateCourseList(){
    const courseContainer = document.getElementById('courseList');
    if (!courseContainer) return;

    const levelSel = document.getElementById('course-level-select');
    const mediumSel = document.getElementById('course-medium-select');
    const timeSel = document.getElementById('course-time-select');

    const level = levelSel?.value ?? 'Any';
    const medium = mediumSel?.value ?? 'Any';
    const time = timeSel?.value ?? 'Any';

    const filtered = courses.filter(course => {
      const levelMatch = level === 'Any' || course.level === level;
      const mediumMatch = medium === 'Any' || course.medium === medium;
      const timeMatch = time === 'Any' || course.time === time;
      return levelMatch && mediumMatch && timeMatch;
    });

    courseContainer.innerHTML = '';
    filtered.forEach(course => {
      const card = document.createElement('div');
      card.className = 'course-card';
      card.innerHTML = `
        <img src="${course.image}" alt="${course.name}" loading="lazy">
        <div class="course-content">
          <h3><a href="${course.url}">${course.name}</a></h3>
          <p>${course.description}</p>
          <div class="details">Уровень: ${toLevelRU(course.level)} | Материал: ${toMediumRU(course.medium)} | Время: ${toTimeRU(course.time)} ч.</div>
        </div>
      `;
      courseContainer.appendChild(card);
    });

    if (filtered.length === 0){
      const msg = document.createElement('p');
      msg.textContent = 'Курсы, удовлетворяющие выбранным параметрам, не найдены.';
      courseContainer.appendChild(msg);
    }
  }

  document.getElementById('course-level-select')?.addEventListener('change', updateCourseList);
  document.getElementById('course-medium-select')?.addEventListener('change', updateCourseList);
  document.getElementById('course-time-select')?.addEventListener('change', updateCourseList);
  updateCourseList();

  // ---------- Support modal (index) ----------
  const supportButton = document.getElementById('supportOpen');
  const modal = document.getElementById('supportModal');
  const closeBtn = document.getElementById('closeModal');
  const supportForm = document.getElementById('supportForm');

  let lastFocused = null;

  function openModal(){
    if (!modal) return;
    lastFocused = document.activeElement;
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    const first = modal.querySelector('input, textarea, button');
    (first || closeBtn || modal).focus?.();
  }

  function closeModal(){
    if (!modal) return;
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    lastFocused?.focus?.();
  }

  if (supportButton && modal){
    supportButton.addEventListener('click', openModal);
  }
  closeBtn?.addEventListener('click', closeModal);

  modal?.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (!modal) return;
    if (modal.getAttribute('aria-hidden') === 'false' && e.key === 'Escape'){
      closeModal();
    }
    // Focus trap (basic)
    if (modal.getAttribute('aria-hidden') === 'false' && e.key === 'Tab'){
      const focusables = Array.from(modal.querySelectorAll('a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'))
        .filter(el => !el.hasAttribute('disabled') && !el.getAttribute('aria-hidden'));
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first){
        e.preventDefault(); last.focus();
      } else if (!e.shiftKey && document.activeElement === last){
        e.preventDefault(); first.focus();
      }
    }
  });

  supportForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    // Keep it lightweight: confirm and close.
    alert('Спасибо за обращение! Мы свяжемся с вами по электронной почте.');
    supportForm.reset();
    closeModal();
  });

  // ---------- Newsletter (index) ----------
  const newsletterForm = document.getElementById('newsletterForm');
  newsletterForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    alert('Спасибо! Вы подписались на новости и бесплатные марафоны.');
    newsletterForm.reset();
  });

  // ---------- Course detail pages (enroll modal + totals + examples carousel) ----------
  const enrollModal = document.getElementById('enrollModal');
  const enrollForm = document.getElementById('enrollForm');
  const enrollEmail = document.getElementById('enrollEmail');
  const enrollPlan = document.getElementById('enrollPlan');
  const enrollPrice = document.getElementById('enrollPrice');
  const enrollMeta = document.getElementById('enrollMeta');
  const enrollOk = document.getElementById('enrollOk');

  let enrollLastFocused = null;

  function starsWord(n){
    const mod10 = n % 10;
    const mod100 = n % 100;
    if (mod10 === 1 && mod100 !== 11) return 'звезда';
    if ([2,3,4].includes(mod10) && ![12,13,14].includes(mod100)) return 'звезды';
    return 'звезд';
  }

  function formatHours(hours){
    const fixed = (Math.round(hours * 10) / 10).toFixed(1);
    const normalized = fixed.endsWith('.0') ? fixed.slice(0, -2) : fixed;
    return normalized.replace('.', ',');
  }

  function openEnrollModal({ plan = '', price = '' } = {}){
    if (!enrollModal) return;
    enrollLastFocused = document.activeElement;
    enrollModal.setAttribute('aria-hidden', 'false');
    enrollModal.classList.add('is-open');
    document.body.style.overflow = 'hidden';

    if (enrollPlan) enrollPlan.value = plan;
    if (enrollPrice) enrollPrice.value = price;
    if (enrollMeta){
      const parts = [];
      if (plan) parts.push(`Вариант: ${plan}`);
      if (price) parts.push(`Стоимость: ${String(price).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} ₽`);
      enrollMeta.textContent = parts.join(' • ');
    }
    if (enrollOk) enrollOk.hidden = true;
    enrollForm?.classList.remove('is-done');

    // focus
    window.setTimeout(() => {
      (enrollEmail || enrollModal.querySelector('button, input'))?.focus?.();
    }, 0);
  }

  function closeEnrollModal(){
    if (!enrollModal) return;
    enrollModal.setAttribute('aria-hidden', 'true');
    enrollModal.classList.remove('is-open');
    document.body.style.overflow = '';
    enrollLastFocused?.focus?.();
  }

  if (enrollModal){
    document.querySelectorAll('[data-enroll-open]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const plan = btn.getAttribute('data-plan') || '';
        const price = btn.getAttribute('data-price') || '';
        openEnrollModal({ plan, price });
      });
    });

    enrollModal.querySelectorAll('[data-enroll-close]').forEach((btn) => {
      btn.addEventListener('click', closeEnrollModal);
    });

    enrollModal.addEventListener('click', (e) => {
      const t = e.target;
      if (t && t.classList.contains('enroll-modal__overlay')) closeEnrollModal();
    });

    document.addEventListener('keydown', (e) => {
      if (enrollModal.getAttribute('aria-hidden') !== 'false') return;
      if (e.key === 'Escape') closeEnrollModal();

      // focus trap
      if (e.key === 'Tab'){
        const focusables = Array.from(enrollModal.querySelectorAll('a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'))
          .filter(el => !el.hasAttribute('disabled') && el.getAttribute('aria-hidden') !== 'true');
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first){
          e.preventDefault(); last.focus();
        } else if (!e.shiftKey && document.activeElement === last){
          e.preventDefault(); first.focus();
        }
      }
    });

    enrollForm?.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailVal = enrollEmail?.value?.trim() || '';
      if (!emailVal){
        enrollEmail?.focus?.();
        return;
      }

      // No backend here — lightweight confirmation.
      if (enrollOk) enrollOk.hidden = false;
      enrollForm?.classList.add('is-done');
    });
  }

  // Totals (stars + hours) for course pages
  const courseDurationElem = document.getElementById('courseDuration');
  const courseStarsTotalElem = document.getElementById('courseStarsTotal');
  const courseHoursTotalElem = document.getElementById('courseHoursTotal');

  if (courseDurationElem || courseStarsTotalElem || courseHoursTotalElem){
    const lessonCards = Array.from(document.querySelectorAll('.course-lesson-card'));
    let totalStars = 0;
    let totalMinutes = 0;

    lessonCards.forEach((card) => {
      const stars = Number(card.getAttribute('data-stars') || '0') || 0;
      totalStars += stars;

      const minM = Number(card.getAttribute('data-min') || '0') || 0;
      const maxM = Number(card.getAttribute('data-max') || '0') || 0;
      if (minM > 0 && maxM > 0){
        totalMinutes += (minM + maxM) / 2;
      } else {
        // fallback: try to parse “⏱ 45–60 минут”
        const timeText = card.querySelector('.meta-chip')?.textContent || '';
        const nums = timeText.match(/\d+/g)?.map(Number) || [];
        if (nums.length >= 2) totalMinutes += (nums[0] + nums[1]) / 2;
        else if (nums.length === 1) totalMinutes += nums[0];
      }

      // Normalize badge text (to avoid "5 звезды")
      const badgeText = card.querySelector('.course-lesson-card__badgeText');
      if (badgeText && stars){
        badgeText.textContent = `${stars} ${starsWord(stars)}`;
      }
    });

    const hours = totalMinutes / 60;
    const hoursText = formatHours(hours);

    if (courseDurationElem) courseDurationElem.textContent = hoursText;
    if (courseStarsTotalElem) courseStarsTotalElem.textContent = String(totalStars);
    if (courseHoursTotalElem) courseHoursTotalElem.textContent = hoursText;
  }

  // Examples carousel dots
  const examplesRail = document.getElementById('examplesRail');
  const examplesDots = document.getElementById('examplesDots');
  if (examplesRail && examplesDots){
    const cards = Array.from(examplesRail.querySelectorAll('.example-card'));

    const dots = cards.map((_, idx) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'examples-dot';
      b.setAttribute('aria-label', `Слайд ${idx + 1}`);
      b.addEventListener('click', () => {
        cards[idx].scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', inline: 'center', block: 'nearest' });
      });
      examplesDots.appendChild(b);
      return b;
    });

    function setActiveDot(activeIndex){
      dots.forEach((d, i) => d.setAttribute('aria-current', i === activeIndex ? 'true' : 'false'));
    }

    function getActiveIndex(){
      const railRect = examplesRail.getBoundingClientRect();
      const railCenter = railRect.left + railRect.width / 2;
      let bestIdx = 0;
      let bestDist = Infinity;
      cards.forEach((card, idx) => {
        const r = card.getBoundingClientRect();
        const c = r.left + r.width / 2;
        const dist = Math.abs(c - railCenter);
        if (dist < bestDist){
          bestDist = dist;
          bestIdx = idx;
        }
      });
      return bestIdx;
    }

    setActiveDot(0);
    let raf = null;
    examplesRail.addEventListener('scroll', () => {
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        setActiveDot(getActiveIndex());
      });
    }, { passive: true });
  }

  // ---------- Mascot → achievements (index) ----------
  // Visual + sound must match final_site_clean (cards, glow, splash), while keeping final_build logic (no layout shift).
  const mascotElem = document.getElementById('mascot');
  const achievementsElem = document.getElementById('achievements');
  const heroSection = document.querySelector('.hero');

  if (mascotElem && achievementsElem && heroSection){
    const starsNote = document.querySelector('.stars-note');

    const mascotHint = document.getElementById('mascotHint');
    const hintText = document.getElementById('mascotHintText');
    const hintStorageKey = 'arthunter_mascot_opened';
    const canUseStorage = (() => {
      try{
        window.localStorage.setItem('__ah_t', '1');
        window.localStorage.removeItem('__ah_t');
        return true;
      } catch (e){
        return false;
      }
    })();

    function showMascotHint(){
      if (!mascotHint || !hintText) return;
      mascotHint.classList.add('show');
      mascotHint.classList.remove('idle');
      mascotHint.setAttribute('aria-hidden', 'false');
      mascotElem.classList.add('mascot-hinting');
      mascotElem.setAttribute('aria-describedby', hintText.id);
    }

    function dismissMascotHint(persist = false){
      if (!mascotHint) return;
      mascotHint.classList.remove('show', 'idle');
      mascotHint.setAttribute('aria-hidden', 'true');
      mascotElem.classList.remove('mascot-hinting');
      mascotElem.removeAttribute('aria-describedby');
      /* подсказка показывается при каждом перезаходе — без сохранения в storage */
    }

    const alreadyOpened = false;
    if (mascotHint && hintText && !alreadyOpened){
      showMascotHint();
      // So the hint stays helpful but becomes less intrusive if the user doesn't click immediately.
      window.setTimeout(() => {
        if (mascotHint.classList.contains('show')) mascotHint.classList.add('idle');
      }, 9000);
    }

    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    const audioCtx = AudioContextClass ? new AudioContextClass() : null;

    function playAchievementSound(){
      if (!audioCtx) return;
      const now = audioCtx.currentTime;
      // Frequencies to play in the fanfare (final_site_clean)
      const freqs = [880, 660, 990];
      freqs.forEach((freq, index) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.value = freq;
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        const start = now + index * 0.18;
        const end = start + 0.2;
        gain.gain.setValueAtTime(0.3, start);
        gain.gain.exponentialRampToValueAtTime(0.001, end);
        osc.start(start);
        osc.stop(end);
      });
    }

    function revealAchievements(){
      // Fade out the mascot, keep its layout footprint.
      mascotElem.style.opacity = '0';
      mascotElem.classList.add('mascot-hidden');

      // Splash overlay behind hero content
      heroSection.classList.add('splashes');

      // Reveal the achievements fan
      achievementsElem.classList.add('show');
      achievementsElem.setAttribute('aria-hidden', 'false');
      mascotElem.setAttribute('aria-expanded', 'true');

      // Tagline appears after the fan finishes
      window.setTimeout(() => {
        if (starsNote) starsNote.classList.add('visible');
      }, 800);
    }

    function startAchievementSequence(){
      dismissMascotHint(true);
      // Prevent repeated clicks
      mascotElem.disabled = true;
      mascotElem.style.pointerEvents = 'none';
      mascotElem.style.transition = 'opacity 0.5s ease';

      // Resume the audio context if it is suspended (some browsers require interaction)
      if (audioCtx && audioCtx.state === 'suspended'){
        audioCtx.resume().catch(() => {});
      }
      // Play the celebratory sound
      playAchievementSound();

      if (prefersReducedMotion){
        revealAchievements();
        return;
      }

      // Trigger the spin animation (rotateY x2, final_site_clean)
      mascotElem.classList.add('spin');

      // After the animation ends, show achievements + splashes
      window.setTimeout(revealAchievements, 1600);
    }

    // a11y defaults
    achievementsElem.setAttribute('aria-hidden', 'true');
    mascotElem.setAttribute('aria-expanded', 'false');

    mascotElem.addEventListener('click', startAchievementSequence);
    // Button already activates on Enter/Space, but keep explicit handler for robustness.
    mascotElem.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' '){
        e.preventDefault();
        startAchievementSequence();
      }
    });
  }

});