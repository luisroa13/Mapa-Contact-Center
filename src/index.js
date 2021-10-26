const express = require("express");
const app = express();
const path=require('path')
const routes=require('./routes/api');
const cors = require('cors');
const { dirname } = require("path");
const publicPath=path.join(__dirname, 'public')
const views=path.join(__dirname, 'views')
//middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(express.static(__dirname));

app.use(express.static(publicPath));
//app.use(express.static(path.join(__dirname, 'views')));

//declarando el uso de rutas
app.use(routes);
app.set('port',process.env.PORT|| 3000);
app.set(views);

//app.set('views',path.join(__dirname,"views"));


// Se inicia la aplicación en el puerto 3000. 
app.listen(3000, () => {
 console.log("Servidor iniciado en puerto 3000");
 
});
