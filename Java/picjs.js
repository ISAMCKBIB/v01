/* ============================================================
   ISAM PIC Tools — app.js
   Deskripsi : Logika utama PIC Area Dashboard
   Versi      : 1.0
   ============================================================ */

'use strict';

/* ============================================================
   DATA — TUGAS AKTIF
   ============================================================ */
var TUGAS_DATA = [
  { no: 'TL-009', ins: 'INS-048', asset: 'APR-048', alat: 'APAR',             risiko: 'Critical', status: 'Dalam Proses', target: '10/06/26' },
  { no: 'TL-008', ins: 'INS-046', asset: 'FBH-017', alat: 'Full Body Harness', risiko: 'High',     status: 'Ditunda',      target: '09/06/26' },
  { no: 'TL-007', ins: 'INS-043', asset: 'ALP-021', alat: 'Alat Listrik',      risiko: 'Medium',   status: 'Dalam Proses', target: '12/06/26' },
  { no: 'TL-006', ins: 'INS-041', asset: 'HSK-007', alat: 'Hook & Shackle',    risiko: 'High',     status: 'Overdue',      target: '05/06/26' },
];

/* ============================================================
   DATA — RIWAYAT
   ============================================================ */
var RIWAYAT_DATA = [
  { no: 'TL-005', ins: 'INS-038', asset: 'TAN-011', alat: 'Tenaga Angin',    status: 'Selesai', selesai: '07/06/26' },
  { no: 'TL-004', ins: 'INS-035', asset: 'APR-009', alat: 'APAR',            status: 'Selesai', selesai: '04/06/26' },
  { no: 'TL-003', ins: 'INS-032', asset: 'SLG-005', alat: 'Sling / Webbing', status: 'Selesai', selesai: '01/06/26' },
  { no: 'TL-002', ins: 'INS-028', asset: 'OTW-002', alat: 'Oil Trap',        status: 'Selesai', selesai: '28/05/26' },
  { no: 'TL-001', ins: 'INS-021', asset: 'TGP-003', alat: 'Tangga Portable', status: 'Ditunda', selesai: '—' },
];

/* ============================================================
   DATA — OVERDUE
   ============================================================ */
var OVERDUE_DATA = [
  { no: 'TL-006', ins: 'INS-041', asset: 'HSK-007', alat: 'Hook & Shackle',  risiko: 'High',     hari: 4, target: '05/06/26' },
  { no: 'TL-010', ins: 'INS-039', asset: 'CRN-001', alat: 'Crane Workshop',  risiko: 'Critical', hari: 8, target: '01/06/26' },
];

/* ============================================================
   STATE
   ============================================================ */
var fotoFiles  = [];
var toastTimer = null;

/* ============================================================
   INIT
   ============================================================ */
document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('today-lbl').textContent = new Date().toLocaleDateString('id-ID', {
    weekday: 'short', day: 'numeric', month: 'short', year: 'numeric',
  });

  var tlId = genTLId();
  document.getElementById('tl-id').textContent   = tlId;
  document.getElementById('tl-ref-no').value     = tlId;
  document.getElementById('tl-tgl-mulai').value  = new Date().toISOString().split('T')[0];

  renderTaskList();
  renderTugas(TUGAS_DATA);
  renderRiwayat(RIWAYAT_DATA);
  renderOverdue();
});

/* ============================================================
   UTILITY — Generate TL ID
   ============================================================ */
function genTLId() {
  var n = new Date();
  return (
    'TL-' +
    n.getFullYear().toString().slice(-2) +
    String(n.getMonth() + 1).padStart(2, '0') +
    String(n.getDate()).padStart(2, '0') +
    '-' +
    Math.random().toString(36).slice(-3).toUpperCase()
  );
}

/* ============================================================
   NAVIGATION
   ============================================================ */
/**
 * @param {string}      id - ID view tanpa prefix 'v-'
 * @param {Element|null} el - nav-item yang diklik
 */
function goNav(id, el) {
  document.querySelectorAll('.view').forEach(function (v) { v.classList.remove('on'); });
  document.getElementById('v-' + id).classList.add('on');

  document.querySelectorAll('.nav-item').forEach(function (n) { n.classList.remove('active'); });
  if (el) el.classList.add('active');

  var titles = {
    'dashboard': 'Dashboard',
    'form-tl':   'Form Tindak Lanjut',
    'tugasku':   'Tugas Saya',
    'overdue':   'Overdue',
    'riwayat':   'Riwayat Tindak Lanjut',
  };
  document.getElementById('page-title').textContent = titles[id] || id;
}

/* ============================================================
   BADGE HELPERS
   ============================================================ */
/**
 * CSS class badge berdasarkan status tindak lanjut.
 * @param {string} s
 */
function sBadge(s) {
  return { 'Dalam Proses': 'b-blue', 'Ditunda': 'b-yellow', 'Overdue': 'b-red', 'Selesai': 'b-green' }[s] || 'b-gray';
}

/**
 * CSS class badge berdasarkan level risiko.
 * @param {string} r
 */
function rBadge(r) {
  return { 'Critical': 'b-red', 'High': 'b-orange', 'Medium': 'b-yellow', 'Low': 'b-green' }[r] || 'b-gray';
}

/* ============================================================
   RENDER — TASK LIST (Dashboard widget)
   ============================================================ */
function renderTaskList() {
  var active = TUGAS_DATA.slice(0, 3);
  document.getElementById('task-list').innerHTML = active.map(function (d) {
    var iconColor = d.risiko === 'Critical'
      ? 'var(--red)'
      : d.risiko === 'High'
        ? 'var(--orange)'
        : 'var(--accent)';
    return (
      '<div class="task-item">' +
        '<div class="task-icon" style="background:' + iconColor + '18">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="' + iconColor + '" stroke-width="2">' +
            '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>' +
          '</svg>' +
        '</div>' +
        '<div class="task-main">' +
          '<div class="task-name">' + d.alat + ' — ' + d.asset + '</div>' +
          '<div class="task-sub">' + d.no + ' · Ref: ' + d.ins + '</div>' +
        '</div>' +
        '<div class="task-right">' +
          '<div class="task-date">' + d.target + '</div>' +
          '<span class="badge ' + sBadge(d.status) + '" style="margin-top:3px">' + d.status + '</span>' +
        '</div>' +
      '</div>'
    );
  }).join('');
}

/* ============================================================
   RENDER — TUGAS SAYA (table)
   ============================================================ */
function renderTugas(data) {
  document.getElementById('tugas-body').innerHTML = data.map(function (d) {
    return (
      '<tr>' +
        '<td class="em">' + d.no + '</td>' +
        '<td><span class="badge b-gray" style="font-size:10px">' + d.ins + '</span></td>' +
        '<td style="font-family:var(--mono);font-size:11px">' + d.asset + '</td>' +
        '<td>' + d.alat + '</td>' +
        '<td><span class="badge ' + rBadge(d.risiko) + '">' + d.risiko + '</span></td>' +
        '<td><span class="badge ' + sBadge(d.status) + '">' + d.status + '</span></td>' +
        '<td style="font-family:var(--mono);font-size:11px;color:var(--text3)">' + d.target + '</td>' +
        '<td><button class="btn" style="padding:4px 10px;font-size:12px" onclick="goNav(\'form-tl\',null)">Update</button></td>' +
      '</tr>'
    );
  }).join('');
}

function filterTugas() {
  var query = (document.querySelector('#v-tugasku .search-inp') || { value: '' }).value.toLowerCase();
  renderTugas(TUGAS_DATA.filter(function (d) {
    return (
      d.no.toLowerCase().includes(query)   ||
      d.alat.toLowerCase().includes(query) ||
      d.asset.toLowerCase().includes(query)
    );
  }));
}

/* ============================================================
   RENDER — RIWAYAT (table)
   ============================================================ */
function renderRiwayat(data) {
  document.getElementById('riwayat-body').innerHTML = data.map(function (d) {
    return (
      '<tr>' +
        '<td class="em">' + d.no + '</td>' +
        '<td><span class="badge b-gray" style="font-size:10px">' + d.ins + '</span></td>' +
        '<td style="font-family:var(--mono);font-size:11px">' + d.asset + '</td>' +
        '<td>' + d.alat + '</td>' +
        '<td><span class="badge ' + sBadge(d.status) + '">' + d.status + '</span></td>' +
        '<td style="font-family:var(--mono);font-size:11px;color:var(--text3)">' + d.selesai + '</td>' +
        '<td><button class="btn" style="padding:4px 10px;font-size:12px" onclick="showToast(\'Detail ' + d.no + ' 📋\')">Detail</button></td>' +
      '</tr>'
    );
  }).join('');
}

function filterRiwayat() {
  var query = (document.querySelector('#v-riwayat .search-inp') || { value: '' }).value.toLowerCase();
  renderRiwayat(RIWAYAT_DATA.filter(function (d) {
    return d.no.toLowerCase().includes(query) || d.alat.toLowerCase().includes(query);
  }));
}

/* ============================================================
   RENDER — OVERDUE (list)
   ============================================================ */
function renderOverdue() {
  document.getElementById('overdue-list').innerHTML = OVERDUE_DATA.map(function (d) {
    return (
      '<div class="od-item">' +
        '<div style="width:32px;height:32px;border-radius:var(--r);background:var(--red-lt);display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:16px">⚠️</div>' +
        '<div class="od-main">' +
          '<div class="od-title">' + d.alat + ' — ' + d.asset + '</div>' +
          '<div class="od-sub">' + d.no + ' · Ref: ' + d.ins + ' · Target: ' + d.target + '</div>' +
        '</div>' +
        '<div style="text-align:right;flex-shrink:0">' +
          '<span class="badge b-red" style="font-size:12px">' + d.hari + ' hari terlambat</span>' +
          '<div style="margin-top:6px">' +
            '<button class="btn btn-primary" style="padding:5px 12px;font-size:12px" onclick="goNav(\'form-tl\',null)">Update Sekarang</button>' +
          '</div>' +
        '</div>' +
      '</div>'
    );
  }).join('');
}

/* ============================================================
   FOTO UPLOAD
   ============================================================ */
function handleFoto(input) {
  var files = Array.prototype.slice.call(input.files, 0, 3);
  fotoFiles = files;

  var prev = document.getElementById('foto-preview');
  prev.innerHTML = '';

  files.forEach(function (file, idx) {
    var reader = new FileReader();
    reader.onload = function (e) {
      prev.innerHTML +=
        '<div class="fp-item">' +
          '<img src="' + e.target.result + '">' +
          '<button class="fp-del" onclick="removeFoto(' + idx + ')">×</button>' +
        '</div>';
    };
    reader.readAsDataURL(file);
  });

  document.getElementById('foto-status').textContent = files.length + ' foto dipilih';
  document.getElementById('foto-status').className   = 'foto-status done';
}

function removeFoto(idx) {
  fotoFiles.splice(idx, 1);
  if (!fotoFiles.length) {
    document.getElementById('foto-preview').innerHTML  = '';
    document.getElementById('foto-status').textContent = '';
    document.getElementById('tl-foto').value           = '';
  }
}

/* ============================================================
   FORM — Ringkasan (live update)
   ============================================================ */
function calcSummary() {
  var ins      = document.getElementById('tl-ref-ins').value  || '—';
  var asset    = document.getElementById('tl-asset').value    || '—';
  var alat     = document.getElementById('tl-alat').value     || '—';
  var tindakan = document.getElementById('tl-tindakan').value || '—';
  var statusEl = document.querySelector('input[name="tl-status"]:checked');

  document.getElementById('sum-ins').textContent      = ins;
  document.getElementById('sum-asset').textContent    = asset;
  document.getElementById('sum-alat').textContent     = alat;
  document.getElementById('sum-tindakan').textContent =
    tindakan.length > 20 ? tindakan.slice(0, 20) + '…' : tindakan;

  var statusSpan = document.getElementById('sum-status');
  if (statusEl) {
    var cls = {
      'Selesai':              'b-green',
      'Dalam Proses':         'b-blue',
      'Ditunda':              'b-yellow',
      'Tidak Bisa Ditangani': 'b-red',
    }[statusEl.value] || 'b-gray';
    statusSpan.innerHTML = '<span class="badge ' + cls + '">' + statusEl.value + '</span>';
  } else {
    statusSpan.textContent = '—';
  }
}

/* ============================================================
   FORM — Submit Tindak Lanjut
   ============================================================ */
function doSubmitTL() {
  var ref      = document.getElementById('tl-ref-ins').value.trim();
  var asset    = document.getElementById('tl-asset').value.trim();
  var tindakan = document.getElementById('tl-tindakan').value.trim();
  var statusEl = document.querySelector('input[name="tl-status"]:checked');

  if (!ref || !asset || !tindakan || !statusEl) {
    showToast('⚠️ Lengkapi field wajib terlebih dahulu!');
    return;
  }
  if (fotoFiles.length === 0) {
    showToast('⚠️ Foto bukti perbaikan wajib min. 1 foto!');
    return;
  }

  var noTL = document.getElementById('tl-id').textContent;
  document.getElementById('ov-msg').textContent = 'No: ' + noTL + '\nTindak lanjut berhasil disimpan.';
  document.getElementById('ov').classList.add('show');
}

/* ============================================================
   FORM — Reset setelah submit
   ============================================================ */
function resetFormTL() {
  document.getElementById('ov').classList.remove('show');

  document.querySelectorAll('#v-form-tl input[type=text], #v-form-tl textarea').forEach(function (el) {
    el.value = '';
  });
  document.querySelectorAll('#v-form-tl input[type=radio], #v-form-tl input[type=date]').forEach(function (el) {
    el.checked = false;
    if (el.type === 'date') el.value = '';
  });

  document.getElementById('foto-preview').innerHTML  = '';
  document.getElementById('foto-status').textContent = '';
  fotoFiles = [];

  var newId = genTLId();
  document.getElementById('tl-id').textContent   = newId;
  document.getElementById('tl-ref-no').value     = newId;
  document.getElementById('tl-tgl-mulai').value  = new Date().toISOString().split('T')[0];

  calcSummary();
}

/* ============================================================
   TOAST
   ============================================================ */
/**
 * @param {string} msg
 */
function showToast(msg) {
  var el = document.getElementById('toast-el');
  document.getElementById('toast-txt').textContent = msg;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(function () { el.classList.remove('show'); }, 3000);
}

/* ============================================================
   MOBILE — Bottom Nav Active State
   ============================================================ */
function setBnActive(id) {
  document.querySelectorAll('.bn-item').forEach(function (el) {
    el.classList.remove('active');
  });
  var target = document.getElementById(id);
  if (target) target.classList.add('active');
}

/* ============================================================
   MOBILE — Sync mobile-nav active state
   ============================================================ */
function syncMobileNav(viewId) {
  document.querySelectorAll('.mobile-nav-item').forEach(function (el) {
    el.classList.remove('active');
    if (el.getAttribute('data-view') === viewId) el.classList.add('active');
  });
}

/* ============================================================
   MOBILE — Override goNav to sync mobile UI
   ============================================================ */
var _goNavOriginal = goNav;

goNav = function (id, el) {
  _goNavOriginal(id, el);
  syncMobileNav(id);

  var bnMap = {
    'dashboard': 'bn-dashboard',
    'tugasku':   'bn-tugasku',
    'form-tl':   'bn-form-tl',
    'overdue':   'bn-overdue',
    'riwayat':   'bn-riwayat',
  };
  if (bnMap[id]) setBnActive(bnMap[id]);

  /* Scroll ke atas saat pindah view di mobile */
  if (window.innerWidth <= 768) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

/* ============================================================
   RESPONSIVE — Detect & show/hide mobile UI
   ============================================================ */
function applyLayout() {
  var isMobile = window.innerWidth <= 768;
  var mobileNav = document.getElementById('mobile-nav');
  var hamburger = document.getElementById('hamburger-btn');

  if (mobileNav)  mobileNav.style.display  = isMobile ? 'flex' : 'none';
  if (hamburger)  hamburger.style.display   = isMobile ? 'flex' : 'none';
}

window.addEventListener('resize', applyLayout);
document.addEventListener('DOMContentLoaded', function () {
  applyLayout();
});