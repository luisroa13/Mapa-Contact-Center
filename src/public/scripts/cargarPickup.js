const datosPickup= document.getElementById('datosPickup')


datosPickup.addEventListener('change', (e) => {
    let reader = new FileReader()
    reader.readAsText(datosPickup.files[0])
    reader.onload=()=>{
    let obj=[]
    let texto=reader.result.split('\n')
    texto.pop()
    let cabeceras=texto[0].split(',')
    //texto.pop()
    console.log(texto)    
    for(let i=1;i<texto.length;i++)
    {

    let llaves=texto[i].split(',')
    
    const indexedUsers = cabeceras.reduce((acc, el,i) => ({
      ...acc,
      [el]: llaves[i],
      }), {})
       obj.push(indexedUsers)
      }
    console.log(JSON.stringify({...obj}))
    } 
   }
)
