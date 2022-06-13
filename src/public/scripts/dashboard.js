let canvas = document.getElementById("myCanvas");
const btnTotales = document.getElementById("btnTotales");
let selectUsuario = document.getElementById("selectUsuario");
let selectFecha = document.getElementById("selectFecha");
const btnFiltrar=document.getElementById('btnFiltrar');
let selectSupervisor=document.getElementById('selectSupervisor')
let btnFiltrarSupervisor=document.getElementById('btnFiltrarSupervisor')
let btnReporte=document.getElementById('btnReporte')


let usuarios = [];
let solicitudes = [];
let fechas = [];
let rutas=[];
let nPeticiones=[]
let usuario;
let peticiones;
let options=[];
let optionsUsuario = [];

window.onload=()=>{

  getSupervisor();
  getDataSolicitudes();
  getData();
  usuario = usuarios;
  peticiones = solicitudes;
  generarGrafica(usuario, peticiones);
}

const getData = async (supervisor) => {
  await fetch(`http://localhost:3000/usuarios/peticiones/${supervisor}`)
    .then((response) => response.json())
    .then((data) => {
      console.log(data)
      //console.log(data.features[0].geometry.coordinates)
      getPeticiones(data);
      getUsers(data);
      agregarUsuarios(usuarios);
    });
};

const getDataSolicitudes = async () => {
  await fetch(`http://localhost:3000/usuarios/solicitudes`)
    .then((response) => response.json())
    .then((data) => {
      getFechas(data);
      return data;
    });
};

const agregarUsuarios = (usuario) => {

  let data = [];
  
  if(optionsUsuario.length>=0)
  {
    optionsUsuario.forEach((element,i)=>{
      selectUsuario.removeChild(optionsUsuario[i])
    })
    optionsUsuario=[]
  }
  data = usuario;
  if (usuario) {
    for (let i = 0; i < usuario.length; i++) {
      optionsUsuario[i] = document.createElement("OPTION");
      optionsUsuario[i].setAttribute("value", `${usuario[i]}`);
      let t = document.createTextNode(`${usuario[i]}`);
      optionsUsuario[i].appendChild(t);
      selectUsuario.appendChild(optionsUsuario[i]);
    }
  }
};

const getUsers = (data) => {
  if(usuarios.length>0)
  {
    usuarios=[]
  }
  data.forEach((element, i) => {
    usuarios.push(data[i].usuario);
  });
  return usuarios;
};

const getPeticiones = (data) => {
  data.forEach((element, i) => {
    solicitudes.push(data[i].Solicitudes);
  });
  return solicitudes;
};

const getFechas = (data) => {
  //let fechas=[];
  //fechas.push(data[0].fecha)
  //console.log(fechas)
  data.forEach((element, i) => {
    fechas.push(data[i].fecha);
  });

  let date = new Set(fechas);

  date = [...date];

  let fechaCFormato = date.map((item) => {
    return item.replace(/T05:00:00.000Z/g, "");
  });

  let options = [];

  for (let i = 0; i < fechaCFormato.length; i++) {
    options[i] = document.createElement("OPTION");
    options[i].setAttribute("value", `${fechaCFormato[i]}`);
    let t = document.createTextNode(`${fechaCFormato[i]}`);
    options[i].appendChild(t);
    selectFecha.appendChild(options[i]);
  }
};

const generarGrafica = (usuario, peticiones) => {
  
  window.chart = new Chart(canvas, {
    type: "bar",
    data: {
      labels: usuario,
      datasets: [
        {
          label: "Solicitudes Totales",
          data: peticiones,
          backgroundColor: [
            "rgba(255, 99, 132, 0.2)",
            "rgba(54, 162, 235, 0.2)",
            "rgba(255, 206, 86, 0.2)",
            "rgba(75, 192, 192, 0.2)",
            "rgba(153, 102, 255, 0.2)",
            "rgba(255, 159, 64, 0.2)",
          ],
          borderColor: [
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(153, 102, 255, 1)",
            "rgba(255, 159, 64, 1)",
          ],
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
};

const getFiltro=async(usuario,fecha)=>{
  await fetch(`http://localhost:3000/filtrarsolicitudes/${usuario}/${fecha}`)
  .then((response) => response.json())
  .then((data) => {
    filtrarGrafica(data);
    btnReporte.addEventListener('click',()=>{
    generarReporte(data);
    })
  });
}


const filtrarGrafica=(data)=>{
  
  if(window.chart){
  window.chart.clear();
  window.chart.destroy();
  rutas=[];
  nPeticiones=[]
  }

data.forEach((element,i)=>{
rutas.push(data[i].ruta)
nPeticiones.push(data[i].Solicitudes)
rutas[i]=rutas[i].replace(/\d/g, '')
})
console.log('Esta es la data', data)
generarGrafica(rutas,nPeticiones)
}

btnFiltrar.addEventListener('click',()=>{
getFiltro(selectUsuario.value,selectFecha.value)
})

const getSupervisor=async()=>{
  await fetch(`http://localhost:3000/usuarios/supervisores`)
  .then(response => response.json())
  .then(data => {
      addSupervisor(data)
  })
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

btnFiltrarSupervisor.addEventListener('click',()=>{
  console.log(selectSupervisor.value)
  getData(selectSupervisor.value)
})

const generarReporte=(data)=>{
console.log(data)
let arrayUsuarios=[];
data.forEach((element,i)=>{
arrayUsuarios.push(data[i])
})
let newJson=(arrayUsuarios)
let workSheet=XLSX.utils.json_to_sheet(newJson)
let workBook=XLSX.utils.book_new()
XLSX.utils.book_append_sheet(workBook,workSheet,'Coordenadas')
XLSX.writeFile(workBook,'reporte.xlsx')
}