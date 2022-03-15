"use strict";

//Nuestro servidor
var express = require('express');

var _require = require('socket.io'),
    Server = _require.Server;

var foodRoutes = require('../src/routes/Food');

var app = express();
app.use(express.json()); //Gltich=>process.env=> segun el entorno donde corra el proyecto, el entorno va a elegir el puerto dodne
//quiero que se corra=> VARIABLE DE ENTORNO ALGO QUE VA A CAMBIAR SEGUN DODNE LO ESTE CORRIENDO

var PORT = process.env.PORT || 8080;
var server = app.listen(PORT, function () {
  console.log("Listening on port ".concat(PORT));
});
app.use('/foods', foodRoutes);
var io = new Server(server); //MIdleware que voy a utilizar para conectar con public

app.use(express["static"](__dirname + '/public')); //************MI CHAT*********************//

var log = []; //crear una tabla en la misma base de datos
//AHORA VAMOS A EMPALMAR WEBSOCKET Y EXPRESS
//io.on => es para quedarse esuchando (evento=>connection)

io.on('connection', function (socket) {
  console.log('Scoket connected'); //El usuario pueda avisar a los demas cuando se conecta
  //socket.broadcast=>se utiliza cuando quieres emitir algo a todos los
  //sockets conectados menos a ti
  //cuando el usuario quiera emitir un evento menos para ti
  //POR CADA EMIT HAY UN ON

  socket.broadcast.emit('newUserConnected');
  socket.emit('log', log); //cuando llegue el mensaje...

  socket.on('message', function (data) {
    log.push(data);
    io.emit('log', log);
  }); //FORM//////////////////////////////////////

  socket.on('sendFood', function _callee(data) {
    var foods;
    return regeneratorRuntime.async(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return regeneratorRuntime.awrap(newFood.createNewFood(data));

          case 2:
            _context.next = 4;
            return regeneratorRuntime.awrap(newFood.getAllfoods());

          case 4:
            foods = _context.sent;
            io.emit('foodLog', foods);

          case 6:
          case "end":
            return _context.stop();
        }
      }
    });
  }); //END FORM /////////////////////////////////
});