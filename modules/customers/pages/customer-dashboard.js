
/**
 * customer-dashboard.component.js
 *
 * Orquestador del módulo Clientes. Responsabilidades:
 *  - Inicializar los componentes de modales
 *  - Cargar y renderizar la tabla de clientes desde la API (paginado)
 *  - Manejar paginación real con datos del PagedResponse
 *  - Filtros por búsqueda (client-side sobre la página actual)
 *  - Actualizar stat-cards con totales reales
 *  - Escuchar eventos 'customer:saved' y 'customer:deleted' para recargar
 */

document.addEventListener('DOMContentLoaded', async () => {

    // ─── Estado de la página ─────────────────────────────────────────────────────

    let _currentPage  = 1;
    const PAGE_SIZE   = 10;

    // ─── Inicializar componentes de modales ──────────────────────────────────────

    initCustomerFormModal();
    initCustomerDetailModal();

    // ─── Botón "Nuevo Cliente" ────────────────────────────────────────────────────

    document.querySelector('.btn-primary')
        .addEventListener('click', () => openCustomerFormModal(_reloadCurrentPage));

    // ─── Escuchar eventos globales de guardado / eliminación ─────────────────────

    document.addEventListener('customer:saved',   _reloadCurrentPage);
    document.addEventListener('customer:deleted', () => {
        // Si estábamos en la última página y queda vacía, retroceder
        _currentPage = Math.max(1, _currentPage - 1);
        _reloadCurrentPage();
    });

    // ─── Carga inicial ───────────────────────────────────────────────────────────

    await _loadPage(_currentPage);

    // ─── Filtro de búsqueda (client-side sobre la página actual) ────────────────

    document.getElementById('searchInput')
        .addEventListener('input', _filterTableClientSide);

    // ─── Filtros de departamento / municipio (actualmente client-side) ───────────

    document.getElementById('deptFilter')
        .addEventListener('change', _filterTableClientSide);
    document.getElementById('municipalityFilter')
        .addEventListener('change', _filterTableClientSide);

    lucide.createIcons();
});

// ─── Cargar página desde la API ──────────────────────────────────────────────

async function _loadPage(pageNumber) {
    _showTableLoading(true);

    try {
        const result = await CustomerService.getAll(pageNumber, 10);

        _renderTable(result.items);
        _renderPagination(result);
        _updateFooterInfo(result);
        _updateStatCards(result);

    } catch (err) {
        _showTableError(err.message);
    } finally {
        _showTableLoading(false);
        lucide.createIcons();
    }
}

function _reloadCurrentPage() {
    _loadPage(_currentPage);
}

// ─── Render de la tabla ──────────────────────────────────────────────────────

function _renderTable(customers) {
    const tbody = document.getElementById('clientsTableBody');

    if (!customers || customers.length === 0) {
        tbody.innerHTML = `
            <tr>
              <td colspan="6" class="table-empty">
                <i data-lucide="users"></i>
                No se encontraron clientes
              </td>
            </tr>`;
        return;
    }

    tbody.innerHTML = customers.map((c, index) => `
        <tr>
          <td>
            <div class="client-cell">
              <div class="client-avatar avatar-color-${index % 8}">${c.initials}</div>
              <div class="client-info">
                <span class="client-name">${c.fullName}</span>
              </div>
            </div>
          </td>
          <td>${c.phone}</td>
          <td>
            <div class="location-cell">
              <i data-lucide="map-pin"></i>
               <span>${c.municipalityName}</span>
            </div>
          </td>
          <td>${c.pointOfSale}</td>
          <td>
            <button
              class="btn-detail"
              data-customer-id="${c.id}"
              title="Ver detalles"
            >
              <i data-lucide="eye"></i>
            </button>
          </td>
        </tr>
    `).join('');

    // Vincular botones de detalle
    document.querySelectorAll('.btn-detail[data-customer-id]').forEach(btn => {
        btn.addEventListener('click', async () => {
            const id = Number(btn.dataset.customerId);
            try {
                const customer = await CustomerService.getById(id);
                openCustomerDetailModal(customer, _reloadCurrentPage);
            } catch (err) {
                alert(`Error al cargar el cliente: ${err.message}`);
            }
        });
    });
}

// ─── Render de paginación ────────────────────────────────────────────────────

function _renderPagination(pagedResult) {
    const container = document.querySelector('.pagination');
    if (!container) return;

    const { pageNumber, totalPages, hasPreviousPage, hasNextPage } = pagedResult;
    _currentPage = pageNumber;

    // Construir botones de páginas visibles (ventana de 5)
    const pages = _buildPageWindow(pageNumber, totalPages);

    container.innerHTML = `
        <button class="pagination-btn" id="btn-prev-page" ${!hasPreviousPage ? 'disabled' : ''}>
          <i data-lucide="chevron-left"></i>
        </button>
        ${pages.map(p => p === '...'
            ? `<button class="pagination-btn" disabled>…</button>`
            : `<button class="pagination-btn ${p === pageNumber ? 'active' : ''}" data-page="${p}">${p}</button>`
        ).join('')}
        <button class="pagination-btn" id="btn-next-page" ${!hasNextPage ? 'disabled' : ''}>
          <i data-lucide="chevron-right"></i>
        </button>
    `;

    // Eventos
    document.getElementById('btn-prev-page')?.addEventListener('click', () => {
        if (hasPreviousPage) _loadPage(_currentPage - 1);
    });
    document.getElementById('btn-next-page')?.addEventListener('click', () => {
        if (hasNextPage) _loadPage(_currentPage + 1);
    });
    document.querySelectorAll('.pagination-btn[data-page]').forEach(btn => {
        btn.addEventListener('click', () => _loadPage(Number(btn.dataset.page)));
    });
}

function _buildPageWindow(current, total) {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

    const pages = [];
    pages.push(1);
    if (current > 3)  pages.push('...');
    for (let p = Math.max(2, current - 1); p <= Math.min(total - 1, current + 1); p++) {
        pages.push(p);
    }
    if (current < total - 2) pages.push('...');
    pages.push(total);
    return pages;
}

// ─── Footer info ─────────────────────────────────────────────────────────────

function _updateFooterInfo(result) {
    const el = document.querySelector('.table-footer-info');
    if (!el) return;

    const from = ((result.pageNumber - 1) * result.pageSize) + 1;
    const to   = Math.min(result.pageNumber * result.pageSize, result.totalCount);

    el.innerHTML = `Mostrando <strong>${from}–${to}</strong> de <strong>${result.totalCount}</strong> clientes`;
}

// ─── Stat cards ──────────────────────────────────────────────────────────────

function _updateStatCards(result) {
    // totalCount refleja el total de clientes del filtro actual
    // Actualizar el badge del encabezado de la tabla
    const badge = document.querySelector('.table-card-header .count-badge');
    if (badge) badge.textContent = result.totalCount;
}

// ─── Filtro client-side ──────────────────────────────────────────────────────

function _filterTableClientSide() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    const rows  = document.querySelectorAll('#clientsTableBody tr');

    rows.forEach(row => {
        row.style.display = row.textContent.toLowerCase().includes(query) ? '' : 'none';
    });
}

function clearFilters() {
    document.getElementById('searchInput').value        = '';
    document.getElementById('deptFilter').value         = '';
    document.getElementById('municipalityFilter').value = '';
    _filterTableClientSide();
}

function applyFilters() {
    _filterTableClientSide();
}

// ─── UI helpers ──────────────────────────────────────────────────────────────

function _showTableLoading(loading) {
    const tbody = document.getElementById('clientsTableBody');
    if (!tbody) return;

    if (loading) {
        tbody.innerHTML = `
            <tr>
              <td colspan="6" class="table-loading">
                Cargando clientes…
              </td>
            </tr>`;
    }
}

function _showTableError(msg) {
    const tbody = document.getElementById('clientsTableBody');
    if (!tbody) return;
    tbody.innerHTML = `
        <tr>
          <td colspan="6" class="table-empty">
            <i data-lucide="alert-circle"></i>
            Error al cargar clientes: ${msg}
          </td>
        </tr>`;
}