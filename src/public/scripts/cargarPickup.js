const datosPickup= document.getElementById('datosPickup')
const btnEnviar=document.getElementById('btnEnviar')

datosPickup.addEventListener('change', (e) => {

    let reader = new FileReader()
    reader.readAsText(datosPickup.files[0])
    reader.onload=()=>{
    let obj=[]
    let texto=reader.result.trim().split('\n')
    let cabeceras=texto[0].trim().split(',')
    //texto.pop()
    console.log(texto)
    for(let i=1;i<texto.length;i++)
    {
      console.log(texto[i])
    let llaves=texto[i].replace(/|\r|/g, "").split(',')
    
    const indexedUsers = cabeceras.reduce((acc, el,i) => ({
      ...acc,
      [el]: llaves[i],
      }), {})
       obj.push(indexedUsers)
      }
         btnEnviar.addEventListener('click',()=>{

        obj.forEach((element,i)=>{
          enviarData(obj[i])
        })
      }) 
    } 
   }
)

const enviarData= async (obj)=>{
  console.log(JSON.stringify(obj))
 let peticion= await fetch('http://localhost:3000/views/Mapas/cargarPickup',{
    method:'POST',
    body:JSON.stringify(obj),
    headers:{
        'Content-Type':'application/json'
    }
})
let result = await peticion.json();

if(result.msj=='ok'){
 alert(`La carga de los datos pickup del CC ${obj.CC} ha sido exitosa`)   
}
else if(result.msj=='error')
{ 
  alert(`Ha ocurrido un error, revise que el CC ${obj.CC} exista dentro de la base de datos`)
  alert(result.error)
}
}


