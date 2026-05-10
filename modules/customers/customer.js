document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();

    const overlayNew     = document.getElementById('modal-new-client');
    const overlayDetail  = document.getElementById('modal-detail-client');
    const btnNew         = document.querySelector('.btn-primary');
    const btnCloseNew    = document.getElementById('btn-close-new-client');
    const btnCancelNew   = document.getElementById('btn-cancel-new-client');
    const btnCloseDetail = document.getElementById('btn-close-detail');

    btnNew.addEventListener('click', () => overlayNew.classList.add('active'));
    btnCloseNew.addEventListener('click', () => overlayNew.classList.remove('active'));
    btnCancelNew.addEventListener('click', () => overlayNew.classList.remove('active'));
    btnCloseDetail.addEventListener('click', () => overlayDetail.classList.remove('active'));

    overlayNew.addEventListener('click', (e) => {
        if (e.target === overlayNew) overlayNew.classList.remove('active');
    });

    overlayDetail.addEventListener('click', (e) => {
        if (e.target === overlayDetail) overlayDetail.classList.remove('active');
    });

    document.querySelectorAll('.btn-detail').forEach(btn => {
        btn.addEventListener('click', () => {
            const row          = btn.closest('tr');
            const name         = row.querySelector('.client-name').textContent;
            const phone        = row.cells[1].textContent.trim();
            const department   = row.querySelector('.location-cell span').textContent;
            const municipality = row.cells[3].textContent.trim();
            const pv           = row.cells[4].textContent.trim();

            document.getElementById('detail-fullname').textContent    = name;
            document.getElementById('detail-phone').textContent       = phone;
            document.getElementById('detail-department').textContent  = department;
            document.getElementById('detail-municipality').textContent = municipality;
            document.getElementById('detail-pv').textContent          = pv;
            document.getElementById('detail-address').textContent     = '—';

            overlayDetail.classList.add('active');
        });
    });

    document.getElementById('form-new-client').addEventListener('submit', (e) => {
        e.preventDefault();
        overlayNew.classList.remove('active');
        document.getElementById('form-new-client').reset();
    });

    document.querySelectorAll('.view-toggle-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.view-toggle-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });

    document.querySelectorAll('.pagination-btn:not(:disabled)').forEach(btn => {
        btn.addEventListener('click', function() {
            if (this.textContent === '...') return;
            document.querySelectorAll('.pagination-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });

    document.querySelectorAll('#clientsTableBody tr').forEach(row => {
        row.addEventListener('click', function() {
            this.style.background = 'rgba(0, 194, 150, 0.05)';
            setTimeout(() => { this.style.background = ''; }, 300);
        });
    });
});

function switchTab(el, tab) {
    document.querySelectorAll('.page-tab').forEach(t => t.classList.remove('active'));
    el.classList.add('active');
}

function filterClients() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    document.querySelectorAll('#clientsTableBody tr').forEach(row => {
        row.style.display = row.textContent.toLowerCase().includes(query) ? '' : 'none';
    });
}