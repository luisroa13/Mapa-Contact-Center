const express = require("express");
const app = express();
const path=require('path')
const routes=require('./routes/api');
const userRoutes=require('./routes/userMapas')
const cors = require('cors');
const { dirname } = require("path");
const publicPath=path.join(__dirname, 'public')
const views=path.join(__dirname, 'views')
const cookieParser=require('cookie-parser');
const { engine } = require("express/lib/application");
const bodyParser = require('body-parser');

//middlewares
app.use(cors());
app.use(cookieParser())
app.use(express.json());
app.use( bodyParser.urlencoded({ extended: true }) );
app.use( bodyParser.json() );
app.set('views', __dirname + '/views');

app.set('view engine','ejs')
app.use(express.urlencoded({extended: false}));
app.use(express.static(__dirname));
app.use(express.static(publicPath));
//app.use(express.static(path.join(__dirname, 'views')));

//declarando el uso de rutas
app.use(routes);
app.use(userRoutes);
app.set('port',process.env.PORT|| 3000);
app.set(views);

// Se inicia la aplicación en el puerto 3000. 
app.listen(3000, () => {
 console.log("Servidor iniciado en puerto 3000");
});
