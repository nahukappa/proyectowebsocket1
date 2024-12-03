const express = require('express');
const router = express.Router();
const ProductManager = require('../ProductManager');
const path = require('path');

//ruta principal
router.get('/', (req, res) => {
    res.render('home', { title: 'Lista de productos' });  //vista home.handlebars
  });

// vista de productos en tiempo real
router.get('/realtimeproducts', (req, res) => {
  const productManager = new ProductManager(path.join(__dirname, '../../products.json'));
  const products = productManager.getProducts();
  res.render('realTimeProducts', { products });
});

//la vista de productos estatica
router.get('/home', (req, res) => {
  const productManager = new ProductManager(path.join(__dirname, '../../products.json'));
  const products = productManager.getProducts();
  res.render('home', { products });
});

module.exports = router;
