class Sidebar {
    constructor(paginaActual) {
        this.paginaActual = paginaActual;
        this.contenedor = document.getElementById('layout-placeholder');

    }

    async cargar() {
        if (!this.contenedor) return;

        try {
            const respuesta = await fetch('/componentes/sidebar.html');

            if (!respuesta.ok) {
                throw new Error(`rror al cargar el sidebar: ${respuesta.status}`);
            }
            const html = await respuesta.text();
            this.contenedor.innerHTML = html;

            this.#marcarActivo();
        }
        catch (error) {
            console.error('error en sidebar:', error);
            this.contenedor.innerHTML = `<p style="color:red; padding:1rem;">Error al cargar el menu</p>`;
        }
    }
      #marcarActivo() {
    const links = this.contenedor.querySelectorAll('.nav-link');

    links.forEach(link => {
      // Compara el href del link con la página actual
      if (link.getAttribute('href') === this.paginaActual) {
        link.classList.add('active');
      }
    });
  }
}
document.addEventListener('DOMContentLoaded', async () => {

  // Crea una instancia de la clase pasando la página actual
  // Ejemplo: new Sidebar('/productos.html')
  const sidebar = new Sidebar(window.location.pathname);

  // Llama al método cargar()
  await sidebar.cargar();

});