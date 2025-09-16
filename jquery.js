
$(document).ready(function(){
    
// Initialize cart in localStorage if not already present
if (!localStorage.getItem("cart")) {
    localStorage.setItem("cart", "[]");
}

// Global variables
let cart = JSON.parse(localStorage.getItem("cart"));
let allProducts = []; // Here we store products globally to avoid two times fetching


// Fetch and render products
$.getJSON("products.json", function(products){
        allProducts = products;
        const productList = $("#product-list");
        const productDetail = $("#product-detail");

        // Render product list (home page)  
        if (productList.length) {
            $.each(products, function (index, product) {
                const card = `
                    <div class="col-sm-6 col-md-4 col-lg-4 mb-1">
                        <div class="card h-100">
                            <a href="product.html?id=${product.id}">
                                <img src="${product.image}" class="card-img-top" alt="product-image">
                            </a>
                            <div class="card-body">
                                <h5 class="card-title">${product.name}</h5>                                 
                                <p class="badge bg-danger discount-badge">${product.discount}</p>
                                <p class="fw-bold">${product.price}</p>
                                <div class="btn-container">
                                    <button class="btn btn-success cart-btn" id="btn${product.id}" 
                                        onclick="detectText(${product.id})">
                                        Add to Cart
                                    </button>
                                </div>    
                            </div>
                        </div>
                    </div>
                `;
                productList.append(card) ;

                const cart = JSON.parse(localStorage.getItem("cart")) || [];
                const isInCart = cart.some(item => item.id == product.id);
                const button = $("#btn" + product.id);
                if (button.length && isInCart) {
                    button.text("Remove from Cart");
                }
            });
        }

        // Render product detail page
        if (productDetail.length) {
            const url = new URL(window.location.href);
            const searchParams = url.searchParams;
            const id = searchParams.get('id');
            const product = products.find(p => p.id == id);

            if (product) {
                const productDes = `
                    <div class="row">
                        <div class="col-md-6 product-detail-image-div">
                            <img src="${product.image}" class="img-fluid custom-border" alt="product-image">
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
                productDetail.html(productDes);

                const cart = JSON.parse(localStorage.getItem("cart")) || [];
                const isInCart = cart.some(item => item.id == product.id);
                const $detailButton = $("#detailBtn" + product.id);
                if ($detailButton.length && isInCart) {
                    $detailButton.text ("Remove from Cart");
                }
            } else {
                productDetail.html (`<h4>Product not found</h4>`);
            }
        }

        updateCartCount();
    });

// Cart Count
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    $("#cart-count").text(cart.length);
    }

// When cart modal is shown, load cart items
$('#cartModal').on('show.bs.modal', function () {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const container = $('#cart-items-container');
    container.empty();

    if (cart.length === 0) {
        container.html('<p>Your cart is empty.</p>');
    } else {
        cart.forEach(item => {
            const cartItemHTML = `
                <div class="d-flex align-items-center justify-content-between border-bottom py-2">
                    <div class="d-flex align-items-center">
                        <img src="${item.image}" alt="${item.name}" class="img-thumbnail" style="width: 60px; height: 60px; object-fit: cover;">
                        <div class="ms-3">
                            <h6 class="mb-0">${item.name}</h6>
                            <small class="text-muted">${item.price}</small>
                        </div>
                    </div>
                    
                </div>
            `;
            container.append(cartItemHTML);
        });
    }
});

//Backend and frontend cart 
window.detectText = function (id) {
    const listButton = $("#btn" + id);
    const detailButton = $("#detailBtn" + id);
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const isInCart = cart.some(item => item.id == id);

    if (isInCart) {
        removeItemFromCart(id);
        if (listButton.length) listButton.text("Add to Cart");
        if (detailButton.length) detailButton.text("Add to Cart");
    } else {
        addItemToCart(id);
        if (listButton.length) listButton.text("Remove from Cart");
        if (detailButton.length) detailButton.text("Remove from Cart");
    }
};

// Add to Cart
function addItemToCart(productId) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let product = allProducts.find(product => product.id == productId);

    if (product && !cart.some(item => item.id == productId)) {
        cart.push(product);
        localStorage.setItem("cart", JSON.stringify(cart));
        updateCartCount();
    }
}

// Remove from Cart 
function removeItemFromCart(productId) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let updatedCart = cart.filter(item => item.id != productId);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    updateCartCount();
}
});