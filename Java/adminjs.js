/* ============================================================
   ISAM Admin — adminjs.js   Versi : 2.0
   ============================================================ */
'use strict';

var PIC_DATA = [
  {id:1, nama:'Budi Jatmiko',  inisial:'BJ', pit:'KGB', area:'WS CIA',         email:'dimayy17@gmail.com',     telp:'+62 812-3456-7890', color:'#2563eb', status:'Aktif'},
  {id:2, nama:'Rina Sari',     inisial:'RS', pit:'KGB', area:'Office CIA',      email:'drangga88@gmail.com',    telp:'',                  color:'#7c3aed', status:'Aktif'},
  {id:3, nama:'Abdul Aziz',    inisial:'AA', pit:'KGB', area:'PCR',             email:'Abdulaziz2037@gmail.com',telp:'+62 813-9876-5432', color:'#059669', status:'Aktif'},
  {id:4, nama:'Hendra P.',     inisial:'HP', pit:'KGB', area:'Area TU',         email:'',                       telp:'',                  color:'#d97706', status:'Aktif'},
  {id:5, nama:'Ahmad Rafi',    inisial:'AR', pit:'KGB', area:'SSB',             email:'',                       telp:'',                  color:'#db2777', status:'Aktif'},
  {id:6, nama:'Dedi Kurnia',   inisial:'DK', pit:'KGB', area:'Bay CP',          email:'',                       telp:'',                  color:'#0891b2', status:'Aktif'},
  {id:7, nama:'Rizki Amri',    inisial:'RA', pit:'GRB', area:'Iglo HE',         email:'',                       telp:'+62 815-1111-2222', color:'#2563eb', status:'Aktif'},
  {id:8, nama:'Fajar Nugroho', inisial:'FN', pit:'GRB', area:'Iglo Track',      email:'',                       telp:'',                  color:'#7c3aed', status:'Aktif'},
  {id:9, nama:'Yudi Pratama',  inisial:'YP', pit:'GRB', area:'Area TU',         email:'',                       telp:'',                  color:'#059669', status:'Aktif'},
  {id:10,nama:'Bayu Santoso',  inisial:'BS', pit:'GRB', area:'Bay CP',          email:'',                       telp:'',                  color:'#d97706', status:'Aktif'},
];

var SUB_AREAS = {
  KGB:['WS CIA','Office CIA','PCR','Area TU','SSB','Bay CP','Epiroc','Pit Stop Selatan'],
  GRB:['Iglo HE','Iglo Track & Support Eq','Area TU','SSB','Bay CP','Epiroc','Pit Stop Selatan'],
};

var COLORS = ['#2563eb','#7c3aed','#db2777','#059669','#d97706','#dc2626','#0891b2','#65a30d','#ea580c','#0d9488'];

var LOG_DATA = [
  {icon:'➕',color:'var(--green-lt)', text:'PIC baru ditambahkan: Bayu Santoso (Bay CP · GRB)',      time:'Hari ini · 10:15'},
  {icon:'✏️',color:'var(--accent-lt)',text:'Data PIC diupdate: Abdul Aziz — nomor telp diperbarui',  time:'Hari ini · 09:30'},
  {icon:'➕',color:'var(--green-lt)', text:'PIC baru ditambahkan: Yudi Pratama (Area TU · GRB)',     time:'Kemarin · 14:20'},
  {icon:'🗑', color:'var(--red-lt)',   text:'PIC dihapus: Rudi S. (Bay CP · KGB)',                   time:'Kemarin · 11:05'},
  {icon:'✏️',color:'var(--accent-lt)',text:'Data PIC diupdate: Dedi Kurnia — email diperbarui',     time:'04 Jun · 15:40'},
  {icon:'➕',color:'var(--green-lt)', text:'PIC baru ditambahkan: Fajar Nugroho (Iglo Track · GRB)',time:'03 Jun · 09:00'},
  {icon:'🔒',color:'var(--yellow-lt)',text:'Status PIC dinonaktifkan: Sari W. (SSB · GRB)',         time:'01 Jun · 16:00'},
];

var editingId     = null;
var selectedColor = COLORS[0];
var nextId        = 11;
var toastTimer    = null;
var drawerOpen    = false;

/* ── INIT ── */
document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('today-lbl').textContent = new Date().toLocaleDateString('id-ID',{
    weekday:'short',day:'numeric',month:'short',year:'numeric',
  });
  buildColorRow();
  renderPicCards();
  renderOverview();
  renderLog();
  updateKPI();
  injectUserSession();
  applyLayout();
});

/* ── INJECT USER SESSION ── */
function injectUserSession() {
  var stored = sessionStorage.getItem('isam_user') || localStorage.getItem('isam_user');
  if (!stored) return;
  try {
    var user = JSON.parse(stored);
    if (!user) return;
    var inisial = (user.nama||'SA').split(' ').map(function(w){return w[0];}).join('').slice(0,2).toUpperCase();
    var sAva  = document.getElementById('sidebar-ava');
    var sNama = document.getElementById('sidebar-nama');
    var tNama = document.getElementById('topbar-nama');
    if (sAva)  sAva.textContent  = inisial;
    if (sNama) sNama.textContent = user.nama || 'Admin';
    if (tNama) tNama.textContent = user.nama || 'Admin';
  } catch(e) {}
}

/* ── NAVIGATION ── */
function goNav(id, el) {
  document.querySelectorAll('.view').forEach(function(v){v.classList.remove('on');});
  var viewEl = document.getElementById('v-'+id);
  if (viewEl) viewEl.classList.add('on');

  document.querySelectorAll('.nav-item').forEach(function(n){n.classList.remove('active');});
  if (el) el.classList.add('active');

  var titles = {
    'dashboard':'Overview','pic-list':'Daftar PIC','accounts':'Akun & Role',
    'log':'Log Aktivitas','active-findings':'Temuan Aktif','overdue':'Overdue',
    'waiting-approval':'Waiting Approval','completed':'Selesai',
    'asset-management':'Manajemen Asset','inspection-schedule':'Jadwal Inspeksi',
    'tool-category':'Kategori Alat',
  };
  document.getElementById('page-title').textContent = titles[id] || id;

  /* Sync mobile UI */
  document.querySelectorAll('.mqn-item').forEach(function(m){
    m.classList.toggle('active', m.getAttribute('data-view') === id);
  });
  var bnMap = {
    'dashboard':'bn-dashboard','pic-list':'bn-pic-list',
    'accounts':'bn-accounts','log':'bn-log',
  };
  if (bnMap[id]) setBnActive(bnMap[id]);

  if (drawerOpen) toggleDrawer();
  if (window.innerWidth <= 768) window.scrollTo({top:0,behavior:'smooth'});
}

/* ── MOBILE — Bottom Nav ── */
function setBnActive(id) {
  document.querySelectorAll('.bn-item').forEach(function(el){el.classList.remove('active');});
  var t = document.getElementById(id);
  if (t) t.classList.add('active');
}

function setMqnActive(el) {
  document.querySelectorAll('.mqn-item').forEach(function(m){m.classList.remove('active');});
  if (el) el.classList.add('active');
}

/* ── MOBILE — Hamburger Drawer ── */
function toggleDrawer() {
  drawerOpen = !drawerOpen;
  if (window.innerWidth > 768) return;

  var drawerId = 'mobile-drawer';
  if (!document.getElementById(drawerId)) {
    var drawer = document.createElement('div');
    drawer.id = drawerId;
    drawer.style.cssText = 'position:fixed;top:57px;left:0;right:0;bottom:0;background:rgba(0,0,0,.4);z-index:150;display:flex;flex-direction:column;';

    var panel = document.createElement('div');
    panel.style.cssText = 'background:var(--bg2);max-height:75vh;overflow-y:auto;padding:10px;box-shadow:0 8px 24px rgba(0,0,0,.12);';

    panel.appendChild(document.querySelector('.sidebar .nav').cloneNode(true));
    panel.appendChild(document.querySelector('.sidebar-footer').cloneNode(true));
    drawer.appendChild(panel);
    drawer.addEventListener('click', function(e){if(e.target===drawer)toggleDrawer();});
    document.body.appendChild(drawer);
  }

  document.getElementById(drawerId).style.display = drawerOpen ? 'flex' : 'none';
}

/* ── RESPONSIVE LAYOUT ── */
function applyLayout() {
  var isMobile = window.innerWidth <= 768;
  var hb = document.getElementById('hamburger-btn');
  var qn = document.getElementById('mobile-quick-nav');
  var bn = document.getElementById('bottom-nav');
  if (hb) hb.style.display = isMobile ? 'flex' : 'none';
  if (qn) qn.style.display = isMobile ? 'flex' : 'none';
  if (bn) bn.style.display = isMobile ? 'flex' : 'none';
  /* Update badge */
  var pb = document.getElementById('bn-pic-badge');
  if (pb) pb.textContent = PIC_DATA.length;
}

window.addEventListener('resize', applyLayout);

/* ── COLOR ROW ── */
function buildColorRow() {
  document.getElementById('color-row').innerHTML = COLORS.map(function(c,i){
    return '<div class="color-opt'+(i===0?' selected':'')+'" style="background:'+c+'" onclick="selectColor(\''+c+'\',this)" title="'+c+'"></div>';
  }).join('');
}

function selectColor(c,el) {
  selectedColor = c;
  document.querySelectorAll('.color-opt').forEach(function(o){o.classList.remove('selected');});
  el.classList.add('selected');
}

/* ── AREA OPTIONS ── */
function updateAreaOptions() {
  var pit   = document.getElementById('m-pit').value;
  var areas = SUB_AREAS[pit] || [];
  document.getElementById('m-area').innerHTML =
    '<option value="">-- Pilih Sub Area --</option>'+
    areas.map(function(a){return '<option>'+a+'</option>';}).join('');
}

/* ── MODAL TAMBAH ── */
function openAddModal() {
  editingId = null;
  document.getElementById('modal-title').innerHTML =
    '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>Tambah PIC Baru';
  document.getElementById('modal-save-btn').textContent = '✓ Simpan PIC';
  clearForm();
  document.getElementById('modal-pic').classList.add('show');
  goNav('pic-list', document.querySelectorAll('.nav-item')[1]);
}

/* ── MODAL EDIT ── */
function openEditModal(id) {
  var p = PIC_DATA.find(function(x){return x.id===id;});
  if (!p) return;
  editingId = id;
  document.getElementById('modal-title').innerHTML =
    '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>Edit PIC — '+p.nama;
  document.getElementById('modal-save-btn').textContent = '✓ Simpan Perubahan';
  document.getElementById('m-nama').value    = p.nama;
  document.getElementById('m-inisial').value = p.inisial;
  document.getElementById('m-pit').value     = p.pit;
  updateAreaOptions();
  document.getElementById('m-area').value    = p.area;
  document.getElementById('m-email').value   = p.email||'';
  document.getElementById('m-telp').value    = p.telp||'';
  document.getElementById('m-status').value  = p.status;
  selectedColor = p.color;
  document.querySelectorAll('.color-opt').forEach(function(o){
    o.classList.toggle('selected', o.style.background===p.color||o.style.backgroundColor===p.color);
  });
  document.getElementById('modal-pic').classList.add('show');
}

/* ── SAVE PIC ── */
function savePIC() {
  var nama    = document.getElementById('m-nama').value.trim();
  var inisial = document.getElementById('m-inisial').value.trim().toUpperCase();
  var pit     = document.getElementById('m-pit').value;
  var area    = document.getElementById('m-area').value;
  if (!nama||!inisial||!pit||!area) { showToast('⚠️ Lengkapi field wajib!'); return; }

  if (editingId) {
    var p = PIC_DATA.find(function(x){return x.id===editingId;});
    if (p) {
      p.nama=nama;p.inisial=inisial;p.pit=pit;p.area=area;
      p.email=document.getElementById('m-email').value.trim();
      p.telp=document.getElementById('m-telp').value.trim();
      p.status=document.getElementById('m-status').value;
      p.color=selectedColor;
      addLog('✏️','var(--accent-lt)','Data PIC diupdate: '+nama+' ('+area+' · '+pit+')');
      showToast('✅ Data '+nama+' berhasil diupdate!');
    }
  } else {
    PIC_DATA.push({id:nextId++,nama:nama,inisial:inisial,pit:pit,area:area,
      email:document.getElementById('m-email').value.trim(),
      telp:document.getElementById('m-telp').value.trim(),
      status:document.getElementById('m-status').value,color:selectedColor});
    addLog('➕','var(--green-lt)','PIC baru ditambahkan: '+nama+' ('+area+' · '+pit+')');
    showToast('✅ PIC '+nama+' berhasil ditambahkan!');
  }

  closeModal();
  renderPicCards();
  renderOverview();
  updateKPI();
  applyLayout();
}

/* ── DELETE PIC ── */
function confirmDelete(id) {
  var p = PIC_DATA.find(function(x){return x.id===id;});
  if (!p) return;
  document.getElementById('del-msg').textContent =
    'PIC "'+p.nama+'" ('+p.area+' · '+p.pit+') akan dihapus permanen. Tindakan ini tidak bisa dibatalkan.';
  document.getElementById('del-confirm-btn').onclick = function(){doDelete(id);};
  document.getElementById('modal-del').classList.add('show');
}

function doDelete(id) {
  var p = PIC_DATA.find(function(x){return x.id===id;});
  if (p) {
    addLog('🗑','var(--red-lt)','PIC dihapus: '+p.nama+' ('+p.area+' · '+p.pit+')');
    PIC_DATA = PIC_DATA.filter(function(x){return x.id!==id;});
    showToast('🗑 PIC '+p.nama+' berhasil dihapus');
  }
  document.getElementById('modal-del').classList.remove('show');
  renderPicCards();renderOverview();updateKPI();applyLayout();
}

/* ── TOGGLE STATUS ── */
function toggleStatus(id) {
  var p = PIC_DATA.find(function(x){return x.id===id;});
  if (!p) return;
  p.status = p.status==='Aktif'?'Nonaktif':'Aktif';
  addLog('🔒','var(--yellow-lt)','Status PIC '+(p.status==='Aktif'?'diaktifkan':'dinonaktifkan')+': '+p.nama);
  renderPicCards();renderOverview();updateKPI();
  showToast((p.status==='Aktif'?'✅ ':'🔒 ')+p.nama+' → '+p.status);
}

/* ── MODAL CLOSE ── */
function closeModal() { document.getElementById('modal-pic').classList.remove('show'); }

function clearForm() {
  ['m-nama','m-inisial','m-email','m-telp'].forEach(function(id){document.getElementById(id).value='';});
  document.getElementById('m-pit').value='';
  document.getElementById('m-area').innerHTML='<option value="">-- Pilih Pit dulu --</option>';
  document.getElementById('m-status').value='Aktif';
  selectedColor=COLORS[0];
  document.querySelectorAll('.color-opt').forEach(function(o,i){o.classList.toggle('selected',i===0);});
}

/* ── RENDER PIC CARDS ── */
function renderPicCards() {
  var q      = (document.getElementById('search-pic')   ||{value:''}).value.toLowerCase();
  var pit    = (document.getElementById('filter-pit')   ||{value:''}).value;
  var status = (document.getElementById('filter-status')||{value:''}).value;

  var filtered = PIC_DATA.filter(function(p){
    return (!q||(p.nama+p.area+p.email).toLowerCase().includes(q))&&
           (!pit||p.pit===pit)&&(!status||p.status===status);
  });

  var kgb = filtered.filter(function(p){return p.pit==='KGB';});
  var grb = filtered.filter(function(p){return p.pit==='GRB';});
  var empty = '<div style="color:var(--text3);font-size:13px;padding:12px">Tidak ada PIC ditemukan.</div>';
  document.getElementById('grid-kgb').innerHTML = kgb.length ? kgb.map(picCardHtml).join('') : empty;
  document.getElementById('grid-grb').innerHTML = grb.length ? grb.map(picCardHtml).join('') : empty;
  document.getElementById('nav-count').textContent = PIC_DATA.length;
}

function picCardHtml(p) {
  var sb = p.status==='Aktif'
    ? '<span class="badge b-green"><span class="bdot" style="background:var(--green)"></span>Aktif</span>'
    : '<span class="badge b-gray"><span class="bdot" style="background:var(--text3)"></span>Nonaktif</span>';
  var emailRow = p.email
    ? '<div class="pc-email">'+p.email+'</div>'
    : '<div style="font-size:11px;color:var(--text3);margin-top:3px">— belum ada email</div>';
  var telpRow = p.telp ? '<div style="font-size:11px;color:var(--text2);margin-top:2px">📞 '+p.telp+'</div>' : '';
  return (
    '<div class="pic-card">'+
      '<div class="pc-top">'+
        '<div class="pc-ava" style="background:'+p.color+'">'+p.inisial+'</div>'+
        '<div style="min-width:0">'+
          '<div class="pc-name">'+p.nama+'</div>'+
          '<div class="pc-area">📍 '+p.area+' · <span style="background:'+p.color+'18;color:'+p.color+';padding:1px 7px;border-radius:10px;font-size:10px;font-weight:600">'+p.pit+'</span></div>'+
          emailRow+telpRow+
        '</div>'+
      '</div>'+
      '<div class="pc-footer">'+
        sb+
        '<div class="pc-actions">'+
          '<button class="pc-btn" onclick="toggleStatus('+p.id+')" title="Toggle status">'+(p.status==='Aktif'?'🔒':'✅')+'</button>'+
          '<button class="pc-btn edit" onclick="openEditModal('+p.id+')">✏️ Edit</button>'+
          '<button class="pc-btn del"  onclick="confirmDelete('+p.id+')">🗑 Hapus</button>'+
        '</div>'+
      '</div>'+
    '</div>'
  );
}

/* ── RENDER OVERVIEW ── */
function renderOverview() {
  var rows = PIC_DATA.slice(-5).reverse().map(function(p){
    var sb = p.status==='Aktif'?'<span class="badge b-green">Aktif</span>':'<span class="badge b-gray">Nonaktif</span>';
    return '<tr>'+
      '<td><div style="display:flex;align-items:center;gap:8px"><div style="width:26px;height:26px;border-radius:50%;background:'+p.color+';display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;color:#fff">'+p.inisial+'</div><b>'+p.nama+'</b></div></td>'+
      '<td>'+p.area+'</td><td>'+p.pit+'</td><td>'+sb+'</td>'+
      '<td><div style="display:flex;gap:5px">'+
        '<button class="pc-btn edit" style="padding:3px 9px;font-size:11px" onclick="openEditModal('+p.id+')">Edit</button>'+
        '<button class="pc-btn del"  style="padding:3px 9px;font-size:11px" onclick="confirmDelete('+p.id+')">Hapus</button>'+
      '</div></td>'+
    '</tr>';
  }).join('');
  document.getElementById('overview-tbl').innerHTML =
    '<thead><tr><th>Nama</th><th>Area</th><th>Pit</th><th>Status</th><th></th></tr></thead><tbody>'+rows+'</tbody>';
}

/* ── UPDATE KPI ── */
function updateKPI() {
  var aktif = PIC_DATA.filter(function(p){return p.status==='Aktif';}).length;
  var kgb   = PIC_DATA.filter(function(p){return p.pit==='KGB';}).length;
  var grb   = PIC_DATA.filter(function(p){return p.pit==='GRB';}).length;
  document.getElementById('kv-total').textContent=PIC_DATA.length;
  document.getElementById('kv-aktif').textContent=aktif;
  document.getElementById('kv-kgb').textContent=kgb;
  document.getElementById('kv-grb').textContent=grb;
}

/* ── LOG ── */
function addLog(icon,color,text) {
  var now=new Date();
  var time='Hari ini · '+now.getHours()+':'+String(now.getMinutes()).padStart(2,'0');
  LOG_DATA.unshift({icon:icon,color:color,text:text,time:time});
  renderLog();
  document.getElementById('nav-log-count').textContent=LOG_DATA.length;
}

function renderLog() {
  function logHtml(l){
    return '<div class="log-item"><div class="log-icon" style="background:'+l.color+'">'+l.icon+'</div>'+
      '<div><div class="log-text">'+l.text+'</div><div class="log-time">'+l.time+'</div></div></div>';
  }
  var oEl=document.getElementById('overview-log');
  var fEl=document.getElementById('full-log');
  if (oEl) oEl.innerHTML=LOG_DATA.slice(0,5).map(logHtml).join('');
  if (fEl) fEl.innerHTML=LOG_DATA.map(logHtml).join('');
  var cEl=document.getElementById('log-count-lbl');
  if (cEl) cEl.textContent=LOG_DATA.length+' entri';
}

/* ── TOAST ── */
function showToast(msg) {
  var el=document.getElementById('toast-el');
  document.getElementById('toast-txt').textContent=msg;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer=setTimeout(function(){el.classList.remove('show');},3000);
}