const selectSupervisor=document.getElementById('selectSupervisor')
const btnFiltro=document.getElementById('btnFiltro')
const resultadosContainer=document.getElementById('resultadosContainer')
const btnEliminar=document.getElementById('btnEliminar')
let options=[]
let check=[]
let usuario=[]
let nombreUsuario=[]
let apellidoP=[]
let apellidoM=[]
let arraySupervisor=[]
let div=[]


const getSupervisor=async ()=>{
    await fetch(`http://localhost:3000/usuarios/supervisores`)
    .then(response => response.json())
    .then(data => {
        addSupervisor(data)
    })
}

window.onload=()=>{
getSupervisor()
}

const addSupervisor=(data)=>
{
data.forEach((element,i) => {
    
    options[i] = document.createElement("OPTION");
    options[i].setAttribute("value", `${element.supervisor}`);
    let t = document.createTextNode(`${element.supervisor}`);
    options[i].appendChild(t);
    selectSupervisor.appendChild(options[i])
});
}

const getUsuarios=async()=>{
    let supervisor=selectSupervisor.value.replace(/\s+/g,"_");
    
    await fetch(`http://localhost:3000/datosUsuarios/${supervisor}`)
    .then(response => response.json())
    .then(data => {
        addUsuarios(data)

    })

}

const addUsuarios=async(data)=>{
if(check.length>0)
{    
    check.forEach((element,i)=>{
    resultadosContainer.removeChild(usuario[i])
    resultadosContainer.removeChild(nombreUsuario[i])
    resultadosContainer.removeChild(apellidoP[i])
    resultadosContainer.removeChild(apellidoM[i])
    resultadosContainer.removeChild(arraySupervisor[i])
    })
    check=[];
    usuario=[];
    nombreUsuario=[];
    apellidoP={};
    apellidoM=[];
    arraySupervisor=[];
}
data.forEach((element,i)=>{
    check[i]=document.createElement('input')
    check[i].setAttribute('type','checkbox')
    check[i].setAttribute('value',element.usuario)
    check[i].setAttribute('class','checkUsuario')
    usuario[i]=document.createElement('div')
    usuario[i].setAttribute('class','col')
    let t = document.createTextNode(`${element.usuario}`);
    usuario[i].appendChild(check[i])
    usuario[i].appendChild(t)
    nombreUsuario[i]=document.createElement('div')
    nombreUsuario[i].setAttribute('class','col')
    let txtNombre=document.createTextNode(`${element.nombre}`);
    nombreUsuario[i].appendChild(txtNombre)

    apellidoP[i]=document.createElement('div')
    apellidoP[i].setAttribute('class','col')
    let aP=document.createTextNode(`${element.apellido_paterno}`);
    apellidoP[i].appendChild(aP)

    apellidoM[i]=document.createElement('div')
    apellidoM[i].setAttribute('class','col')
    let aM=document.createTextNode(`${element.apellido_materno}`);
    apellidoM[i].appendChild(aM)
    arraySupervisor[i]=document.createElement('div')
    arraySupervisor[i].setAttribute('class','col')
    let txtSuper=document.createTextNode(`${element.supervisor}`)
    arraySupervisor[i].appendChild(txtSuper)
    resultadosContainer.appendChild(usuario[i])
    resultadosContainer.appendChild(nombreUsuario[i])
    resultadosContainer.appendChild(apellidoP[i])
    resultadosContainer.appendChild(apellidoM[i]) 
    resultadosContainer.appendChild(arraySupervisor[i])  
})

}
const getCheckbox=()=>{
    let eliminarCheck=document.getElementsByClassName('checkUsuario')
    eliminarCheck=[...eliminarCheck]
    let arraychecked=[]
    eliminarCheck.forEach((element,i)=>{
        if(eliminarCheck[i].checked)
        {
            arraychecked.push(eliminarCheck[i].value)
        }
    })
    let obj = arraychecked.reduce((acc, el,i) => ({
        ...acc,
        [el]: arraychecked[i],
        }), {})

    if(arraychecked.length<=0)
    {
        alert('Selecciona algun usuario a elimiinar')
    }
    else{
        Swal.fire({
            title: '¿Deseas eliminar a estos usuarios?',
            text: "",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si'
          }).then((result) => {
            if (result.isConfirmed) {
                elimiinarUsuarios(obj)
            }
          })
          
    
    }
}

const elimiinarUsuarios=(obj)=>{
    
   console.log(obj)
    fetch('http://localhost:3000/eliminarUsuarios',{
        method:'POST',
        body:JSON.stringify(obj),
        headers:{
            'Content-Type':'application/json'
        }})

}

btnFiltro.addEventListener('click',()=>{
    getUsuarios()
})
btnEliminar.addEventListener('click',()=>{
    getCheckbox()    
})

