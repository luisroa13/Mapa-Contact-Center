

let map = L.map('map').setView([19.35941466493296, -99.15019173874926], 17);
L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', { maxZoom: 30, subdomains: ['mt0', 'mt1', 'mt2', 'mt3'] }).addTo(map);


const bntSearchEs = document.getElementById("bntSearchEs");
const bntSearchMun = document.getElementById("bntSearchMun");
const btnSearch = document.getElementById("btnSearch");
let marker1 = new Array();
let selectEstado = document.getElementById("Estados");
let modal = document.getElementById("tvesModal");
let btn = document.getElementById("btnBusquedaAvanzada");
let span = document.getElementsByClassName("close")[0];
let body = document.getElementsByTagName("body")[0];
let txtBntSearch = document.getElementById("txtBntSearch");
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



// funcion que añade un estado a el mapa
function addEstado(data) {
    //let estados = L.layerGroup().addTo(map);


    data.forEach((element, i) => {
        estado.push(JSON.parse(data[i]));
        layerEstado.push(L.geoJSON(estado[i], { color: 'rgb(66,66,66)' }).bindPopup(`${estado[i].properties.nombre_estado}`))
        map.addLayer(layerEstado[i]);
        layerEstado[i].addEventListener('mouseover', () => {

            layerEstado[i].setStyle({ fillColor: "blue" }, { color: 'rgb(165,39,20)' });
        })
        layerEstado[i].addEventListener('mouseout', () => {

            layerEstado[i].resetStyle();
        })
    })

}



// Funcion que agrega un marcardor con los datos obtenidos por la api
function addDir(data) {

    if (d.length > 0) {
        removeStreet(d.length)
    }

    //por cada resultado que arroja la api se va agregando un marcador

    data.features.forEach((element, i) => {
        lat.push(data.features[i].geometry.coordinates[1]);
        lang.push(data.features[i].geometry.coordinates[0]);

        d[i] = document.createElement("div");
        d[i].innerHTML = `${data.features[i].properties.display_name}`
        div.append(d[i])
        layer.push(L.marker([lat[i], lang[i]], 16).bindPopup(`${data.features[i].properties.display_name}</br>Coordenadas:${lat[i]},${lang[i]}`));
        map.addLayer(layer[i]);

        d[i].addEventListener('click', () => {
            map.setView([lang[i], lat[i]], 18)
            layer[i].openPopup();
        })
        map.panTo([lat[i], lang[i]], 16);

    })


}



//funcion para añadir municipio al mapa


function addMunicipio(data) {
    //let estados = L.layerGroup().addTo(map);



    data.forEach((element, i) => {

        municipio.push(JSON.parse(data[i]));
        layerMunicipio.push(L.geoJSON(municipio[i], { color: 'rgb(66,66,66)' }).bindPopup(`<p>Municipio: ${municipio[i].properties.Municipio}</br> Estado:${municipio[i].properties.Estado}`))
        map.addLayer(layerMunicipio[i]);
        layerMunicipio[i].addEventListener('mouseover', () => {

            layerMunicipio[i].setStyle({ fillColor: "rgb(165,39,20)" }, { color: 'rgb(165,39,20)' });
        })
        layerMunicipio[i].addEventListener('mouseout', () => {

            layerMunicipio[i].resetStyle();
        })

        layerMunicipio[i].addEventListener('click', () => {

            layerMunicipio[i].setStyle({ draggable: true });
        })

    })


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
            layer.push(L.geoJSON(calle[i],{weight: 5}).bindPopup(popup[i]));
            map.addLayer(layer[i]);
            d[i] = document.createElement("div");
            d[i].innerHTML = popup[i];

            div.append(d[i]);

            lang.push(calle[i].geometry.coordinates[0][0][1]);
            lat.push(calle[i].geometry.coordinates[0][0][0]);

            d[i].addEventListener('click', () => {
                map.flyTo([lang[i], lat[i]], 18)
                layer[i].resetStyle();
                layer[i].setStyle({color:'red'})
                layer[i].openPopup();


            })

        })

        map.setView([lang[0], lat[0]], 18)
    }
}


function addColonia(data) {

    let colonia = new Array();
    let layerColonia = new Array();
    let popupColonia = new Array();
    data.forEach((element, i) => {


        colonia.push(JSON.parse(data[i]));
        popupColonia.push(`<table>
    <tr>
    <td>COLONIA:</td>
    <td>${colonia[i].properties.nom_col}</td>
    </tr>
    <tr>
    <td>COD POSTAL:</td>
    <td>${colonia[i].properties.cod_post}</td>
    </tr>
    <tr>
    <td>MUNICIPIO:</td>
    <td>${colonia[i].properties.nombre_municipio.toUpperCase()}</td>
    </tr>
    <tr>
    <td>ESTADO:</td>
    <td>${colonia[i].properties.nombre_estado.toUpperCase()}</td>
    </tr>
    </table>`)
        layerColonia.push(L.geoJSON(colonia[i], { draggable: true }).bindPopup(popupColonia[i]));


        map.addLayer(layerColonia[i], { color: 'black' });
        layerColonia[i].addEventListener('mouseover', () => {

            layerColonia[i].setStyle({ fillColor: "#4B1BDE" }, { color: 'red' });
        })
        layerColonia[i].addEventListener('mouseout', () => {

            layerColonia[i].resetStyle();

        })


    });

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

// evento que al hacer click en el boton estados  realiza una peticion a la pi sobre los municipios
bntSearchMun.addEventListener('click', async () => {
    let idMunicipio = document.getElementById("Estados").value;

    await fetch(`http://localhost:3000/Municipios/${idMunicipio}`)
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


//funcion que al hacer click busca una direccion en la bd
txtBntSearch.onclick = async () => {

    let txtSearchCalle = document.getElementById("txtSearchCalle").value.toUpperCase();
    let txtSearchEsquina = document.getElementById("txtSearchEsquina").value.toUpperCase();
    let idEstado=document.getElementById('EstadosbAb').value;
    let txtColonia=document.getElementById('txtColonia').value.toUpperCase();
    let query;
    if (txtSearchCalle == "") {
        alert("Ingresa El nombre de una calle")
    }
   

    else {

        if (txtSearchEsquina == "") {
            txtSearchEsquina='NA'
        }
        if (txtColonia == "") {
            txtColonia='NA'
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


btn.onclick = function () {
    modal.style.display = "block";

    body.style.position = "static";

    body.style.height = "100%";
    body.style.overflow = "hidden";

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
        });

})


/*map.addEventListener("dblclick",(e)=>{
    mymarker =new L.Marker(e.latlng,{draggable:true});

    map.addLayer(mymarker)
   let query=`${e.latlng.lat},${e.latlng.lng}`
   nominatimSearch(query)
})
*/
