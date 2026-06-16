/* ============================================================
   ISAM — login.js   Versi : 3.2 Final
   Pakai GAS yang sudah ada — action: 'login'
   ============================================================ */

'use strict';

// ── URL GAS yang sudah ada (tidak berubah) ───────────────────
var API_URL = 'https://script.google.com/macros/s/AKfycbw4k8CSXxUQmahghLAqRtUDgk1vy3tc0qvEaqorklJvIZIgzVUpxdfm-9pCr3u-hw1ugQ/exec';

// Role → halaman dashboard
var DASHBOARD = {
  pic    : 'pic.html',
  viewer : 'safety.html',
  admin  : 'admin.html',
};

var toastTimer = null;


/* ── CEK SESI AKTIF ── */
(function checkExistingSession() {
  var stored = sessionStorage.getItem('isam_user') || localStorage.getItem('isam_user');
  if (!stored) return;
  try {
    var user   = JSON.parse(stored);
    var target = DASHBOARD[user && user.role];
    if (target) window.location.replace(target);
  } catch (e) {
    sessionStorage.removeItem('isam_user');
    localStorage.removeItem('isam_user');
  }
})();


/* ── POST ke GAS ── */
function postLogin(email, password) {
  return fetch(API_URL, {
    method  : 'POST',
    headers : { 'Content-Type': 'text/plain;charset=utf-8' },
    body    : JSON.stringify({
      action   : 'login',   // ← pakai handler baru di GAS
      email    : email,
      password : password,
    }),
    redirect: 'follow',
  })
  .then(function(res) {
    if (!res.ok) throw new Error('Server error: ' + res.status);
    return res.json();
  });
}


/* ── UI HELPERS ── */
function showToast(msg) {
  var el = document.getElementById('toast-el');
  document.getElementById('toast-txt').textContent = msg;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(function() { el.classList.remove('show'); }, 3500);
}

function showAlert(msg) {
  var el  = document.getElementById('alert-error');
  var txt = document.getElementById('alert-msg');
  if (txt) txt.textContent = msg;
  el.classList.add('show');
}

function clearErr() {
  document.getElementById('alert-error').classList.remove('show');
  ['inp-email','inp-password'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.classList.remove('error');
  });
  ['err-email','err-password'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.classList.remove('show');
  });
}

function setLoading(on) {
  var btn  = document.getElementById('login-btn');
  var hint = document.getElementById('network-hint');
  if (!btn) return;
  btn.classList.toggle('loading', on);
  btn.disabled = on;
  if (hint) hint.style.display = on ? 'block' : 'none';
}

function togglePw() {
  var inp  = document.getElementById('inp-password');
  var icon = document.getElementById('pw-icon');
  var show = inp.type === 'password';
  inp.type = show ? 'text' : 'password';
  icon.innerHTML = show
    ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>'
    : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>';
}


/* ── MAIN LOGIN ── */
function doLogin() {
  var emailInput = (document.getElementById('inp-email').value    || '').trim().toLowerCase();
  var pwInput    = (document.getElementById('inp-password').value || '').trim();

  var hasErr = false;
  if (!emailInput) {
    document.getElementById('inp-email').classList.add('error');
    document.getElementById('err-email').classList.add('show');
    hasErr = true;
  }
  if (!pwInput) {
    document.getElementById('inp-password').classList.add('error');
    document.getElementById('err-password').classList.add('show');
    hasErr = true;
  }
  if (hasErr) return;

  setLoading(true);

  postLogin(emailInput, pwInput)
    .then(function(json) {

      if (!json.success) {
        showAlert(json.message || 'Email atau password salah.');
        document.getElementById('inp-email').classList.add('error');
        document.getElementById('inp-password').classList.add('error');
        return;
      }

      var user = json.user;

      // Simpan sesi
      var remember = document.getElementById('remember-me').checked;
      var storage  = remember ? localStorage : sessionStorage;
      storage.setItem('isam_user', JSON.stringify({
        employee_id  : user.employee_id  || '',
        nik          : user.nik          || '',
        email        : user.email        || emailInput,
        nama         : user.nama         || '',
        jabatan      : user.jabatan      || '',
        role         : user.role         || '',
        company_id   : user.company_id   || '',
        company_nama : user.company_nama || '',
        area_id      : user.area_id      || '',
        area_nama    : user.area_nama    || '',
        subarea_id   : user.subarea_id   || '',
        subarea_nama : user.subarea_nama || '',
        last_login   : user.last_login   || '',
      }));

      // Redirect berdasarkan role
      var target = DASHBOARD[user.role];
      if (!target) {
        showAlert('Role "' + user.role + '" belum memiliki dashboard. Hubungi admin.');
        return;
      }

      showToast('✅ Selamat datang, ' + (user.nama || emailInput) + '!');
      setTimeout(function() { window.location.href = target; }, 900);
    })
    .catch(function(err) {
      console.error('[ISAM] Login error:', err);
      showAlert('Gagal terhubung ke server. Cek koneksi internet dan coba lagi.');
    })
    .finally(function() {
      setLoading(false);
    });
}


/* ── ENTER KEY ── */
document.addEventListener('keydown', function(e) {
  if (e.key === 'Enter') {
    var btn = document.getElementById('login-btn');
    if (btn && !btn.disabled) doLogin();
  }
});
