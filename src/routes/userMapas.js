const { send } = require("express/lib/response");
const user = require("../controllers/usersController");
const route = require('express').Router();


// metodos get
route.get('/views/Mapas/altaUsuarios',user.controllerUser.isAuthenticaded, (req, res) => {
    res.render('../views/Mapas/altaUsuarios');
});
route.get('/logout',user.controllerUser.logout);

route.get('/views/Mapas/Dashboard',user.controllerUser.isAuthenticaded, (req, res) => {
    res.render('../views/Mapas/Dashboard');
});
route.get('/views/Mapas/mapa',user.controllerUser.isAuthenticaded, (req, res) => {
    res.render('../views/Mapas/mapa');
});

route.get('/views/Mapas/cargarPlacemark',user.controllerUser.isAuthenticaded, (req, res) => {
    res.render('../views/Mapas/cargarPlacemark');
});
route.get('/views/Mapas/actualizarPlacemark',user.controllerUser.isAuthenticaded, (req, res) => {
    res.render('../views/Mapas/actualizarPlacemark');
});
route.get('/views/Mapas/eliminarPlacemark',user.controllerUser.isAuthenticaded, (req, res) => {
    res.render('../views/Mapas/eliminarPlacemark');
});
route.get('/views/index', user.controllerUser.isAuthenticaded,(req, res) => {
    res.render('../views/index');
});

// metodos post
route.post('/views/Mapas/registrar',user.controllerUser.userRegister,(req,re)=>{
    send.redirect('/views/Mapas/altaUsuarios')
});

route.post('/views/Mapas/subirPlacemark',user.controllerUser.cargarPlacemark,(req,re)=>{
    send.redirect('/views/Mapas/cargarPlacemark')
});

route.post('/views/Mapas/actualizarPlacemark',user.controllerUser.cargarPlacemark,(req,re)=>{
    send.redirect('/views/Mapas/actualizarPlacemark')
});
route.post('/views/login',user.controllerUser.authUser);
module.exports = route;