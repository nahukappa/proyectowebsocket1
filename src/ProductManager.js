const fs = require('fs');
const path = require('path');

class ProductManager {
  constructor(filePath) {
    this.filePath = filePath;
  }

  getProducts() {
    return JSON.parse(fs.readFileSync(this.filePath, 'utf8'));
  }

  addProduct(product) {
    const products = this.getProducts();
    product.id = products.length + 1;
    products.push(product);
    fs.writeFileSync(this.filePath, JSON.stringify(products, null, 2));
  }

  deleteProduct(id) {
    const products = this.getProducts().filter(product => product.id !== id);
    fs.writeFileSync(this.filePath, JSON.stringify(products, null, 2));
  }
}

module.exports = ProductManager;
