/* ========================================
   REDOKU — Основные скрипты
   Enhanced with Discord Widget, Online Counter
   ======================================== */

const REDOKU_IP = 'redoku.bisquit.host';
const DISCORD_SERVER_ID = '1378930784663554048';

/* ===== Preloader ===== */
window.addEventListener('load', () => {
  const p = document.getElementById('preloader');
  if (p) { p.classList.add('done'); setTimeout(() => p.style.display = 'none', 600); }
});

/* ===== Mobile Menu ===== */
function toggleMobileMenu() {
  const menu = document.getElementById('mobile-menu');
  const icon = document.getElementById('mobile-menu-icon');
  if (!menu) return;
  if (menu.classList.contains('open')) {
    menu.classList.remove('open');
    icon.className = 'fa-solid fa-bars text-xl';
    document.body.style.overflow = '';
  } else {
    menu.classList.add('open');
    icon.className = 'fa-solid fa-xmark text-xl';
    document.body.style.overflow = 'hidden';
  }
}

/* ===== Copy IP ===== */
function copyIp() {
  navigator.clipboard.writeText(REDOKU_IP).then(() => {
    showToast('IP скопирован!', REDOKU_IP);
    document.querySelectorAll('[data-ip-text]').forEach(el => {
      const orig = el.textContent;
      el.textContent = 'СКОПИРОВАНО!';
      el.classList.add('text-green-400');
      setTimeout(() => { el.textContent = orig; el.classList.remove('text-green-400'); }, 3000);
    });
  });
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => showToast('Скопировано!', text));
}

/* ===== Toast ===== */
function showToast(title, subtitle) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = 'toast';
    toast.innerHTML = `<div class="w-10 h-10 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center shrink-0"><i class="fa-solid fa-check text-lg"></i></div><div><div class="font-bold text-sm text-white" id="toast-title"></div><div class="text-xs text-gray-400" id="toast-sub"></div></div>`;
    document.body.appendChild(toast);
  }
  document.getElementById('toast-title').textContent = title || 'Успешно!';
  document.getElementById('toast-sub').textContent = subtitle || '';
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}

/* ===== Scroll Reveal ===== */
function initReveal() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('active');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
}

/* ===== Navbar scroll ===== */
function initNavbar() {
  const nav = document.getElementById('navbar');
  if (!nav) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  });
}

/* ===== Active nav link ===== */
function initActiveNav() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link, .mobile-menu a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === path || (path === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

/* ===== Spotlight cards ===== */
function initSpotlight() {
  document.querySelectorAll('.spotlight-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
      card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
    });
  });
}

/* ===== Fetch Online ===== */
async function fetchOnline() {
  try {
    const res = await fetch(`https://api.mcsrvstat.us/2/${REDOKU_IP}`);
    const data = await res.json();
    const online = data.online ? data.players.online : 0;
    const el = document.getElementById('online-count');
    if (el) animateCounter(el, online);
    const el2 = document.getElementById('online-count-2');
    if (el2) animateCounter(el2, online);
    const pingEl = document.getElementById('ping-val');
    if (pingEl) pingEl.textContent = data.online ? (data.debug ? data.debug.ping : '-') : '-';
    const verEl = document.getElementById('version-val');
    if (verEl && data.online) verEl.textContent = data.version || '1.21.11';
  } catch (e) { console.error('Online fetch error:', e); }
}

function animateCounter(el, target) {
  const current = parseInt(el.textContent) || 0;
  if (current === target) return;
  const diff = target - current;
  const steps = 20;
  const increment = diff / steps;
  let step = 0;
  const timer = setInterval(() => {
    step++;
    if (step >= steps) {
      el.textContent = target;
      clearInterval(timer);
    } else {
      el.textContent = Math.round(current + increment * step);
    }
  }, 30);
}

/* ===== Discord Widget ===== */
async function fetchDiscordWidget() {
  const widgetEl = document.getElementById('discord-members');
  if (!widgetEl) return;
  try {
    const res = await fetch(`https://discord.com/api/v10/guilds/${DISCORD_SERVER_ID}/widget.json`);
    const data = await res.json();
    if (data.presence_count !== undefined) {
      widgetEl.textContent = data.presence_count;
    }
  } catch (e) {
    console.error('Discord widget error:', e);
  }
}

/* ===== Modal ===== */
function openModal(id) {
  const m = document.getElementById(id);
  if (!m) return;
  m.classList.add('visible');
  document.body.style.overflow = 'hidden';
}
function closeModal(id) {
  const m = document.getElementById(id);
  if (!m) return;
  m.classList.remove('visible');
  document.body.style.overflow = '';
}

/* ===== Timeline toggle ===== */
function toggleTimeline(card) {
  const content = card.querySelector('.timeline-content') || card.querySelector('.timeline-expand');
  const icon = card.querySelector('.faq-icon');
  const isOpen = content && content.classList.contains('open');
  const progress = document.getElementById('timeline-progress');

  document.querySelectorAll('.timeline-card').forEach(c => {
    c.classList.remove('active');
    const ce = c.querySelector('.timeline-content') || c.querySelector('.timeline-expand');
    if (ce) ce.classList.remove('open');
    const ic = c.querySelector('.faq-icon');
    if (ic) ic.style.transform = 'rotate(0deg)';
  });

  if (!isOpen && content) {
    card.classList.add('active');
    content.classList.add('open');
    if (icon) icon.style.transform = 'rotate(180deg)';
    if (progress) {
      const step = card.closest('.timeline-item');
      if (step) {
        const stepNum = step.dataset.step;
        progress.style.height = (stepNum * 25) + '%';
      }
    }
  } else {
    if (progress) progress.style.height = '0%';
  }
}

/* ===== FAQ toggle ===== */
function toggleFaq(item) {
  const answer = item.querySelector('.faq-answer');
  const isOpen = item.classList.contains('open');
  document.querySelectorAll('.faq-item').forEach(i => {
    i.classList.remove('open');
    const a = i.querySelector('.faq-answer');
    if (a) a.classList.remove('open');
  });
  if (!isOpen) {
    item.classList.add('open');
    if (answer) answer.classList.add('open');
  }
}

/* ===== Accordion toggle (wiki) ===== */
function toggleAccordion(btn) {
  const content = btn.parentElement.querySelector('.accordion-content');
  const icon = btn.querySelector('.accordion-icon');
  if (content.classList.contains('open')) {
    content.classList.remove('open');
    if (icon) icon.classList.remove('rotate');
  } else {
    content.classList.add('open');
    if (icon) icon.classList.add('rotate');
  }
}

/* ===== Wiki section switching ===== */
function showSection(id) {
  document.querySelectorAll('.wiki-section').forEach(s => {
    s.classList.remove('visible');
    s.classList.add('hidden');
  });
  const target = document.getElementById(id);
  if (target) {
    target.classList.remove('hidden');
    setTimeout(() => target.classList.add('visible'), 10);
  }
  document.querySelectorAll('.sidebar-link').forEach(l => l.classList.remove('active'));
  const link = document.querySelector(`.sidebar-link[data-section="${id}"]`);
  if (link) link.classList.add('active');
  updateToc(id);
  history.pushState(null, null, `#${id}`);
}

function updateToc(sectionId) {
  const toc = document.getElementById('wiki-toc-links');
  if (!toc) return;
  const section = document.getElementById(sectionId);
  if (!section) { toc.innerHTML = ''; return; }
  const headings = section.querySelectorAll('h2, h3');
  let html = '';
  headings.forEach(h => {
    const text = h.textContent.trim();
    const slug = text.toLowerCase().replace(/[^a-z0-9а-яё]+/g, '-');
    h.id = slug;
    html += `<a href="#${slug}" class="block text-xs text-gray-500 hover:text-brand-copper py-1 transition-colors">${text}</a>`;
  });
  toc.innerHTML = html;
}

/* ===== News filters ===== */
function initNewsFilters() {
  const btns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.news-card');
  if (!btns.length) return;
  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      cards.forEach(card => {
        if (card.dataset.category === 'placeholder') return;
        if (filter === 'all' || card.dataset.category === filter) {
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ===== Donate details toggle ===== */
function toggleDonateDetails(btn) {
  const details = btn.nextElementSibling;
  details.classList.toggle('hidden');
  btn.textContent = details.classList.contains('hidden') ? 'Подробнее' : 'Скрыть';
}

/* ===== Discord copy ===== */
function copyDiscord(tag) {
  navigator.clipboard.writeText(tag).then(() => showToast('Discord скопирован!', tag));
}

/* ===== Mod info modal ===== */
function showModInfo(name, description, link) {
  const modal = document.getElementById('mod-modal');
  if (!modal) return;
  const title = document.getElementById('mod-title');
  const desc = document.getElementById('mod-description');
  const linkEl = document.getElementById('mod-link');
  if (title) title.textContent = name;
  if (desc) desc.textContent = description;
  if (linkEl) linkEl.href = link;
  modal.classList.remove('hidden');
  modal.classList.add('flex');
}
function closeModModal() {
  const modal = document.getElementById('mod-modal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
}

/* ===== Wiki Hash check ===== */
function checkWikiHash() {
  const hash = window.location.hash.replace('#', '');
  if (hash && document.getElementById(hash)) {
    showSection(hash);
  } else {
    showSection('basic-info');
  }
}

/* ===== Init ===== */
document.addEventListener('DOMContentLoaded', () => {
  initReveal();
  initNavbar();
  initActiveNav();
  initSpotlight();
  initNewsFilters();
  fetchOnline();
  setInterval(fetchOnline, 60000);
  fetchDiscordWidget();

  // Close modals on overlay click
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', e => {
      if (e.target === overlay) closeModal(overlay.id);
    });
  });

  // Close on Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay.visible').forEach(m => closeModal(m.id));
      closeModModal();
    }
  });

  // Wiki hash
  if (document.querySelector('.wiki-layout')) {
    checkWikiHash();
    window.addEventListener('hashchange', checkWikiHash);
  }

  // Mobile menu close on link click
  document.querySelectorAll('#mobile-menu a').forEach(link => {
    link.addEventListener('click', () => {
      const menu = document.getElementById('mobile-menu');
      const icon = document.getElementById('mobile-menu-icon');
      if (menu) {
        menu.classList.remove('open');
        icon.className = 'fa-solid fa-bars text-xl';
        document.body.style.overflow = '';
      }
    });
  });

  // Back to top button
  const backToTop = document.createElement('button');
  backToTop.id = 'back-to-top';
  backToTop.className = 'fixed bottom-8 right-8 w-12 h-12 bg-brand-surface border border-white/10 text-brand-copper rounded-full flex items-center justify-center z-[90] opacity-0 pointer-events-none transition-all duration-300 hover:bg-brand-copper hover:text-white hover:border-brand-copper shadow-lg';
  backToTop.innerHTML = '<i class="fa-solid fa-arrow-up"></i>';
  backToTop.onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  document.body.appendChild(backToTop);

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      backToTop.classList.remove('opacity-0', 'pointer-events-none');
      backToTop.classList.add('opacity-100', 'pointer-events-auto');
    } else {
      backToTop.classList.add('opacity-0', 'pointer-events-none');
      backToTop.classList.remove('opacity-100', 'pointer-events-auto');
    }
  });
});
