
const capas = require("../controllers/layerController");
const router = require('express').Router();

router.get('/Estados', capas.controllerData.getEstados);
router.get('/:calle/:esquina/:colonia/:estado', capas.controllerData.getAddress);
router.get('/Municipios/:claveEstado', capas.controllerData.getMunicipios);
router.get('/Colonias/:estado', capas.controllerData.getColonias);
router.get('/Codigos/:estado', capas.controllerData.getCodigosPostales);
router.get('/FiltrarMunicipio/:estado/:valor',capas.controllerData.getFiltroMunicipio);
router.get('/FiltrarColonia/:estado/:valor',capas.controllerData.getFiltroColonia);
router.get('/FiltrarCodigoPostal/:estado/:valor',capas.controllerData.getFiltroCodigoPostal);
router.get('/tz/:marca',capas.controllerData.getTz);
router.get('/sites/:marca',capas.controllerData.getSites);
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




module.exports = router;