import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from '../Navbar/navbar';
import '../css/productos.css';
import axios from "axios";
import {reducer } from '../reducers/shoppingReducer';
import { TYPES } from '../actions/shoppingActions';
import Titulo from '../Navbar/titulo';
import Cookies from 'universal-cookie/es6';
const cookies = new Cookies();
const url = 'http://localhost:8080/';
class Home extends React.Component {
    constructor ( ){
        super();
        this.state={
            categories: [],
            categoriesValue:1,
            subcategories: [],
            subcategoriesValue:2,
            productos:[],
            carrito:[],
            carritoCantidad:1,
            productosPrecio:[],
            productoPrecioValue:0,
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleChange1 = this.handleChange1.bind(this);
        this.handleChangeNum= this.handleChangeNum.bind(this);
        this.handleChangePrecios = this.handleChangePrecios.bind(this);
    }
    handleChange(event) {// camvia el valor de la variable value por el que se eligion en el combobox
        this.setState({categoriesValue: event.target.value});
        this.peticion(event.target.value);
    }
    handleChange1(event) {// camvia el valor de la variable value por el que se eligion en el combobox
        this.setState({subcategoriesValue: event.target.value});
        this.peticionProductos(event.target.value);
    }
    handleChangeNum(event) {// camvia el valor de la variable value por el que se eligion en el combobox
        this.setState({carritoCantidad: event.target.value});
    }
    handleChangePrecios(event){
        this.setState({productoPrecioValue: event.target.value});
        this.peticionProductosPrecios(event.target.value);
    }
    componentDidMount() {
        axios.get(url.concat('api/categories')).then(response=>{
                this.setState({categories:response.data})
                console.log(this.state.categories);
        }).catch(error=>{console.log(error.message);});
        this.peticion(1);
        this.peticionProductos(1);
        if(cookies.get('carrito')){// si hay algo guardo en las cookies  guardar estas en la variable 'productos guardados'p
            let productosGuardados = cookies.get('carrito');
            console.log(productosGuardados)
        }

    }
    peticion(value){// llama a subcategorias dependiendo  de las categories
        axios.get(url.concat("api/categories/").concat(value).concat("/subcategories") ).then(response=>{
            this.setState({subcategories:response.data})
            console.log(this.state.subcategories);
        }).catch(error=>{console.log(error.message);})
    }
    peticionProductos(value){// llama a los productos dependiendo de la subcategories
        axios.get(url.concat("api/subcategories/").concat(value).concat("/products") ).then(response=>{
            this.setState({productos:response.data})
            console.log(this.state.productos);
        }).catch(error=>{console.log(error.message);})
    }
    peticionProductosPrecios(rango){
        console.log(rango)
        switch (rango) {// si el selec tiene el codigo 1 consulta los servicios de acuerdo al rpecio desde 1 a 3 dolares 
            case '1':
                    axios.get(url+"api/subcategories/"+this.state.subcategoriesValue+"/products/1/3/price" ).then(response=>{
                        this.setState({productos:response.data})
                        console.log(this.state.productos);
                    }).catch(error=>{console.log(error.message);})
                break;
            case '2':// si el selec tiene el codigo 1 consulta los servicios de acuerdo al rpecio desde 5 a 10 dolares 
                axios.get(url+"api/subcategories/"+this.state.subcategoriesValue+"/products/5/10/price" ).then(response=>{
                    this.setState({productos:response.data})
                    console.log(this.state.productos);
                }).catch(error=>{console.log(error.message);})
            
                break;
            case '3':// si el selec tiene el codigo 1 consulta los servicios de acuerdo al rpecio desde 10 a 20 dolares 
                axios.get(url+"api/subcategories/"+this.state.subcategoriesValue+"/products/10/20/price" ).then(response=>{
                    this.setState({productos:response.data})
                    console.log(this.state.productos);
                }).catch(error=>{console.log(error.message);})
                break;
        
            default:
                break;
        }

    }
    addCart=(producto,cantidad)=>{
        if(cantidad > producto.available){
            return alert('Cantidad no disponible en Stock');
        }
        if(cookies.get('carrito')){// si hay elementos en el carrito avisa al reducer con true 
                reducer(TYPES.ADD_TO_CART,producto,true,cantidad);
                alert('Producto agregado al carrito de compras');
                window.location.assign('http://localhost:3000/');

        }else{// si no hay elementos en el carrito avisa al reducer confalse
                reducer(TYPES.ADD_TO_CART,producto,false,cantidad);
                alert('Producto agregado al carrito de compras');
                window.location.assign('http://localhost:3000/');
        }
    }
    render(){
        return(
            <div>
                <Navbar/>
                <Titulo/>
                <div class="container">
                <div class="row">
                    <div class="col">
                        <nav aria-label="breadcrumb">
                            <ol class="breadcrumb">
                                <li class="breadcrumb-item active" aria-current="page">Inicio</li>
                            </ol>
                        </nav>
                    </div>
                </div>
            </div>
            <div class="container">
                <div class="row">
                    <div class="col-12 col-sm-3">
                        <div class="card bg-light mb-3">
                            <div class="card-header bg-primary text-white text-uppercase"><i class="fa fa-list"></i> Categorias</div>
                            <ul class="list-group category_block">
                            <select className="browser-default custom-select" value={this.state.categoriesValue} onChange={this.handleChange} >
                                {this.state.categories.map(ele =>(<option key = {ele.id} value={ele.id} >{ele.name}</option>))}
                            </select>
                            </ul>
                        </div>
                    </div>
                    <div class="col">
                        <div class="row">
                        <div class="row">
                        <div class="col-sm-3">
                            <div class="form-group">
                            <select className="browser-default custom-select" value={this.state.subcategoriesValue} onChange={this.handleChange1} >
                                <option key = {0} value={0} >Ninguna</option>
                                {this.state.subcategories.map(ele =>(<option key = {ele.id} value={ele.id} >{ele.name}</option>))}
                            </select>
                            </div>
                        </div>
                        <div class="col-sm-3">
                            <div class="form-group"><select className="browser-default custom-select" value={this.state.productoPrecioValue} onChange={this.handleChangePrecios} >
                                <option key = {0} value={0}  disabled= 'true' >Precios</option>
                                <option key = {1} value={1}   >1$ - 3$</option>
                                <option key = {2} value={2}   >5$ - 10$</option>
                                <option key = {3} value={3}   >10$ - 20$</option>
                            </select>
                            </div>
                        </div>
                        </div>
                        {this.state.productos.map((consulta, i) => {
                            return(
                                <div class="col-12 col-md-6 col-lg-4">
                                <div class="card">
                                    <img class="card-img-top" src={consulta.image} alt="Card" width="100" height="200"/>
                                    <div class="card-body">
                                        <h4 class="card-title"><a href="product.html" title="View Product">{consulta.name}</a></h4>
                                        <p class="card-text">{consulta.description}</p>
                                            <div class="col">
                                                <p>Ctd. : {consulta.available} </p>
                                            </div>
                                        <div class="row">
                                            <div class="col">
                                                <p class="btn btn-danger btn-block">{consulta.price} $</p>
                                            </div>
                                            <div className = "col">
                                            <div class="center">  
                                                <div class="input-group">         
                                                    <input  class="form-control input-sm input-number planQuantity"  min="1" max={consulta.available} type="number" value={this.state.carritoCantidad} onChange={this.handleChangeNum} />    
                                                </div>
                                        </div> 
                                            </div>
                                            <div class="col">
                                                <button class="btn btn-success btn-block" onClick={()=>{this.addCart(consulta,this.state.carritoCantidad);}}>Agregar al carrito</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                </div>
                            );
                        })}
                        <br/>
                        <hr/>
                        <div class="col-12">
                            <nav aria-label="...">
                                <ul class="pagination">
                                    <li class="page-item disabled">
                                        <a class="page-link" href="/" tabindex="-1">Previous</a>
                                    </li>
                                    <li class="page-item"><a class="page-link" href="/">1</a></li>
                                    <li class="page-item active">
                                        <a class="page-link" href="/">2 <span class="sr-only">(current)</span></a>
                                    </li>
                                    <li class="page-item"><a class="page-link" href="/">3</a></li>
                                    <li class="page-item">
                                        <a class="page-link" href="/">Next</a>
                                    </li>
                                </ul>
                            </nav>
                        </div>
                       
                    </div>
                </div>
    </div>
</div>
            </div>
        );
    }
}
export default Home;

