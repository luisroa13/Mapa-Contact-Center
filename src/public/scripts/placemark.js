let cargarPlacemark = document.getElementById('formFile')

const btnEnviar=document.getElementById('btnEnviar')

//funcion para leer el placemark

cargarPlacemark.addEventListener('change', (e) => {
    let reader = new FileReader()
    reader.readAsText(cargarPlacemark.files[0])
    let marca = document.getElementById('Marca').value
   let campana = document.getElementById('campana').value
    
        reader.onload = () => {
        
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
                if(!item.getElementsByTagName('Point')[0])
                { 
                    Swal.fire({
                        title: 'Error',
                        text: 'El archivo no contiene coordenadas para el site',
                        icon: 'error',
                        confirmButtonText: 'Aceptar'
                      })
                      cargarPlacemark.value=''
                }
                
                 else {
                let site=item.getElementsByTagName('Point')[0]
                let coordenadasSite=site.getElementsByTagName('coordinates')[0].childNodes[0].nodeValue.trim()  
                coordenadasSite=coordenadasSite.replace(/,0/,'')
                coordenadasSite=coordenadasSite.replace(/,/,' ')

                console.log(coordenadasSite)    
                let tz ={
                name:name,
                marca:marca,
                coordenadas:coordenadasTZ,
                site:coordenadasSite,
                campana:campana
                }
                btnEnviar.addEventListener('click',()=>{
                enviarDataTZ(tz)
                })                    
             }
            }
        }

    }
)


const enviarDataTZ=(tz)=>{
    fetch('http://localhost:3000/views/Mapas/subirPlacemark',{
        method:'POST',
        body:JSON.stringify(tz),
        headers:{
            'Content-Type':'application/json'
        }
    }).then(res => {res.json()
        if(res.statusText=='Internal Server Error'){
            Swal.fire({
                title: 'Error',
                text: 'Verifique que el centro de costos no exista en la base de datos',
                icon: 'error',
                confirmButtonText: 'Aceptar'
              })
              
        }

        else
        {
            Swal.fire({
                title: 'OK',
                text: 'La carga se ha realizado de forma exitosa',
                icon: 'success',
                confirmButtonText: 'Aceptar'
              })
              .then((result)=>{
              window.location.assign("/views/Mapas/cargarPlacemark")
              })
        }
    })
    .catch(error=>console.log("Error en la peticion post"))
}

