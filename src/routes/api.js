
const capas = require("../controllers/layerController");
const router = require('express').Router();

router.get('/Estados', capas.controllerData.getEstados);
router.get('/direccion/:calle/:esquina', capas.controllerData.getAddress);
router.get('/direccion/:calle', capas.controllerData.getAddressCalle);
router.get('/Municipios/:clavemun', capas.controllerData.getMunicipios);
router.get('/Colonias/:estado', capas.controllerData.getColonias);


router.get('../index.js',(req,res)=>{

    res.redirect('/')
    
    });
    
router.get('/', (req, res) => {
    res.redirect('../views/index.html');
    
});



module.exports = router;