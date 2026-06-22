/**
 * productcatalog.service.js
 * Capa de acceso a datos del modulo Productos.
 */

const ProductCatalogService = (() => {
    const API_ORIGIN = 'https://localhost:7035';
    const BASE_URL = `${API_ORIGIN}/api`;

    function getApiOrigin() {
        return API_ORIGIN;
    }

    function _buildJsonHeaders() {
        return {
            ..._buildAuthHeaders(),
            'Content-Type': 'application/json',
        };
    }

    function _buildAuthHeaders() {
        const headers = { 'Accept': 'application/json' };
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
            items: (pagedData?.data ?? []).map(dto => new ProductCatalogItem(dto)),
            totalCount: pagedData?.totalRecords ?? 0,
            pageNumber: pagedData?.currentPage ?? 1,
            pageSize: pagedData?.pageSize ?? 12,
            totalPages: pagedData?.totalPages ?? 1,
            hasPreviousPage: Boolean(pagedData?.hasPreviousPage),
            hasNextPage: Boolean(pagedData?.hasNextPage),
        };
    }

    async function getCatalog(query = {}) {
        const params = new URLSearchParams();
        _appendParam(params, 'page', query.page ?? 1);
        _appendParam(params, 'pageSize', query.pageSize ?? 12);
        _appendParam(params, 'lineId', query.lineId);
        _appendParam(params, 'flavorId', query.flavorId);
        _appendParam(params, 'search', query.search?.trim());
        _appendParam(params, 'active', query.active);

        const response = await fetch(`${BASE_URL}/Products/catalog?${params.toString()}`, {
            method: 'GET',
            headers: _buildJsonHeaders(),
        });

        return _mapPagedResponse(await _readEnvelope(response));
    }

    async function getById(id) {
        const response = await fetch(`${BASE_URL}/Products/${id}`, {
            method: 'GET',
            headers: _buildJsonHeaders(),
        });

        return new Product(await _readEnvelope(response));
    }

    async function uploadProductImage(file) {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch(`${BASE_URL}/uploads/products`, {
            method: 'POST',
            headers: _buildAuthHeaders(),
            body: formData,
        });

        return await _readEnvelope(response);
    }

    async function create(formData) {
        const payload = Product.toCreateDto(formData);
        const response = await fetch(`${BASE_URL}/Products`, {
            method: 'POST',
            headers: _buildJsonHeaders(),
            body: JSON.stringify(payload),
        });

        return new Product(await _readEnvelope(response));
    }

    async function update(id, formData) {
        const payload = Product.toUpdateDto(formData);
        const response = await fetch(`${BASE_URL}/Products/${id}`, {
            method: 'PUT',
            headers: _buildJsonHeaders(),
            body: JSON.stringify(payload),
        });

        await _readEnvelope(response);
    }

    async function remove(id) {
        const response = await fetch(`${BASE_URL}/Products/${id}`, {
            method: 'DELETE',
            headers: _buildJsonHeaders(),
        });

        await _readEnvelope(response);
    }

    async function getLines() {
        const response = await fetch(`${BASE_URL}/Lines`, {
            method: 'GET',
            headers: _buildJsonHeaders(),
        });

        return _asArray(await _readEnvelope(response));
    }

    async function getFlavors() {
        const flavors = [];
        let page = 1;
        let hasNextPage = true;

        while (hasNextPage) {
            const response = await fetch(`${BASE_URL}/Flavors?page=${page}&pageSize=50`, {
                method: 'GET',
                headers: _buildJsonHeaders(),
            });

            const pagedData = await _readEnvelope(response);
            flavors.push(...(pagedData?.data ?? []));
            hasNextPage = Boolean(pagedData?.hasNextPage);
            page += 1;
        }

        return flavors;
    }

    async function getLinePresentations() {
        const response = await fetch(`${BASE_URL}/LinePresentations`, {
            method: 'GET',
            headers: _buildJsonHeaders(),
        });

        return _asArray(await _readEnvelope(response));
    }

    async function getLinePresentationsByLine(lineId) {
        const selectedLineId = Number(lineId);
        const relations = await getLinePresentations();

        return relations.filter(relation => Number(relation.line?.id) === selectedLineId);
    }

    function _asArray(data) {
        if (Array.isArray(data)) return data;
        if (Array.isArray(data?.data)) return data.data;
        return [];
    }

    return {
        getApiOrigin,
        getCatalog,
        getById,
        uploadProductImage,
        create,
        update,
        remove,
        getLines,
        getFlavors,
        getLinePresentations,
        getLinePresentationsByLine,
    };
})();
