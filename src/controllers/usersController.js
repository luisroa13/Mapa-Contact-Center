const Pool = require('pg').Pool
//  Recuperamos los datos de config.js y los pasamos a variables
const config = require('../config/config');
const { db: { host, user, password, database, port } } = config;
const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const { promisify } = require('util')
const jwtConfig = require('../config/jwtConfig')
// Usando el objeto Pool del módulo pg  instanciamos un nuevo objeto que usará las credenciales definidas.
const pool = new Pool({
  user: user,
  host: host,
  database: database,
  password: password,
  port: port,
})

const controllerUser = ({})
controllerUser.userRegister = async (req, res, next) => {
  const nombre = req.body.nombre
  const apellidoP = req.body.apellidoP
  const apellidoM = req.body.apellidoM
  const tipo = req.body.tipo
  const pass = req.body.pass
  const user = generaeUser(nombre, apellidoP, apellidoM)

  let passHash = await bcryptjs.hash(pass, 8)

  const queryUser = `insert into usuarios values ('${user}','${nombre}','${apellidoP}','${apellidoM}','${tipo}','${passHash}')`

  let query = pool.query(queryUser, async (err, resp) => {
    if (err) {
      return console.error('Error ejecutando la consulta. ', err.stack)
    }
  })
  res.redirect('../Mapas/altaUsuarios');
}


const generaeUser = (nombre, apellidoP, apellidoM) => {
  const aleatorio = Math.floor(Math.random() * 10000)
  const newUser = `${nombre[0]}${nombre[1]}${apellidoP[0]}${apellidoM[0]}${aleatorio}`
  return newUser.toUpperCase()
}

controllerUser.authUser = async (req, res) => {
  const user = req.body.user
  const password = req.body.password

  const queryUser = `select * from usuarios where usuario='${user}'`

  let query = pool.query(queryUser, async (err, resp) => {
    if (err) {
      return console.error('Error ejecutando la consulta. ', err.stack)
    }
    else {
      if (resp.rows.length == 0 ||! (await bcryptjs.compare(password, resp.rows[0].password))) {
        res.render('login', {
          alert: true,
          alertTitle: 'error',
          alertMessage: 'Usuario y/o contraseña incorrectas',
          alertIcon: 'error',
          showConfirmButton: true,
          timer: false,
          ruta: 'login'
        })
      }
      else if (resp.rows.length != 0 && (await bcryptjs.compare(password, resp.rows[0].password))) {
        
        const usuarioLogeado = resp.rows[0].usuario;
        const token = jwt.sign({ id: usuarioLogeado }, jwtConfig.jwt_password, { expiresIn: jwtConfig.jwt_Tiempo_Expira })

        const cookieOptions = {
          expire: new Date(Date.now() * jwtConfig.jwt_Cookie_Expira * 24 * 60 * 60 * 1000),
          httpOnly: true
        }

        res.cookie('jwt', token, cookieOptions)
        res.redirect('/views/Mapas/Dashboard')
      }
    }
  })
}

controllerUser.isAuthenticaded=async (req,res,next)=>{
 if(req.cookies.jwt)
{
  try{
    const decodificado=await promisify(jwt.verify)(req.cookies.jwt,jwtConfig.jwt_password)

    let queryJwt= `select * from usuarios where usuario='${decodificado.id}'`
    let query = pool.query(queryJwt, async (err, resp) => {
      if (err) {
        return console.error('Error ejecutando la consulta. ', err.stack)
      }

      if(!resp.rows){return next()}
      req.user=resp.rows[0]
      return next()
    })     
  }
  catch(error){
   console.log(error)
   return  next()
  }
}

else{
 res.redirect('/views/login')
 return next()
}
}

controllerUser.logout=(req,res)=>{  
res.clearCookie('jwt')
return res.redirect('/')
}

controllerUser.cargarPlacemark=(req,res)=>{
  let coordenadas=req.body.coordenadas
  let cc=req.body.name
  let marca=parseInt(req.body.marca)
  let site=req.body.site
  let campana=req.body.campana
  let queryUser=`insert into "TZ" (geom,"Name","Marca") values(ST_GeometryFromText('POLYGON Z((${coordenadas}))'),'${cc}','${marca}')`
  let querySite=`insert into "SITES" (geom,"CC","Marca","Campana") values(ST_GeomFromText('POINT(${site})',4326),'${cc}','${marca}','${campana}')`
  let query1 = pool.query(querySite, async (err, resp) => {
    if (err) {
      res.status(500).json({ error: 'message' })
      return console.log(err.stack)
    }
      let query = pool.query(queryUser, async (err, resp) => {
        if (err) {
          res.status(500).json({ error: 'message' })
          return console.log(err.stack)
        }
        else {
          respuesta='ok'
          res.json({respuesta:respuesta})
          }    
      })
    
  })
}

controllerUser.actualizarPlacemark=(req,res)=>{
  let coordenadas=req.body.coordenadas
  let cc=req.body.name
  let site=req.body.site
  let queryUser=`insert into "TZ" (geom,"Name","Marca") values(ST_GeometryFromText('POLYGON Z((${coordenadas}))'),'${cc}','${marca}')`
  
      let query = pool.query(queryUser, async (err, resp) => {
        if (err) {
          res.status(500).json({ error: 'message' })
          return console.log(err.stack)
        }
        else {
          respuesta='ok'
          res.json({respuesta:respuesta})
          }    
      })

}

module.exports = { controllerUser }
