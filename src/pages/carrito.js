import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/UserRegistrer.css';
import Navbar from '../Navbar/navbar';
import Cookies from 'universal-cookie/es6';
import '../css/Carrito.css';
import {initAxiosInterceptor } from '../services/auth-helpers';
import { RealizarOrden, RealizarDeatalle } from '../services/CargarUser';
import {reducerDeteteCart } from '../reducers/shoppingReducer';
import { TYPES } from '../actions/shoppingActions';
const url = 'http://localhost:8080/'
initAxiosInterceptor();
class Carrito extends React.Component {
    constructor ( ){
        super();
        this.state={
            carrito:[],
            productos:[],
            autentificado : false,
            usuario : null,
            arrayGen : []
        }
    }
    eliminarRepetidos(ArrayCookies){// elimina los elementos repetidos del carrito
        ArrayCookies.forEach((element)=>{
            this.state.arrayGen.push(element)// los elementos del array los guarda en arrayGen
            const data = this.state.arrayGen;
            const itemsRepeated = {};
            const unique = [];
            for (let i = 0; i < data.length; i++) {
                const item = data[i];//recorre cada elemento del array data
                if ( !itemsRepeated[item.producto.name]) {
                    itemsRepeated[item.producto.name] = item.producto.name;// si el nombre coincide , significa que esta eligiendo el mismo elemento
                    unique.push(item);//guarda los no repetidos en la variable unique
                }
            }
            console.log(unique)
            this.setState({carrito:unique});// el carrito ahora solo tiene variables no repetidos
        });
    }
    componentDidMount(){
        const cookies = new Cookies();// al iniciar se obtiene las cookies
        if(cookies.get('carrito')){
            this.eliminarRepetidos(cookies.get('carrito'));//obtiene las cookies con el nombre  carrito
        }
    }
    calcularSubtotal(cantidad,precio){// multiplica cantidad * precio y retorna un subtotal
        if(cantidad && precio){
            let subtotal = cantidad*precio;
            return subtotal;
        }else{
            return 0;
        }
        
    }
    calcularTotal(){//
        let suma= 0 ;
        var total  = this.state.carrito.map(function(num) {// recorre los elementos del carrito 
            let subtotal = num.cantidad*num.producto.price;// de cada elemento toma la cantidad y precio // subtotal
            return subtotal;
        });
            total.forEach (function(numero){// realiza la suma de los subtotales guardados 
                if(!isNaN(numero)){// si todos tienen valor diferente a ninguno , la suma se realiza 
                    suma += numero;
                }
            });
           return suma;
    }
    async Comprar(total){// se guarda primero la orden con el total
        await RealizarOrden('http://localhost:3000/login',url,total);
        try {
            this.state.carrito.map((ele) => {// se guarda cada detalle de compra en la base de datos 
                 return RealizarDeatalle('http://localhost:3000/login',ele.producto.id,ele.cantidad, ele.producto.name)
            })
            //alert("Compra realizada con exito");
            
        } catch (error) {
            alert("Error, no se realizo la compra");
        }
    }
    DeleteCart=(idProducto)=>{
        if(idProducto){
            reducerDeteteCart(TYPES.ADD_TO_CART,idProducto,this.state.carrito);// llama al reducer eliminar del carrito
            alert('Producto eliminado del carrito')
        }
    }
    render(){
        let elementos  = this.state.carrito;
        return(
            <div>
                <Navbar/>
                <br/><br/>
                <h4 class="media-heading">Productos Agregados </h4>
                <br/>
                            <div class="container">
                                <div class="row">
                                    <div class="">
                                        <table class="table table-hover">
                                            <thead>
                                                <tr>
                                                    <th>Producto</th>
                                                    <th>Cantidad</th>
                                                    <th class="text-center">Precio</th>
                                                    <th class="text-center">Sub total</th>
                                                    <th> </th>
                                                </tr>
                                            </thead>
                                            <tbody>                       
                                                {elementos.map((item, index) => (
                                                         <tr>
                                                         <td class="col-sm-8 col-md-6">
                                                         <div class="media">
                                                             <a class="thumbnail pull-left" href="/"> <img class="media-object" src={item.producto.image} alt="Card"width= '72px'  height= '72px'/> </a>
                                                             <div class="media-body">
                                                                 <p class="media-heading">{item.producto.name}</p>
                                                                 <span>Status: </span><span class="text-success"><strong>{item.producto.productStatus==='AVAILABLE'?'En Stok':item.producto.productStatus}</strong></span>
                                                             </div>
                                                         </div></td>
                                                         <td class="col-sm-1 col-md-1"><strong></strong>{item.cantidad} </td>
                                                         <td class="col-sm-1 col-md-1 text-center"><strong>${item.producto.price}</strong></td>
                                                         <td class="col-sm-1 col-md-1 text-center"><strong>${this.calcularSubtotal(item.cantidad,item.producto.price)}</strong></td>
                                                         <td class="col-sm-1 col-md-1">
                                                         <button type="button" class="btn btn-danger" onClick={()=>{this.DeleteCart(item.id)}}>
                                                             <span class="glyphicon glyphicon-remove"></span> Quitar
                                                         </button></td>
                                                     </tr>
                                                ))}
                                                <tr>
                                                    <td>   </td>
                                                    <td>   </td>
                                                    <td>   </td>
                                                    <td><h5>Total</h5></td>
                                                    <td class="text-right"><h5><strong>${this.calcularTotal()}</strong></h5></td>
                                                </tr>
                                                <tr>
                                                    <td>   </td>
                                                    <td>   </td>
                                                    <td>   </td>
                                                    <td>
                                                    <button type="button" class="btn btn-default">
                                                        <span class="glyphicon glyphicon-shopping-cart"></span> Continuar con la compra
                                                    </button></td>
                                                    <td>
                                                    <button type="button" class="btn btn-success" onClick={()=>{this.Comprar(this.calcularTotal())}}>
                                                        Si <span class="glyphicon glyphicon-play"></span>
                                                    </button></td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
            </div>
        );
    }
}
export default Carrito;