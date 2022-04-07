const addToCartButtonElement = document.querySelector('#product-details button');
const cartBadgeElement = document.querySelector('.nav-items .badge');

async function addToCart() {
    let response;

    try {
        response = await fetch('/cart/items', {
            method: "POST",
            body: JSON.stringify({
                productId: addToCartButtonElement.dataset.productid,
                _csrf: addToCartButtonElement.dataset.csrf
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {
        alert('Something went wrong!');
        return;
    }

    if (!response.ok) {
        alert('Something went wrong!');
        return;
    }

    const responseData = await response.json();

    const { newTotalItems: newTotalQuantity } = responseData;
    cartBadgeElement.textContent = newTotalQuantity;
}

addToCartButtonElement.addEventListener('click', addToCart);