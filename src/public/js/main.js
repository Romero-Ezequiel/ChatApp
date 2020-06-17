$(function () {

    // Almaceno la conexion de los WebSocket en una variable
    // para poder enviar mensajes. Este Socket se encarga de obtener
    // la conexion de tiempo real con el servidor, entonces atra vez
    // de este socket voy a poder enviar y recibir mensajes
    const socket = io.connect();

    // Obtengo los elementos del DOM desde la interface del chat
    // Utilizo los selectores de JQuery para obtener los elementos
    const $messageForm = $('#message-form');
    const $messageBox = $('#message');
    const $chat = $('#chat');

    // Obtengo los elementos del DOM desde le NicknameForm de la interface
    const $nickForm = $('#nickForm');
    const $nickError = $('#nickError');
    const $nickname = $('#nickname');

    // Obtengo los usuarios desde el contenedor del DOM
    const $users = $('#usernames');

    /** Aca trato de ejecutar el nickForm, indicandole cuando se envie 
     * el evento o cuando trate de enviar algo al servidor, capturo el 
     * evento. */
    $nickForm.submit(e => {
      e.preventDefault();
      /** 
       * Para validarlo y enviarlo al servidor, le indico que cuando obtenga
       * el evento de enviar datos al servidor voy a utilizar a  ejecutar con
       * socket, enviarle un dato utilizando la conexion de WebSocket, entonces
       * le envio un evento y el servidor va a tener que estar preparado para
       * escuchar dicho evento. 
      */
      socket.emit('nuevo usuario', $nickname.val(), data => {
        if(data) {
          $('#nickWrap').hide();
          $('#contentWrap').show();
          $('#message').focus();
        } else {
          $nickError.html(`
            <div class="alert alert-danger">
              Ese nombre ya existe en la base de datos
            </div>
          `);
        }
      });
      $nickname.val('');
    });

  
    $messageForm.submit( e => {
      e.preventDefault();
      socket.emit('mensaje enviado', $messageBox.val(), data => {
        $chat.append(`<p class="error">${data}</p>`)
      });
      $messageBox.val('');
    });

    socket.on('nuevo mensaje', data => {
      displayMsg(data);
    });

    socket.on('usernames', data => {
      let html = '';
      for(i = 0; i < data.length; i++) {
        html += `<p><i class="fas fa-user"></i> ${data[i]}</p>`; 
      }
      $users.html(html);
    });
    
    socket.on('whisper', data => {
      $chat.append(`<p class="whisper"><b>${data.nick}</b>: ${data.msg}</p>`);
    });

    socket.on('cargar mensajes antiguos', msgs => {
      for(let i = msgs.length -1; i >=0 ; i--) {
        displayMsg(msgs[i]);
      }
    });

    function displayMsg(data) {
      $chat.append(`<p class="msg"><b>${data.nick}</b>: ${data.msg}</p>`);
    }

});