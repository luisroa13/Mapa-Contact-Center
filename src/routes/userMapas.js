const { send } = require("express/lib/response");
const user = require("../controllers/usersController");
const route = require('express').Router();


// metodos get
route.get('/views/Mapas/altaUsuarios',user.controllerUser.isAuthenticaded, (req, res) => {
    res.render('../views/Mapas/altaUsuarios',{
        alert:false,
        alertTitle:"Ok",
        alertMessage:"Usuario",
        alertIcon:"success",
        showConfirmButton:true,
        timer:false
    });
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
route.get('/views/Mapas/cargarPickup',user.controllerUser.isAuthenticaded, (req, res) => {
    res.render('../views/Mapas/cargarPickup');
});

route.get('/views/Mapas/descargarPlacemark',user.controllerUser.isAuthenticaded, (req, res) => {
    res.render('../views/Mapas/descargarPlacemark');
});
route.get('/views/Mapas/cargarAgebs',user.controllerUser.isAuthenticaded, (req, res) => {
    res.render('../views/Mapas/cargarAgebs');
});

// metodos post
route.post('/views/Mapas/registrar',user.controllerUser.isAuthenticaded,user.controllerUser.userRegister,(req,re)=>{
    send.redirect('/views/Mapas/altaUsuarios')
});

route.post('/views/Mapas/subirPlacemark',user.controllerUser.isAuthenticaded,user.controllerUser.cargarPlacemark,(req,re)=>{
    send.redirect('/views/Mapas/cargarPlacemark')
});

route.post('/views/Mapas/validarActualizarPlacemark',user.controllerUser.isAuthenticaded,user.controllerUser.actualizarPlacemark,(req,re)=>{
    send.redirect('/views/Mapas/actualizarPlacemark')
});
route.post('/views/Mapas/eliminarPlacemark',user.controllerUser.isAuthenticaded,user.controllerUser.eliminarPlacemark,(req,re)=>{
    send.redirect('/views/Mapas/eliminarPlacemark')
});

route.post('/views/Mapas/cargarPickup',user.controllerUser.isAuthenticaded,user.controllerUser.cargarPickup,(req,re)=>{
    send.redirect('/views/Mapas/cargarPickup')
});
route.post('/views/Mapas/cargarAgebs/',user.controllerUser.isAuthenticaded,user.controllerUser.cargarAgebs,(req,re)=>{
    send.redirect('/views/Mapas/cargarAgebs')
});
route.post('/views/login',user.controllerUser.authUser);
module.exports = route;