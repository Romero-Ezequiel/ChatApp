const Chat = require('./models/Chat');

//Pongo todo el codigo en una funcion que voy a exportar
module.exports = io => {

  let users = {};

/** Aca le indico que se quede escuchando cuando hay
 *  una nueva conexion de sockets y cuando se conecte un nuevo socket
 *  o cliente, */

  io.on('connection', async socket => {

    let messages = await Chat.find({}).limit(8).sort('-created');

    socket.emit('cargar mensajes antiguos', messages);

    socket.on('nuevo usuario', (data, cb) => {
      if (data in users) {
        cb(false);
      } else {
        cb(true);
        socket.nickname = data;
        users[socket.nickname] = socket;
        updateNicknames();
      }
    });

    // Recibir un mensaje a trasmitir
    socket.on('mensaje enviado', async (data, cb) => {
      var msg = data.trim();

      if (msg.substr(0, 3) === '/w ') {
        msg = msg.substr(3);
        var index = msg.indexOf(' ');
        if(index !== -1) {
          var name = msg.substring(0, index);
          var msg = msg.substring(index + 1);
          if (name in users) {
            users[name].emit('whisper', {
              msg,
              nick: socket.nickname 
            });
          } else {
            cb('Error! Ingrese un usuario valido');
          }
        } else {
          cb('Error! Por favor ingrese su mensaje');
        }
      } else {
        var newMsg = new Chat({
          msg,
          nick: socket.nickname
        });
        await newMsg.save();
      
        io.sockets.emit('nuevo mensaje', {
          msg,
          nick: socket.nickname
        });
      }
    });

    socket.on('disconnect', data => {
      if(!socket.nickname) return;
      delete users[socket.nickname];
      updateNicknames();
    });

    function updateNicknames() {
      io.sockets.emit('usernames', Object.keys(users));
    }
  });

}