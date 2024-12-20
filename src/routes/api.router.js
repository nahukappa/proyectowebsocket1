const express = require('express');
const router = express.Router();
const ProductManager = require('../ProductManager');
const path = require('path');

//obtener los productos
const productManager = new ProductManager(path.join(__dirname, '../../products.json'));

router.get('/products', (req, res) => {
  const products = productManager.getProducts();
  res.json(products);
});

//agregar un producto
router.post('/products', (req, res) => {
  const newProduct = req.body;
  productManager.addProduct(newProduct);
  res.json(newProduct);
});

//eliminar un producto
router.delete('/products/:id', (req, res) => {
  const { id } = req.params;
  productManager.deleteProduct(parseInt(id));
  res.json({ message: 'Producto eliminado' });
});

module.exports = router;
