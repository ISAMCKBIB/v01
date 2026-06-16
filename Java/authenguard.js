/**
 * ISAM — Auth Guard
 * ============================================================
 * Pasang di <head> setiap halaman dashboard (SEBELUM script lain):
 *   <script src="Java/auth-guard.js"></script>
 *
 * Cara pakai di halaman dashboard:
 *   var user = getISAMUser();
 *   // user → { email, nama, role, jabatan, area_id, area_nama }
 *
 * Contoh:
 *   var user = getISAMUser();
 *   if (user) {
 *     document.getElementById('user-name').textContent = user.nama;
 *   }
 * ============================================================
 */

(function authGuard() {
  /* Cek sesi di sessionStorage (tab aktif) atau localStorage (remember me) */
  var stored =
    sessionStorage.getItem('isam_user') ||
    localStorage.getItem('isam_user');

  /* Tidak ada sesi → redirect ke login */
  if (!stored) {
    window.location.replace('index.html');
    return;
  }

  try {
    var user = JSON.parse(stored);

    /* Validasi minimal: harus ada role */
    if (!user || !user.role) {
      throw new Error('invalid session');
    }

    /* Simpan di window supaya bisa diakses dari halaman manapun */
    window.__isamUser = user;

  } catch (e) {
    /* Sesi corrupt → hapus & redirect */
    sessionStorage.removeItem('isam_user');
    localStorage.removeItem('isam_user');
    window.location.replace('index.html');
  }
})();


/**
 * Ambil data user yang sedang login.
 * @returns {{ email, nama, role, jabatan, area_id, area_nama } | null}
 */
function getISAMUser() {
  return window.__isamUser || null;
}


/**
 * Logout — hapus sesi & redirect ke halaman login.
 */
function isamLogout() {
  sessionStorage.removeItem('isam_user');
  localStorage.removeItem('isam_user');
  window.location.replace('index.html');
}


/**
 * Cek apakah user punya role tertentu.
 * Berguna untuk sembunyikan/tampilkan elemen berdasarkan role.
 *
 * @param  {string|string[]} allowedRoles - role atau array of role
 * @returns {boolean}
 *
 * Contoh:
 *   if (!hasRole('admin')) { el.style.display = 'none'; }
 *   if (!hasRole(['admin', 'viewer'])) { ... }
 */
function hasRole(allowedRoles) {
  var user = getISAMUser();
  if (!user) return false;

  var roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
  return roles.indexOf(user.role) !== -1;
}


/**
 * Inject info user ke elemen HTML.
 * Cocok untuk topbar / sidebar yang perlu tampilkan nama & area.
 *
 * Tambahkan atribut data-isam pada elemen HTML:
 *   <span data-isam="nama"></span>
 *   <span data-isam="area_nama"></span>
 *   <span data-isam="role"></span>
 *   <span data-isam="email"></span>
 *   <span data-isam="jabatan"></span>
 *
 * Panggil di DOMContentLoaded:
 *   document.addEventListener('DOMContentLoaded', injectUserInfo);
 */
function injectUserInfo() {
  var user = getISAMUser();
  if (!user) return;

  var els = document.querySelectorAll('[data-isam]');
  for (var i = 0; i < els.length; i++) {
    var el  = els[i];
    var key = el.getAttribute('data-isam');
    if (user[key] !== undefined) {
      el.textContent = user[key];
    }
  }
}