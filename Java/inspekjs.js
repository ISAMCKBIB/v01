/* ============================================================
   ISAM Inspection — app.js
   Deskripsi : Logika utama Inspection Dashboard
   Versi      : 1.0
   ============================================================ */

'use strict';

/* ============================================================
   CONFIG
   ============================================================ */
var SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwVn7wO19dYw0kAzd4G9cQeo4DafeCUkqDEYB3AvrNJayJ4qiMDsXAMQW7U9PU08i2OZw/exec';

/* ============================================================
   DATA — MASTER
   ============================================================ */
var SUB_AREAS = {
  KGB: ['WS CIA', 'Office CIA', 'PCR', 'Area TU', 'SSB', 'Bay CP', 'Epiroc', 'Pit Stop Selatan'],
  GRB: ['Iglo HE', 'Iglo Track & Support Eq', 'Area TU', 'SSB', 'Bay CP', 'Epiroc', 'Pit Stop Selatan'],
};

var PIC_OPTIONS = {
  KGB: [
    { nama: 'Budi Jatmiko',   area: 'WS CIA',          email: 'dimayy17@gmail.com' },
    { nama: 'Rina Sari',      area: 'Office CIA',       email: 'drangga88@gmail.com' },
    { nama: 'Abdul Aziz',     area: 'PCR',              email: 'Abdulaziz2037@gmail.com' },
    { nama: 'Hendra P.',      area: 'Area TU',          email: '' },
    { nama: 'Ahmad Rafi',     area: 'SSB',              email: '' },
    { nama: 'Dedi Kurnia',    area: 'Bay CP',           email: '' },
    { nama: 'Siti Rahayu',    area: 'Epiroc',           email: '' },
    { nama: 'Irfan Maulana',  area: 'Pit Stop Selatan', email: '' },
  ],
  GRB: [
    { nama: 'Rizki Amri',     area: 'Iglo HE',          email: '' },
    { nama: 'Fajar Nugroho',  area: 'Iglo Track',       email: '' },
    { nama: 'Yudi Pratama',   area: 'Area TU',          email: '' },
    { nama: 'Novi Andriani',  area: 'SSB',              email: '' },
    { nama: 'Bayu Santoso',   area: 'Bay CP',           email: '' },
    { nama: 'Toni Wijaya',    area: 'Epiroc',           email: '' },
    { nama: 'Mega Wulandari', area: 'Pit Stop Selatan', email: '' },
  ],
};

/* ============================================================
   DATA — WAITING INSPECTION
   ============================================================ */
var WAITING_DATA = [
  { asset: 'APR-012', loc: 'WS CIA · KGB',    tool: 'APAR',                   jadwal: '10/06/26', last: '10/03/26', priority: 'Segera' },
  { asset: 'FBH-019', loc: 'Iglo HE · GRB',   tool: 'Full Body Harness',      jadwal: '08/06/26', last: '08/03/26', priority: 'Segera' },
  { asset: 'CRN-003', loc: 'Bay CP · KGB',     tool: 'Crane Workshop',         jadwal: '15/06/26', last: '15/03/26', priority: 'Normal' },
  { asset: 'SLG-008', loc: 'PCR · KGB',        tool: 'Sling / Webbing',        jadwal: '12/06/26', last: '12/03/26', priority: 'Normal' },
  { asset: 'TGP-005', loc: 'SSB · GRB',        tool: 'Tangga Portable',        jadwal: '14/06/26', last: '14/03/26', priority: 'Normal' },
  { asset: 'ALP-025', loc: 'Office CIA · KGB', tool: 'Alat Listrik Portable',  jadwal: '09/06/26', last: '09/03/26', priority: 'Segera' },
  { asset: 'HSK-011', loc: 'Epiroc · GRB',     tool: 'Hook & Shackle',         jadwal: '11/06/26', last: '11/03/26', priority: 'Normal' },
  { asset: 'EYW-002', loc: 'Area TU · KGB',    tool: 'Eyewash',                jadwal: '20/06/26', last: '20/03/26', priority: 'Normal' },
  { asset: 'OTW-004', loc: 'Pit Stop · GRB',   tool: 'Oil Trap / Washpad',     jadwal: '18/06/26', last: '18/03/26', priority: 'Normal' },
  { asset: 'RNT-006', loc: 'Bay CP · GRB',     tool: 'Rantai Pengangkat',      jadwal: '07/06/26', last: '07/03/26', priority: 'Segera' },
];

/* ============================================================
   DATA — OVERDUE
   ============================================================ */
var OVERDUE_DATA = [
  { asset: 'APR-005', loc: 'Iglo HE · GRB',    tool: 'APAR',                  tipe: 'Inspeksi Terlambat',         hari: 15, pic: 'Rizki Amri' },
  { asset: 'FBH-003', loc: 'Bay CP · KGB',      tool: 'Full Body Harness',     tipe: 'Korektif Belum Selesai',     hari: 8,  pic: 'Dedi Kurnia' },
  { asset: 'CRN-001', loc: 'WS CIA · KGB',      tool: 'Crane Workshop',        tipe: 'Inspeksi Terlambat',         hari: 22, pic: 'Budi Jatmiko' },
  { asset: 'TAN-007', loc: 'SSB · KGB',         tool: 'Tenaga Angin',          tipe: 'Inspeksi Terlambat',         hari: 5,  pic: 'Ahmad Rafi' },
  { asset: 'SLG-003', loc: 'PCR · KGB',         tool: 'Sling / Webbing',       tipe: 'Korektif Belum Selesai',     hari: 12, pic: 'Abdul Aziz' },
  { asset: 'TGP-002', loc: 'Epiroc · GRB',      tool: 'Tangga Portable',       tipe: 'Inspeksi Terlambat',         hari: 18, pic: 'Toni Wijaya' },
  { asset: 'RNT-001', loc: 'Area TU · GRB',     tool: 'Rantai Pengangkat',     tipe: 'Korektif Belum Selesai',     hari: 30, pic: 'Yudi Pratama' },
  { asset: 'HSK-004', loc: 'Iglo Track · GRB',  tool: 'Hook & Shackle',        tipe: 'Inspeksi Terlambat',         hari: 7,  pic: 'Fajar Nugroho' },
  { asset: 'ALP-009', loc: 'Office CIA · KGB',  tool: 'Alat Listrik Portable', tipe: 'Korektif Belum Selesai',     hari: 3,  pic: 'Rina Sari' },
  { asset: 'EYW-001', loc: 'Pit Stop · GRB',    tool: 'Eyewash',               tipe: 'Inspeksi Terlambat',         hari: 45, pic: 'Mega Wulandari' },
  { asset: 'OTW-001', loc: 'Bay CP · GRB',      tool: 'Oil Trap / Washpad',    tipe: 'Inspeksi Terlambat',         hari: 11, pic: 'Bayu Santoso' },
  { asset: 'APR-009', loc: 'Area TU · KGB',     tool: 'APAR',                  tipe: 'Korektif Belum Selesai',     hari: 6,  pic: 'Hendra P.' },
];

/* ============================================================
   DATA — RIWAYAT
   ============================================================ */
var LIST_DATA = [
  { no: 'INS-048', loc: 'WS CIA · KGB',    tool: 'APAR',                  asset: 'APR-048', status: 'Lulus',     date: '07/06/26' },
  { no: 'INS-047', loc: 'Iglo HE · GRB',   tool: 'Crane Workshop',        asset: 'CRN-002', status: 'Perhatian', date: '06/06/26' },
  { no: 'INS-046', loc: 'Bay CP · KGB',     tool: 'Full Body Harness',     asset: 'FBH-017', status: 'Gagal',     date: '05/06/26' },
  { no: 'INS-045', loc: 'PCR · KGB',        tool: 'Sling / Webbing',       asset: 'SLG-005', status: 'Lulus',     date: '04/06/26' },
  { no: 'INS-044', loc: 'SSB · GRB',        tool: 'Tangga Portable',       asset: 'TGP-003', status: 'Draft',     date: '03/06/26' },
  { no: 'INS-043', loc: 'WS CIA · KGB',     tool: 'Alat Listrik',          asset: 'ALP-021', status: 'Lulus',     date: '02/06/26' },
  { no: 'INS-042', loc: 'Area TU · GRB',    tool: 'APAR',                  asset: 'APR-009', status: 'Lulus',     date: '01/06/26' },
  { no: 'INS-041', loc: 'Epiroc · KGB',     tool: 'Hook & Shackle',        asset: 'HSK-007', status: 'Perhatian', date: '31/05/26' },
  { no: 'INS-040', loc: 'Bay CP · GRB',     tool: 'Eyewash',               asset: 'EYW-001', status: 'Lulus',     date: '30/05/26' },
  { no: 'INS-039', loc: 'SSB · KGB',        tool: 'Rantai Pengangkat',     asset: 'RNT-004', status: 'Lulus',     date: '29/05/26' },
  { no: 'INS-038', loc: 'Iglo HE · GRB',    tool: 'Tenaga Angin',          asset: 'TAN-011', status: 'Gagal',     date: '28/05/26' },
  { no: 'INS-037', loc: 'PCR · KGB',        tool: 'Oil Trap',              asset: 'OTW-002', status: 'Lulus',     date: '27/05/26' },
];

/* ============================================================
   DATA — CHECKLIST PER JENIS TOOLS
   ============================================================ */
var CL = {
  tenaga_angin: {
    label: 'Tenaga Angin', kategori: '1. Tool Room',
    items: [
      { no: '1.1.1', q: 'Nama peralatan portabel tercantum/teridentifikasi' },
      { no: '1.1.2', q: 'Kabel listrik dalam keadaan baik (tidak rusak)' },
      { no: '1.1.3', q: 'Tidak ada kerusakan secara fisik pada alat' },
      { no: '1.1.4', q: 'Periksa air strainer pada alat (jika ada)' },
      { no: '1.1.5', q: 'Katup kontrol (control valve) tertutup sebelum penyambungan' },
      { no: '1.1.6', q: 'Pengaman terpasang dengan baik (jika ada)' },
      { no: '1.1.7', q: 'Sambungan dalam keadaan baik' },
    ],
  },

  alat_listrik: {
    label: 'Alat Listrik Portable', kategori: '1. Tool Room',
    items: [
      { no: '1.3.1',  q: 'Kabel dan plug dalam kondisi baik' },
      { no: '1.3.2',  q: 'Karbon Brush / Brushguel dalam kondisi baik' },
      { no: '1.3.3',  q: 'Frame / Pelindung dalam kondisi baik' },
      { no: '1.3.4',  q: 'Switch / Tombol ON-OFF berfungsi' },
      { no: '1.3.5',  q: 'Semua sambungan kabel dalam kondisi baik' },
      { no: '1.3.6',  q: 'Kabel Grounding terpasang dan baik' },
      { no: '1.3.7',  q: 'Kondisi fisik alat baik' },
      { no: '1.3.8',  q: 'Peralatan tercantum dalam daftar peralatan' },
      { no: '1.3.9',  q: 'Peralatan memiliki No. Register' },
      { no: '1.3.10', q: 'Tertera info tanggal tes / inspeksi terakhir' },
      { no: '1.3.11', q: 'Polaritas sesuai' },
      { no: '1.3.12', q: 'Kabel berisolasi ganda' },
      { no: '1.3.13', q: 'Tidak ada kerusakan isolasi pada flexible supply cord' },
      { no: '1.3.14', q: 'Kabel flexible sesuai anchored' },
      { no: '1.3.15', q: 'Resistansi isolator dan konduktor tidak kurang dari 1.0 mega ohms' },
    ],
  },

  hook_shackle: {
    label: 'Hook & Shackle', kategori: '2. Lifting & Penyangga',
    subs: [
      {
        label: 'Hook',
        items: [
          { no: '2.1.1', q: 'Safety latch terpasang dan berfungsi' },
          { no: '2.1.2', q: 'Tidak ada pelebaran pada bukaan hook' },
          { no: '2.1.3', q: 'Bebas dari retak, goresan, atau aus berlebih' },
          { no: '2.1.4', q: 'Tidak ada bengkok ke samping' },
          { no: '2.1.5', q: 'Tidak ada keausan pada Eye, Clevis, Saddle, Load Pin' },
        ],
      },
      {
        label: 'Shackle',
        items: [
          { no: '2.1.6', q: 'Kondisi umum shackle baik' },
          { no: '2.1.7', q: 'Tidak ada keausan pada pin' },
          { no: '2.1.8', q: 'Ulir dalam keadaan baik' },
          { no: '2.1.9', q: 'Beban Kerja Aman (SWL) tercantum dan sesuai' },
        ],
      },
    ],
  },

  sling: {
    label: 'Sling / Webbing', kategori: '2. Lifting & Penyangga',
    items: [
      { no: '2.2.1',  q: 'Seluruh panjang sling sudah diperiksa' },
      { no: '2.2.2',  q: 'Beban Kerja Aman (SWL) tercantum' },
      { no: '2.2.3',  q: 'Tidak ada keausan / kerusakan mekanik' },
      { no: '2.2.4',  q: 'Tidak ada serat putus / terpotong / terurai' },
      { no: '2.2.5',  q: 'Tidak ada tali/untaian yang berubah tempat' },
      { no: '2.2.6',  q: 'Tidak ada pemipihan pada untaian' },
      { no: '2.2.7',  q: 'Tidak ada perubahan warna tali (tanda panas/kimia)' },
      { no: '2.2.8',  q: 'Kondisi bagian dalam untaian baik' },
      { no: '2.2.9',  q: 'Tidak terpapar media korosif' },
      { no: '2.2.10', q: 'Tidak terpapar panas berlebih / sinar matahari langsung' },
    ],
  },

  rantai: {
    label: 'Rantai Pengangkat', kategori: '2. Lifting & Penyangga',
    items: [
      { no: '2.3.1',  q: 'Semua sambungan sepanjang rantai sudah diperiksa' },
      { no: '2.3.2',  q: 'Beban Kerja Aman (SWL) ditunjukkan + nomor' },
      { no: '2.3.3',  q: 'Tidak ada keausan / abrasi / kerusakan mekanis' },
      { no: '2.3.4',  q: 'Tidak ada yang membelit / melar / bengkok' },
      { no: '2.3.5',  q: 'Tidak ada yang tertoreh / retak' },
      { no: '2.3.6',  q: 'Rantai 4 kaki, semua kaki sama panjang' },
      { no: '2.3.7',  q: 'Tidak ada keausan pada sambungan dan barrel samping' },
      { no: '2.3.8',  q: 'Tidak ada yang berubah bentuk (sambungan utama)' },
      { no: '2.3.9',  q: 'Tidak ada kerusakan pada sambungan coupling' },
      { no: '2.3.10', q: 'Tidak ada kerusakan pada attachment' },
    ],
  },

  crane: {
    label: 'Crane Workshop', kategori: '2. Lifting & Penyangga',
    items: [
      { no: '2.4.1',  q: 'Tidak ada kerusakan pada struktur crane' },
      { no: '2.4.2',  q: 'Alat pengunci kabel pada drum wheel berfungsi' },
      { no: '2.4.3',  q: 'Beban maksimum tertera pada crane' },
      { no: '2.4.4',  q: 'Indikator beban aman berfungsi' },
      { no: '2.4.5',  q: 'Sistem rem pada beban berfungsi' },
      { no: '2.4.6',  q: 'Alat pembatas beban berfungsi' },
      { no: '2.4.7',  q: 'Sistem rem untuk berjalan berfungsi' },
      { no: '2.4.8',  q: 'Saklar alat pembatas berfungsi' },
      { no: '2.4.9',  q: 'Emergency switch berfungsi dengan baik' },
      { no: '2.4.10', q: 'Tidak ada keausan berlebih pada puli' },
      { no: '2.4.11', q: 'Tidak ada keausan berlebih pada drum' },
      { no: '2.4.12', q: 'Tali pada drum minimal 3 lilitan penuh' },
      { no: '2.4.13', q: 'Arah berjalan pada cross beam sesuai kontrol' },
      { no: '2.4.14', q: 'Akses sekitar crane aman dan tidak terhalang' },
      { no: '2.4.15', q: 'Pelumasan dalam kondisi baik' },
      { no: '2.4.16', q: 'Alarm untuk bergerak berfungsi' },
      { no: '2.4.17', q: 'Safety sign terpasang dan terbaca' },
      { no: '2.4.18', q: 'Remote Control / Lockout pada kontrol berfungsi' },
      { no: '2.4.19', q: 'Alat pembatas hoist (anti blocking) berfungsi' },
      { no: '2.4.20', q: 'Hook pengangkat dalam kondisi baik' },
      { no: '2.4.21', q: 'Tali pengangkat dalam kondisi baik' },
      { no: '2.4.22', q: 'Tidak ada kerusakan pada rel crane' },
    ],
  },

  tangga_permanen: {
    label: 'Tangga Permanen', kategori: '3. Fasilitas Penunjang',
    items: [
      { no: '3.1.1', q: 'Anak tangga dalam kondisi baik (tidak longgar)' },
      { no: '3.1.2', q: 'Tangga bebas dari paku atau logam lain yang longgar' },
      { no: '3.1.3', q: 'Tiang, penguat dan anak tangga tidak retak atau patah' },
      { no: '3.1.4', q: 'Anak tangga tidak terhalang' },
      { no: '3.1.5', q: 'Tangga stabil' },
      { no: '3.1.6', q: 'Pegangan dan kerangka dalam kondisi baik' },
      { no: '3.1.7', q: 'Kerangka dipasang dan dikunci' },
    ],
  },

  tangga_portable: {
    label: 'Tangga Portable', kategori: '3. Fasilitas Penunjang',
    items: [
      { no: '3.2.1',  q: 'Anak tangga dalam kondisi baik (tidak longgar)' },
      { no: '3.2.2',  q: 'Tangga tidak memiliki paku atau logam yang longgar' },
      { no: '3.2.3',  q: 'Tiang, penguat, atau anak tangga tidak retak' },
      { no: '3.2.4',  q: 'Tiang tangga atau anak tangga tidak licin' },
      { no: '3.2.5',  q: 'Engsel dalam kondisi baik' },
      { no: '3.2.6',  q: 'Tangga stabil (tidak goyang)' },
      { no: '3.2.7',  q: 'Extension sock/lock dalam kondisi baik' },
      { no: '3.2.8',  q: 'Tali dalam kondisi baik (jika ada)' },
      { no: '3.2.9',  q: 'Tangga bebas dari label yang menutup cacat' },
      { no: '3.2.10', q: 'Tangga disimpan secara horizontal' },
      { no: '3.2.11', q: 'Tangga metal sudah diberi label Jangan Dipakai di Dekat Listrik' },
    ],
  },

  oil_trap: {
    label: 'Oil Trap / Washpad', kategori: '3. Fasilitas Penunjang',
    items: [
      { no: '3.3.1', q: 'Saluran masukan ke trap berfungsi, tidak tersumbat' },
      { no: '3.3.2', q: 'Dinding beton tidak retak dan tutup ruangan berfungsi' },
      { no: '3.3.3', q: 'Lumpur tidak melebihi 1/4 kapasitas, aliran keluaran lancar' },
      { no: '3.3.4', q: 'Katup & pipa berfungsi, tidak rusak, posisi tertutup' },
      { no: '3.3.5', q: 'Rambu / demarkasi dan tanda keselamatan terlihat jelas' },
    ],
  },

  eyewash: {
    label: 'Eyewash', kategori: '4. Sarana K3',
    items: [
      { no: '4.1.1', q: 'Akses dan jangkauan tidak ada penghalang' },
      { no: '4.1.2', q: 'Air dengan volume sesuai kapasitas' },
      { no: '4.1.3', q: 'Kualitas air baik dan bersih' },
      { no: '4.1.4', q: 'Selang penyemprot tidak tersumbat' },
      { no: '4.1.5', q: 'Posisi eyewash sesuai ergonomi' },
      { no: '4.1.6', q: 'Beroperasi dengan baik secara kontinyu' },
    ],
  },

  fbh: {
    label: 'Full Body Harness', kategori: '4. Sarana K3',
    items: [
      { no: '4.2.1',  q: 'Buckle, ring-D, thimble tidak menajam, bunyi, atau retak' },
      { no: '4.2.2',  q: 'Buckle berfungsi dengan nyaman' },
      { no: '4.2.3',  q: 'Semua sabuk tidak berjumbai, kusut, robek, atau memudar' },
      { no: '4.2.4',  q: 'Webbing tidak terlipat menekan objek > 30mm' },
      { no: '4.2.5',  q: 'Label disertakan dan dapat dibaca keseluruhan' },
      { no: '4.2.6',  q: 'Disimpan di area bersih, sejuk, kering' },
      { no: '4.2.7',  q: 'Daya tahan lanyard baik, ujung tidak terurai' },
      { no: '4.2.8',  q: 'Sambungan pengait terpasang dengan benar' },
      { no: '4.2.9',  q: 'Gerbang pengait bergerak leluasa dan terkunci' },
      { no: '4.2.10', q: 'Adjuster terpasang dengan benar' },
      { no: '4.2.11', q: 'Daya tahan penyangga cukup kuat' },
      { no: '4.2.12', q: 'Penyangga terlindung dan tidak robek / rusak' },
      { no: '4.2.13', q: 'Semua temuan dan label peringatan sudah diperiksa' },
      { no: '4.2.14', q: 'Tiap-tiap sistem komponen sudah diperiksa' },
      { no: '4.2.15', q: 'Kondisi aman untuk digunakan' },
      { no: '4.2.16', q: 'Hardware lifeline tidak ada distorsi atau korosi' },
      { no: '4.2.17', q: 'Sambungan pengait lifeline terpasang dengan benar' },
      { no: '4.2.18', q: 'Gerbang pengait lifeline bergerak leluasa dan terkunci' },
      { no: '4.2.19', q: 'Tali sintetik tidak ada sayatan atau paparan kimia' },
      { no: '4.2.20', q: 'Semua label peringatan lifeline sudah diperiksa' },
      { no: '4.2.21', q: 'Tiap-tiap sistem lifeline sudah diperiksa' },
      { no: '4.2.22', q: 'Lifeline aman untuk digunakan' },
    ],
  },

  apar: {
    label: 'APAR', kategori: '4. Sarana K3',
    items: [
      { no: '4.3.1', q: 'APAR tersedia di lokasi yang ditentukan' },
      { no: '4.3.2', q: 'Kapasitas APAR sesuai standar area' },
      { no: '4.3.3', q: 'Jumlah APAR sesuai persyaratan' },
      { no: '4.3.4', q: 'Kondisi hose (selang) baik, tidak retak / bocor' },
      { no: '4.3.5', q: 'Kondisi tabung baik, tidak penyok / korosi' },
      { no: '4.3.6', q: 'Kondisi gauge (tekanan) berada di zona hijau' },
      { no: '4.3.7', q: 'Pin pengaman tersedia dan tersegel' },
    ],
  },
};

/* ============================================================
   STATE
   ============================================================ */
var formStep  = 0;
var formId    = '';
var fotoFiles = [];
var toastTimer = null;

/* ============================================================
   INIT
   ============================================================ */
document.addEventListener('DOMContentLoaded', function () {
  formId = genId();
  document.getElementById('fid-badge').textContent      = formId;
  document.getElementById('form-id-aside').textContent  = formId;
  document.getElementById('f-tanggal').value            = new Date().toISOString().split('T')[0];
  document.getElementById('today-lbl').textContent      = new Date().toLocaleDateString('id-ID', {
    weekday: 'short', day: 'numeric', month: 'short', year: 'numeric',
  });

  renderList(LIST_DATA);
  renderWaiting(WAITING_DATA);
  renderOverdue(OVERDUE_DATA);
  renderPicList();
});

/* ============================================================
   UTILITY — Generate Form ID
   ============================================================ */
function genId() {
  var n = new Date();
  return (
    'INS-' +
    n.getFullYear().toString().slice(-2) +
    String(n.getMonth() + 1).padStart(2, '0') +
    String(n.getDate()).padStart(2, '0') +
    '-' +
    Math.random().toString(36).slice(-4).toUpperCase()
  );
}

/* ============================================================
   NAVIGATION
   ============================================================ */
/**
 * Beralih ke view tertentu.
 * @param {string}      id - ID view tanpa prefix 'v-'
 * @param {Element|null} el - nav-item yang diklik
 */
function goNav(id, el) {
  document.querySelectorAll('.view').forEach(function (v) { v.classList.remove('on'); });
  document.getElementById('v-' + id).classList.add('on');

  document.querySelectorAll('.nav-item').forEach(function (n) { n.classList.remove('active'); });
  if (el) el.classList.add('active');

  var titles = {
    dashboard: 'Dashboard',
    form:      'Form Inspeksi Alat',
    waiting:   'Waiting Inspection',
    list:      'Riwayat Inspeksi',
    overdue:   'Overdue',
    piclist:   'List PIC Area',
  };
  document.getElementById('page-title').textContent = titles[id] || id;
}

/* ============================================================
   RENDER — WAITING INSPECTION
   ============================================================ */
function renderWaiting(data) {
  document.getElementById('waiting-body').innerHTML = data.map(function (d) {
    var pill = d.priority === 'Segera'
      ? '<span class="badge bg-red">Segera</span>'
      : '<span class="badge bg-gray">Normal</span>';
    return (
      '<tr>' +
        '<td class="em">' + d.asset + '</td>' +
        '<td>' + d.loc + '</td>' +
        '<td>' + d.tool + '</td>' +
        '<td style="font-family:var(--mono);font-size:11px">' + d.jadwal + '</td>' +
        '<td style="font-family:var(--mono);font-size:11px;color:var(--text3)">' + d.last + '</td>' +
        '<td>' + pill + '</td>' +
        '<td><button class="btn" style="padding:4px 10px;font-size:12px" onclick="goNav(\'form\',null)">Inspeksi</button></td>' +
      '</tr>'
    );
  }).join('');
}

function filterWaiting() {
  var query = (document.querySelector('#v-waiting .search-inp') || { value: '' }).value.toLowerCase();
  renderWaiting(WAITING_DATA.filter(function (d) {
    return (
      d.asset.toLowerCase().includes(query) ||
      d.loc.toLowerCase().includes(query)   ||
      d.tool.toLowerCase().includes(query)
    );
  }));
}

/* ============================================================
   RENDER — OVERDUE
   ============================================================ */
function renderOverdue(data) {
  document.getElementById('overdue-body').innerHTML = data.map(function (d) {
    var cls = d.hari >= 30 ? 'bg-red' : d.hari >= 14 ? 'bg-orange' : 'bg-yellow';
    return (
      '<tr>' +
        '<td class="em" style="color:var(--red)">' + d.asset + '</td>' +
        '<td>' + d.loc + '</td>' +
        '<td>' + d.tool + '</td>' +
        '<td><span class="badge bg-gray">' + d.tipe + '</span></td>' +
        '<td><span class="badge ' + cls + '">' + d.hari + ' hari</span></td>' +
        '<td>' + d.pic + '</td>' +
        '<td><button class="btn" style="padding:4px 10px;font-size:12px;color:var(--red);border-color:var(--red)" ' +
          'onclick="showToast(\'Menghubungi ' + d.pic + ' 📞\')">Hubungi</button></td>' +
      '</tr>'
    );
  }).join('');
}

function filterOverdue() {
  var query = (document.querySelector('#v-overdue .search-inp') || { value: '' }).value.toLowerCase();
  renderOverdue(OVERDUE_DATA.filter(function (d) {
    return d.asset.toLowerCase().includes(query) || d.loc.toLowerCase().includes(query);
  }));
}

/* ============================================================
   RENDER — PIC LIST
   ============================================================ */
function renderPicList() {
  var colors = ['#2563eb', '#7c3aed', '#db2777', '#059669', '#d97706', '#dc2626', '#0891b2', '#65a30d'];

  function initials(n) {
    return n.split(' ').map(function (w) { return w[0]; }).join('').slice(0, 2).toUpperCase();
  }

  function renderGroup(pics, containerId) {
    document.getElementById(containerId).innerHTML = pics.map(function (p, i) {
      var c = colors[i % colors.length];
      var emailHtml = p.email
        ? '<div class="pic-email">' + p.email + '</div>'
        : '<div class="pic-email" style="color:var(--text3)">— belum ada email</div>';
      return (
        '<div class="pic-card">' +
          '<div class="pic-ava" style="background:' + c + '">' + initials(p.nama) + '</div>' +
          '<div style="min-width:0">' +
            '<div class="pic-name">' + p.nama + '</div>' +
            '<div class="pic-area">' + p.area + '</div>' +
            emailHtml +
          '</div>' +
          '<div class="pic-status"><span class="badge bg-green" style="font-size:10px">Aktif</span></div>' +
        '</div>'
      );
    }).join('');
  }

  renderGroup(PIC_OPTIONS.KGB, 'pic-grid-kgb');
  renderGroup(PIC_OPTIONS.GRB, 'pic-grid-grb');
}

/* ============================================================
   RENDER — RIWAYAT / LIST
   ============================================================ */
function badgeCls(s) {
  return { Lulus: 'bg-green', Perhatian: 'bg-yellow', Gagal: 'bg-red', Draft: 'bg-blue' }[s] || 'bg-gray';
}

function dotClr(s) {
  return {
    Lulus:     'var(--green)',
    Perhatian: 'var(--yellow)',
    Gagal:     'var(--red)',
    Draft:     'var(--accent)',
  }[s] || 'var(--text2)';
}

function renderList(data) {
  document.getElementById('list-body').innerHTML = data.map(function (d) {
    return (
      '<tr>' +
        '<td class="em">' + d.no + '</td>' +
        '<td>' + d.loc + '</td>' +
        '<td>' + d.tool + '</td>' +
        '<td style="font-family:var(--mono);font-size:11px">' + d.asset + '</td>' +
        '<td><span class="badge ' + badgeCls(d.status) + '"><span class="bdot" style="background:' + dotClr(d.status) + '"></span>' + d.status + '</span></td>' +
        '<td style="font-family:var(--mono);font-size:11px;color:var(--text3)">' + d.date + '</td>' +
        '<td><button class="btn" style="padding:4px 10px;font-size:12px" onclick="showToast(\'Detail ' + d.no + ' 📋\')">Detail</button></td>' +
      '</tr>'
    );
  }).join('');
}

function filterList() {
  var query = (document.querySelector('#v-list .search-inp') || { value: '' }).value.toLowerCase();
  renderList(LIST_DATA.filter(function (d) {
    return (
      d.no.toLowerCase().includes(query)  ||
      d.loc.toLowerCase().includes(query) ||
      d.tool.toLowerCase().includes(query)
    );
  }));
}

/* ============================================================
   FORM STEPS
   ============================================================ */
/**
 * Tampilkan step form tertentu.
 * @param {number} i - Index step (0, 1, 2)
 */
function showFStep(i) {
  [0, 1, 2].forEach(function (n) {
    var el = document.getElementById('fstep-' + n);
    if (el) el.style.display = (n === i ? 'block' : 'none');
  });
  formStep = i;

  for (var j = 0; j < 3; j++) {
    var dot  = document.getElementById('sd' + j);
    var lbl  = document.getElementById('sl' + j);
    var line = document.getElementById('sline' + j);

    if (j < i) {
      dot.className  = 'fsh-dot done';
      dot.textContent = '✓';
      lbl.className  = 'fsh-lbl done';
      if (line) line.className = 'fsh-line done';
    } else if (j === i) {
      dot.className  = 'fsh-dot active';
      dot.textContent = (j + 1);
      lbl.className  = 'fsh-lbl active';
      if (line) line.className = 'fsh-line';
    } else {
      dot.className  = 'fsh-dot';
      dot.textContent = (j + 1);
      lbl.className  = 'fsh-lbl';
      if (line) line.className = 'fsh-line';
    }
  }

  document.getElementById('v-form').scrollTop = 0;
}

function fsNext() {
  if (formStep === 0) {
    /* Validasi step 0 */
    var req = ['f-tanggal', 'f-nama', 'f-sn', 'f-pit', 'f-asset'];
    for (var i = 0; i < req.length; i++) {
      var el = document.getElementById(req[i]);
      if (!el.value.trim()) {
        el.focus();
        el.style.borderColor = 'var(--red)';
        (function (e) { setTimeout(function () { e.style.borderColor = ''; }, 2000); })(el);
        showToast('⚠️ Field wajib belum diisi!');
        return;
      }
    }
    if (!getSubArea()) { showToast('⚠️ Sub area wajib diisi!'); return; }
    if (!getPicArea()) { showToast('⚠️ PIC Area wajib dipilih!'); return; }

    var tool = getToolVal();
    if (!tool) { showToast('⚠️ Pilih jenis tools terlebih dahulu!'); return; }

    buildChecklist(tool);
    showFStep(1);
    return;
  }

  if (formStep === 1) {
    if (hasNG()) showFStep(2);
    else doSubmitForm();
    return;
  }
}

function fsPrev() {
  if (formStep > 0) showFStep(formStep - 1);
}

/* ============================================================
   AREA DROPDOWNS — Sub Area & PIC
   ============================================================ */
function updateArea() {
  var area = document.getElementById('f-pit').value;

  /* Sub Area */
  var subSel = document.getElementById('f-sub');
  var subs   = SUB_AREAS[area] || [];
  subSel.innerHTML =
    '<option value="">- Pilih Sub Area -</option>' +
    subs.map(function (s) { return '<option value="' + s + '">' + s + '</option>'; }).join('');

  document.getElementById('f-sub-manual').style.display = 'none';
  document.getElementById('f-sub-manual').value = '';
  document.getElementById('sub-toggle').textContent = '+ Input manual';
  subSel.style.display  = '';
  subSel.required = true;

  /* PIC */
  var picSel = document.getElementById('f-pic');
  var pics   = PIC_OPTIONS[area] || [];
  picSel.innerHTML =
    '<option value="">- Pilih PIC Area -</option>' +
    pics.map(function (p) {
      return '<option value="' + p.nama + '" data-email="' + p.email + '">' + p.nama + ' — ' + p.area + '</option>';
    }).join('');

  document.getElementById('f-pic-manual').style.display = 'none';
  document.getElementById('f-pic-manual').value = '';
  document.getElementById('pic-toggle').textContent = '+ Input manual';
  picSel.style.display  = '';
  picSel.required = true;
}

function toggleSubManual() {
  var sel = document.getElementById('f-sub');
  var inp = document.getElementById('f-sub-manual');
  var btn = document.getElementById('sub-toggle');
  if (inp.style.display !== 'none') {
    inp.style.display = 'none'; inp.value = '';
    sel.style.display = ''; sel.required = true; inp.required = false;
    btn.textContent = '+ Input manual';
  } else {
    sel.style.display = 'none'; sel.required = false;
    inp.style.display = ''; inp.required = true; inp.focus();
    btn.textContent = 'Kembali ke daftar';
  }
}

function togglePicManual() {
  var sel = document.getElementById('f-pic');
  var inp = document.getElementById('f-pic-manual');
  var btn = document.getElementById('pic-toggle');
  if (inp.style.display !== 'none') {
    inp.style.display = 'none'; inp.value = '';
    sel.style.display = ''; sel.required = true; inp.required = false;
    btn.textContent = '+ Input manual';
  } else {
    sel.style.display = 'none'; sel.required = false;
    inp.style.display = ''; inp.required = true; inp.focus();
    btn.textContent = 'Kembali ke daftar';
  }
}

function getSubArea() {
  var inp = document.getElementById('f-sub-manual');
  return inp.style.display !== 'none' ? inp.value.trim() : document.getElementById('f-sub').value;
}

function getPicArea() {
  var inp = document.getElementById('f-pic-manual');
  return inp.style.display !== 'none' ? inp.value.trim() : document.getElementById('f-pic').value;
}

function getPicEmail() {
  var inp = document.getElementById('f-pic-manual');
  if (inp.style.display !== 'none') return '';
  var sel = document.getElementById('f-pic');
  var opt = sel.options[sel.selectedIndex];
  return opt ? (opt.getAttribute('data-email') || '') : '';
}

function getToolVal() {
  var c = document.querySelector('input[name="jenisTool"]:checked');
  return c ? c.value : '';
}

/* ============================================================
   CHECKLIST — Build & Stats
   ============================================================ */
function buildChecklist(tool) {
  var cl = CL[tool];
  if (!cl) return;

  document.getElementById('aside-tool-lbl').textContent  = cl.label;
  document.getElementById('aside-asset-lbl').textContent = 'Asset: ' + document.getElementById('f-asset').value;

  function renderItems(items) {
    return items.map(function (item) {
      var n = 'cl_' + tool + '_' + item.no.split('.').join('_');
      return (
        '<div class="cl-item">' +
          '<div>' +
            '<div class="cl-no">' + item.no + '</div>' +
            '<div class="cl-text">' + item.q + '</div>' +
          '</div>' +
          '<div class="yn">' +
            '<input type="radio" name="' + n + '" id="' + n + '_ya"  value="Ya"><label for="' + n + '_ya">Ya</label>' +
            '<input type="radio" name="' + n + '" id="' + n + '_tdk" value="Tidak"><label for="' + n + '_tdk">Tidak</label>' +
            '<input type="radio" name="' + n + '" id="' + n + '_na"  value="NA"><label for="' + n + '_na">N/A</label>' +
          '</div>' +
        '</div>'
      );
    }).join('');
  }

  var html =
    '<div class="fsec-title">' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:13px;height:13px">' +
        '<polyline points="9 11 12 14 22 4"/>' +
        '<path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>' +
      '</svg>' +
      'Checklist — ' + cl.label +
    '</div>';

  if (cl.subs) {
    cl.subs.forEach(function (sub) {
      html += '<div class="fsec-subtitle">' + sub.label + '</div>';
      html += '<div class="cl-header"><span>Item Pemeriksaan</span><span>Ya / Tidak / N/A</span></div>';
      html += renderItems(sub.items);
    });
  } else {
    html += '<div class="cl-header"><span>Item Pemeriksaan</span><span>Ya / Tidak / N/A</span></div>';
    html += renderItems(cl.items);
  }

  var container = document.getElementById('cl-container');
  container.innerHTML = html;

  container.querySelectorAll('input[type=radio]').forEach(function (r) {
    r.addEventListener('change', function () {
      updateClStats();
      checkNg();
      updateClNextBtn();
    });
  });

  updateClStats();
  updateClNextBtn();
}

/** Cek apakah ada item Tidak yang dichecklist */
function hasNG() {
  return document.querySelectorAll('#cl-container input[value="Tidak"]:checked').length > 0;
}

function checkNg() {
  hasNG()
    ? document.getElementById('ng-alert').classList.add('show')
    : document.getElementById('ng-alert').classList.remove('show');

  var ng  = document.querySelectorAll('#cl-container input[value="Tidak"]:checked');
  var nos = [];
  ng.forEach(function (r) {
    nos.push(r.name.split('_').slice(-3).join('.').replace(/_/g, '.'));
  });
  document.getElementById('sum-ng').textContent = nos.length ? nos.join(', ') : '-';
}

function updateClNextBtn() {
  var btn = document.getElementById('btn-cl-next');
  if (!btn) return;
  if (hasNG()) {
    btn.innerHTML =
      'Lanjut — Isi Detail Temuan ' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="width:13px;height:13px"><polyline points="9 18 15 12 9 6"/></svg>';
    btn.className = 'btn btn-primary';
  } else {
    btn.innerHTML =
      'Submit Langsung ' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="width:13px;height:13px;vertical-align:-2px"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>';
    btn.className = 'btn btn-green';
  }
}

function updateClStats() {
  var tool = getToolVal();
  var cl   = CL[tool];
  if (!cl) return;

  var allItems = [];
  if (cl.subs) {
    cl.subs.forEach(function (s) { s.items.forEach(function (it) { allItems.push(it); }); });
  } else {
    allItems = cl.items;
  }

  var total = allItems.length, ya = 0, tdk = 0, na = 0;
  allItems.forEach(function (item) {
    var n   = 'cl_' + tool + '_' + item.no.split('.').join('_');
    var chk = document.querySelector('input[name="' + n + '"]:checked');
    if (chk) {
      if (chk.value === 'Ya')    ya++;
      else if (chk.value === 'Tidak') tdk++;
      else na++;
    }
  });

  var done = ya + tdk + na;
  var pct  = total ? Math.round((done / total) * 100) : 0;

  document.getElementById('cl-pct').textContent      = pct + '%';
  document.getElementById('cl-fill').style.width     = pct + '%';
  document.getElementById('cl-ya').textContent       = ya;
  document.getElementById('cl-tdk').textContent      = tdk;
  document.getElementById('cl-na').textContent       = na;
  document.getElementById('cl-blm').textContent      = total - done;
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
    document.getElementById('foto-preview').innerHTML = '';
    document.getElementById('foto-status').textContent = '';
    document.getElementById('foto-input').value = '';
  } else {
    var dt = new DataTransfer();
    fotoFiles.forEach(function (f) { dt.items.add(f); });
    document.getElementById('foto-input').files = dt.files;
    handleFoto({ files: fotoFiles });
  }
}

/**
 * Konversi File ke base64.
 * @param  {File} file
 * @returns {Promise<{base64, mimeType, name}>}
 */
function fileToBase64(file) {
  return new Promise(function (res, rej) {
    var r = new FileReader();
    r.onload  = function (e) { res({ base64: e.target.result.split(',')[1], mimeType: file.type, name: file.name }); };
    r.onerror = function () { rej(new Error('Gagal membaca file')); };
    r.readAsDataURL(file);
  });
}

function prepFoto() {
  return new Promise(function (resolve) {
    if (!fotoFiles.length) { resolve([]); return; }
    var st = document.getElementById('foto-status');
    st.textContent = 'Menyiapkan foto...';
    st.className   = 'foto-status uploading';
    Promise.all(fotoFiles.map(fileToBase64)).then(function (fd) {
      st.textContent = fotoFiles.length + ' foto siap';
      st.className   = 'foto-status done';
      resolve(fd);
    });
  });
}

/* ============================================================
   SUBMIT — Collect EAV & Send
   ============================================================ */
function collectEAV() {
  var tool = getToolVal();
  var cl   = CL[tool];

  var hdr = {
    form_id:         formId,
    tanggal:         document.getElementById('f-tanggal').value,
    nama_inspektor:  document.getElementById('f-nama').value.trim(),
    sn_inspektor:    document.getElementById('f-sn').value.trim(),
    pit_area:        document.getElementById('f-pit').value,
    sub_area:        getSubArea(),
    pic_area:        getPicArea(),
    pic_email:       getPicEmail(),
    kategori:        cl.kategori,
    jenis_tools:     cl.label,
    no_asset:        document.getElementById('f-asset').value.trim(),
    no_register:     document.getElementById('f-reg').value.trim(),
  };

  var allItems = [];
  if (cl.subs) {
    cl.subs.forEach(function (s) {
      s.items.forEach(function (it) { allItems.push({ no: it.no, q: it.q, subsec: s.label }); });
    });
  } else {
    allItems = cl.items.map(function (it) { return { no: it.no, q: it.q, subsec: '-' }; });
  }

  return allItems.map(function (item) {
    var n   = 'cl_' + tool + '_' + item.no.split('.').join('_');
    var chk = document.querySelector('input[name="' + n + '"]:checked');
    var row = Object.assign({}, hdr);
    row.no_kategori = item.no;
    row.subsection  = item.subsec || '-';
    row.pertanyaan  = item.q;
    row.status      = chk ? chk.value : 'Belum Dicek';
    return row;
  });
}

function doSubmitForm() {
  var btn = document.getElementById('btn-submit');
  if (btn) btn.disabled = true;
  document.getElementById('sp').style.display          = 'block';
  document.getElementById('btn-submit-txt').style.opacity = '0.6';

  /* Validasi foto jika ada temuan */
  if (hasNG() && fotoFiles.length === 0) {
    showToast('⚠️ Foto temuan wajib min. 1 foto!');
    if (btn) btn.disabled = false;
    document.getElementById('sp').style.display             = 'none';
    document.getElementById('btn-submit-txt').style.opacity = '1';
    return;
  }

  function doSend(filesData) {
    var rows   = collectEAV();
    var ngList = rows.filter(function (r) { return r.status === 'Tidak'; }).map(function (r) { return r.no_kategori; });

    var temuan = ngList.length
      ? {
          ada_temuan:  'Ya',
          item_tidak:  ngList.join(', '),
          risiko:      (document.querySelector('input[name="risiko"]:checked') || { value: '-' }).value,
          deskripsi:   document.getElementById('t-desc').value.trim(),
          rekomendasi: document.getElementById('t-rek').value.trim(),
          status_aset: document.getElementById('t-status').value,
          catatan:     document.getElementById('t-catatan').value.trim(),
          status_temuan: 'Open',
          foto_files:  filesData,
          foto_links:  '',
          pic_area:    getPicArea(),
          pic_email:   getPicEmail(),
        }
      : { ada_temuan: 'Tidak' };

    var payload = {
      form_id:   formId,
      timestamp: new Date().toISOString(),
      tbl:       'inspeksi',
      eav_rows:  rows,
      temuan:    temuan,
    };

    fetch(SCRIPT_URL, {
      method:  'POST',
      mode:    'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(payload),
    })
      .then(function () { showOv(true); })
      .catch(function () { showOv(false); });

    if (btn) btn.disabled = false;
    document.getElementById('sp').style.display             = 'none';
    document.getElementById('btn-submit-txt').style.opacity = '1';
  }

  if (hasNG()) prepFoto().then(doSend);
  else doSend([]);
}

/* ============================================================
   OVERLAY — Success / Error
   ============================================================ */
function showOv(ok) {
  document.getElementById('ov-i').textContent = ok ? '✅' : '❌';
  document.getElementById('ov-t').textContent = ok ? 'Berhasil Dikirim!' : 'Gagal Mengirim';
  document.getElementById('ov-t').className   = 'ov-title ' + (ok ? 'ok' : 'err');
  document.getElementById('ov-m').textContent = ok
    ? 'ID: ' + formId + '\nData tersimpan ke spreadsheet.'
    : 'Cek koneksi internet dan coba lagi.';
  document.getElementById('ov').classList.add('show');
}

function resetFormFull() {
  document.getElementById('ov').classList.remove('show');
  document.querySelectorAll('#v-form input[type=text],#v-form textarea').forEach(function (el) { el.value = ''; });
  document.querySelectorAll('#v-form input[type=radio]').forEach(function (el) { el.checked = false; });
  document.querySelectorAll('#v-form select').forEach(function (el) { el.selectedIndex = 0; });
  document.getElementById('f-tanggal').value = new Date().toISOString().split('T')[0];
  document.getElementById('cl-container').innerHTML = '';
  document.getElementById('ng-alert').classList.remove('show');
  document.getElementById('foto-preview').innerHTML = '';
  document.getElementById('foto-status').textContent = '';
  fotoFiles = [];
  formId = genId();
  document.getElementById('fid-badge').textContent     = formId;
  document.getElementById('form-id-aside').textContent = formId;
  showFStep(0);
}

/* ============================================================
   TOAST
   ============================================================ */
/**
 * @param {string} msg - Pesan toast
 */
function showToast(msg) {
  var el = document.getElementById('toast-el');
  document.getElementById('toast-txt').textContent = msg;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(function () { el.classList.remove('show'); }, 3000);
}