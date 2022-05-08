const selectMarca=document.getElementById('Marca')
const selectCC=document.getElementById('CC')
const btnEliminar=document.getElementById('btnEliminar')
let options=[]
let CC=[]
window.onload=()=>{
    getCC(selectMarca.value)
}

selectMarca.addEventListener('change',()=>{
 getCC(selectMarca.value)
})

const getCC= async (marca)=>{

    await fetch(`http://localhost:3000/TZ/${marca}`)
        .then(response => response.json())
        .then(data => {
            addCC(data)
        })
}

const addCC=(data)=>{
if(options.length>0)
{
options.forEach((element,i)=>{
    selectCC.removeChild(options[i])

})
options=[]
CC=[]
}


data.forEach((element,i) => {
CC.push(JSON.parse(data[i]))
options[i] = document.createElement("OPTION");
options[i].setAttribute("value", `${CC[i].properties['CC']}`);
let t = document.createTextNode(`${CC[i].properties['CC']}`);
options[i].appendChild(t);
selectCC.appendChild(options[i])
});

}

const eliminarPlacemark=(cc)=>{

    let ccAEliminar={
      CC:cc  
    }

    fetch('http://localhost:3000/views/Mapas/eliminarPlacemark',{
        method:'POST',
        body:JSON.stringify(ccAEliminar),
        headers:{
            'Content-Type':'application/json'
        }
 }).then(res => {res.json()
    if(res.statusText=='Internal Server Error'){
        Swal.fire({
            title: 'Error',
            text: 'Verifique que el centro de exista en la base de datos',
            icon: 'error',
            confirmButtonText: 'Aceptar'
          })
          
    }

    else
    {
        Swal.fire({
            title: 'OK',
            text: `Se ha eliminado el CC ${cc} de la base de datos de forma exitosa`,
            icon: 'success',
            confirmButtonText: 'Aceptar'
          })
          .then((result)=>{
            window.location.assign("/views/Mapas/eliminarPlacemark")
            })
    }
})

}

btnEliminar.addEventListener('click',()=>{
    eliminarPlacemark(selectCC.value)
})