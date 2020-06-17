//Requiero los modulos
const http = require('http');
const express = require('express');
//Requiero el modulo path para unir los directorios
const path = require('path');

/** El modulo socket-io me permite realizar conexion de tiempo real.
 * Este modulo funciona encima de un servidor, es decir para que 
 * sirva este modulo en conexion de tiempo real primero, ya tiene que a ver
 * un servidor. Entonces como ya cree un servidor y está dentro de la constante
 * app voy a utilizar esta constante app para darsela a socket.io. Pero 
 * voy a utilizar el modulo http para crear un servidor atra vez de su 
 * método createServer y le paso app para darle un servidor a socket.io 
 * para que funcione*/
const socketio = require('socket.io');
const mongoose = require('mongoose');
 
/**Luego ejecuto la funcion express, una vez que ejecuto está funcion
 * me va a devolver un objeto de javascript con opciones y metodos que 
 * podemos utilizar para crear un servidor. */
const app = express();
const server = http.createServer(app);

/** Aca le indico a socket que escuche el servidor que cree y entonces
 * ahora ya puedo tener conexion de tiempo real. Entonces me devuelve
 * una conexion de WebSockets que voy almacenar en una constante llamada
 * io. Con esta constante io voy a poder enviar y recibir mensajes desde
 * el cliente y el servidor */
const io = socketio.listen(server);

//Conexión de la BD
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

//mongoose.connect('mongodb://localhost/chat-database')
// Utilice mongodb Atlas para guardas los datos en la base de datos
// en la nube para poder desplegarlo en heroku
mongoose.connect('mongodb+srv://eze:Elrtl0ot57wB31wW@cluster0-s7zol.mongodb.net/chat-database?retryWrites=true&w=majority')
    .then(db => console.log('La base de datos está conectada'))
    .catch(err => console.log(err));

//Configuro el puerto de app, ya que lo voy a utilizar cuando despliegue 
//la aplicación en heroku. Le indico que utilice el puerto que me pasa 
//el servidor sino que se ejecute en el puerto 3000
app.set('port', process.env.PORT || 3000);

//Aca importo la funcion que está en el archivo sockets y le paso por 
//parametro la conexion de sockets que es io
require('./sockets')(io);

//Archivos estaticos
//console.log(path.join(__dirname, 'public'));
//console.log(__dirname + '/public');
app.use(express.static(path.join(__dirname, 'public')));
//console.log(__filename);
// app.use(express.static('public'));

//Aca esta escuchando el servidor, y le indico con app.get() que obtenga
//el puerto para que escuche
server.listen(app.get('port'), ()=>{
    console.log('El servidor está corriendo en el puerto', app.get('port'));
});