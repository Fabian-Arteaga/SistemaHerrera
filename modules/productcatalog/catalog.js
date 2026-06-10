import { getCatalog }
from "./services/productcatalog.service.js";

import { createProductCard }
from "./components/product-card.js";

document.addEventListener(
    "DOMContentLoaded",
    loadCatalog
);

async function loadCatalog() {

    try {

        const response =
            await getCatalog();

        const products =
            response.data.data;

        renderProducts(products);

        updatePagination(
            response.data
        );

    }
    catch (error) {

        console.error(error);
    }
}

function renderProducts(products) {

    const grid =
        document.getElementById(
            "productsGrid"
        );

    grid.innerHTML = "";

    products.forEach(product => {

        grid.innerHTML +=
            createProductCard(product);

    });

    lucide.createIcons();
}

function updatePagination(data) {

    document
        .getElementById(
            "resultCount"
        )
        .textContent =
        data.totalRecords;

    document
        .getElementById(
            "showingTotal"
        )
        .textContent =
        data.totalRecords;
}