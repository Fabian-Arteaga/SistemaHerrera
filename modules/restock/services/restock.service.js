/**
 * restock.service.js
 * Capa de acceso a datos del modulo Reabastecimientos.
 */

const RestockService = (() => {
    let _baseUrl = null;

    async function _getBaseUrl() {
        if (_baseUrl) return _baseUrl;

        const configModule = await import('../../core/config/app.config.js');
        _baseUrl = `${configModule.CONFIG.API_URL}/restocks`;

        return _baseUrl;
    }

    function _buildJsonHeaders() {
        const headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        };

        const token = localStorage.getItem('token');
        if (token) headers.Authorization = `Bearer ${token}`;

        return headers;
    }

    async function _readEnvelope(response) {
        let envelope = null;

        try {
            envelope = await response.json();
        } catch {
            throw new Error(`Error HTTP ${response.status}`);
        }

        const success = envelope.success ?? envelope.Success;
        const message = envelope.message ?? envelope.Message;
        const data = envelope.data ?? envelope.Data;

        if (!response.ok || success === false) {
            if (Array.isArray(data)) throw new Error(data.join('\n'));
            throw new Error(message || `Error HTTP ${response.status}`);
        }

        return data;
    }

    function _appendParam(params, key, value) {
        if (value !== undefined && value !== null && value !== '') {
            params.set(key, String(value));
        }
    }

    function _mapPagedResponse(pagedData) {
        return {
            items: (pagedData?.data ?? []).map(dto => new RestockListItem(dto)),
            totalCount: pagedData?.totalRecords ?? 0,
            pageNumber: pagedData?.currentPage ?? 1,
            pageSize: pagedData?.pageSize ?? 10,
            totalPages: pagedData?.totalPages ?? 1,
            hasPreviousPage: Boolean(pagedData?.hasPreviousPage),
            hasNextPage: Boolean(pagedData?.hasNextPage),
        };
    }

    async function getStatistics() {
        const baseUrl = await _getBaseUrl();
        const response = await fetch(`${baseUrl}/statistics`, {
            method: 'GET',
            headers: _buildJsonHeaders(),
        });

        return new RestockStatistics(await _readEnvelope(response));
    }

    async function getRestocks(query = {}) {
        const baseUrl = await _getBaseUrl();
        const params = new URLSearchParams();
        _appendParam(params, 'page', query.page ?? 1);
        _appendParam(params, 'pageSize', query.pageSize ?? 10);
        _appendParam(params, 'fromDate', query.fromDate);
        _appendParam(params, 'toDate', query.toDate);
        _appendParam(params, 'search', query.search?.trim());

        const response = await fetch(`${baseUrl}?${params.toString()}`, {
            method: 'GET',
            headers: _buildJsonHeaders(),
        });

        return _mapPagedResponse(await _readEnvelope(response));
    }

    async function getDetail(restockId) {
        const baseUrl = await _getBaseUrl();
        const response = await fetch(`${baseUrl}/${restockId}/detail`, {
            method: 'GET',
            headers: _buildJsonHeaders(),
        });

        return new RestockDetail(await _readEnvelope(response));
    }

    return {
        getStatistics,
        getRestocks,
        getDetail,
    };
})();
