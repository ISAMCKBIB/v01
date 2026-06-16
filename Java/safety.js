/* ============================================================
   ISAM Captain — app.js
   Deskripsi : Logika Safety Captain & PIC Area Dashboard
   Versi      : 1.0
   ============================================================ */

'use strict';

/* ============================================================
   DATA — CAPTAIN
   ============================================================ */
var INSPECTORS = [
  { nama: 'Budi Jatmiko', inisial: 'BJ', color: '#2563eb', done: 12, total: 16, overdue: 1 },
  { nama: 'Rina Sari',    inisial: 'RS', color: '#7c3aed', done: 8,  total: 13, overdue: 0 },
  { nama: 'Abdul Aziz',   inisial: 'AA', color: '#059669', done: 6,  total: 11, overdue: 2 },
  { nama: 'Dedi Kurnia',  inisial: 'DK', color: '#0891b2', done: 7,  total: 13, overdue: 3 },
  { nama: 'Rizki Amri',   inisial: 'RA', color: '#2563eb', done: 9,  total: 16, overdue: 2 },
];

var AREAS = [
  { nama: 'WS CIA · KGB',   done: 10, total: 13, color: '#2563eb' },
  { nama: 'Bay CP · KGB',   done: 6,  total: 11, color: '#0891b2' },
  { nama: 'Iglo HE · GRB',  done: 8,  total: 14, color: '#7c3aed' },
  { nama: 'PCR · KGB',      done: 7,  total: 9,  color: '#059669' },
  { nama: 'SSB · GRB',      done: 5,  total: 8,  color: '#d97706' },
];

var APPROVALS = [
  { no: 'INS-047', lokasi: 'Iglo HE · GRB',  alat: 'Crane Workshop',    insp: 'Rizki Amri',  risiko: 'High' },
  { no: 'INS-046', lokasi: 'Bay CP · KGB',    alat: 'Full Body Harness', insp: 'Dedi Kurnia', risiko: 'Critical' },
  { no: 'INS-041', lokasi: 'Epiroc · KGB',    alat: 'Hook & Shackle',    insp: 'Hendra P.',   risiko: 'Medium' },
  { no: 'INS-038', lokasi: 'Iglo HE · GRB',   alat: 'Tenaga Angin',      insp: 'Fajar N.',    risiko: 'High' },
  { no: 'INS-035', lokasi: 'SSB · KGB',        alat: 'APAR',              insp: 'Ahmad R.',    risiko: 'Medium' },
];

var FEEDS = [
  { dot: '#16a34a', text: 'INS-048 disubmit oleh Budi Jatmiko',            time: 'Hari ini · 09:14' },
  { dot: '#dc2626', text: 'Alert: CRN-001 overdue 22 hari di Bay CP',      time: 'Hari ini · 08:30' },
  { dot: '#d97706', text: 'INS-047 menunggu approval supervisor',           time: 'Kemarin · 15:45' },
  { dot: '#dc2626', text: 'FBH-003 korektif belum selesai — 8 hari',        time: 'Kemarin · 11:20' },
  { dot: '#2563eb', text: 'Draft INS-044 disimpan oleh Ahmad Rafi',         time: '03 Jun · 16:45' },
  { dot: '#16a34a', text: 'INS-043 diapprove oleh Ahmad Surya',             time: '02 Jun · 10:00' },
  { dot: '#7c3aed', text: '10 PIC area diperbarui untuk GRB',               time: '01 Jun · 09:00' },
];

var TAB_DATA = {
  harian:   { total: 6,  lulus: 4,  wait: 8,  over: 3,  temuan: 2 },
  mingguan: { total: 18, lulus: 13, wait: 15, over: 7,  temuan: 5 },
  bulanan:  { total: 48, lulus: 35, wait: 30, over: 12, temuan: 9 },
};

/* ============================================================
   DATA — PIC AREA
   ============================================================ */
var PICS = [
  { id: 1,  nama: 'Budi Jatmiko',  inisial: 'BJ', area: 'WS CIA',    pit: 'KGB', email: 'dimayy17@gmail.com',     color: '#2563eb', done: 12, waiting: 4, overdue: 1, temuan: 2,
    tasks: [
      { alat: 'APAR',                 asset: 'APR-048', jadwal: '07/06/26', status: 'Selesai' },
      { alat: 'Tenaga Angin',         asset: 'TAN-011', jadwal: '10/06/26', status: 'Waiting' },
      { alat: 'Alat Listrik Portable',asset: 'ALP-021', jadwal: '12/06/26', status: 'Waiting' },
      { alat: 'Crane Workshop',       asset: 'CRN-001', jadwal: '15/06/26', status: 'Waiting' },
    ]},
  { id: 2,  nama: 'Rina Sari',     inisial: 'RS', area: 'Office CIA', pit: 'KGB', email: 'drangga88@gmail.com',    color: '#7c3aed', done: 8,  waiting: 5, overdue: 0, temuan: 1,
    tasks: [
      { alat: 'Tangga Portable', asset: 'TGP-003', jadwal: '06/06/26', status: 'Selesai' },
      { alat: 'Eyewash',         asset: 'EYW-002', jadwal: '11/06/26', status: 'Waiting' },
      { alat: 'APAR',            asset: 'APR-011', jadwal: '13/06/26', status: 'Waiting' },
    ]},
  { id: 3,  nama: 'Abdul Aziz',    inisial: 'AA', area: 'PCR',        pit: 'KGB', email: 'Abdulaziz2037@gmail.com',color: '#059669', done: 6,  waiting: 3, overdue: 2, temuan: 3,
    tasks: [
      { alat: 'Sling / Webbing',  asset: 'SLG-005', jadwal: '04/06/26', status: 'Selesai' },
      { alat: 'Hook & Shackle',   asset: 'HSK-007', jadwal: '09/06/26', status: 'Overdue' },
      { alat: 'Rantai Pengangkat',asset: 'RNT-004', jadwal: '08/06/26', status: 'Overdue' },
    ]},
  { id: 4,  nama: 'Hendra P.',     inisial: 'HP', area: 'Area TU',    pit: 'KGB', email: '',                       color: '#d97706', done: 5,  waiting: 6, overdue: 1, temuan: 2,
    tasks: [
      { alat: 'Full Body Harness',asset: 'FBH-017', jadwal: '05/06/26', status: 'Selesai' },
      { alat: 'APAR',             asset: 'APR-009', jadwal: '13/06/26', status: 'Waiting' },
      { alat: 'Oil Trap',         asset: 'OTW-002', jadwal: '16/06/26', status: 'Waiting' },
    ]},
  { id: 5,  nama: 'Ahmad Rafi',    inisial: 'AR', area: 'SSB',        pit: 'KGB', email: '',                       color: '#db2777', done: 4,  waiting: 4, overdue: 1, temuan: 1,
    tasks: [
      { alat: 'Oil Trap',          asset: 'OTW-003', jadwal: '03/06/26', status: 'Selesai' },
      { alat: 'Tangga Permanen',   asset: 'TGP-005', jadwal: '14/06/26', status: 'Waiting' },
      { alat: 'Tenaga Angin',      asset: 'TAN-008', jadwal: '17/06/26', status: 'Overdue' },
    ]},
  { id: 6,  nama: 'Dedi Kurnia',   inisial: 'DK', area: 'Bay CP',     pit: 'KGB', email: '',                       color: '#0891b2', done: 7,  waiting: 3, overdue: 3, temuan: 4,
    tasks: [
      { alat: 'Crane Workshop',    asset: 'CRN-001', jadwal: '02/06/26', status: 'Overdue' },
      { alat: 'Full Body Harness', asset: 'FBH-003', jadwal: '07/06/26', status: 'Overdue' },
      { alat: 'APAR',              asset: 'APR-012', jadwal: '10/06/26', status: 'Waiting' },
      { alat: 'Hook & Shackle',    asset: 'HSK-009', jadwal: '18/06/26', status: 'Overdue' },
    ]},
  { id: 7,  nama: 'Rizki Amri',    inisial: 'RA', area: 'Iglo HE',    pit: 'GRB', email: '',                       color: '#2563eb', done: 9,  waiting: 5, overdue: 2, temuan: 3,
    tasks: [
      { alat: 'Crane Workshop',    asset: 'CRN-002', jadwal: '06/06/26', status: 'Selesai' },
      { alat: 'APAR',              asset: 'APR-005', jadwal: '09/06/26', status: 'Overdue' },
      { alat: 'Sling / Webbing',   asset: 'SLG-008', jadwal: '12/06/26', status: 'Waiting' },
      { alat: 'Full Body Harness', asset: 'FBH-019', jadwal: '08/06/26', status: 'Overdue' },
    ]},
  { id: 8,  nama: 'Fajar Nugroho', inisial: 'FN', area: 'Iglo Track',  pit: 'GRB', email: '',                      color: '#7c3aed', done: 5,  waiting: 4, overdue: 1, temuan: 1,
    tasks: [
      { alat: 'Hook & Shackle',    asset: 'HSK-011', jadwal: '11/06/26', status: 'Waiting' },
      { alat: 'Rantai Pengangkat', asset: 'RNT-006', jadwal: '07/06/26', status: 'Overdue' },
      { alat: 'Tenaga Angin',      asset: 'TAN-014', jadwal: '19/06/26', status: 'Waiting' },
    ]},
  { id: 9,  nama: 'Yudi Pratama',  inisial: 'YP', area: 'Area TU',    pit: 'GRB', email: '',                       color: '#059669', done: 6,  waiting: 4, overdue: 2, temuan: 2,
    tasks: [
      { alat: 'Eyewash',           asset: 'EYW-003', jadwal: '05/06/26', status: 'Selesai' },
      { alat: 'Tangga Portable',   asset: 'TGP-007', jadwal: '10/06/26', status: 'Waiting' },
      { alat: 'Rantai Pengangkat', asset: 'RNT-001', jadwal: '08/06/26', status: 'Overdue' },
    ]},
  { id: 10, nama: 'Bayu Santoso',  inisial: 'BS', area: 'Bay CP',     pit: 'GRB', email: '',                       color: '#d97706', done: 8,  waiting: 3, overdue: 1, temuan: 2,
    tasks: [
      { alat: 'APAR',              asset: 'APR-015', jadwal: '07/06/26', status: 'Selesai' },
      { alat: 'Oil Trap',          asset: 'OTW-004', jadwal: '18/06/26', status: 'Waiting' },
      { alat: 'Crane Workshop',    asset: 'CRN-003', jadwal: '15/06/26', status: 'Overdue' },
    ]},
];

/* ============================================================
   STATE
   ============================================================ */
var selectedPicId   = null;
var currentFilter   = 'all';
var toastTimer      = null;

/* ============================================================
   INIT
   ============================================================ */
document.addEventListener('DOMContentLoaded', function () {
  var now = new Date();
  document.getElementById('today-lbl').textContent =
    now.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
  document.getElementById('today-full').textContent =
    now.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  // Captain
  renderInspectors();
  renderAreaProgress();
  renderApprovals();
  renderFeed();

  // PIC
  renderPicDashboard();
});

/* ============================================================
   NAVIGATION
   ============================================================ */
function goNav(id, el) {
  document.querySelectorAll('.view').forEach(function (v) { v.classList.remove('on'); });
  document.getElementById('v-' + id).classList.add('on');

  document.querySelectorAll('.nav-item').forEach(function (n) { n.classList.remove('active'); });
  if (el) el.classList.add('active');

  var titles = {
    'captain':     'Dashboard Safety Captain',
    'pic-area':    'Dashboard PIC Area',
    'pic-performa':'Performa PIC',
  };
  document.getElementById('topbar-title').textContent = titles[id] || id;
}

/* ============================================================
   CAPTAIN — Tab Switch
   ============================================================ */
function switchTab(tab, el) {
  document.querySelectorAll('.dtab').forEach(function (t) { t.classList.remove('active'); });
  el.classList.add('active');
  var d = TAB_DATA[tab];
  if (!d) return;
  document.getElementById('kv-total').textContent  = d.total;
  document.getElementById('kv-lulus').textContent  = d.lulus;
  document.getElementById('kv-wait').textContent   = d.wait;
  document.getElementById('kv-over').textContent   = d.over;
  document.getElementById('kv-temuan').textContent = d.temuan;
  var meta = { harian: 'Hari ini', mingguan: 'Minggu ini', bulanan: 'Bulan ini' };
  document.getElementById('km-total').textContent  = meta[tab];
  document.getElementById('km-lulus').textContent  = Math.round((d.lulus / d.total) * 100) + '% pass rate';
  document.getElementById('km-wait').textContent   = 'Belum diinspeksi';
  document.getElementById('km-over').textContent   = 'Perlu tindakan';
  document.getElementById('km-temuan').textContent = 'Perlu tindak lanjut';
}

/* ============================================================
   CAPTAIN — Render Inspectors
   ============================================================ */
function renderInspectors() {
  document.getElementById('inspector-list').innerHTML = INSPECTORS.map(function (p) {
    var pct  = p.total > 0 ? Math.round((p.done / p.total) * 100) : 0;
    var barC = p.overdue > 1 ? '#dc2626' : p.overdue > 0 ? '#d97706' : '#16a34a';
    return (
      '<div class="insp-item">' +
        '<div class="insp-ava" style="background:' + p.color + '18;color:' + p.color + '">' + p.inisial + '</div>' +
        '<div style="flex:1;min-width:0">' +
          '<div style="display:flex;justify-content:space-between;align-items:center">' +
            '<span style="font-size:13px;font-weight:500;color:var(--text)">' + p.nama + '</span>' +
            '<span style="font-size:10.5px;font-family:var(--mono);color:var(--text3)">' + p.done + '/' + p.total + '</span>' +
          '</div>' +
          '<div class="progbar"><div class="progfill" style="width:' + pct + '%;background:' + barC + '"></div></div>' +
        '</div>' +
        (p.overdue > 0
          ? '<span class="badge b-red" style="margin-left:8px">' + p.overdue + ' OD</span>'
          : '<span class="badge b-green" style="margin-left:8px">OK</span>') +
      '</div>'
    );
  }).join('');
}

/* ============================================================
   CAPTAIN — Render Area Progress
   ============================================================ */
function renderAreaProgress() {
  document.getElementById('area-progress').innerHTML = AREAS.map(function (a) {
    var pct = a.total > 0 ? Math.round((a.done / a.total) * 100) : 0;
    return (
      '<div style="margin-bottom:11px">' +
        '<div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:4px">' +
          '<span style="color:var(--text)">' + a.nama + '</span>' +
          '<span style="color:var(--text3);font-family:var(--mono)">' + a.done + '/' + a.total + '</span>' +
        '</div>' +
        '<div class="progbar"><div class="progfill" style="width:' + pct + '%;background:' + a.color + '"></div></div>' +
      '</div>'
    );
  }).join('');
}

/* ============================================================
   CAPTAIN — Render Approvals
   ============================================================ */
function renderApprovals() {
  document.getElementById('approval-list').innerHTML = APPROVALS.map(function (a) {
    var rc = { Critical: 'b-red', High: 'b-orange', Medium: 'b-yellow' }[a.risiko] || 'b-gray';
    return (
      '<div class="apv-item">' +
        '<div class="apv-num">' + a.no + '</div>' +
        '<div class="apv-main">' +
          '<div class="apv-title">' + a.alat + ' — ' + a.lokasi + '</div>' +
          '<div class="apv-sub">Inspektor: ' + a.insp + ' · <span class="badge ' + rc + '" style="padding:1px 6px;font-size:10px">' + a.risiko + '</span></div>' +
        '</div>' +
        '<div class="apv-actions">' +
          '<button class="apv-btn ok" onclick="approveItem(\'' + a.no + '\',this)">✓ Approve</button>' +
          '<button class="apv-btn no"  onclick="rejectItem(\'' + a.no + '\',this)">✕ Reject</button>' +
        '</div>' +
      '</div>'
    );
  }).join('');
}

/* ============================================================
   CAPTAIN — Render Activity Feed
   ============================================================ */
function renderFeed() {
  document.getElementById('activity-feed').innerHTML = FEEDS.map(function (f, i) {
    var isLast = (i === FEEDS.length - 1);
    return (
      '<div class="feed-item">' +
        '<div class="feed-dot-wrap">' +
          '<div class="feed-dot" style="background:' + f.dot + '"></div>' +
          (!isLast ? '<div class="feed-line"></div>' : '') +
        '</div>' +
        '<div><div class="feed-text">' + f.text + '</div><div class="feed-meta">' + f.time + '</div></div>' +
      '</div>'
    );
  }).join('');
}

/* ============================================================
   CAPTAIN — Approval Actions
   ============================================================ */
function approveItem(no, btn) {
  var item = btn.closest('.apv-item');
  item.style.opacity = '0.5';
  item.style.pointerEvents = 'none';
  showToast('✅ ' + no + ' diapprove!');
}

function rejectItem(no, btn) {
  var item = btn.closest('.apv-item');
  item.style.opacity = '0.5';
  item.style.pointerEvents = 'none';
  showToast('❌ ' + no + ' direject.');
}

/* ============================================================
   PIC AREA — Main Render
   ============================================================ */
function renderPicDashboard() {
  var data = currentFilter === 'all'
    ? PICS
    : PICS.filter(function (p) { return p.pit === currentFilter; });
  renderKpi(data);
  renderPicGrid(data);
  renderPicDetail(data);
  renderPicCharts(data);
}

/* ============================================================
   PIC AREA — Filter Pills
   ============================================================ */
function filterArea(area, el) {
  currentFilter = area;
  document.querySelectorAll('.pill').forEach(function (p) { p.classList.remove('active'); });
  el.classList.add('active');
  selectedPicId = null;
  renderPicDashboard();
}

/* ============================================================
   PIC AREA — KPI
   ============================================================ */
function renderKpi(data) {
  var done = data.reduce(function (a, p) { return a + p.done; }, 0);
  var wait = data.reduce(function (a, p) { return a + p.waiting; }, 0);
  var over = data.reduce(function (a, p) { return a + p.overdue; }, 0);
  document.getElementById('kpi-total').textContent    = data.length;
  document.getElementById('kpi-total-sub').textContent =
    currentFilter === 'all' ? 'KGB & GRB' : 'Area ' + currentFilter;
  document.getElementById('kpi-done').textContent = done;
  document.getElementById('kpi-wait').textContent = wait;
  document.getElementById('kpi-over').textContent = over;
}

/* ============================================================
   PIC AREA — Grid Cards
   ============================================================ */
function renderPicGrid(data) {
  var html = data.map(function (p) {
    var total = p.done + p.waiting + p.overdue;
    var pct   = total > 0 ? Math.round((p.done / total) * 100) : 0;
    var stColor, stDot, stTxt;
    if (p.overdue > 2)      { stColor = 'var(--red)';    stDot = '#dc2626'; stTxt = 'Kritis'; }
    else if (p.overdue > 0) { stColor = 'var(--yellow)'; stDot = '#d97706'; stTxt = 'Perhatian'; }
    else                    { stColor = 'var(--green)';  stDot = '#16a34a'; stTxt = 'Baik'; }
    var barC = p.overdue > 2 ? '#dc2626' : p.overdue > 0 ? '#d97706' : '#16a34a';
    var sel  = selectedPicId === p.id ? ' selected' : '';

    return (
      '<div class="pic-card' + sel + '" onclick="selectPic(' + p.id + ')">' +
        '<div class="pic-top">' +
          '<div class="pic-ava" style="background:' + p.color + '18;color:' + p.color + '">' + p.inisial + '</div>' +
          '<div>' +
            '<div class="pic-name">' + p.nama + '</div>' +
            '<div class="pic-area-tag">📍 ' + p.area + ' · <span style="background:' + p.color + '18;color:' + p.color + ';padding:1px 7px;border-radius:10px;font-weight:500">' + p.pit + '</span></div>' +
          '</div>' +
        '</div>' +
        '<div class="pic-stats">' +
          '<div class="ps"><div class="ps-val" style="color:var(--green)">'  + p.done    + '</div><div class="ps-lbl">Selesai</div></div>' +
          '<div class="ps"><div class="ps-val" style="color:var(--yellow)">' + p.waiting + '</div><div class="ps-lbl">Waiting</div></div>' +
          '<div class="ps"><div class="ps-val" style="color:' + (p.overdue > 0 ? 'var(--red)' : 'var(--text3)') + '">' + p.overdue + '</div><div class="ps-lbl">Overdue</div></div>' +
        '</div>' +
        '<div class="pic-footer">' +
          '<div class="status-dot" style="background:' + stDot + '"></div>' +
          '<span class="status-txt" style="color:' + stColor + '">' + stTxt + '</span>' +
          '<div class="prog-track"><div class="prog-fill" style="width:' + pct + '%;background:' + barC + '"></div></div>' +
          '<span class="prog-pct">' + pct + '%</span>' +
        '</div>' +
      '</div>'
    );
  }).join('');

  document.getElementById('pic-grid').innerHTML = html;
}

/* ============================================================
   PIC AREA — Select & Detail
   ============================================================ */
function selectPic(id) {
  selectedPicId = selectedPicId === id ? null : id;
  var data = currentFilter === 'all'
    ? PICS
    : PICS.filter(function (p) { return p.pit === currentFilter; });
  renderPicGrid(data);
  renderPicDetail(data);
}

function renderPicDetail(data) {
  var wrap = document.getElementById('detail-wrap');
  if (!selectedPicId) { wrap.innerHTML = ''; return; }
  var p = PICS.find(function (x) { return x.id === selectedPicId; });
  if (!p) { wrap.innerHTML = ''; return; }

  var emailTag = p.email
    ? '<span class="tag blue">✉ ' + p.email + '</span>'
    : '<span class="tag">— belum ada email</span>';

  var overdueTag = p.overdue > 0 ? '<span class="tag red">' + p.overdue + ' Overdue</span>' : '';
  var temuanTag  = p.temuan  > 0 ? '<span class="tag yellow">' + p.temuan + ' Temuan</span>' : '';

  var tasksHtml = p.tasks.map(function (t) {
    var bc  = t.status === 'Selesai' ? 'badge-selesai' : t.status === 'Overdue' ? 'badge-overdue' : 'badge-waiting';
    var dot = t.status === 'Selesai' ? '#16a34a' : t.status === 'Overdue' ? '#dc2626' : '#d97706';
    return (
      '<div class="task-item">' +
        '<div class="task-icon" style="background:' + p.color + '18">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="' + p.color + '" stroke-width="2">' +
            '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>' +
          '</svg>' +
        '</div>' +
        '<div class="task-main">' +
          '<div class="task-name">' + t.alat + '</div>' +
          '<div class="task-asset">' + t.asset + '</div>' +
        '</div>' +
        '<div class="task-right">' +
          '<div class="task-date">' + t.jadwal + '</div>' +
          '<span class="task-badge ' + bc + '"><span style="width:5px;height:5px;border-radius:50%;background:' + dot + ';display:inline-block"></span> ' + t.status + '</span>' +
        '</div>' +
      '</div>'
    );
  }).join('');

  wrap.innerHTML =
    '<div class="sec-lbl">Detail PIC</div>' +
    '<div class="detail-panel">' +
      '<div class="dp-head">' +
        '<div class="dp-ava" style="background:' + p.color + '18;color:' + p.color + '">' + p.inisial + '</div>' +
        '<div style="flex:1">' +
          '<div class="dp-name">' + p.nama + '</div>' +
          '<div class="dp-sub">📍 ' + p.area + ' · ' + p.pit + '</div>' +
          '<div class="dp-tags">' + emailTag + '<span class="tag green">' + p.done + ' Selesai</span>' + overdueTag + temuanTag + '</div>' +
        '</div>' +
        '<div class="dp-actions">' +
          '<button class="dp-action-btn" onclick="showToast(\'Menghubungi ' + p.nama + ' 📞\')">📞 Hubungi</button>' +
          '<button class="dp-action-btn" onclick="showToast(\'Rekap laporan ' + p.nama + ' sedang disiapkan 📄\')">📄 Rekap</button>' +
        '</div>' +
      '</div>' +
      '<div style="font-size:12px;color:var(--text2);margin-bottom:10px;font-weight:500">Daftar Tugas Inspeksi (' + p.tasks.length + ' item)</div>' +
      '<div class="task-grid">' + tasksHtml + '</div>' +
    '</div>';
}

/* ============================================================
   PIC AREA — Bottom Charts
   ============================================================ */
function renderPicCharts(data) {
  var maxDone = Math.max.apply(null, data.map(function (p) { return p.done; })) || 1;
  document.getElementById('bar-done').innerHTML = data.slice(0, 8).map(function (p) {
    var w = Math.round((p.done / maxDone) * 100);
    return (
      '<div class="bar-row">' +
        '<div class="bar-lbl" title="' + p.nama + '">' + p.nama.split(' ')[0] + '</div>' +
        '<div class="bar-track"><div class="bar-fill" style="width:' + w + '%;background:' + p.color + '"></div></div>' +
        '<div class="bar-num">' + p.done + '</div>' +
      '</div>'
    );
  }).join('');

  var maxT = Math.max.apply(null, data.map(function (p) { return p.temuan; })) || 1;
  document.getElementById('bar-finding').innerHTML = data.slice(0, 8).map(function (p) {
    var w  = Math.round((p.temuan / maxT) * 100);
    var fc = p.temuan >= 4 ? '#dc2626' : p.temuan >= 2 ? '#d97706' : '#16a34a';
    return (
      '<div class="bar-row">' +
        '<div class="bar-lbl" title="' + p.nama + '">' + p.nama.split(' ')[0] + '</div>' +
        '<div class="bar-track"><div class="bar-fill" style="width:' + w + '%;background:' + fc + '"></div></div>' +
        '<div class="bar-num">' + p.temuan + '</div>' +
      '</div>'
    );
  }).join('');
}

/* ============================================================
   PERFORMA PIC — Full table view
   ============================================================ */
function renderPerforma() {
  var sorted = PICS.slice().sort(function (a, b) {
    var pctA = (a.done / (a.done + a.waiting + a.overdue)) || 0;
    var pctB = (b.done / (b.done + b.waiting + b.overdue)) || 0;
    return pctB - pctA;
  });

  document.getElementById('performa-body').innerHTML = sorted.map(function (p, i) {
    var total  = p.done + p.waiting + p.overdue;
    var pct    = total > 0 ? Math.round((p.done / total) * 100) : 0;
    var barC   = p.overdue > 2 ? '#dc2626' : p.overdue > 0 ? '#d97706' : '#16a34a';
    var rankBg = i === 0 ? '#fef9c3' : i === 1 ? '#f1f5f9' : i === 2 ? '#fff7ed' : '';
    var statusBadge = p.overdue > 2
      ? '<span class="badge b-red">Kritis</span>'
      : p.overdue > 0
        ? '<span class="badge b-yellow">Perhatian</span>'
        : '<span class="badge b-green">Baik</span>';

    return (
      '<tr style="background:' + rankBg + '">' +
        '<td style="text-align:center;font-family:var(--mono);font-weight:700;font-size:13px">' + (i + 1) + '</td>' +
        '<td>' +
          '<div style="display:flex;align-items:center;gap:8px">' +
            '<div style="width:28px;height:28px;border-radius:50%;background:' + p.color + '18;color:' + p.color + ';display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700">' + p.inisial + '</div>' +
            '<div><div style="font-weight:600;font-size:13px;color:var(--text)">' + p.nama + '</div>' +
            '<div style="font-size:11px;color:var(--text3)">📍 ' + p.area + '</div></div>' +
          '</div>' +
        '</td>' +
        '<td><span style="background:' + p.color + '18;color:' + p.color + ';padding:2px 8px;border-radius:10px;font-size:11px;font-weight:600">' + p.pit + '</span></td>' +
        '<td style="font-family:var(--mono);font-weight:600;color:var(--green)">' + p.done + '</td>' +
        '<td style="font-family:var(--mono);color:var(--yellow)">' + p.waiting + '</td>' +
        '<td style="font-family:var(--mono);color:' + (p.overdue > 0 ? 'var(--red)' : 'var(--text3)') + ';font-weight:' + (p.overdue > 0 ? '700' : '400') + '">' + p.overdue + '</td>' +
        '<td style="font-family:var(--mono);color:var(--orange)">' + p.temuan + '</td>' +
        '<td>' +
          '<div style="display:flex;align-items:center;gap:8px">' +
            '<div style="flex:1;height:5px;background:var(--bg4);border-radius:3px;overflow:hidden">' +
              '<div style="width:' + pct + '%;height:100%;background:' + barC + ';border-radius:3px"></div>' +
            '</div>' +
            '<span style="font-family:var(--mono);font-size:11px;color:var(--text2);min-width:32px">' + pct + '%</span>' +
          '</div>' +
        '</td>' +
        '<td>' + statusBadge + '</td>' +
        '<td>' +
          '<button class="apv-btn ok" style="font-size:11px;padding:3px 9px" onclick="showToast(\'Hubungi ' + p.nama + ' 📞\')">📞</button>' +
        '</td>' +
      '</tr>'
    );
  }).join('');
}

/* ============================================================
   TOAST
   ============================================================ */
function showToast(msg) {
  var el = document.getElementById('toast-el');
  document.getElementById('toast-txt').textContent = msg;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(function () { el.classList.remove('show'); }, 3000);
}


/* ============================================================
   MOBILE — Inject user info dari sesi login
   ============================================================ */
(function injectUserSession() {
  var stored = sessionStorage.getItem('isam_user') || localStorage.getItem('isam_user');
  if (!stored) return;
  try {
    var user = JSON.parse(stored);
    if (!user) return;

    /* Inisial dari nama */
    var inisial = (user.nama || 'U').split(' ')
      .map(function (w) { return w[0]; })
      .join('').slice(0, 2).toUpperCase();

    /* Topbar */
    var topbarAva  = document.getElementById('topbar-ava');
    var topbarNama = document.getElementById('topbar-nama');
    if (topbarAva)  topbarAva.textContent  = inisial;
    if (topbarNama) topbarNama.textContent = user.nama || '';

    /* Sidebar footer */
    var sidebarAva  = document.getElementById('sidebar-ava');
    var sidebarNama = document.getElementById('sidebar-nama');
    if (sidebarAva)  sidebarAva.textContent  = inisial;
    if (sidebarNama) sidebarNama.textContent = user.nama || '';

  } catch (e) {}
})();


/* ============================================================
   MOBILE — Bottom Nav Active State
   ============================================================ */
function setBnActive(id) {
  document.querySelectorAll('.bn-item').forEach(function (el) {
    el.classList.remove('active');
  });
  var t = document.getElementById(id);
  if (t) t.classList.add('active');
}


/* ============================================================
   MOBILE — Quick Nav Active State
   ============================================================ */
function setMqnActive(el) {
  document.querySelectorAll('.mqn-item').forEach(function (m) {
    m.classList.remove('active');
  });
  if (el) el.classList.add('active');
}


/* ============================================================
   MOBILE — Hamburger Drawer (show sidebar nav as overlay)
   ============================================================ */
var drawerOpen = false;

function toggleDrawer() {
  drawerOpen = !drawerOpen;
  var nav = document.querySelector('.sidebar .nav');
  var footer = document.querySelector('.sidebar-footer');

  /* Di mobile, sidebar sudah jadi topbar — tampilkan nav sebagai dropdown */
  if (window.innerWidth <= 768) {
    if (!document.getElementById('mobile-drawer')) {
      /* Buat drawer overlay sekali */
      var drawer = document.createElement('div');
      drawer.id = 'mobile-drawer';
      drawer.style.cssText = [
        'position:fixed;top:57px;left:0;right:0;bottom:0;',
        'background:rgba(0,0,0,.4);z-index:150;',
        'display:flex;flex-direction:column;'
      ].join('');

      var panel = document.createElement('div');
      panel.style.cssText = [
        'background:var(--bg2);max-height:70vh;overflow-y:auto;',
        'padding:12px 10px 20px;border-bottom:1px solid var(--line);',
        'box-shadow:0 8px 24px rgba(0,0,0,.12);'
      ].join('');

      /* Clone nav + footer */
      var navClone    = document.querySelector('.sidebar .nav').cloneNode(true);
      var footerClone = document.querySelector('.sidebar-footer').cloneNode(true);

      panel.appendChild(navClone);
      panel.appendChild(footerClone);
      drawer.appendChild(panel);

      /* Klik backdrop → tutup */
      drawer.addEventListener('click', function (e) {
        if (e.target === drawer) toggleDrawer();
      });

      document.body.appendChild(drawer);
    }

    var drawerEl = document.getElementById('mobile-drawer');
    drawerEl.style.display = drawerOpen ? 'flex' : 'none';
  }
}


/* ============================================================
   MOBILE — Override goNav agar sync bottom-nav & quick-nav
   ============================================================ */
var _goNavOriginal = goNav;

goNav = function (id, el) {
  _goNavOriginal(id, el);

  /* Sync mobile quick nav */
  document.querySelectorAll('.mqn-item').forEach(function (m) {
    m.classList.toggle('active', m.getAttribute('data-view') === id);
  });

  /* Sync bottom nav */
  var bnMap = {
    'captain':      'bn-captain',
    'pic-area':     'bn-pic-area',
    'pic-performa': 'bn-pic-performa',
  };
  if (bnMap[id]) setBnActive(bnMap[id]);

  /* Tutup drawer jika terbuka */
  if (drawerOpen) toggleDrawer();

  /* Scroll ke atas di mobile */
  if (window.innerWidth <= 768) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};


/* ============================================================
   MOBILE — Responsive Layout Detection
   ============================================================ */
function applyLayout() {
  var isMobile    = window.innerWidth <= 768;
  var hamburger   = document.getElementById('hamburger-btn');
  var quickNav    = document.getElementById('mobile-quick-nav');
  var bottomNav   = document.getElementById('bottom-nav');

  if (hamburger) hamburger.style.display = isMobile ? 'flex' : 'none';
  if (quickNav)  quickNav.style.display  = isMobile ? 'flex' : 'none';
  if (bottomNav) bottomNav.style.display = isMobile ? 'flex' : 'none';
}

window.addEventListener('resize', applyLayout);
document.addEventListener('DOMContentLoaded', applyLayout);