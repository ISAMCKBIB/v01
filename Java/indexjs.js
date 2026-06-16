/* ============================================================
   ISAM Landing Page — indexjs.js
   Versi : 1.1 — Fix: rename scrollTo → scrollSec
   ============================================================ */

'use strict';

var navbar     = document.getElementById('navbar');
var mobileMenu = document.getElementById('mobile-menu');
var hamburger  = document.getElementById('hamburger');
var toastTimer = null;

/* ── NAVBAR SCROLL EFFECT ── */
window.addEventListener('scroll', function () {
  if (window.scrollY > 40) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  updateActiveNav();
});

/* ── HAMBURGER TOGGLE ── */
hamburger.addEventListener('click', function () {
  mobileMenu.classList.toggle('open');
});

document.querySelectorAll('.mobile-link[data-scroll]').forEach(function (link) {
  link.addEventListener('click', function () {
    mobileMenu.classList.remove('open');
  });
});

/* ── ACTIVE NAV HIGHLIGHT ── */
function updateActiveNav() {
  var sections = ['home', 'dashboard', 'pic-area', 'about', 'contact'];
  var scrollY  = window.scrollY + 100;

  sections.forEach(function (id) {
    var el   = document.getElementById('sec-' + id);
    if (!el) return;
    var top    = el.offsetTop;
    var bottom = top + el.offsetHeight;
    var link   = document.querySelector('[data-nav="' + id + '"]');
    if (!link) return;

    if (scrollY >= top && scrollY < bottom) {
      document.querySelectorAll('.nav-link').forEach(function (l) { l.classList.remove('active'); });
      link.classList.add('active');
    }
  });
}

/* ── SMOOTH SCROLL ─────────────────────────────────────────
   PENTING: Namanya scrollSec (bukan scrollTo) supaya tidak
   konflik dengan window.scrollTo() bawaan browser.
   Konflik itulah yang menyebabkan tombol href="login.html"
   tidak bisa berpindah halaman.
   ─────────────────────────────────────────────────────── */
function scrollSec(id) {
  var el = document.getElementById('sec-' + id);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
  if (mobileMenu) mobileMenu.classList.remove('open');
}

/* ── SESSION CHECK ── */
document.addEventListener('DOMContentLoaded', function () {
  checkSession();
  initCounters();
  updateActiveNav();
});

function checkSession() {
  try {
    var raw = sessionStorage.getItem('isam_user') || localStorage.getItem('isam_user');
    if (!raw) return;
    var user = JSON.parse(raw);
    if (!user || !user.nama) return;

    /* Sembunyikan tombol login */
    document.querySelectorAll('.btn-nav-login, .btn-nav-primary').forEach(function (b) {
      b.style.display = 'none';
    });

    var badge  = document.getElementById('profile-badge');
    var avaEl  = document.getElementById('profile-ava');
    var nameEl = document.getElementById('profile-name');
    var roleEl = document.getElementById('profile-role');

    if (badge) {
      var inisial = (user.nama || 'U').split(' ')
        .map(function (w) { return w[0]; }).join('').slice(0, 2).toUpperCase();
      if (avaEl)  avaEl.textContent  = inisial;
      if (nameEl) nameEl.textContent = user.nama;
      if (roleEl) roleEl.textContent = getRoleLabel(user.role);
      badge.style.display = 'flex';
    }
  } catch (e) { /* ignore */ }
}

function getRoleLabel(role) {
  var map = {
    admin  : '⚙️ Admin',
    viewer : '🛡 Safety Captain',
    pic    : '🛠 PIC Area',
  };
  return map[role] || role;
}

function goDashboard() {
  try {
    var raw  = sessionStorage.getItem('isam_user') || localStorage.getItem('isam_user');
    var user = raw ? JSON.parse(raw) : null;
    if (user && user.role) {
      var map = {
        admin  : 'admin.html',
        viewer : 'safety.html',
        pic    : 'pic.html',
      };
      window.location.href = map[user.role] || 'login.html';
    } else {
      window.location.href = 'login.html';
    }
  } catch (e) {
    window.location.href = 'login.html';
  }
}

/* ── ANIMATED COUNTERS ── */
function initCounters() {
  var counters = document.querySelectorAll('[data-count]');
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(function (el) { observer.observe(el); });
}

function animateCounter(el) {
  var target   = parseInt(el.getAttribute('data-count'), 10);
  var suffix   = el.getAttribute('data-suffix') || '';
  var start    = 0;
  var step     = target / (1400 / 16);
  var timer = setInterval(function () {
    start += step;
    if (start >= target) { start = target; clearInterval(timer); }
    el.textContent = Math.floor(start).toLocaleString('id-ID') + suffix;
  }, 16);
}

/* ── CONTACT FORM ── */
function submitContact(e) {
  e.preventDefault();
  var nama    = document.getElementById('cf-nama').value.trim();
  var email   = document.getElementById('cf-email').value.trim();
  var subject = document.getElementById('cf-subject').value;
  var pesan   = document.getElementById('cf-pesan').value.trim();

  if (!nama || !email || !subject || !pesan) {
    showToast('⚠️ Lengkapi semua field terlebih dahulu!');
    return;
  }

  var btn = document.getElementById('btn-contact-submit');
  btn.disabled    = true;
  btn.textContent = '⏳ Mengirim…';

  setTimeout(function () {
    btn.disabled  = false;
    btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="width:14px;height:14px"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg> Kirim Pesan';
    document.getElementById('contact-form').reset();
    showToast('✅ Pesan berhasil dikirim! Kami akan menghubungi Anda segera.');
  }, 1200);
}

/* ── TOAST ── */
function showToast(msg) {
  var el = document.getElementById('toast-el');
  document.getElementById('toast-txt').textContent = msg;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(function () { el.classList.remove('show'); }, 3500);
}