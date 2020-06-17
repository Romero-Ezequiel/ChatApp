const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/chat', {
    useNewUrlParser: true
})
  .then(db => console.log('Base de datos conectada'))
  .catch(err => console.log(err));