const { send } = require("express/lib/response");
const user = require("../controllers/usersController");
const route = require('express').Router();



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
route.get('/views/index', user.controllerUser.isAuthenticaded,(req, res) => {
    res.render('../views/index');
});
route.post('/views/Mapas/registrar',user.controllerUser.userRegister,(req,re)=>{
    send.redirect('/views/Mapas/altaUsuarios')
});
route.post('/views/login',user.controllerUser.authUser);
module.exports = route;