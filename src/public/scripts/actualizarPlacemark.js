let inputActualizarPlacemark=document.getElementById('actualizarPlacemark')
const btnActualizar=document.getElementById('btnActualizar')

inputActualizarPlacemark.addEventListener('change',(e)=>{
    let reader = new FileReader()
    reader.readAsText(actualizarPlacemark.files[0])
    reader.onload=()=>{

        let parser = new DOMParser()
        let xmlDoc = parser.parseFromString(reader.result, "text/xml")
        if (xmlDoc.documentElement.nodeName == "kml") {
            const item = xmlDoc.getElementsByTagName('Document')[0] 
            let name = item.getElementsByTagName('name')[0].childNodes[0].nodeValue.trim()
            let poligonoTZ=item.getElementsByTagName('Polygon')[0]
            let coordenadasTZ = poligonoTZ.getElementsByTagName('coordinates')[0].childNodes[0].nodeValue.trim()
            coordenadasTZ=coordenadasTZ.replace(/\n|\r|/g, "");
            coordenadasTZ=coordenadasTZ.replace(/ /g, "");
            coordenadasTZ=coordenadasTZ.replace(/,/g, " ");     
            coordenadasTZ=coordenadasTZ.replace(/ 0/g, " 0, ");
            coordenadasTZ=coordenadasTZ.replace(/,.$/,"");

            let tz={
            name:name,
            coordenadas:coordenadasTZ
            }
            
            btnActualizar.addEventListener('click',()=>{
                enviarDataTZ(tz)
            })
        }

    }

})

const enviarDataTZ=(tz)=>{
    fetch('http://localhost:3000/views/Mapas/validarActualizarPlacemark',{
        method:'POST',
        body:JSON.stringify(tz),
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
                text: `La actualizacion del TZ del CC ${tz.name} se ha realizado de forma exitosa`,
                icon: 'success',
                confirmButtonText: 'Aceptar'
              })
              .then((result)=>{
                window.location.assign("/views/Mapas/actualizarPlacemark")
                })
        }
    })
    .catch(error=>console.log("Error en la peticion post"))
}

