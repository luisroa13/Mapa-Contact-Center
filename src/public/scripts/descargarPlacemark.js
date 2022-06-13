const selectMarca=document.getElementById('Marca')
const selectCC=document.getElementById('CC')
const btnDescargar=document.getElementById('btnDescargar')
let options=[]
let CC=[]
let arrayAgeb=[]
let array=[]
let coordenadas=[]
let coordenadasAgeb=[]
let objTZ={}
let objAgebs
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


const descargarCoordenadas= async(cc)=>{
     
    await fetch(`http://localhost:3000/placemark/${cc}`)
    .then(response => response.json())
    .then(data => {
        getTZ(data)
        })

    await fetch(`http://localhost:3000/Agebs/${cc}`)
    .then(response => response.json())
    .then(data => {
     getAgebs(data)
        })
     let placemarkJSON={...objTZ,...objAgebs}
     descargarExcel(placemarkJSON,`${cc}_Placemark.xlsx`)
    }
const getTZ=(data)=>{
    let tz=data.st_astext.trim().replace("MULTIPOLYGON Z (((","")
    tz=tz.replace("POLYGON Z ((","")
    tz=tz.replace(")))","")
    tz=tz.replace("))","")
    tz=tz.replace(/ /g, ",");
    tz=tz.replace(/,0,/g, ",0.0 ");
    tz=tz.replace(/,0,/g, ",0.0 ");
    tz=tz.replace(/,0$/,",0.0");
    tz=`A${tz}`
    let site=`${data.latitud}, ${data.longitud}`
    objTZ={
      TZ:tz,
      Site:site  
    }
    console.log(objTZ)
}

const getAgebs=(data)=>{
    data.forEach((element,i)=>{

        array.push(JSON.parse(data[i]))
        coordenadasAgeb[i]=JSON.stringify(array[i].geometry.coordinates)
        coordenadasAgeb[i]=coordenadasAgeb[i].replace("[[[", '[ [ ')
        coordenadasAgeb[i]=coordenadasAgeb[i].replace("]]]", ' ] ]')
        coordenadasAgeb[i]=coordenadasAgeb[i].replace(/\],\[/g, " ], [ ") 
        arrayAgeb.push(array[i].properties.Ageb)
    })
    objAgebs = arrayAgeb.reduce((acc, el,i) => ({
        ...acc,
        [el]: coordenadasAgeb[i],
        }), {})
console.log(objAgebs)}

btnDescargar.addEventListener('click',()=>{
descargarCoordenadas(selectCC.value)
})

const descargarExcel=(data,nombre)=>{
let newJson=[data]

let workSheet=XLSX.utils.json_to_sheet(newJson)
let workBook=XLSX.utils.book_new()
XLSX.utils.book_append_sheet(workBook,workSheet,'Coordenadas')
XLSX.writeFile(workBook,nombre)
}
