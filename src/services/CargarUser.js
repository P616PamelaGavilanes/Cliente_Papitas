import axios from "axios";
import { Spinner } from "reactstrap";
import { getToken } from "./auth-helpers";
const  URL_GENERAL = 'http://localhost:8080/'
//El archivo contiene funciones publicas, pero seran llamadas en base a la authenticacion
export async function LoadUser(locate, request,locatenotoken){//locate: url, request: url a una determinada api, locatenotoken:url 
    if (!getToken()) {// Accion si no tiene token 
        window.location.assign(locate)
        return this.state.autentificado = false; 
    }
    if(locatenotoken){// Accion si hay tiene token 
        window.location.assign(locatenotoken);
    }
    if(request){// obtener cuerpo de un servicio 
        try {
            await axios.get(request).then(response=>{
            }).catch(error=>{console.log(error);})
        } catch (error) {
            console.log(error)
        }
    }
    
}
export async function RealizarOrden(locate, request, totalOrden){
    if (!getToken()) {// si no tiene token lo redirecciona 
        return  window.location.assign(locate)
    }
    if(request){// si hay token peticion al servicio
        const TotalPagar = {
            total:totalOrden,
        };
        try {
            await  axios.post(request+'orders',TotalPagar).then((res)=> {
                <Spinner color='info'/>
                alert("Guardado correctamente");
            }).catch(err => {console.error(err);alert("Campos llenados incorrectamente o incompletos"); }); 
        } catch (error) {
            console.log(error)
        }
    }
    
}
export async function RealizarDeatalle(locate,productoId,cantidad,productoName){
    if (!getToken()) {
        window.location.assign(locate)
    }
    if(URL_GENERAL){
        const cantidadDeatelle = {
            quantity:cantidad,
            productName: productoName
        };
        try {
            const idIrden = await axios.get(URL_GENERAL+"orders/").then(response=>{//Obtener orden o compra 
                if (response.data.length <= 0  ) { 
                    return
                } else {  //si existe orden, tomar la ultima que se agrego a la tabla orden 
                    var  ordenDeUsuario = response.data[response.data.length - 1 ]
                   return ordenDeUsuario.id// retornar el id de la utima orden 
                }
            }).catch(error=>{console.log(error);}); //envia el detalle de la orden al servicio 
            await  axios.post(URL_GENERAL+'orders/'+idIrden+'/products/'+productoId+'/details',cantidadDeatelle).then((res)=> {
                alert('Factura generada con éxito');
                window.location.assign('http://localhost:3000/Orden/'+idIrden)
            }).catch(err => {console.error(err);}); 
        } catch (error) {
            console.log(error)
        }
    }

}