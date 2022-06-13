const Pool = require("pg").Pool;
//  Recuperamos los datos de config.js y los pasamos a variables
const config = require("../config/config");
const {
  db: { host, user, password, database, port },
} = config;
const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");
const { promisify } = require("util");
const jwtConfig = require("../config/jwtConfig");
// Usando el objeto Pool del módulo pg  instanciamos un nuevo objeto que usará las credenciales definidas.
const pool = new Pool({
  user: user,
  host: host,
  database: database,
  password: password,
  port: port,
});

const dataController = {};

dataController.getSupervisores=async (req, res) => {
let queryUser=`select distinct supervisor from usuarios`

let query = pool.query(queryUser, async (err, resp) => {
    if (err) {
      return console.error("Error ejecutando la consulta. ", err.stack);
    }
    res.json(resp.rows)
  });
  };
dataController.getDataUsuarios=async (req, res) => {
    let supervisor=req.params.supervisor.replace(/_/g,' ')
    let queryUser=`select usuario, nombre,apellido_paterno,apellido_materno,tipo_usuario,supervisor from usuarios where supervisor like '%${supervisor}%'`
    
    let query = pool.query(queryUser, async (err, resp) => {
        if (err) {
          return console.error("Error ejecutando la consulta. ", err.stack);
        }
        res.json(resp.rows)
      });
      };
      

dataController.eliminarUsuario=(req,res)=>{
  let usuarios=req.body
  
   for( let i in usuarios){
  let queryUser=`delete from usuarios where usuario='${usuarios[i]}'`
  let query = pool.query(queryUser, async (err, resp) => {
    if (err) {
      return console.error("Error ejecutando la consulta. ", err.stack);
    }
   }); 
 }
 res.render('../views/Mapas/bajaUsuario')
}      


module.exports = { dataController };