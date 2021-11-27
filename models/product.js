exports.Product = class Audit {
    constructor(product_id, title, price, description, image_url) {
        this.product_id = product_id;
        this.title = title;
        this.price = price;
        this.description = description;
        this.image_url = image_url;
    }
}