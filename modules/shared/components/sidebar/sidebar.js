class Sidebar {
    constructor(paginaActual) {
        this.paginaActual = paginaActual;
        this.contenedor = document.getElementById('layout-placeholder');
    }

    async cargar() {
        if (!this.contenedor) return;

        try {
            const respuesta = await fetch('/modules/shared/components/sidebar/sidebar.html');
            if (!respuesta.ok) throw new Error(`Error al cargar el sidebar: ${respuesta.status}`);

            const html = await respuesta.text();
            this.contenedor.innerHTML = html;
            this.#aplicarPermisos();
            if (window.lucide) lucide.createIcons();
            this.#marcarActivo();
            this.#iniciarResponsive();

        } catch (error) {
            console.error('error en sidebar:', error);
            this.contenedor.innerHTML = `<p style="color:red; padding:1rem;">Error al cargar el menu</p>`;
        }
    }

    #aplicarPermisos() {
        const userRole = localStorage.getItem('rol');

        if (userRole !== 'Administrador' && userRole !== 'Admin') {
            
            const rutasProhibidas = [
                '/modules/users/users.html',
                '/modules/roles/roles.html'
            ];

            const links = this.contenedor.querySelectorAll('.nav-link');
            
            links.forEach(link => {
                const href = link.getAttribute('href');
                
                if (rutasProhibidas.includes(href)) {
                    const parentLi = link.closest('li');
                    if (parentLi) {
                        parentLi.remove();
                    } else {
                        link.remove();
                    }
                }
            });
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

    #iniciarResponsive() {
        const overlay = document.createElement('div');
        overlay.classList.add('sidebar-overlay');
        overlay.addEventListener('click', () => this.#cerrar());
        document.body.appendChild(overlay);

        const links = this.contenedor.querySelectorAll('.nav-link');
        links.forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 768) this.#cerrar();
            });
        });

        window.toggleSidebar = () => {
            const sidebar = document.querySelector('.sidebar');
            if (sidebar) sidebar.classList.contains('open') ? this.#cerrar() : this.#abrir();
        };
    }

    #abrir() {
        document.querySelector('.sidebar')?.classList.add('open');
        document.querySelector('.sidebar-overlay')?.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    #cerrar() {
        document.querySelector('.sidebar')?.classList.remove('open');
        document.querySelector('.sidebar-overlay')?.classList.remove('active');
        document.body.style.overflow = '';
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    const sidebar = new Sidebar(window.location.pathname);
    await sidebar.cargar();
});