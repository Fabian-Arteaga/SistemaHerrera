class Sidebar {
    constructor(paginaActual) {
        this.paginaActual = paginaActual;
        this.contenedor = document.getElementById('layout-placeholder');

    }

    async cargar() {
        if (!this.contenedor) return;

        try {
            const respuesta = await fetch('/shared/components/sidebar/sidebar.html');

            if (!respuesta.ok) {
                throw new Error(`Error al cargar el sidebar: ${respuesta.status}`);
            }
            const html = await respuesta.text();
            this.contenedor.innerHTML = html;
          lucide.createIcons();  
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
      if (link.getAttribute('href') === this.paginaActual) {
        link.classList.add('active');
      }
    });
  }
}
document.addEventListener('DOMContentLoaded', async () => {


  const sidebar = new Sidebar(window.location.pathname);


  await sidebar.cargar();

});