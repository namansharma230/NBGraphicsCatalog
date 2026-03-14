/* ============================================================
   NB GRAPHICS PORTFOLIO — SCRIPT.JS v3
   ============================================================ */

/* ── Navbar scroll ── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
}, { passive: true });

/* ── Mobile Nav ── */
const hamburger  = document.getElementById('hamburger');
const navDrawer  = document.getElementById('navDrawer');
const drawerLinks = navDrawer ? navDrawer.querySelectorAll('.drawer-link') : [];

if (hamburger && navDrawer) {
  hamburger.addEventListener('click', () => {
    const open = navDrawer.classList.toggle('open');
    hamburger.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });
  drawerLinks.forEach(link => link.addEventListener('click', () => {
    navDrawer.classList.remove('open');
    hamburger.classList.remove('open');
    document.body.style.overflow = '';
  }));
}

/* ── Hero landing animations (staggered sequence) ── */
document.addEventListener('DOMContentLoaded', () => {
  const sequence = [
    { sel: '.hero-anim-left',  delay:  80 },
    { sel: '.hero-anim-right', delay: 120 },
    { sel: '#heroCutout',      delay: 200 },
    { sel: '.hero-anim-fade',  delay: 350 },
  ];
  sequence.forEach(({ sel, delay }) => {
    const els = document.querySelectorAll(sel);
    els.forEach((el, i) => {
      setTimeout(() => el.classList.add('hero-in'), delay + i * 40);
    });
  });
});

/* ── Hero portrait subtle scroll parallax ── */
const heroCutout = document.getElementById('heroCutout');
window.addEventListener('scroll', () => {
  if (!heroCutout) return;
  const y = window.scrollY;
  if (y < window.innerHeight) {
    // Keep translateX(-50%) centering while adding parallax translateY
    heroCutout.style.transform = `translateX(-50%) translateY(${y * 0.05}px)`;
  }
}, { passive: true });

/* ── Generic reveal observer ── */
function makeRevealObs(visibleClass, opts = {}) {
  return new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add(visibleClass);
        e.target._obs?.unobserve(e.target);
      }
    });
  }, { threshold: opts.threshold ?? 0.15 });
}

/* About section reveals */
const aboutObs = makeRevealObs('visible', { threshold: 0.2 });
document.querySelectorAll('[data-reveal-left], [data-reveal-right]').forEach(el => {
  el._obs = aboutObs;
  aboutObs.observe(el);
});

/* Package cards staggered reveal */
(() => {
  const pkgObs = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('visible'), i * 100);
        pkgObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.pkg-card').forEach(el => pkgObs.observe(el));
})();

/* ── Portfolio Vault Interaction ── */
const vaultGrid = document.getElementById('vaultGrid');
const vaultRevealObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      vaultRevealObs.unobserve(e.target);
    }
  });
}, { threshold: 0.08 });

function openVaultFolder(folderId) {
  if (!vaultGrid) return;
  
  // Hide grid
  vaultGrid.classList.add('closing');
  setTimeout(() => {
    vaultGrid.style.display = 'none';
    vaultGrid.classList.remove('closing');
    
    // Show folder
    const folder = document.getElementById(`vault-${folderId}`);
    if (folder) {
      folder.classList.add('open');
      // Observe items for reveal
      folder.querySelectorAll('.vault-masonry-item').forEach(item => {
        item.classList.remove('visible');
        vaultRevealObs.observe(item);
      });
      document.getElementById('portfolio').scrollIntoView({ behavior: 'smooth' });
    }
  }, 300);
}

function closeVaultFolder() {
  const currentFolder = document.querySelector('.vault-folder.open');
  if (!currentFolder || !vaultGrid) return;
  
  currentFolder.classList.add('closing');
  setTimeout(() => {
    currentFolder.classList.remove('open');
    currentFolder.classList.remove('closing');
    vaultGrid.style.display = 'grid';
    document.getElementById('portfolio').scrollIntoView({ behavior: 'smooth' });
  }, 300);
}

window.openVaultFolder = openVaultFolder;
window.closeVaultFolder = closeVaultFolder;

/* Initial reveal for vault items isn't needed here as folder open handles it */

/* ── Lightbox ── */
const lightbox        = document.getElementById('lightbox');
const lightboxImg     = document.getElementById('lightbox-img');
const lightboxCaption = document.getElementById('lightbox-caption');

function openLightbox(el) {
  const img = el.querySelector('img');
  lightboxImg.src = img.src;
  lightboxImg.alt = img.alt;
  const label = el.dataset.label ?? '';
  const title = el.dataset.title ?? img.alt;
  lightboxCaption.textContent = label ? `${label} — ${title}` : title;
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
  lightbox.querySelector('.lightbox-close').focus();
}

function closeLightbox() {
  lightbox.classList.remove('open');
  lightboxImg.src = '';
  document.body.style.overflow = '';
}

if (lightbox) {
  lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    if (lightbox?.classList.contains('open')) closeLightbox();
    if (navDrawer?.classList.contains('open')) {
      navDrawer.classList.remove('open');
      hamburger.classList.remove('open');
      document.body.style.overflow = '';
    }
  }
});

window.openLightbox  = openLightbox;
window.closeLightbox = closeLightbox;

/* ── Roadmap: scroll-triggered sequential reveal ── */
(() => {
  const steps = document.querySelectorAll('[data-roadmap-step]');
  if (!steps.length) return;

  const stepObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('rm-visible');
        stepObs.unobserve(e.target);
      }
    });
  }, {
    // Trigger when 20% of the item is visible
    threshold: 0.2,
  });

  steps.forEach(step => stepObs.observe(step));
})();

/* ── Active nav highlight on scroll ── */
(() => {
  const sections   = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a');

  const sectionObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        navAnchors.forEach(a => a.classList.remove('active-nav'));
        const a = document.querySelector(`.nav-links a[href="#${e.target.id}"]`);
        if (a) a.classList.add('active-nav');
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => sectionObs.observe(s));
})();

/* ── Subtle cursor glow (desktop only) ── */
(() => {
  if (window.matchMedia('(pointer: coarse)').matches) return;
  const glow = document.createElement('div');
  glow.style.cssText = [
    'position:fixed',
    'pointer-events:none',
    'z-index:9999',
    'width:320px',
    'height:320px',
    'border-radius:50%',
    'background:radial-gradient(circle, rgba(120,81,169,0.15) 0%, transparent 70%)',
    'transform:translate(-50%,-50%)',
    'will-change:left,top',
    'transition:left 0.12s ease-out, top 0.12s ease-out',
  ].join(';');
  document.body.appendChild(glow);
  document.addEventListener('mousemove', e => {
    glow.style.left = e.clientX + 'px';
    glow.style.top  = e.clientY + 'px';
  }, { passive: true });
})();

console.log('%c🎨 NB Graphics — Designing the future, one pixel at a time.', 'color:#7851A9; font-family:monospace; font-size:14px;');
