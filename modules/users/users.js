document.addEventListener('DOMContentLoaded', () => {
  lucide.createIcons();

  // ========== MODAL AGREGAR USUARIO ==========
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

  // ========== MODAL VER/EDITAR USUARIO ==========
  const overlayViewUser = document.getElementById('modal-view-user');
  const btnCloseViewModal = document.getElementById('btn-close-view-modal');
  const btnCancelView = document.getElementById('btn-cancel-view');
  const btnEditToggle = document.getElementById('btn-edit-toggle');
  const btnCancelEdit = document.getElementById('btn-cancel-edit');
  const btnSaveUser = document.getElementById('btn-save-user');
  const formViewUser = document.getElementById('form-view-user');
  const viewMode = document.getElementById('view-mode');
  const editMode = document.getElementById('edit-mode');
  
  // Campos de vista
  const viewUserTitle = document.getElementById('view-user-title');
  const viewUserAvatar = document.getElementById('view-user-avatar');
  const viewFullName = document.getElementById('view-full-name');
  const viewUsername = document.getElementById('view-username');
  const viewFirstName = document.getElementById('view-first-name');
  const viewLastName = document.getElementById('view-last-name');
  const viewIdNumber = document.getElementById('view-id-number');
  const viewUsernameDisplay = document.getElementById('view-username-display');
  const viewRole = document.getElementById('view-role');
  const viewStatus = document.getElementById('view-status');
  
  // Campos de edición
  const editFirstName = document.getElementById('edit-first-name');
  const editLastName = document.getElementById('edit-last-name');
  const editRole = document.getElementById('edit-role');
  const editStatus = document.getElementById('edit-status');
  
  // Almacenar datos del usuario actual en edición
  let currentEditingUser = null;
  
  // Funciones auxiliares
  function getRoleLabel(role) {
    return role === 'admin' ? 'Administrador' : 'Vendedor';
  }
  
  function getStatusLabel(status) {
    return status === 'active' ? 'Activo' : 'Inactivo';
  }
  
  function getInitials(firstName, lastName) {
    return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
  }
  
  function getAvatarClass(role) {
    // Determinar clase de avatar basada en el rol o índice
    const avatarClasses = ['avatar-1', 'avatar-2', 'avatar-3', 'avatar-4', 'avatar-5'];
    return avatarClasses[Math.floor(Math.random() * avatarClasses.length)];
  }
  
  function populateViewUser(userData) {
    const firstName = userData.firstName || userData.name?.split(' ')[0] || 'Usuario';
    const lastName = userData.lastName || userData.name?.split(' ')[1] || '';
    const fullName = `${firstName} ${lastName}`.trim();
    const username = userData.username || 'unknown';
    const role = userData.role || 'seller';
    const status = userData.status || 'active';
    const idNumber = userData.idNumber || 'N/A';
    const avatar = userData.avatar || getInitials(firstName, lastName);
    
    // Llenar campos de vista
    viewFullName.textContent = fullName;
    viewUsername.textContent = `@${username}`;
    viewFirstName.textContent = firstName;
    viewLastName.textContent = lastName;
    viewIdNumber.textContent = idNumber;
    viewUsernameDisplay.textContent = username;
    
    // Actualizar avatar
    viewUserAvatar.textContent = avatar;
    viewUserAvatar.className = `user-avatar-large ${userData.avatarClass || getAvatarClass(role)}`;
    
    // Actualizar badges con clases
    viewRole.textContent = getRoleLabel(role);
    viewRole.className = `info-value info-badge ${role}`;
    
    viewStatus.textContent = getStatusLabel(status);
    viewStatus.className = `info-value info-badge ${status}`;
    
    // Llenar campos de edición
    editFirstName.value = firstName;
    editLastName.value = lastName;
    editRole.value = role;
    editStatus.value = status;
    
    // Guardar datos actuales
    currentEditingUser = {
      firstName,
      lastName,
      username,
      idNumber,
      role,
      status,
      avatar,
      avatarClass: userData.avatarClass || getAvatarClass(role)
    };
  }
  
  // Abrir modal desde los botones de editar en la tabla
  document.addEventListener('click', (e) => {
    const editButton = e.target.closest('button[title="Editar"]');
    if (editButton) {
      const row = editButton.closest('tr');
      if (row) {
        const userData = {
          name: row.querySelector('.client-name')?.textContent || '',
          username: row.querySelector('.client-sub')?.textContent?.replace('@', '') || '',
          idNumber: row.querySelector('td:nth-child(2)')?.textContent?.trim() || '',
          role: row.querySelector('.role-badge')?.textContent?.toLowerCase() === 'administrador' ? 'admin' : 'seller',
          status: row.querySelector('.status-badge')?.textContent?.toLowerCase() === 'activo' ? 'active' : 'inactive',
          avatarClass: row.querySelector('.client-avatar')?.className || 'avatar-1'
        };
        
        viewUserTitle.textContent = 'Ver Usuario';
        populateViewUser(userData);
        switchToViewMode();
        overlayViewUser.classList.add('active');
      }
    }
  });
  
  // Funciones para cambiar entre modo vista y edición
  function switchToViewMode() {
    viewMode.classList.remove('hidden');
    editMode.classList.add('hidden');
    btnEditToggle.classList.remove('hidden');
    btnCancelEdit.classList.add('hidden');
    btnCancelView.classList.remove('hidden');
    btnSaveUser.classList.add('hidden');
    btnCancelView.textContent = 'Cerrar';
    viewUserTitle.textContent = 'Ver Usuario';
  }
  
  function switchToEditMode() {
    viewMode.classList.add('hidden');
    editMode.classList.remove('hidden');
    btnEditToggle.classList.add('hidden');
    btnCancelEdit.classList.remove('hidden');
    btnCancelView.classList.add('hidden');
    btnSaveUser.classList.remove('hidden');
    btnCancelEdit.textContent = 'Cancelar';
    viewUserTitle.textContent = 'Editar Usuario';
  }
  
  // Event listeners del modal de ver/editar
  btnCloseViewModal.addEventListener('click', () => {
    overlayViewUser.classList.remove('active');
    switchToViewMode();
  });
  
  btnCancelView.addEventListener('click', () => {
    if (editMode.classList.contains('hidden')) {
      // En modo vista, cerrar
      overlayViewUser.classList.remove('active');
    } else {
      // En modo edición, volver a vista
      switchToViewMode();
    }
  });
  
  btnEditToggle.addEventListener('click', () => {
    switchToEditMode();
  });
  
  btnCancelEdit.addEventListener('click', () => {
    switchToViewMode();
  });
  
  // Cerrar al hacer clic en el overlay
  overlayViewUser.addEventListener('click', (e) => {
    if (e.target === overlayViewUser) {
      overlayViewUser.classList.remove('active');
      switchToViewMode();
    }
  });
  
  // Guardar cambios
  formViewUser.addEventListener('submit', (e) => {
    e.preventDefault();
    
    if (!currentEditingUser) return;
    
    // Obtener valores editados
    const updatedData = {
      firstName: editFirstName.value.trim(),
      lastName: editLastName.value.trim(),
      role: editRole.value,
      status: editStatus.value
    };
    
    // Validar que no estén vacíos
    if (!updatedData.firstName || !updatedData.lastName) {
      alert('Por favor, completa el nombre y apellido');
      return;
    }
    
    // Aquí iría la lógica para guardar en el servidor
    console.log('Guardando cambios:', {
      username: currentEditingUser.username,
      idNumber: currentEditingUser.idNumber,
      ...updatedData
    });
    
    // Actualizar datos en memoria
    currentEditingUser = {
      ...currentEditingUser,
      ...updatedData
    };
    
    // Actualizar la vista
    populateViewUser(currentEditingUser);
    
    // Volver a modo vista
    switchToViewMode();
    
    // Mostrar confirmación
    alert('Cambios guardados exitosamente');
  });

  // ========== FILTROS Y ORDENAR ==========
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