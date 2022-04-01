function getProducts(req, res) {
    res.render('/admin/products/all-products');
}

function getNewProduct() {
    res.render('/admin/products/new-product');
}

function createNewProduct() {}

module.exports = {
    getProducts: getProducts,
    getNewProduct: getNewProduct,
    createNewProduct: createNewProduct
};