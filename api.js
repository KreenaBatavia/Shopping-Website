// Initialize cart in localStorage if not already present
if (!localStorage.getItem("cart")) {
    localStorage.setItem("cart", "[]");
}

// Global variables
let cart = JSON.parse(localStorage.getItem("cart"));
let allProducts = []; // Here we store products globally to avoid two times fetching

// Fetch and render products
fetch("https://fake-store-api.mock.beeceptor.com/api/products")
    .then(response => response.json())
    .then(products => {
        allProducts = products;
        const productList = document.getElementById("product-list");
        const productDetail = document.getElementById("product-detail");

        // Render product list (home page)
        if (productList) {
            products.forEach(product => {
                const card = `
                    <div class="col-sm-6 col-md-4 col-lg-4 mb-4">
                        <div class="card h-100">
                            <a href="product.html?id=${product.product_id}">
                                <img src="images/laptop.jpg" class="card-img-top" alt="product-image">
                            </a>
                            <div class="card-body">
                                <h5 class="card-title">${product.name}</h5>                                 
                                <p class="badge bg-danger discount-badge">${product.discount}</p>
                                <p class="fw-bold">${product.price}</p>
                                <div class="btn-container">
                                    <button class="btn btn-success cart-btn" id="btn${product.product_id}" 
                                        onclick="detectText(${product.product_id})">
                                        Add to Cart
                                    </button>
                                </div>    
                            </div>
                        </div>
                    </div>
                `;
                productList.innerHTML += card;

                const cart = JSON.parse(localStorage.getItem("cart")) || [];
                const isInCart = cart.some(item => item.id == product.id);
                const buttonElement = document.getElementById("btn" + product.id);
                if (buttonElement && isInCart) {
                    buttonElement.innerText = "Remove from Cart";
                }
            });
        }

        // Render product detail page
        if (productDetail) {
            const url = new URL(window.location.href);
            const searchParams = url.searchParams;
            const id = searchParams.get('product_id');
            const product = products.find(p => p.id == id);

            if (product) {
                productDetail.innerHTML = `
                    <div class="row">
                        <div class="col-md-6 product-detail-image-div">
                            <img src="images/laptop.jpg" class="img-fluid custom-border" alt="product-image">
                        </div>
                        <div class="col-md-5 px-4">
                            <h2>${product.name}</h2>
                            <p class="border-bottom border-3 custom-p">${product.description}</p>
                            <p><strong>Price:</strong> ${product.price}</p>
                            <p class="text-danger border-bottom border-3 custom-p">
                                <strong>Discount:</strong> ${product.discount}
                            </p>
                            <button class="mt-3 btn btn-success details-cart-btn" id="detailBtn${product.id}" 
                                onclick="detectText(${product.id})">
                                Add to Cart
                            </button>
                        </div>
                    </div>
                `;

                const cart = JSON.parse(localStorage.getItem("cart")) || [];
                const isInCart = cart.some(item => item.id == product.id);
                const detailButton = document.getElementById("detailBtn" + product.id);
                if (detailButton && isInCart) {
                    detailButton.innerText = "Remove from Cart";
                }
            } else {
                productDetail.innerHTML = `<h4>Product not found</h4>`;
            }
        }

        updateCartCount();
    });

// Cart Count
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const cartCountElement = document.getElementById("cart-count");
    if (cartCountElement) {
        cartCountElement.innerText = cart.length;
    }
}

//Backend and frontend cart 
function detectText(product_id) {
    const listButton = document.getElementById("btn" + product_id);
    const detailButton = document.getElementById("detailBtn" + product_id);
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const isInCart = cart.some(item => item.product_id == product_id);

    if (isInCart) {
        removeItemFromCart(product_id);
        if (listButton) listButton.innerText = "Add to Cart";
        if (detailButton) detailButton.innerText = "Add to Cart";
    } else {
        addItemToCart(product_id);
        if (listButton) listButton.innerText = "Remove from Cart";
        if (detailButton) detailButton.innerText = "Remove from Cart";
    }
}

// Add to Cart
function addItemToCart(productId) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let product = allProducts.find(product => product.product_id == productId);

    if (product && !cart.some(item => item.product_id == productId)) {
        cart.push(product);
        localStorage.setItem("cart", JSON.stringify(cart));
        updateCartCount();
    }
}

// Remove from Cart 
function removeItemFromCart(productId) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let updatedCart = cart.filter(item => item.product_id != productId);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    updateCartCount();
}

document.addEventListener("DOMContentLoaded", updateCartCount());
