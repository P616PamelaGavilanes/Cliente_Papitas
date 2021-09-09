import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { deleteToken} from '../services/auth-helpers';
import jwt from 'jwt-decode';
import Cookies from 'universal-cookie/es6';
const ISLOGGET = localStorage.getItem('token');
const URL_REACT = 'http://localhost:3000';
class Navbar extends React.Component {
    constructor ( ){
        super();
        this.state={
            isloget :false,// identifica si esta logueado
            isAdmin:false,// identifica el rol de usuario
            cantidadCarrito:0,
            SelectInventarioValue:0,
            reportesValue:0,
            arrayGen : []
        }
        this.handleChangeInventario = this.handleChangeInventario.bind(this);
        this.handleChangeReportes = this.handleChangeReportes.bind(this);

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
            this.setState({cantidadCarrito:unique.length});// obtiene la cantidad de elementos que esta en el carrito de las cookies
        });
    }
    handleChangeInventario(event){
        this.SelectInventario(event.target.value);
    }
    handleChangeReportes(event){// de acuerdo al elemento elegido en el selec se redirecciona a las diferentes rutas de los componentes 
        switch (event.target.value) {
            case '1':
                window.location.assign(URL_REACT+'/rInventario');
                break;
            case '2':
                window.location.assign(URL_REACT+'/rVentas');
                break;
            case '3':
                window.location.assign(URL_REACT+'/rComprasUsuario');
                break;
            case '4':
                window.location.assign(URL_REACT+'/rUsuarios');
                break;
            case '5':
                window.location.assign(URL_REACT+'/rCaducados');
                break;
            default:
                break;
        }
    }
    SelectInventario(seleccion){// de acuerdo al elemento elegido en el selec se redirecciona a las diferentes rutas de los componentes 
        if(seleccion === '1'){
            window.location.assign(URL_REACT+'/categorias');
        }else if(seleccion === '2'){
            window.location.assign(URL_REACT+'/Productos');
        }else{
            return;
        }
    }
    decodeToken(token){
        let user = jwt(token);//decodifica el token y guarda el objeto en user
        localStorage.setItem('token', token);
        if (user.CLAIM_TOKEN === 'ROLE_ADMIN,ROLE_USER') {this.setState({isAdmin:true})}// si el rol de administrador , is admin cambia de estado a true
    }
    componentDidMount(){// 
        const cookies = new Cookies();
        if(cookies.get('carrito')){// obtiene la cookies 
            this.eliminarRepetidos(cookies.get('carrito'));//obtiene las cookies con el nombre  carrito

        }
        if(ISLOGGET){ //identifica si esta logueado
            this.setState({isloget:true});
            this.decodeToken(ISLOGGET)
        }else{
            this.setState({isloget:false});
        }

    }
    cerrarSecion(){// elimina token y redirecciona 
        deleteToken();
        console.log('Has cerrado sesion');
        window.location.assign('http://localhost:3000/');
    }
    render(){
        return(
            <div>
               <link href="//maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" rel="stylesheet" id="bootstrap-css"/>
                <script src="//maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js"></script>
                <script src="//cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>

                <link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet" integrity="sha384-wvfXpqpZZVQGK6TAh5PVlGOfQNHSoD2xbE+QkPxCAFlNEevoEH3Sl0sibVcOQVnN" crossorigin="anonymous"/>

                <nav class="navbar navbar-expand-md navbar-dark bg-dark">
                    <div class="container">
                        <a class="navbar-brand" href="/">Las papitas E </a>
                        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarsExampleDefault" aria-controls="navbarsExampleDefault" aria-expanded="false" aria-label="Toggle navigation">
                            <span class="navbar-toggler-icon"></span>
                        </button>

                        <div class="collapse navbar-collapse justify-content-end" id="navbarsExampleDefault">
                            <ul class="navbar-nav m-auto">
                                <li class="nav-item">
                                    <a class="nav-link" href="/">Inicio</a>
                                </li>
                                <li class="nav-item">
                                    {/*Presentara el combobox dependiendo de la bandera 'isAdmin' */}
                                {this.state.isAdmin?
                                    <select className="btn btn-dark" value={this.state.SelectInventarioValue} onChange={this.handleChangeInventario} >
                                    <option key = {0} value={0}  disabled= 'true' >Gestión Inventario</option>
                                    <option key = {1} value={1}   >Gestion Categorias/Sub</option>
                                    <option key = {2} value={2}   >Gestion Productos</option>
                                    </select>
                                :null}
                                </li>
                                <li class="nav-item">
                                </li>
                                <li class="nav-item ">
                                     {/*Presentara el combobox dependiendo de la bandera 'isAdmin' */}
                                    {this.state.isAdmin?
                                        <select className="btn btn-dark" value={this.state.reportesValue} onChange={this.handleChangeReportes} >
                                        <option key = {0} value={0}  disabled= 'true' >Reportes</option>
                                        <option key = {1} value={1}   >Inventario</option>
                                        <option key = {2} value={2}   >Ventas</option>
                                        <option key = {3} value={3}   >Compras Por Usuario</option>
                                        <option key = {4} value={4}   >Usuarios</option>
                                        <option key = {5} value={5}   >Productos Caducados</option>
                                        </select>
                                    :null}                                    
                                </li>
                            </ul>
                            <form class="form-inline my-2 my-lg-0">
                                <div class="input-group input-group-sm">
                                    <input type="text" class="form-control" aria-label="Small" aria-describedby="inputGroup-sizing-sm" placeholder="Search..."/>
                                    <div class="input-group-append">
                                        <button type="button" class="btn btn-secondary btn-number">
                                            <i class="fa fa-search"></i>
                                        </button>
                                    </div>
                                </div>
                                <a class="btn btn-success btn-sm ml-3" href="/carrito">
                                    <i class="fa fa-shopping-cart"></i> Carrito
                                    <span class="badge badge-light">{this.state.cantidadCarrito}</span>
                                </a>
                                <ul class="navbar-nav m-auto">
                                <li class="nav-item">
                                    {'    '}
                                {/*Presentara el texto dependiendo de la bandera 'isloget' */}
                                {this.state.isloget?<button class="btn btn-dark" onClick= {this.cerrarSecion} >Cerrar Sesión</button>:<a class="nav-link" href="/login">Iniciar Sesión</a> }
                                </li>
                            </ul>
                            </form>
                        </div>
                    </div>
                </nav>
            </div>
        );
    }
}
export default Navbar;