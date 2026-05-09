class TopBar {
  constructor() {
    this.contenedor = document.getElementById('topbar-placeholder');
  }

  async cargar() {
    if (!this.contenedor) return;

    try {
      const respuesta = await fetch('/shared/components/topbar/topbar.html');

      if (!respuesta.ok) {
        throw new Error(`Error al cargar el topbar: ${respuesta.status}`);
      }

      const html = await respuesta.text();
      this.contenedor.innerHTML = html;

      if (window.lucide) lucide.createIcons();

      this.#configurarEventos();

    } catch (error) {
      console.error('Error en topbar:', error);
      this.contenedor.innerHTML = `<p style="color:red; padding:1rem;">Error al cargar el topbar</p>`;
    }
  }

  #configurarEventos() {
    this.#configurarBuscador();
    this.#configurarOffcanvas();
    this.#configurarToggleTema();
    this.#configurarLogout();
    this.#configurarNotificaciones();
  }

  #configurarBuscador() {
    const searchWrapper = this.contenedor.querySelector('.topbar-search');
    const searchInput   = this.contenedor.querySelector('.search-input');
    const searchTrigger = this.contenedor.querySelector('.search-trigger');

    if (!searchTrigger || !searchInput || !searchWrapper) return;

    searchTrigger.addEventListener('click', () => {
      searchWrapper.classList.toggle('active');
      if (searchWrapper.classList.contains('active')) searchInput.focus();
    });

    searchInput.addEventListener('blur', () => {
      if (searchInput.value.trim() === '') searchWrapper.classList.remove('active');
    });
  }

  #configurarOffcanvas() {
    const btnOpenProfile  = this.contenedor.querySelector('#btn-open-profile');
    const btnCloseProfile = this.contenedor.querySelector('#btn-close-profile');
    const offcanvasPanel  = this.contenedor.querySelector('#profile-offcanvas');
    const overlay         = this.contenedor.querySelector('#profile-overlay');

    if (!btnOpenProfile || !offcanvasPanel || !overlay) return;

    const closePanel = () => {
      offcanvasPanel.classList.remove('active');
      overlay.classList.remove('active');
    };

    btnOpenProfile.addEventListener('click', () => {
      offcanvasPanel.classList.add('active');
      overlay.classList.add('active');
    });

    if (btnCloseProfile) btnCloseProfile.addEventListener('click', closePanel);
    overlay.addEventListener('click', closePanel);
  }

  #configurarToggleTema() {
    const btnToggle   = this.contenedor.querySelector('#btn-toggle-theme');
    const themeSwitch = this.contenedor.querySelector('#theme-switch');

    if (!btnToggle || !themeSwitch) return;

    btnToggle.addEventListener('click', () => {
      themeSwitch.classList.toggle('active');
    });
  }

  #configurarLogout() {
    const btnLogout = this.contenedor.querySelector('.btn-logout-panel');
    if (!btnLogout) return;

    btnLogout.addEventListener('click', () => {
      localStorage.removeItem('token');
      window.location.href = '/modules/login/login.html';
    });
  }

  #configurarNotificaciones() {
    const btnBell    = this.contenedor.querySelector('#btn-notifications');
    const dropdown   = this.contenedor.querySelector('#notif-dropdown');
    const btnMarkAll = this.contenedor.querySelector('#btn-mark-all');
    const badge      = this.contenedor.querySelector('#notif-badge');

    if (!btnBell || !dropdown) return;

    btnBell.addEventListener('click', (e) => {
      e.stopPropagation();
      dropdown.classList.toggle('active');
    });

    document.addEventListener('click', (e) => {
      if (!dropdown.contains(e.target) && e.target !== btnBell) {
        dropdown.classList.remove('active');
      }
    });

    if (btnMarkAll) {
      btnMarkAll.addEventListener('click', () => {
        this.contenedor.querySelectorAll('.notif-item.unread')
          .forEach(item => item.classList.remove('unread'));

        this.contenedor.querySelectorAll('.notif-dot')
          .forEach(dot => dot.remove());

        if (badge) {
          badge.textContent = '0';
          badge.style.display = 'none';
        }
      });
    }
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  const topbar = new TopBar();
  await topbar.cargar();
});