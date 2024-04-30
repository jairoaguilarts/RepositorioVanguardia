var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// Conexion a la base de datos en Atlas
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://DBAdmin:SLhO7Tunkw9fjx6W@inventario.ievreub.mongodb.net/?retryWrites=true&w=majority&appName=Inventario";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

run().catch(console.dir);

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

const inventario = [];

// Crear producto del inventario
app.post('/agregarElemento', (req, res) => {
  const { id, nombre, entrada, salida, precio, desc, estado } = req.body;
  const nuevoElemento = {
    ID: id,
    Nombre: nombre,
    Entrada: entrada,
    Salida: salida,
    Precio: precio,
    Descripcion: desc,
    Estado: estado
  };
  inventario.push(nuevoElemento);
  res.send('Elemento agregado al inventario');
});

app.put('/modificarElemento/', (req, res) => {
  const { id, nombre, entrada, salida, precio, desc, estado } = req.body;
  let mod = false;
  for (let i = 0; i < inventario.length; i++) {
    if (inventario[i].id === id) {
      inventario[i] = {
        Nombre: nombre,
        Entrada: entrada,
        Salida: salida,
        Precio: precio,
        Descripcion: desc,
        Estado: estado
      };
      mod = true;
      break;
    }
  }
  if (mod) {
    res.send('Elemento modificado');
  }
});

app.delete('/eliminarElemento/:id', (req, res) => {
  const { id } = req.params;
  let del = false;
  for (let i = 0; i < inventario.length; i++) {
    if (inventario[i].id === id) {
      inventario.splice(i, 1);
      del = true;
      break;
    }
  }
  if (del) {
    res.send('Elemento modificado');
  }
});

module.exports = app;
