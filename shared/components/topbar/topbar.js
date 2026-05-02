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

      if (window.lucide) {
        lucide.createIcons();
      }

      this.#configurarEventos();

    } catch (error) {
      console.error('Error en topbar:', error);
      this.contenedor.innerHTML = `<p style="color:red; padding:1rem;">Error al cargar el topbar</p>`;
    }
  }

  #configurarEventos() {
    const btnVenta      = this.contenedor.querySelector('.btn-ventas');
    const btnPedido     = this.contenedor.querySelector('.btn-pedidos');
    const btnProduccion = this.contenedor.querySelector('.btn-produccion');

    if (btnVenta) {
      btnVenta.addEventListener('click', () => console.log('Nueva venta'));
    }

    if (btnPedido) {
      btnPedido.addEventListener('click', () => console.log('Nuevo pedido'));
    }

    if (btnProduccion) {
      btnProduccion.addEventListener('click', () => console.log('Nueva producción'));
    }

    const searchWrapper = this.contenedor.querySelector('.topbar-search');
    const searchInput   = this.contenedor.querySelector('.search-input');
    const searchTrigger = this.contenedor.querySelector('.search-trigger');

    if (searchTrigger && searchInput && searchWrapper) {
      searchTrigger.addEventListener('click', () => {
        searchWrapper.classList.toggle('active');
        if (searchWrapper.classList.contains('active')) {
          searchInput.focus();
        }
      });

      searchInput.addEventListener('blur', () => {
        if (searchInput.value.trim() === '') {
          searchWrapper.classList.remove('active');
        }
      });
    }
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  const topbar = new TopBar();
  await topbar.cargar();
});