

let map = L.map('map').setView([19.35941466493296, -99.15019173874926], 17);



let capaOSM = new L.tileLayer('http://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 30 })
let capaSatelite = new L.tileLayer('http://www.google.cn/maps/vt?lyrs=s@189&gl=cn&x={x}&y={y}&z={z}', { maxZoom: 30 })
let gMapsHibryd = new L.tileLayer(' https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', { maxZoom: 30 })
let hereMap = new L.tileLayer('https://2.base.maps.ls.hereapi.com/maptile/2.1/maptile/newest/{z}/{x}/{y}')
let capaGMaps = new L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', { maxZoom: 30, subdomains: ['mt0', 'mt1', 'mt2', 'mt3'] }).addTo(map);


const here = {
    apiKey: '_poEJB6nEAXu-YQctaODRHh1zJmz4uFDu81GDF27Biw',
    style: 'normal.day'
};
const hereTileUrl = new L.tileLayer(`https://2.base.maps.ls.hereapi.com/maptile/2.1/maptile/newest/${here.style}/{z}/{x}/{y}/512/png8?apiKey=${here.apiKey}&ppi=320`);

const capasMap = {
    'OSM': capaOSM,
    'Hibryd': gMapsHibryd,
    'Here': hereTileUrl,
    'Google maps': capaGMaps
}

const selectorCapas = new L.control.layers(capasMap);
selectorCapas.addTo(map);
const bntSearchEs = document.getElementById("bntSearchEs");
const bntSearchMun = document.getElementById("bntSearchMun");
const btnSearch = document.getElementById("btnSearch");
const btnCp = document.getElementById("btnCp");
let marker1 = new Array();
const selectEstado = document.getElementById("Estados");
const modal = document.getElementById("tvesModal");
const modal2 = document.getElementById("tvesModal2");
const btn = document.getElementById("btnBusquedaAvanzada");
const span = document.getElementsByClassName("close")[0];
const span2 = document.getElementsByClassName("close")[1];
const body = document.getElementsByTagName("body")[0];
const txtBntSearch = document.getElementById("txtBntSearch");
let btnColonias = document.getElementById("btnColonias");
let calle = new Array();
let popup = new Array();
let d = new Array();
let lang = new Array();
let lat = new Array();
let div = document.getElementById('res');
let layer = new Array();
let municipio = new Array();
let layerMunicipio = new Array();
let estado = new Array();
let layerEstado = new Array();
let colonia = new Array();
let layerColonia = new Array();
let popupColonia = new Array();


let coordinates = document.getElementById("query").value;



function isValidCoordinates(coordinates) {
    if (!coordinates.match(/^[-]?\d+[\.]?\d*, [-]?\d+[\.]?\d*$/)) {
        return false;
    }
    const [latitude, longitude] = coordinates.split(",");
    return (latitude > -90 && latitude < 90 && longitude > -180 && longitude < 180);
}

// funcion que añade un estado a el mapa
async function addEstado(data) {

    if (estado.length > 0) {
        estado.forEach((element, i) => {
            map.removeLayer(layerEstado[i])
        })
        estado = []
        layerEstado = []
        bntSearchEs.style.background = '#d7d7d8';

    }
    else {
        await data.forEach((element, i) => {
            estado.push(JSON.parse(data[i]));
            layerEstado.push(L.geoJSON(estado[i], { color: 'rgb(66,66,66)' }).bindPopup(`${estado[i].properties.nombre_estado}</br>`))
            //drawnItems.addLayer(layerEstado[i]);
            map.addLayer(layerEstado[i]);
            layerEstado[i].addEventListener('mouseover', () => {

                layerEstado[i].setStyle({ fillColor: "blue" }, { color: 'rgb(165,39,20)' }, { draggable: true });
            })
            layerEstado[i].addEventListener('mouseout', () => {

                layerEstado[i].resetStyle();
            })



        })
        bntSearchEs.style.background = '#146eb4';
    }
}



// Funcion que agrega un marcardor con los datos obtenidos por la api
async function addDir(data) {

    if (d.length > 0) {
        removeStreet2(d.length)
    }

    //por cada resultado que arroja la api se va agregando un marcador

    await data.features.forEach((element, i) => {
        lat.push(data.features[i].geometry.coordinates[1]);
        lang.push(data.features[i].geometry.coordinates[0]);

        d[i] = document.createElement("div");
        d[i].innerHTML = `${data.features[i].properties.display_name}`
        //div.append(d[i])
        layer.push(L.marker([lat[i], lang[i]], 16))//.bindPopup(`${data.features[i].properties.display_name}</br>Coordenadas:${lat[i]},${lang[i]}`));
        map.addLayer(layer[i]);

        //d[i].addEventListener('click', () => {
          //  map.setView([lang[i], lat[i]], 18)
            //layer[i].openPopup();
        //})
        map.panTo([lat[i], lang[i]], 16);

    })


}



//funcion para añadir municipio al mapa


async function addMunicipio(data) {
    //let estados = L.layerGroup().addTo(map);
    if (municipio.length > 0) {
        municipio.forEach((element, i) => {
            map.removeLayer(layerMunicipio[i])
        })
        municipio = []
        layerMunicipio = []
        bntSearchMun.style.background = '#d7d7d8';

    }
    else {

        await data.forEach((element, i) => {

            municipio.push(JSON.parse(data[i]));
            layerMunicipio.push(L.geoJSON(municipio[i], { color: 'rgb(66,66,66)' }).bindPopup(`<p>Municipio: ${municipio[i].properties.Municipio}</br> Estado:${municipio[i].properties.Estado}`))
            //layerMunicipio[i].addTo(map)
            //drawnItems.addLayer(layerMunicipio[i]);

            map.addLayer(layerMunicipio[i]);

            layerMunicipio[i].addEventListener('mouseover', () => {

                layerMunicipio[i].setStyle({ fillColor: "rgb(165,39,20)", }, { draggable: true }, { color: 'rgb(165,39,20)' });
            })
            layerMunicipio[i].addEventListener('mouseout', () => {

                layerMunicipio[i].resetStyle();
            })

            layerMunicipio[i].addEventListener('click', () => {

                layerMunicipio[i].setStyle({ draggable: true });
            })

        })
        bntSearchMun.style.background = '#146eb4';
    }
}

//FUNCION QUE AGREFA UNA CALLE VECTORIZADA AL MAPA

function removeStreet(length) {
    if (length > 0) {
        for (i = 0; i < length; i++) {
       div.removeChild(d[i]);
            layer[i].remove();
        }
        d = [];
        popup = [];
        calle = [];
        layer = [];
        lat = []
        lang = []

    }

}
function removeStreet2(length) {
    if (length > 0) {
        for (i = 0; i < length; i++) {
       //div.removeChild(d[i]);
            layer[i].remove();
        }
        d = [];
        popup = [];
        calle = [];
        layer = [];
        lat = []
        lang = []

    }

}
let resultados = document.getElementById("resultados");
let contenedor = document.getElementById("contenedor");
function addStreet(data) {


    if (d.length > 0) {
        removeStreet(d.length)
    }

    if (data.length <= 0) {

        alert("Los criterios de busqueda no regresan resultados, por favor verificalos y vuelve a intentarlo")
    }
    else {

        data.forEach((element, i) => {

            calle.push(JSON.parse(data[i]))
            popup.push(
                `<table>
        <tr>
        <td>CALLE:</td>
        <td>${calle[i].properties.Calle}</td>
        </tr>
        <tr>
        <td>ESQUINA 1:</td>
        <td>${calle[i].properties['Esquina 1']}</td>
        </tr>
        <tr>
        <td>ESQUINA 2:</td>
        <td>${calle[i].properties['Esquina 2']}</td>
        </tr>
        <tr>
        <td>COLONIA:</td>
        <td>${calle[i].properties['Colonia']}</td>
        </tr>
        <td>CODIGO POSTAL:</td>
        <td>${calle[i].properties['Codigo postal']}</td>
        </tr>
        <td>MUNICIPIO:</td>
        <td>${calle[i].properties['Municipio'].toUpperCase()}</td>
        </tr>
        <td>ESTADO:</td>
        <td>${calle[i].properties['Estado'].toUpperCase()}</td>
        </tr>
        <td>MARCA:</td>
        <td>${calle[i].properties['Marca'].toUpperCase()}</td>
        </tr>
        </table>`
            )

            layer.push(L.geoJSON(calle[i], { weight: 5 }).bindPopup(popup[i]));
            map.addLayer(layer[i]);
            d[i] = document.createElement("div");
            d[i].innerHTML = popup[i];

            div.append(d[i]);

            lang.push(calle[i].geometry.coordinates[0][0][1]);
            lat.push(calle[i].geometry.coordinates[0][0][0]);

            d[i].addEventListener('click', () => {
                map.flyTo([lang[i], lat[i]], 18)
                layer[i].resetStyle();
                layer[i].setStyle({ color: 'red' })
                layer[i].openPopup();


            })

        })

        map.setView([lang[0], lat[0]], 18)
    }
}




async function addColonia(data) {

    if (colonia.length > 0) {
        colonia.forEach((element, i) => {
            map.removeLayer(layerColonia[i])

        })
        colonia = []
        layerColonia = []

        btnColonias.style.background = '#d7d7d8';
    }

    else {
        await data.forEach((element, i) => {


            colonia.push(JSON.parse(data[i]));

            layerColonia.push(L.geoJSON(colonia[i], {
                draggable: true // to move polygon , add this 
            }).bindPopup(`<table>
        <tr>
        <td>COLONIA:</td>
        <td>${colonia[i].properties.Colonia}</td>
        </tr>
        <tr>
        <td>COD POSTAL:</td>
        <td>${colonia[i].properties["Codigo Postal"]}</td>
        </tr>
        <tr>
        <td>MUNICIPIO:</td>
        <td>${colonia[i].properties.Municipio.toUpperCase()}</td>
        </tr>
        <tr>
        <td>ESTADO:</td>
        <td>${colonia[i].properties.Estado.toUpperCase()}</td>
        </tr>
        </table>`))
            //layerColonia[i].addTo(map)
            // drawnItems.addLayer(layerColonia[i], { color: 'black' });
            map.addLayer(layerColonia[i].bringToBack(), { color: 'black' });
            layerColonia[i].addEventListener('mouseover', () => {

                layerColonia[i].setStyle({ fillColor: "#4B1BDE" }, { color: 'red' });
            })
            layerColonia[i].addEventListener('mouseout', () => {

                layerColonia[i].resetStyle();

            })


        });
        btnColonias.style.background = '#146eb4';
    }

}

let codigoPostal = new Array();
let layerCodigoPostal = new Array();

function addCodigoPostal(data) {
     
    if(codigoPostal.length>0){
        codigoPostal.forEach((element,i)=>{
       map.removeLayer(layerCodigoPostal[i])
        })
        codigoPostal=[]
        layerCodigoPostal=[]
        btnCp.style.background = '#d7d7d8';

    }
   else{     

    data.forEach((element, i) => {
        codigoPostal.push(JSON.parse(data[i]));
        //console.log(codigoPostal[i])
        layerCodigoPostal.push(L.geoJSON(codigoPostal[i]).bindPopup(`<p>CÓDIGO POSTAL: ${codigoPostal[i].properties.codigo_postal.toUpperCase()} </br>
         MUNICIPIO: ${codigoPostal[i].properties.Municipio.toUpperCase()}
        `))
        layerCodigoPostal[i].addTo(map)
        layerCodigoPostal[i].addEventListener('mouseover', () => {

            layerCodigoPostal[i].setStyle({ fillColor: "#4B1BDE" }, { color: 'red' });
        })
        layerCodigoPostal[i].addEventListener('mouseout', () => {

            layerCodigoPostal[i].resetStyle();

        })

    })
    btnCp.style.background = '#146eb4';

  }
}

//evento que al hacer click realiza una busqueda en nominatim
const nominatimSearch = async (query) => {

    await fetch(`https://nominatim.openstreetmap.org/search?q=${query}&format=geojson`)

        .then(response => response.json())

        .then(data => {

            if (data.features.length == 0) {

                alert(`Los criterios de busqueda no regresan resultados,
                 por favor verificalos y vuelve a intentarlo`)
            }
            else {
                addDir(data)
            }
        });


}


btnSearch.addEventListener('click', async () => {
    let query = document.getElementById("query").value;

    nominatimSearch(query)

})

// evento que al hacer click en el boton estados  realiza una peticion a la api sobre los municipios
bntSearchMun.addEventListener('click', async () => {
    let id_Estado = document.getElementById("Estados").value;

    await fetch(`http://localhost:3000/Municipios/${id_Estado}`)
        .then(response => response.json())
        .then(data => { //console.log(data.features[0].geometry.coordinates)
            // console.log(data)
            addMunicipio(data)
        });
})

// evento que al hacer click en el boton estados  realiza una peticion a la pi sobre los estados
bntSearchEs.addEventListener('click', async () => {

    await fetch(`http://localhost:3000/Estados`)
        .then(response => response.json())
        .then(data => { //console.log(data.features[0].geometry.coordinates)
            // console.log(data)
            addEstado(data)
        })
})
//codigos postaes
btnCp.addEventListener('click', async () => {
    let id_Estado = document.getElementById("Estados").value;
    await fetch(`http://localhost:3000/Codigos/${id_Estado}`)
        .then(response => response.json())
        .then(data => { //console.log(data.features[0].geometry.coordinates)
            // console.log(data)
            addCodigoPostal(data)
        })
})

//funcion que al hacer click busca una direccion en la bd
txtBntSearch.onclick = async () => {

    let txtSearchCalle = document.getElementById("txtSearchCalle").value.toUpperCase();
    let txtSearchEsquina = document.getElementById("txtSearchEsquina").value.toUpperCase();
    let idEstado = document.getElementById('EstadosbAb').value;
    let txtColonia = document.getElementById('txtColonia').value.toUpperCase();
    let query;
    if (txtSearchCalle == "") {
        alert("Ingresa El nombre de una calle")
    }


    else {

        if (txtSearchEsquina == "") {
            txtSearchEsquina = 'NA'
        }
        if (txtColonia == "") {
            txtColonia = 'NA'
        }

        query = `http://localhost:3000/${txtSearchCalle}/${txtSearchEsquina}/${txtColonia}/${idEstado}`
        console.log(query)



        await fetch(`${query}`)
            .then(response => response.json())
            .then(data => {

                if (data.length <= 0) {

                    alert("Los criterios de busqueda no regresan resultados, por favor verificalos y vuelve a intentarlo")
                }
                else {
                    addStreet(data)

                }
            });
    }

}

const btnFiltro = document.getElementById("btnFiltro");
btnFiltro.onclick = function () {

    modal2.style.display = "block";

    body.style.position = "static";

    body.style.height = "100%";
    body.style.overflow = "hidden";


}

btn.onclick = function () {
    modal.style.display = "block";

    body.style.position = "static";

    body.style.height = "100%";
    body.style.overflow = "hidden";

}

span2.onclick = function () {
    modal2.style.display = "none";

    body.style.position = "inherit";
    body.style.height = "auto";
    body.style.overflow = "visible";
}


span.onclick = function () {
    modal.style.display = "none";

    body.style.position = "inherit";
    body.style.height = "auto";
    body.style.overflow = "visible";
}


btnColonias.addEventListener('click', async () => {
    let estado = document.getElementById("Estados").value;

    let query = `http://localhost:3000/Colonias/${estado}`;
    await fetch(`${query}`)
        .then(response => response.json())
        .then(data => {

            addColonia(data)
        })

})


/*map.addEventListener("dblclick",(e)=>{
    mymarker =new L.Marker(e.latlng,{draggable:true});

    map.addLayer(mymarker)
   let query=`${e.latlng.lat},${e.latlng.lng}`
   nominatimSearch(query)
})
*/
const txtBntSearchFiltro = document.getElementById("txtBntSearchFiltro")
txtBntSearchFiltro.addEventListener('click', async () => {
    let estadosFiltro = document.getElementById("estadosFiltro").value;

    let capa = document.getElementById("Capa").value;
    let txtFiltro = document.getElementById("txtFiltro").value.toUpperCase();
    let query = `http://localhost:3000/Filtrar${capa}/${estadosFiltro}/${txtFiltro}`;
    await fetch(`${query}`)
        .then(response => response.json())
        .then(data => {
            addFiltro(data, capa)
        })

})

let municipioFiltro = [];
let coloniaFiltro = [];
let codigoFiltro = [];
let layerFiltro = [];
function addFiltro(data, Capa) {

    if (Capa == "Municipio") {
        if (municipioFiltro.length > 0) {
            municipioFiltro = [];
            layerFiltro = [];

        }
        else {
            data.forEach((element, i) => {
                municipioFiltro.push(JSON.parse(data[i]))
                layerFiltro.push(L.geoJSON(municipioFiltro[i]).bindPopup(`<p>Municipio: ${municipioFiltro[i].properties.Municipio}</br> Estado:${municipioFiltro[i].properties.Estado}`))
                map.addLayer(layerFiltro[i])
                map.setView([municipioFiltro[0].properties.Centroide.coordinates[1], municipioFiltro[0].properties.Centroide.coordinates[0]], 10)

            })
        }
    }

    else if (Capa == "Colonia") {

        if (coloniaFiltro.length > 0) {
            coloniaFiltro = [];
            layerFiltro = [];

        }
        else {
            data.forEach((element, i) => {
                coloniaFiltro.push(JSON.parse(data[i]))
                layerFiltro.push(L.geoJSON(coloniaFiltro[i]).bindPopup(`<table>
            <tr>
            <td>COLONIA:</td>
            <td>${coloniaFiltro[i].properties.Colonia}</td>
            </tr>
            <tr>
            <td>COD POSTAL:</td>
            <td>${coloniaFiltro[i].properties["Codigo Postal"]}</td>
            </tr>
            <tr>
            <td>MUNICIPIO:</td>
            <td>${coloniaFiltro[i].properties.Municipio.toUpperCase()}</td>
            </tr>
            <tr>
            <td>ESTADO:</td>
            <td>${coloniaFiltro[i].properties.Estado.toUpperCase()}</td>
            </tr>
            </table>`))
                map.addLayer(layerFiltro[i])
                map.setView([coloniaFiltro[0].properties.Centroide.coordinates[1], coloniaFiltro[0].properties.Centroide.coordinates[0]], 14)

            })
        }
    }
    else if (Capa == "CodigoPostal") {
        if (codigoFiltro.length > 0) {
            codigoFiltro = []
            layerFiltro = []
        }

        else {
            data.forEach((element, i) => {
                codigoFiltro.push(JSON.parse(data[i]));
                //console.log(codigoPostal[i])
                layerFiltro.push(L.geoJSON(codigoFiltro[i]).bindPopup(`<p>CÓDIGO POSTAL: ${codigoFiltro[i].properties.codigo_postal.toUpperCase()} </br>
             MUNICIPIO: ${codigoFiltro[i].properties.Municipio.toUpperCase()}`))
                map.addLayer(layerFiltro[i])
                map.setView([codigoFiltro[0].properties.Centroide.coordinates[1], codigoFiltro[0].properties.Centroide.coordinates[0]], 14)

            })
        }
    }


}

const getSite = async (marca) => {

    let query = `http://localhost:3000/sites/${marca}`;
    await fetch(`${query}`)
        .then(response => response.json())
        .then(data => {
            addSite(data,marca)
        })
}

siteLayer = []
site = []
tz = []
layerTz = []

function addSite(data,marca) {
    if (site.length > 0) {
        site.forEach((element, i) => {

            map.removeLayer(siteLayer[i])

        })
        siteLayer = []
        site = []
                btnColonias.style.background = '#d7d7d8';

    }
    else {
      
const myIcon = L.icon({
    iconUrl: `../imagenes/${marca}.png`,
    iconSize: [30, 30]
});

        data.forEach((element, i) => {

            site.push(JSON.parse(data[i]))

            siteLayer.push(L.geoJSON(site[i], {
                pointToLayer: function (geoJsonPoint, latlng) {
                    return L.marker(latlng, {
                        icon: myIcon
                    });
                }
            }).bindPopup(`<table>
         <tr>
         
         <td>${site[i].properties.CC}</td>
         </tr>
         <tr>
         <td>${site[i].properties.Nombre}</td>
         </tr>
         <tr>
         <td>${site[i].properties.Campaña.toUpperCase()}</td>
         </tr>
         <tr>
         <td>${site[i].properties.Marca.toUpperCase()}</td>
         </tr>
         <tr>
         <td>DIRECCION:</td>
         </tr>
         <tr>
        <td>${site[i].properties.DIRECCION}</td>
         </tr>
         <tr>
        <td>${site[i].properties["NUM EXT"]}</td>
         </tr>
         <tr>
        <td>${site[i].properties.Colonia}</td>
         </tr>
         <tr>
         <td>${site[i].properties.Municipo}</td>
          </tr>
          <tr>
         <td>${site[i].properties.Estado}</td>
          </tr>
         </table>`))
            
            map.addLayer(siteLayer[i])

        })
    }
}

function addTz(data,id) {
    const btnmarca=document.getElementById(id)

    
    if (tz.length > 0) {
        tz.forEach((element, i) => {

            map.removeLayer(layerTz[i])

        })
        layerTz = []
        tz = []

        btnmarca.style.background = '#d7d7d8';

    }
    else {
        data.forEach((element, i) => {
            tz.push(JSON.parse(data[i]))
            layerTz.push(L.geoJSON(tz[i], { color: 'rgb(165,39,20)', fillColor: 'rgb(117,117,117)' }).bindPopup(`<p>CC: ${tz[i].properties["CC"]}</p>Marca: ${tz[i].properties["Marca"]}`))
            map.addLayer(layerTz[i].bringToBack())
        })
    
    
        btnmarca.style.background = '#146eb4';
    }
    
}
const getTz = async (marca,id) => {
    let query = `http://localhost:3000/tz/${marca}`;
    await fetch(`${query}`)
        .then(response => response.json())
        .then(data => {

            addTz(data,id)
        })

}

const btnPh=document.getElementById('btnPh')

btnPh.addEventListener('click', () => {
    
    getSite(btnPh.value);

    getTz(btnPh.value, btnPh.id);
})

const btnKFC = document.getElementById('btnKFC');
//btnKFC.addEventListener('click',getTz())
btnKFC.addEventListener('click', () => {
    
    getSite(btnKFC.value);
    getTz(btnKFC.value,btnKFC.id );
})

//addEventListener('click'