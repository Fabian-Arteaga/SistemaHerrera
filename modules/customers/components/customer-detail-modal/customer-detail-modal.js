/**
 * customer-detail-modal.component.js
 *
 * Responsabilidades:
 *  - Inyectar el HTML del modal directamente (sin fetch externo)
 *  - Mostrar datos de un Customer ya cargado
 *  - Botón "Editar" → delega a openCustomerEditModal
 *  - Botón "Eliminar" → DELETE /api/Customers/{id} con confirmación
 *  - Emitir evento 'customer:deleted' tras eliminar exitosamente
 */

(function () {

    let _currentCustomer = null;
    let _onChangedCb     = null;

    // ─── Template HTML incrustado ────────────────────────────────────────────────

    const TEMPLATE = `
        <div class="modal-overlay" id="modal-customer-detail">
          <div class="modal modal-detail">
            <div class="modal-header">
              <h2>Detalles del Cliente</h2>
              <div class="modal-header-actions">
                <button class="btn-edit-detail" id="btn-edit-from-detail" type="button">
                  <i data-lucide="edit-2"></i> Editar
                </button>
                <button class="btn-close-modal" id="btn-close-customer-detail" type="button">
                  <i data-lucide="x"></i>
                </button>
              </div>
            </div>

            <div class="detail-grid" id="detail-content">
              <div class="detail-row">
                <span class="detail-label">Nombre completo:</span>
                <span class="detail-value" id="detail-fullname">—</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Teléfono:</span>
                <span class="detail-value" id="detail-phone">—</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Municipio:</span>
                <span class="detail-value" id="detail-municipality">—</span>
              </div>
              <div class="detail-row">
              <span class="detail-label">Departamento:</span>
              <span class="detail-value" id="detail-department">—</span>
                </div>
              <div class="detail-row">
                <span class="detail-label">Punto de Venta:</span>
                <span class="detail-value" id="detail-pos">—</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Dirección PV:</span>
                <span class="detail-value" id="detail-posaddress">—</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Estado:</span>
                <span class="detail-value" id="detail-status">—</span>
              </div>
            </div>

            <div class="modal-footer detail-modal-footer">
              <button type="button" class="btn-delete-detail" id="btn-delete-customer">
                <i data-lucide="trash-2"></i>
                <span>Eliminar</span>
              </button>
            </div>
          </div>
        </div>`;

    // ─── Inyección del HTML ──────────────────────────────────────────────────────

    function _loadTemplate() {
        const placeholder = document.getElementById('customer-detail-modal-placeholder');
        if (!placeholder) {
            console.error('[CustomerDetailModal] Placeholder #customer-detail-modal-placeholder no encontrado.');
            return;
        }
        placeholder.innerHTML = TEMPLATE;
        _bindEvents();
    }

    // ─── Binding de eventos ──────────────────────────────────────────────────────

    function _bindEvents() {
        document.getElementById('btn-close-customer-detail').addEventListener('click', closeCustomerDetailModal);

        document.getElementById('btn-edit-from-detail').addEventListener('click', () => {
            if (!_currentCustomer) return;
            closeCustomerDetailModal();
            openCustomerEditModal(_currentCustomer.id, _onChangedCb);
        });

        document.getElementById('btn-delete-customer').addEventListener('click', _handleDelete);

        document.getElementById('modal-customer-detail').addEventListener('click', (e) => {
            if (e.target.id === 'modal-customer-detail') closeCustomerDetailModal();
        });
    }

    // ─── Apertura ────────────────────────────────────────────────────────────────

    function openCustomerDetailModal(customer, onChanged) {
        _currentCustomer = customer;
        _onChangedCb     = onChanged || null;

        _populateDetail(customer);
        document.getElementById('modal-customer-detail').classList.add('active');
        lucide.createIcons();
    }

    // ─── Cierre ──────────────────────────────────────────────────────────────────

    function closeCustomerDetailModal() {
        document.getElementById('modal-customer-detail').classList.remove('active');
        _currentCustomer = null;
    }

    // ─── Poblar datos ────────────────────────────────────────────────────────────

    function _populateDetail(customer) {
        document.getElementById('detail-fullname').textContent   = customer.fullName;
        document.getElementById('detail-phone').textContent      = customer.phone;
        document.getElementById('detail-pos').textContent        = customer.pointOfSale;
        document.getElementById('detail-posaddress').textContent = customer.posaddress;
        document.getElementById('detail-municipality').textContent =
        customer.municipalityName;
        document.getElementById('detail-department').textContent =
        customer.departmentName;

        const statusEl = document.getElementById('detail-status');
        statusEl.innerHTML = customer.isActive
            ? `<span class="status-badge-inline active">Activo</span>`
            : `<span class="status-badge-inline inactive">Inactivo</span>`;
    }

    // ─── Eliminar ────────────────────────────────────────────────────────────────

    async function _handleDelete() {
        if (!_currentCustomer) return;

        const confirmed = confirm(
            `¿Estás seguro de que querés eliminar a "${_currentCustomer.fullName}"?\n\n` +
            `Si tiene órdenes o ventas asociadas, la operación no podrá completarse.`
        );
        if (!confirmed) return;

        const btnDelete = document.getElementById('btn-delete-customer');
        btnDelete.disabled = true;
        btnDelete.querySelector('span').textContent = 'Eliminando…';

        try {
            await CustomerService.remove(_currentCustomer.id);
            closeCustomerDetailModal();
            if (typeof _onChangedCb === 'function') _onChangedCb();
            document.dispatchEvent(new CustomEvent('customer:deleted'));
        } catch (err) {
            alert(`No se pudo eliminar el cliente:\n${err.message}`);
        } finally {
            btnDelete.disabled = false;
            btnDelete.querySelector('span').textContent = 'Eliminar';
        }
    }

    // ─── Init (síncrono, sin fetch) ──────────────────────────────────────────────

    function initCustomerDetailModal() {
        _loadTemplate();
    }

    // ─── API pública ─────────────────────────────────────────────────────────────

    window.initCustomerDetailModal  = initCustomerDetailModal;
    window.openCustomerDetailModal  = openCustomerDetailModal;
    window.closeCustomerDetailModal = closeCustomerDetailModal;

})();