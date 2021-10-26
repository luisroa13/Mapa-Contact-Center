const Pool = require('pg').Pool
const GeoJSON = require('geojson');
//  Recuperamos los datos de config.js y los pasamos a variables
const config = require('../config/config');
const { db: { host, user, password, database, port } } = config;

// Usando el objeto Pool del módulo pg  instanciamos un nuevo objeto que usará las credenciales definidas.
const pool = new Pool({
  user: user,
  host: host,
  database: database,
  password: password,
  port: port,
})


const controllerData = ({})

controllerData.getEstados = (req, res, next) => {
  // Almacenamos la consulta SQL
  let queryLayer = `select ST_AsGeoJSON(e.*) from  "Estados" e`

 
  let query = pool.query(queryLayer, async (err, resp) => {
    if (err) {
      return console.error('Error ejecutando la consulta. ', err.stack)
    }

    let array = new Array();

    let i;
    for (i = 0; i < resp.rows.length; i++) {
      array.push((resp.rows[i].st_asgeojson));
    }

    await res.json(array)

  })
}

// Obteniendo calles

controllerData.getAddress = (req, res, next) => {

  let calle = req.params.calle;
  let esquina = req.params.esquina;
  

  // Almacenamos la consulta SQL
  let queryLayer = `select ST_AsGeoJSON(u.*) from(
    
select v.nomvial
as "Calle",s.nomvial as "Esquina 1",b.nomvial as "Esquina 2",n.geom as 
"Geometria",col.nom_col as "Colonia", col.cod_post as "Codigo postal",
mun.nombre_municipio as "Municipio", es.nombre_estado as "Estado",
m.nombre_marca as "Marca",cam.nombre_campana as "Campaña",n.ageb
from cruces_526 c inner join vialidades_526 v on c.calle=v.cvevial
inner join  vialidades_526 s on c.esquina_1=s.cvevial
inner join  vialidades_526 b on c.esquina_2=b.cvevial
inner join "CC526" n on c.id_geom=n.id_geom
inner join "Marca" m on m.id_marca=n.id_marca
inner join  "Campana" cam on cam.id_campana = n.id_campana
inner join "Colonias" col on col.id = n.id_2
inner join "municipios" mun on mun.id_municipio= col.id_municipio
inner join  "Estados" es on es.clave_ent = col.cve_ent
      where v.nomvial like '%${calle}%' 
      and (s.nomvial like'%${esquina}%' or b.nomvial like'%${esquina}%')  ) u  
    `
  let query = pool.query(queryLayer, (err, resp) => {
    if (err) {
      return console.error('Error ejecutando la consulta. ', err.stack)
    }

    let array = new Array();

    let i;
    for (i = 0; i < resp.rows.length; i++) {
      array.push((resp.rows[i].st_asgeojson));
      // console.log(i);  
    }
    const geojson = resp.rows;
    //  console.log(geojson);
    res.json(array);

  })
}
controllerData.getAddressCalle = (req, res, next) => {

  let calle = req.params.calle;


  // Almacenamos la consulta SQL
  let queryLayer = `select ST_AsGeoJSON(u.*) from (
    
select v.nomvial
as "Calle",s.nomvial as "Esquina 1",b.nomvial as "Esquina 2",n.geom as 
"Geometria",col.nom_col as "Colonia", col.cod_post as "Codigo postal",
mun.nombre_municipio as "Municipio", es.nombre_estado as "Estado",
m.nombre_marca as "Marca",cam.nombre_campana as "Campaña",n.ageb
from cruces_526 c inner join vialidades_526 v on c.calle=v.cvevial
inner join  vialidades_526 s on c.esquina_1=s.cvevial
inner join  vialidades_526 b on c.esquina_2=b.cvevial
inner join "CC526" n on c.id_geom=n.id_geom
inner join "Marca" m on m.id_marca=n.id_marca
inner join  "Campana" cam on cam.id_campana = n.id_campana
inner join "Colonias" col on col.id = n.id_2
inner join "municipios" mun on mun.id_municipio= col.id_municipio
inner join  "Estados" es on es.clave_ent = col.cve_ent
    where v.nomvial like '%${calle}%' 
      and (s.nomvial like'%%' or b.nomvial like'%%')  ) u  
    `


  let query = pool.query(queryLayer, (err, resp) => {
    if (err) {
      return console.error('Error ejecutando la consulta. ', err.stack)
    }

    let array = new Array();

    let i;
    for (i = 0; i < resp.rows.length; i++) {
      array.push((resp.rows[i].st_asgeojson));
        
    }
   
    res.json(array);

  })
}

//obteniendo Municipios
controllerData.getMunicipios = (req, res, next) => {
  // Almacenamos la consulta SQL

  let idMunicipio = req.params.clavemun;


  let queryLayer = `select ST_AsGeoJSON(b.*) from (select m.nombre_municipio as "Municipio", 
  m.cve_mun as "Clave Municipio",m.cve_ent as "Clave Estado", 
  e.nombre_estado as "Estado", m.geometria
  from municipios m 
  inner join "Estados" e on m.cve_ent=e.clave_ent where m.cve_ent='${idMunicipio}') b`


  let query = pool.query(queryLayer, (err, resp) => {
    if (err) {
      return console.error('Error ejecutando la consulta. ', err.stack)
    }

    let array = new Array();

    let i;
    for (i = 0; i < resp.rows.length; i++) {
      array.push((resp.rows[i].st_asgeojson));
      // console.log(i);  
    }
    //console.log(array);

    res.json(array)

  })
}

//obteniendo colonias
controllerData.getColonias =  (req, res, next) => {


  let estado = req.params.estado


  let queryLayer = `select  ST_AsGeoJSON(b.*) from (select c.geom, c.nom_col, m.nombre_municipio,
    c.cod_post,e.nombre_estado,c.cve_ent from "Colonias" c
    inner join "Estados" e on c.cve_ent=e.clave_ent
	inner join municipios m on c.id_municipio=m.id_municipio where c.cve_ent='${estado}'
	)b`


   let query = pool.query(queryLayer, async (err, resp) => {
     if (err) {
        return console.error('Error ejecutando la consulta. ', err.stack);
     }

     let array = new Array();

     let i;
     for (i = 0; i < resp.rows.length; i++) {
       array.push((resp.rows[i].st_asgeojson));
        
     }
      await res.json(array);

   })

}

module.exports = { controllerData }