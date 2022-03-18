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
  let colonia =req.params.colonia;
  let idEstado=req.params.estado;

 if (esquina=='NA'){esquina='%%'}

 if (colonia=='NA'){colonia='%%'}

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
       where v.nomvial like '%${calle}%' and es.clave_ent = '${idEstado}' 
      and col.nom_col like '%${colonia}%'
      and (s.nomvial like'%${esquina}%' or b.nomvial like'%${esquina}%') ) u  
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
    
   
    //  console.log(geojson);
    res.json(array);

  })
}

//obteniendo Municipios
controllerData.getMunicipios = (req, res, next) => {
  // Almacenamos la consulta SQL

  let idEstado = req.params.claveEstado;


  let queryLayer = `select ST_AsGeoJSON(b.*) from (select m.nombre_municipio as "Municipio", 
  m.cve_mun as "Clave Municipio",m.cve_ent as "Clave Estado", 
  e.nombre_estado as "Estado", m.geometria
  from municipios m 
  inner join "Estados" e on m.cve_ent=e.clave_ent where m.cve_ent='${idEstado}') b`


    let query =  pool.query( queryLayer, async (err, resp) => {
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

    await res.json(array)

  })
}

//obteniendo colonias
controllerData.getColonias =  (req, res, next) => {


  let estado = req.params.estado


  let queryLayer = `select  ST_AsGeoJSON(b.*) from (select c.geom "Geometria", c.nom_col as "Colonia", m.nombre_municipio as "Municipio",
    c.cod_post as "Codigo Postal",e.nombre_estado as "Estado",c.cve_ent from "colonias2020" c
    inner join "Estados" e on c.cve_ent=e.clave_ent
	inner join municipios m on c.id_municipio=m.id_municipio where c.cve_ent='${estado}'
	)b`


   let query = pool.query(queryLayer,  (err, resp) => {
     if (err) {
        return console.error('Error ejecutando la consulta. ', err.stack);
     }

     let array = new Array();

     let i;
     for (i = 0; i < resp.rows.length; i++) {
       array.push((resp.rows[i].st_asgeojson));
        
     }
      res.json(array);

   })

}

//obteniendo codigos postales
controllerData.getCodigosPostales =  (req, res, next) => {


  let estado = req.params.estado


  let queryLayer = `select  ST_AsGeoJSON(b.*) 
  from ( select cp.codigo_postal, cp.geom, mun.nombre_municipio as "Municipio", estados.nombre_estado as "Estado "from "Codigos_postales" cp 
  inner join "municipios" mun on cp.id_municipio=mun.id_municipio
  inner join "Estados" estados on mun.cve_ent=estados.clave_ent
  
  where cp.cve_ent='${estado}'
  ) b`


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

//Filtro de Municipio
controllerData.getFiltroMunicipio =  (req, res, next) => {


  const idEstado = req.params.estado;
  const valor=req.params.valor;
console.log(idEstado+" "+valor)
  let queryLayer = `select ST_AsGeoJSON(b.*) from (select m.nombre_municipio as "Municipio", 
  m.cve_mun as "Clave Municipio",m.cve_ent as "Clave Estado", 
  e.nombre_estado as "Estado", m.geometria,ST_CENTROID(m.geometria) as "Centroide"
  from municipios m 
  inner join "Estados" e on m.cve_ent=e.clave_ent where m.cve_ent='${idEstado}' 
  and m.nombre_municipio like '%${valor}%' ) b`



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

//Filtro de Colonia
controllerData.getFiltroColonia =  (req, res, next) => {


  const idEstado = req.params.estado;
  const valor=req.params.valor;

let queryLayer = `select  ST_AsGeoJSON(b.*) from (select c.geom "Geometria", c.nom_col as "Colonia", m.nombre_municipio as "Municipio",
c.cod_post as "Codigo Postal",e.nombre_estado as "Estado",c.cve_ent, ST_CENTROID(C.geom) as "Centroide" from "colonias2020" c
inner join "Estados" e on c.cve_ent=e.clave_ent
inner join municipios m on c.id_municipio=m.id_municipio where c.cve_ent='${idEstado}'
and (c.nom_col like '%${valor}%')
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


//Filtro de Codigo Postal
controllerData.getFiltroCodigoPostal =  (req, res, next) => {


  const idEstado = req.params.estado;
  const valor=req.params.valor;

console.log(idEstado+" "+valor)
let queryLayer = `select  ST_AsGeoJSON(b.*) 
  from ( select cp.codigo_postal, cp.geom, mun.nombre_municipio as "Municipio", estados.nombre_estado as "Estado", 
  ST_CENTROID(cp.geom) as "Centroide"
  from "Codigos_postales" cp 
  inner join "municipios" mun on cp.id_municipio=mun.id_municipio
  inner join "Estados" estados on mun.cve_ent=estados.clave_ent
  
  where cp.cve_ent='${idEstado}' and cp.codigo_postal ='${valor}'
  ) b`




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


controllerData.getSites =  (req, res, next) => {

const marca=req.params.marca
let queryLayer = `select  ST_AsGeoJSON(b.*) 
from ( select site.geom, site."CC", site."Nombre",campana.nombre_campana as "Campaña",
  marca.nombre_marca as "Marca", site."Estado", 
  site."Estado",site."Municipo",site."Colonia",site."DIRECCION",
  site."Calle 1", site."Calle 2",site."Ageb",site."NUM EXT",site."TELEFONO"
  FROM "SITES" site
  INNER join "Campana" campana on site."Campana"=campana.id_campana
  INNER JOIN "Marca" marca on site."Marca"=marca.id_marca
  where marca.nombre_marca like '${marca}'
) b`




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
controllerData.getTz =  (req, res, next) => {

  const marca= req.params.marca
  const queryLayer = `select  ST_AsGeoJSON(b.*) 
  from ( 
    select tz.geom, tz."Name" as "CC", marca.nombre_marca as "Marca" FROM "TZ" tz
    inner join "Marca" marca on tz."Marca"= marca.id_marca
  where marca.nombre_marca='${marca}'
  ) b`
  
  
  
  
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