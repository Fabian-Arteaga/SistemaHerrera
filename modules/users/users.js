document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();

    const overlay    = document.getElementById('modal-user');
    const btnOpen    = document.getElementById('btn-open-modal');
    const btnClose   = document.getElementById('btn-close-modal');
    const btnCancel  = document.getElementById('btn-cancel');
    const togglePass = document.querySelector('.btn-toggle-pass');
    const passInput  = document.getElementById('password');

    btnOpen.addEventListener('click', () => {
        overlay.classList.add('active');
    });

    btnClose.addEventListener('click', () => {
        overlay.classList.remove('active');
    });

    btnCancel.addEventListener('click', () => {
        overlay.classList.remove('active');
    });

    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) overlay.classList.remove('active');
    });

    togglePass.addEventListener('click', () => {
        const isHidden = passInput.type === 'password';
        passInput.type = isHidden ? 'text' : 'password';
        togglePass.innerHTML = isHidden
            ? '<i data-lucide="eye-off"></i>'
            : '<i data-lucide="eye"></i>';
        lucide.createIcons();
    });

    window.addEventListener('click', (e) => {
        if (!e.target.closest('.dropdown')) {
            document.querySelectorAll('.dropdown-menu').forEach(m => m.classList.remove('show'));
        }
    });
});

function toggleMenu(button) {
    const allMenus    = document.querySelectorAll('.dropdown-menu');
    const currentMenu = button.nextElementSibling;

    allMenus.forEach(menu => {
        if (menu !== currentMenu) menu.classList.remove('show');
    });

    currentMenu.classList.toggle('show');
}