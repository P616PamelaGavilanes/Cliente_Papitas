import { TYPES } from "../actions/shoppingActions";//tipos de acciones para el carrito
import Cookies from "universal-cookie/es6";
export let statecar=[{//objeto que manejara el carrito de compras
            id:null,
            producto:[],
            cantidad:0,
        }
]
/* Reducer maneja la comunicacion ente el componente de inicio u componente del carrito */
export function reducer(state, productoEle,hay, cantidadU){//
    const cookieCart = new Cookies();//instancia de cookies
    switch (state) {
        case TYPES.ADD_TO_CART:{// si el estado de accion es "agregar al carrito"
            if(hay===false){//Identifica si hay algo en el carrito
                statecar.forEach(function(currentValue, index, arr){
                    if(currentValue.id===null){//elimina los elementos que tengan un id vacio
                        statecar.splice(0,3);     
                     }
                    })
                    return (
                        {...statecar.push({id:1,producto:productoEle,cantidad:cantidadU})}, //agrega el primer elemento al carrito
                        cookieCart.set('carrito',statecar,{path:'/'}) //guardar en las cookies con el nombre 'carrito'
                    );   
            }else{//Ya hay elementos en el carrito
                statecar = cookieCart.get('carrito');//obtener cookies
                console.log(statecar);
                if(statecar.length){//identificas si hay algun elemento en el objeto 
                    const la  = statecar[statecar.length - 1].id;//definir id al objeto seleccionado
                    return ({...statecar.push({id:la+1,producto:productoEle,cantidad:cantidadU})},//al antiguo estado aumentarle el elemento seleccionado
                    cookieCart.set('carrito',statecar,{path:'/'})//cambiar valor de cookie
                    );
                }else{
                    return ({...statecar.push({id:1,producto:productoEle,cantidad:cantidadU})},//si el objeto esta basio , asignar al objeto id = 1
                    cookieCart.set('carrito',statecar,{path:'/'}));
                }
            }
        }
        default:
            return state;
    }
}
export function reducerDeteteCart(state, id, enCarrito){//elimina el elemento del carrito
    const cookieCart = new Cookies();
    enCarrito.forEach(function (index){//recorrer conjunto de objeto 
        if(index.id===id){
            enCarrito.splice(index,1); //eliminar elemento si coincide co el id 
            cookieCart.set('carrito',enCarrito,{path:'/'});//cambio de valor de cookie
            window.location.assign('http://localhost:3000/carrito');
        }
});
     
}