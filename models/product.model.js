const mongodb = require('mongodb');

const db = require('../data/database')

class Product {
    constructor(productData) {
        this.title = productData.title;
        this.summary = productData.summary;
        this.price = +productData.price;
        this.description = productData.description;
        this.image = productData.image; // the name of the image file
        this.updateImageData();
        if (productData._id) {
            this.id = productData._id.toString();
        }
    }

    static async findById(productId) {
        let id;
        try {
            id = new mongodb.ObjectId(productId);
        } catch (error) {
            error.code = 404;
            throw error;
        }
        const product = await db.getDb().collection('products').findOne({ _id: id });

        if (!product) {
            const error = new Error('Could not find product with provided id.');
            error.code = 404;
            throw error;
        }

        return new Product(product);
    }

    static async findAll() {
        const products = await db.getDb().collection('products').find().toArray();

        // convert to Product objects to enrich with imagePath and imageUrl fields
        return products.map(product => new Product(product));
    }

    updateImageData() {
        this.imagePath = `product-data/images/${this.image}`;
        this.imageUrl = `/products/assets/images/${this.image}`;
    }

    async save() {
        const productData = {
            title: this.title,
            summary: this.summary,
            price: this.price,
            description: this.description,
            image: this.image
        };

        if (this.id) {
            const productId = new mongodb.ObjectId(this.id);

            if (!this.image) {
                delete productData.image;
            }

            await db.getDb().collection('products').updateOne({ _id: productId }, { $set: productData });
        } else {
            await db.getDb().collection('products').insertOne(productData);
        }
    }

    async replaceImage(newImage) {
        this.image = newImage;
        this.updateImageData();
    }
}

module.exports = Product;