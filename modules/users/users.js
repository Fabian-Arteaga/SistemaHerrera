document.addEventListener('DOMContentLoaded', () => {
  lucide.createIcons();

  const overlay    = document.getElementById('modal-user');
  const btnOpen    = document.getElementById('btn-open-modal');
  const btnClose   = document.getElementById('btn-close-modal');
  const btnCancel  = document.getElementById('btn-cancel');
  const togglePass = document.querySelector('.btn-toggle-pass');
  const passInput  = document.getElementById('password');

  btnOpen.addEventListener('click', () => overlay.classList.add('active'));
  btnClose.addEventListener('click', () => overlay.classList.remove('active'));
  btnCancel.addEventListener('click', () => overlay.classList.remove('active'));

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

  // Filtros y Ordenar — solo abrir/cerrar el dropdown visual
  const btnFilters     = document.getElementById('btn-filters');
  const filterDropdown = document.getElementById('filter-dropdown');
  const btnSort        = document.getElementById('btn-sort');
  const sortDropdown   = document.getElementById('sort-dropdown');

  btnFilters?.addEventListener('click', (e) => {
    e.stopPropagation();
    filterDropdown.classList.toggle('active');
    sortDropdown.classList.remove('active');
  });

  btnSort?.addEventListener('click', (e) => {
    e.stopPropagation();
    sortDropdown.classList.toggle('active');
    filterDropdown.classList.remove('active');
  });

  document.addEventListener('click', (e) => {
    if (!filterDropdown?.contains(e.target) && e.target !== btnFilters)
      filterDropdown?.classList.remove('active');
    if (!sortDropdown?.contains(e.target) && e.target !== btnSort)
      sortDropdown?.classList.remove('active');
  });
});