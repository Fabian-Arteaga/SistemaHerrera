/**
 * Modelos del modulo de reabastecimientos.
 * Mapean los DTOs documentados de /api/restocks.
 */

class RestockListItem {
    constructor(dto = {}) {
        this.restockId = dto.restockId;
        this.restockCode = dto.restockCode || '';
        this.restockDate = dto.restockDate ?? null;
        this.userName = dto.userName || '';
        this.batchCount = Number(dto.batchCount ?? 0);
        this.totalUnits = Number(dto.totalUnits ?? 0);
        this.totalInvestment = Number(dto.totalInvestment ?? 0);
    }
}

class RestockStatistics {
    constructor(dto = {}) {
        this.restocksThisMonth = Number(dto.restocksThisMonth ?? 0);
        this.totalInvestmentThisMonth = Number(dto.totalInvestmentThisMonth ?? 0);
        this.batchesCreatedThisMonth = Number(dto.batchesCreatedThisMonth ?? 0);
    }
}

class RestockDetail {
    constructor(dto = {}) {
        this.restockId = dto.restockId;
        this.restockCode = dto.restockCode || '';
        this.restockDate = dto.restockDate ?? null;
        this.userName = dto.userName || '';
        this.batchCount = Number(dto.batchCount ?? 0);
        this.totalUnits = Number(dto.totalUnits ?? 0);
        this.totalInvestment = Number(dto.totalInvestment ?? 0);
        this.differentProductsCount = Number(dto.differentProductsCount ?? 0);
        this.batches = (dto.batches ?? []).map(batch => new RestockDetailBatch(batch));
    }
}

class RestockDetailBatch {
    constructor(dto = {}) {
        this.batchId = dto.batchId;
        this.batchCode = dto.batchCode ?? null;
        this.productName = dto.productName || '';
        this.batchStatusName = dto.batchStatusName || '';
        this.initialQuantity = Number(dto.initialQuantity ?? 0);
        this.unitProductionCost = Number(dto.unitProductionCost ?? 0);
        this.totalCost = Number(dto.totalCost ?? 0);
        this.expirationDate = dto.expirationDate ?? null;
    }
}
