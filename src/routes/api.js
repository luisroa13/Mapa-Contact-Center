
const capas = require("../controllers/layerController");
const usuarios=require("../controllers/usersController")
const data=require("../controllers/dataController")

const router = require('express').Router();

router.get('/Estados',usuarios.controllerUser.autToken ,capas.controllerData.getEstados);
router.get('/:calle/:esquina/:colonia/:estado', usuarios.controllerUser.autToken ,capas.controllerData.getAddress);
router.get('/Municipios/:claveEstado',usuarios.controllerUser.autToken , capas.controllerData.getMunicipios);
router.get('/Colonias/:estado', usuarios.controllerUser.autToken ,capas.controllerData.getColonias);
router.get('/Codigos/:estado', usuarios.controllerUser.autToken ,capas.controllerData.getCodigosPostales);
router.get('/FiltrarMunicipio/:estado/:valor',usuarios.controllerUser.autToken ,capas.controllerData.getFiltroMunicipio);
router.get('/FiltrarColonia/:estado/:valor',usuarios.controllerUser.autToken ,capas.controllerData.getFiltroColonia);
router.get('/FiltrarCodigoPostal/:estado/:valor',usuarios.controllerUser.autToken ,capas.controllerData.getFiltroCodigoPostal);
router.get('/tz/:marca' ,capas.controllerData.getTz);
router.get('/sites/:marca' ,capas.controllerData.getSites);
router.get('/placemark/:cc',usuarios.controllerUser.autToken ,capas.controllerData.getPlacemark)
router.get('/Agebs/:cc',usuarios.controllerUser.autToken ,capas.controllerData.getAgebs)
router.get('/usuarios/peticiones/:supervisor',usuarios.controllerUser.getPeticionesUsuario)
router.get('/usuarios/solicitudes',usuarios.controllerUser.getSolicitudes)
router.get('/filtrarsolicitudes/:usuario/:fecha',usuarios.controllerUser.filtarSolicitudes);
router.get('/usuarios/supervisores',data.dataController.getSupervisores);
router.get('/datosUsuarios/:supervisor',data.dataController.getDataUsuarios);


//router.get('/Filtrar/:estado/Colonia/:valor');
//router.get('/Filtrar/:estado/CodigoPostal/:valor');
router.get('../index.js',(req,res)=>{

    res.redirect('/')
    
    });
    
router.get('/', (req, res) => {
    res.render('../views/login',{
        alert:false,
        alertTitle:"Advertencia",
        alertMessage:"Usuario o contraseña incorrectos",
        alertIcon:"info",
        showConfirmButton:true,
        timer:false,
        ruta:'login'
    });
    
});

router.get('/views/login', (req, res) => {
    res.render('../views/login',{
        alert:false,
        alertTitle:"Advertencia",
        alertMessage:"Usuario o contraseña incorrectos",
        alertIcon:"info",
        showConfirmButton:true,
        timer:false,
        ruta:'login'
    });
});

router.get('/views/mapa',usuarios.controllerUser.isAuthenticaded,(req,res)=>{
res.render('../views/mapa')

})



module.exports = router;