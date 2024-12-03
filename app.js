const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');
const ProductManager = require('./src/ProductManager');
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Configuración de Handlebars
app.engine('handlebars', exphbs.engine());  // Usar la versión actualizada de Handlebars
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Middleware para archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Instancia de ProductManager
const productManager = new ProductManager();

// Rutas
const viewsRouter = require('./src/routes/views.router');  // Solo una vez
const apiRouter = require('./src/routes/api.router');

// Usar rutas
app.use('/', viewsRouter);  // Ruta de vistas
app.use('/api', apiRouter);  // Ruta de API

// Configuración de WebSocket
io.on('connection', (socket) => {
  console.log('Nuevo cliente conectado');
  
  // Enviar productos al cliente
  socket.emit('productos', productManager.getProducts());
  
  // Manejar agregar producto
  socket.on('agregarProducto', (producto) => {
    productManager.addProduct(producto);
    io.sockets.emit('productos', productManager.getProducts());
  });
  
  // Manejar eliminar producto
  socket.on('eliminarProducto', (productoId) => {
    productManager.deleteProduct(productoId);
    io.sockets.emit('productos', productManager.getProducts());
  });

  socket.on('disconnect', () => {
    console.log('Cliente desconectado');
  });
});

console.log(path.join(__dirname, 'views')); // Asegúrate de que este path sea correcto

// Configuración de puerto
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
