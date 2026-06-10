export function createProductCard(product) {

    const image =
        product.imageUrl ??
        "/assets/images/no-image.png";

    const wholesale =
        product.wholesalePrice ??
        "N/D";

    const retail =
        product.retailPrice ??
        "N/D";

    return `
    
    <div class="product-card">

        <span class="product-card-status ${
            product.isActive
                ? "active"
                : "inactive"
        }">

            ${
                product.isActive
                    ? "Activo"
                    : "Inactivo"
            }

        </span>

        <div class="product-card-image">

            <img
                src="${image}"
                alt="${product.productName}"
            >

        </div>

        <div class="product-card-body">

            <h3 class="product-card-name">

                ${product.productName}

            </h3>

            <div class="product-card-meta">

                <span class="meta-tag line">

                    ${product.lineName}

                </span>

                <span class="meta-tag flavor">

                    ${product.flavorName}

                </span>

                <span class="meta-tag presentation">

                    ${product.presentationName}

                </span>

            </div>

            <div class="product-card-prices">

                <div class="price-group">

                    <span class="price-label">

                        Mayoreo

                    </span>

                    <span class="price-value wholesale">

                        C$ ${wholesale}

                    </span>

                </div>

                <div class="price-group">

                    <span class="price-label">

                        Detalle

                    </span>

                    <span class="price-value retail">

                        C$ ${retail}

                    </span>

                </div>

            </div>

        </div>

    </div>
    
    `;
}