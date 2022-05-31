const selectMarca = document.getElementById("Marca");
const selectCC = document.getElementById("CC");
const btnEnviar = document.getElementById("btnEnviar");
const fileAgebs = document.getElementById("fileAgebs");
let options = [];
let CC = [];
window.onload = () => {
  getCC(selectMarca.value);
};

selectMarca.addEventListener("change", () => {
  getCC(selectMarca.value);
});

const getCC = async (marca) => {
  await fetch(`http://localhost:3000/TZ/${marca}`)
    .then((response) => response.json())
    .then((data) => {
      addCC(data);
    });
};

const addCC = (data) => {
  if (options.length > 0) {
    options.forEach((element, i) => {
      selectCC.removeChild(options[i]);
    });
    options = [];
    CC = [];
  }

  data.forEach((element, i) => {
    CC.push(JSON.parse(data[i]));
    options[i] = document.createElement("OPTION");
    options[i].setAttribute("value", `${CC[i].properties["CC"]}`);
    let t = document.createTextNode(`${CC[i].properties["CC"]}`);
    options[i].appendChild(t);
    selectCC.appendChild(options[i]);
  });
};


fileAgebs.addEventListener('change', (e) => {
    let reader = new FileReader()
    reader.readAsText(fileAgebs.files[0])
    
        reader.onload = () => {
        
        let parser = new DOMParser()
        let xmlDoc = parser.parseFromString(reader.result, "text/xml")
        console.log(xmlDoc)
        let name=[]
        let poligonoTZ
        let coordenadasTZ=[]
        let coordenadasf=[]
        if (xmlDoc.documentElement.nodeName == "kml") {
                let cc=xmlDoc.getElementsByTagName('name')[0].childNodes[0].nodeValue.trim()
                if(cc!==selectCC.value)
                {
                  Swal.fire({
                    title: 'Error',
                    text: `El cc ${cc} del archivo no coincide con el cc ${selectCC.value}`,
                    icon: 'error',
                    confirmButtonText: 'Aceptar'
                  })
                fileAgebs.value=''
                }
                else{
                let item = xmlDoc.getElementsByTagName('Placemark') 
                placemarks=Array.from(item)
                 for (i in placemarks)
                {
                    name.push(item[i].getElementsByTagName('name')[0].childNodes[0].nodeValue.trim())
                    poligonoTZ=item[i].getElementsByTagName('Polygon')[0]
                    coordenadasTZ.push(poligonoTZ.getElementsByTagName('coordinates')[0].childNodes[0].nodeValue.trim())
                    coordenadasTZ[i]=coordenadasTZ[i].replace(/\n|\r|/g, "");
                    coordenadasTZ[i]=coordenadasTZ[i].replace(/ /g, "");
                    coordenadasTZ[i]=coordenadasTZ[i].replace(/,/g, " ");     
                    coordenadasTZ[i]=coordenadasTZ[i].replace(/ 0/g, " 0, ");
                    coordenadasTZ[i]=coordenadasTZ[i].replace(/,.$/,"");
                    coordenadasTZ[i]=coordenadasTZ[i].replace(/"/g,"");
                    coordenadasf.push(coordenadasTZ[i])
                }
                let agebs = name.reduce((acc, el,i) => ({
                    ...acc,
                    [el]: coordenadasf[i],
                    }), {})

                let data=[]
                data.push(agebs)
                let centroDeCostos={
                  cc:selectCC.value
                }
                let obj={...data[0],...centroDeCostos}
                console.log(obj)

                btnEnviar.addEventListener('click',()=>{
                  enviarData(obj)

                })

            }
          }   
        }

    }
)

const enviarData= async (data)=>{
  console.log(JSON.stringify(data))
  let peticion= await fetch('http://localhost:3000/views/Mapas/cargarAgebs',{
    method:'POST',
    body:JSON.stringify(data),
    headers:{
        'Content-Type':'application/json'
    }
})
.then(res => {res.json()
  console.log(res)
  Swal.fire({
    title: 'OK',
    text: 'La carga se ha realizado de forma exitosa',
    icon: 'success',
    confirmButtonText: 'Aceptar'
  })
  .then((result)=>{
  window.location.assign("/views/Mapas/cargarAgebs")
  })
}
)
/*let result = await peticion.json();

if(result.msj=='ok'){
 alert(`La carga de los datos pickup del CC ${obj.CC} ha sido exitosa`)   
}
else if(result.msj=='error')
{ 
  alert(`Ha ocurrido un error, revise que el CC ${obj.CC} exista dentro de la base de datos`)
  alert(result.error)
}*/
}


