/**
 * Modelos del modulo de ventas.
 * Mapean los DTOs documentados de /api/Sales.
 */

class SaleStatistics {
    constructor(dto = {}) {
        this.salesThisMonth = Number(dto.salesThisMonth ?? 0);
        this.totalIncomeThisMonth = Number(dto.totalIncomeThisMonth ?? 0);
        this.productsSoldThisMonth = Number(dto.productsSoldThisMonth ?? 0);
    }
}

class SaleListItem {
    constructor(dto = {}) {
        this.id = dto.id;
        this.saleCode = dto.saleCode || '';
        this.saleDate = dto.saleDate ?? null;
        this.customerName = dto.customerName || '';
        this.saleTypeId = dto.saleTypeId;
        this.saleTypeName = dto.saleTypeName || '';
        this.paymentTypeId = dto.paymentTypeId;
        this.paymentTypeName = dto.paymentTypeName || '';
        this.total = Number(dto.total ?? 0);
    }
}

class SaleHeader {
    constructor(dto = {}) {
        this.id = dto.id;
        this.saleCode = dto.saleCode || '';
        this.saleDate = dto.saleDate ?? null;
        this.orderCode = dto.orderCode ?? null;
        this.customer = new SaleCustomer(dto.customer ?? {});
        this.total = Number(dto.total ?? 0);
        this.paymentStatusName = dto.paymentStatusName || '';
        this.pendingBalance = dto.pendingBalance === null || dto.pendingBalance === undefined
            ? null
            : Number(dto.pendingBalance);
        this.createdByUserName = dto.createdByUserName || '';
        this.paymentTypeId = dto.paymentTypeId;
        this.paymentTypeName = dto.paymentTypeName || '';
        this.saleTypeId = dto.saleTypeId;
        this.saleTypeName = dto.saleTypeName || '';
    }
}

class SaleCustomer {
    constructor(dto = {}) {
        this.id = dto.id;
        this.fullName = dto.fullName || '';
        this.departmentName = dto.departmentName || '';
        this.municipalityName = dto.municipalityName || '';
        this.pointOfSale = dto.pointOfSale || '';
    }
}

class SaleDetailItem {
    constructor(dto = {}) {
        this.id = dto.id;
        this.productId = dto.productId;
        this.productName = dto.productName || '';
        this.batchCode = dto.batchCode ?? null;
        this.quantity = Number(dto.quantity ?? 0);
        this.unitPrice = Number(dto.unitPrice ?? 0);
        this.lineSubtotal = Number(dto.lineSubtotal ?? 0);
    }
}

class SalePayment {
    constructor(dto = {}) {
        this.id = dto.id;
        this.amount = Number(dto.amount ?? 0);
        this.paymentMethodName = dto.paymentMethodName || '';
        this.paymentDate = dto.paymentDate ?? null;
        this.transactionReference = dto.transactionReference ?? null;
        this.registeredByUserName = dto.registeredByUserName || '';
    }
}
