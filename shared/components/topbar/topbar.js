class TopBar {
  constructor() {
    this.container = document.getElementById('topbar-placeholder');
  }

  async load() {
    if (!this.container) return;

    try {
      const response = await fetch('/shared/components/topbar/topbar.html');

      if (!response.ok) {
        throw new Error(`Error loading topbar: ${response.status}`);
      }

      const html = await response.text();
      this.container.innerHTML = html;

      if (window.lucide) lucide.createIcons();

      this.#setupEvents();

    } catch (error) {
      console.error('Topbar error:', error);
      this.container.innerHTML = `<p style="color:red; padding:1rem;">Error al cargar el menú</p>`;
    }
  }

  #setupEvents() {
    this.#setupSearch();
    this.#setupOffcanvas();
    this.#setupThemeToggle();
    this.#setupLogout();
    this.#setupNotifications();
  }

  #setupSearch() {
    const wrapper  = this.container.querySelector('.topbar-search');
    const input    = this.container.querySelector('.search-input');
    const trigger  = this.container.querySelector('.search-trigger');

    if (!trigger || !input || !wrapper) return;

    trigger.addEventListener('click', () => {
      wrapper.classList.toggle('active');
      if (wrapper.classList.contains('active')) input.focus();
    });

    input.addEventListener('blur', () => {
      if (input.value.trim() === '') wrapper.classList.remove('active');
    });
  }

  #setupOffcanvas() {
    const btnOpen  = this.container.querySelector('#btn-open-profile');
    const btnClose = this.container.querySelector('#btn-close-profile');
    const panel    = this.container.querySelector('#profile-offcanvas');
    const overlay  = this.container.querySelector('#profile-overlay');

    if (!btnOpen || !panel || !overlay) return;

    const close = () => {
      panel.classList.remove('active');
      overlay.classList.remove('active');
    };

    btnOpen.addEventListener('click', () => {
      panel.classList.add('active');
      overlay.classList.add('active');
    });

    if (btnClose) btnClose.addEventListener('click', close);
    overlay.addEventListener('click', close);
  }

  #setupThemeToggle() {
    const btn    = this.container.querySelector('#btn-toggle-theme');
    const toggle = this.container.querySelector('#theme-switch');

    if (!btn || !toggle) return;

    btn.addEventListener('click', () => {
      toggle.classList.toggle('active');
    });
  }

  #setupLogout() {
    const btn = this.container.querySelector('.btn-logout-panel');
    if (!btn) return;

    btn.addEventListener('click', () => {
      localStorage.removeItem('token');
      window.location.href = '/modules/login/login.html';
    });
  }

  #setupNotifications() {
    const btnBell   = this.container.querySelector('#btn-notifications');
    const dropdown  = this.container.querySelector('#notif-dropdown');
    const btnMarkAll = this.container.querySelector('#btn-mark-all');
    const badge     = this.container.querySelector('#notif-badge');

    if (!btnBell || !dropdown) return;

    btnBell.addEventListener('click', (e) => {
      e.stopPropagation();
      dropdown.classList.toggle('active');
    });

    document.addEventListener('click', (e) => {
      if (!dropdown.contains(e.target) && e.target !== btnBell) {
        dropdown.classList.remove('active');
        dropdown.classList.remove('expanded');
        if (btnViewAll) btnViewAll.textContent = 'Ver todas las notificaciones';
      }
    });

    if (btnMarkAll) {
      btnMarkAll.addEventListener('click', () => {
        this.container.querySelectorAll('.notif-item.unread')
          .forEach(item => item.classList.remove('unread'));

        this.container.querySelectorAll('.notif-dot')
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
  await topbar.load();
});