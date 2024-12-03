const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');
const ProductManager = require('./src/ProductManager');
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

//handlebars
app.engine('handlebars', exphbs.engine());  //
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

//middle
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());


const productManager = new ProductManager();


const viewsRouter = require('./src/routes/views.router');  // 
const apiRouter = require('./src/routes/api.router');

//rutas
app.use('/', viewsRouter);  
app.use('/api', apiRouter);  

//websocket
io.on('connection', (socket) => {
  console.log('Nuevo cliente conectado');
  
  //al cliente
  socket.emit('productos', productManager.getProducts());
  
  //agregar producto
  socket.on('agregarProducto', (producto) => {
    productManager.addProduct(producto);
    io.sockets.emit('productos', productManager.getProducts());
  });
  
  //eliminar producto
  socket.on('eliminarProducto', (productoId) => {
    productManager.deleteProduct(productoId);
    io.sockets.emit('productos', productManager.getProducts());
  });

  socket.on('disconnect', () => {
    console.log('Cliente desconectado');
  });
});

console.log(path.join(__dirname, 'views')); //path sea correcto

//puerto
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
