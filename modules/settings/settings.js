      lucide.createIcons();

      const tabMeta = {
        perfil: {
          title: "Mi Perfil",
          desc: "Gestiona tu información personal y nombre de usuario.",
        },
        seguridad: {
          title: "Seguridad y Acceso",
          desc: "Protege tu cuenta actualizando tu contraseña periódicamente.",
        },
        negocio: {
          title: "Datos del Negocio",
          desc: "Configura la información legal de la sorbetería para documentos.",
        },
        sistema: {
          title: "Preferencias",
          desc: "Apariencia y notificaciones del sistema.",
        },
      };

      function showTab(id, el) {
        document
          .querySelectorAll(".settings-menu-item")
          .forEach((b) => b.classList.remove("active"));
        el.classList.add("active");
        document
          .querySelectorAll(".tab-panel")
          .forEach((p) => (p.style.display = "none"));
        document.getElementById("panel-" + id).style.display = "block";
        document.getElementById("tab-title").textContent = tabMeta[id].title;
        document.getElementById("tab-desc").textContent = tabMeta[id].desc;
        lucide.createIcons();
}
      document.getElementById('btn-logout').addEventListener('click', function() {
    window.location.href = '/modules/login/login.html';
});

      function setTheme(el) {
        document
          .querySelectorAll(".theme-card")
          .forEach((c) => c.classList.remove("active"));
        el.classList.add("active");
      }
    