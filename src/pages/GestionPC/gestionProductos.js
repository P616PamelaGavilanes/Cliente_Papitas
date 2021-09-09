import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import jwt from 'jwt-decode';
import Navbar from '../../Navbar/navbar';
import { initAxiosInterceptor } from '../../services/auth-helpers';
import { faTrashAlt, faEye, faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Modal, ModalBody, ModalFooter} from 'reactstrap';
import axios from 'axios';
import '../../css/ProductoViewModal.css';
const url = 'http://localhost:8080';
const ISLOGGET = localStorage.getItem('token');
initAxiosInterceptor();
class gestionProductos extends React.Component {
    constructor ( ){
        super();
        this.state={// inicializacion de variables 
            categoriesValue:0,
            categories:[],
            subcategoriesValue:0,
            subcategories:[],
                id:null,
                name: null,
                slug: null,
                description: null,
                image:null,
                price: 0,
                quantity: 0,
                expiredAt: 0,
                productStatus:0,
            productos:[],
            modal:false,
            modalid:0,
        }
        this.handleChangeCategories = this.handleChangeCategories.bind(this);//funciones que controlan el cambio de estado del conbobox de las categorias 
        this.handleChangeSubcategories = this.handleChangeSubcategories.bind(this);///funciones que controlan el cambio de estado del conbobox de las categorias
        this.handleChangeIn = this.handleChangeIn.bind(this);///funciones que controlan el cambio de estado del los input del formulaario
    }
    handleChangeCategories(event) {
        this.setState({categoriesValue: event.target.value});// obtiene el id de la categoria 
        this.getSubCategorias(event.target.value);// llama a las subcategorias de la categoria seleccionada 
    }
    handleChangeSubcategories(event) {
        this.setState({subcategoriesValue: event.target.value});//subcategoriesValue contiene el id de la subcategorias
        this.getProductos(event.target.value);// llama a los productos de la subcategoria seleccionada
    }
    handleChangeIn(event) {
        this.setState({[event.target.name]: event.target.value});// el valor de la variable es igual al dato ingresado en el input, 
        //el valor del id y name del inpu debe tener el mismo nombre de la variable
    }
    handleSubmit = e =>{//enviar formulario para agregar producto
        e.preventDefault();
        const producto = {// crear cuerpo de envio al servicio con los datos actuales guardados en el estado del formulario
            name: this.state.name,
            slug: '',
            description: this.state.description,
            image:this.state.image,
            price: parseFloat(this.state.price),// cambiar string a float 
            quantity:parseInt(this.state.quantity),//cambiar string a int
            expired_at:this.state.expiredAt
        };
        console.log(producto)
        if(this.state.subcategoriesValue ===0){// verificar si a elejido una categoria 
            return alert('Debe elegir una categoria')
        }else{
            axios.post(url+'/admin/subcategories/'+this.state.subcategoriesValue+'/products', producto).then(()=> {//agregar producto con subcategoria guardade en el estado
                alert("Producto agregado correctamente");
                e.target.reset();//limpiar formulario
                this.componentDidMount()// recargar datos
            }).catch(err => {console.error(err);alert("Campos llenados incorrectamente o incompletos");e.target.reset(); });    
        }
    }
    handleSubmitEdit = e =>{// es el mismo proceso que handlesubmil pero la peticion es PUT 
        e.preventDefault();
        const producto = {
            name: this.state.name,
            slug: '',
            description: this.state.description,
            image:this.state.image,
            price: parseFloat(this.state.price),
            quantity:parseInt(this.state.quantity),
            expired_at:this.state.expiredAt
        };
        console.log(producto)
        if(this.state.subcategoriesValue ===0){
            return alert('Debe elegir una categoria')
        }else{
            axios.put(url+'/admin/subcategories/'+this.state.subcategoriesValue+'/products/'+this.state.id+'/update', producto).then(()=> {
                this.setState({modal: false});
                alert("Producto actualizado correctamente");
                window.location.assign('http://localhost:3000/Productos');
            }).catch(err => {console.error(err);alert("Campos llenados incorrectamente o incompletos");e.target.reset(); });    
        }
    }
    getSubCategorias(idCategoria) {//obtiene las sbcategorias y las guarda en la variable subcategories del estado
        axios.get(url.concat("/api/categories/").concat(idCategoria).concat("/subcategories") ).then(response=>{
            this.setState({subcategories:response.data})
        }).catch(error=>{console.log(error.message);})
    }
    getProductos(idSubcategories){//obtiene los productos y las guarda en la variable productos del estado
        axios.get(url+'/api/subcategories/'+idSubcategories+'/products').then(response=>{
            this.setState({productos:response.data})
            console.log(this.state.productos);
        }).catch(error=>{console.log(error.message);})
    }
    async DeleteProduct(id, idSubcategories){// elimina el producto
        axios.delete(url+'/admin/subcategories/'+idSubcategories+'/products/'+id+'/delete').then(response=>{
            this.setState({modal: false});//cierra el modal
             alert('Producto eliminado')
             window.location.assign('http://localhost:3000/Productos');
        }).catch(error=>{alert('No se pudo eliminar');})
    }
    seleccionarProducto(producto){// cambia el estado actual de las variables a las del producto que se recive como parametro
        this.setState({
            id:producto.id,
            name: producto.name,
            description: producto.description,
            image:producto.image,
            price: producto.price,
            quantity: producto.quantity,
            expiredAt: producto.expired_at,
            productStatus:producto.productStatus
        })
    }
    componentDidMount(){
        if(!ISLOGGET){
            return window.location.assign('http://localhost:3000/login');
        }else{
            this.decodeToken(ISLOGGET)
        }
        axios.get(url.concat('/api/categories')).then(response=>{// al iniciar la pagina se llama a las categorias disponibles
            this.setState({categories:response.data})
        }).catch(error=>{console.log(error.message);});
    }
    decodeToken(token){
        let user = jwt(token);
        localStorage.setItem('token', token);
        if (user.CLAIM_TOKEN === 'ROLE_USER') {// si la persona que inicio cesion es usuario no podra ver esta pagina 
            return window.location.assign('http://localhost:3000/');
        }
    }
    render(){
        return(
            <div><Navbar/>
                <br/><br/>
                <h4 className="media-heading">Gestion Productos</h4>
                <div className="container">
                <div class="row">
                    <div class="col-12">
                    <div class="card">
                        <article class="card-body">
                            <form class="form"  onSubmit = {this.handleSubmit}>
                                <legend>Registrar nuevo producto</legend>
                                <div class="form-group">
                                    <div class="container">
                                        <div class="row">
                                            <div class="col-4">
                                                <label for="textinput">Categoria </label>
                                                <div class="col-sm-10">
                                                <select className="browser-default custom-select" value={this.state.categoriesValue} onChange={this.handleChangeCategories} >
                                                    <option key = {0} value={0} >Ninguna</option>
                                                    {this.state.categories.map(ele =>(<option key = {ele.id} value={ele.id} >{ele.name}</option>))}
                                                </select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <div class="container">
                                        <div class="row">
                                            <div class="col-4">
                                                <label for="textinput">Subcategoria</label>
                                                <div class="col-sm-10">
                                                <select className="browser-default custom-select" value={this.state.subcategoriesValue} onChange={this.handleChangeSubcategories} >
                                                    <option key = {0} value={0} >Ninguna</option>
                                                    {this.state.subcategories.map(ele =>(<option key = {ele.id} value={ele.id} >{ele.name}</option>))}
                                                </select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <div class="container">
                                        <div class="row">
                                            <div class="col-4">
                                                <label for="textinput">Nombre * </label>
                                                <div class="col-sm-10">
                                                    <input type="text"  class="form-control" name="name" id="name" placeholder="Nombre" required onChange={this.handleChangeIn}/>
                                                </div>
                                            </div>
                                            <div class="col-4">
                                                <label for="textinput">Precio  *</label>
                                                <div class="col-sm-10">
                                                    <input type="number" step="0.01"  class="form-control" name="price" id="price" placeholder="12.00" required onChange={this.handleChangeIn}/>
                                                </div>
                                            </div>
                                            <div class="col-4">
                                            <label for="textinput">Descripción *</label>
                                                <div class="col-sm-10">
                                                    <textarea  type="text"  class="form-control" name="description" id="description" placeholder="Descripción"  required onChange={this.handleChangeIn} rows="2"></textarea>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <div class="container">
                                        <div class="row">
                                            <div class="col-4">
                                                <label for="textinput">Cantidad *</label>
                                                <div class="col-sm-10">
                                                    <input type="number"  class="form-control" name="quantity" id="quantity" placeholder="2" required onChange={this.handleChangeIn}/>
                                                </div>
                                            </div>
                                            <div class="col-4">
                                                <label for="textinput">Fecha de expiración *</label>
                                                <div class="col-sm-10">
                                                    <input type="date"  class="form-control" name="expiredAt" id="expiredAt" placeholder="12.00" required onChange={this.handleChangeIn}/>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <div class="container">
                                        <div class="row">
                                            <div class="col-4">
                                                <label for="textinput">Imagen *</label>
                                                    <input type="text"  class="form-control" name="image" id="image" placeholder="url" required onChange={this.handleChangeIn}/>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <div class="pull-right">
                                        <button type="submit" className="btn btn-dark">Guardar</button>
                                    </div>
                                </div>
                            </form>
                        </article>
                    </div>
                    </div>
                </div>
                <div class="row">
                    <p>Productos registrados</p>     
                    <div class="container">
                        <div class="row">
                            <div class="col-4">
                                <label for="textinput">Categoria </label>
                                <div class="col-sm-10">
                                <select className="browser-default custom-select" value={this.state.categoriesValue} onChange={this.handleChangeCategories} >
                                    <option key = {0} value={0} >Ninguna</option>
                                    {this.state.categories.map(ele =>(<option key = {ele.id} value={ele.id} >{ele.name}</option>))}
                                </select>
                                </div>
                            </div>
                            <div class="col-4">
                                <label for="textinput">Subcategoria </label>
                                <div class="col-sm-10">
                                    <select className="browser-default custom-select" value={this.state.subcategoriesValue} onChange={this.handleChangeSubcategories} >
                                        <option key = {0} value={0} >Ninguna</option>
                                        {this.state.subcategories.map(ele =>(<option key = {ele.id} value={ele.id} >{ele.name}</option>))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                    <br/><br/>
                    <div>
                        <div class='col-md-12'>
                            <table class="table table-bordered table-condensed table-hover">
                                <thead>
                                    <tr>
                                        <th>Descripción</th>
                                        <th>Precio</th>
                                        <th>Stock</th>
                                        <th>Acción</th>
                                    </tr>
                                </thead>
                                <tbody id="form-list-client-body">
                                    {this.state.productos.map((consulta, i) => {
                                        return(
                                            <tr>
                                                <td class="col-sm-8 col-md-6">
                                                    <div class="media">
                                                        <a class="thumbnail pull-left" href="/"> <img class="media-object" src={consulta.image} alt="Card"width= '72px'  height= '72px'/> </a>
                                                        <div class="media-body">
                                                            <p class="media-heading">{consulta.name}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td class="col-sm-1 col-md-1"><strong>{consulta.price} $</strong></td>
                                                <td class="col-sm-1 col-md-1 text-center"><strong>{consulta.quantity} </strong></td>
                                                <td>
                                                    <button className="btn btn-danger" onClick={()=>{this.seleccionarProducto(consulta); this.setState({modal:true, modalid:1});}}><FontAwesomeIcon icon={faTrashAlt}/></button>
                                                    <button className="btn btn-dark" onClick={()=>{this.seleccionarProducto(consulta); this.setState({modal:true, modalid:2});}}><FontAwesomeIcon icon={faEye}/></button>
                                                    <button className="btn btn-success" onClick={()=>{this.seleccionarProducto(consulta); this.setState({modal:true, modalid:3});}}><FontAwesomeIcon icon={faPencilAlt}/></button>

                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    </div>
                    {this.state.modalid===1?<Modal isOpen={this.state.modal}>
                    <ModalBody>
                        Estás seguro que deseas eliminar: {this.state.name}
                    </ModalBody>
                    <ModalFooter>
                        <button className="btn btn-danger" onClick={()=>this.DeleteProduct(this.state.id,this.state.subcategoriesValue)}>Sí</button>
                        <button className="btn btn-secundary" onClick={()=>this.setState({modal: false})}>No</button>
                    </ModalFooter>
                    </Modal>:null}
                    {this.state.modalid===2?<Modal isOpen={this.state.modal}>
                    <ModalBody>
                    <h4 class="card-title">Producto :{this.state.name}</h4>
                    <br/>
                        <img class="media-object" src={this.state.image} alt="Card"width= '90px'  height= '90px'/>
                            <div class="card-block">
                                <div class="meta">
                                    <h6>Precio : {this.state.price} $</h6>
                                </div>
                                <div class="card-text">Descripción: <br/>{this.state.description}</div>
                            </div>
                            <div class="card-footer">
                                <span class="float-right">Estado : {this.state.productStatus==='AVAILABLE'?'Disponible':'Indisponible'}</span>
                                <span><i class=""></i>Stock : {this.state.quantity}</span>
                            </div>
                    </ModalBody>
                    <ModalFooter>
                        <button className="btn btn-secundary" onClick={()=>this.setState({modal: false})}>Cerrar</button>
                    </ModalFooter>
                    </Modal>:null}
                    {this.state.modalid===3?<Modal isOpen={this.state.modal}>
                    <ModalBody>
                    <h4 class="card-title">Editar Producto :{this.state.name}</h4>
                    <br/>
                    <form class="form" onSubmit = {this.handleSubmitEdit}>
                                <div class="form-group">
                                    <label for="textinput">Categoria </label>
                                    <div class="col-sm-10">
                                        <select className="browser-default custom-select" value={this.state.categoriesValue} onChange={this.handleChangeCategories} >
                                            <option key = {0} value={0} >Ninguna</option>
                                            {this.state.categories.map(ele =>(<option key = {ele.id} value={ele.id} >{ele.name}</option>))}
                                        </select>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label for="textinput">Subcategoria</label>
                                    <div class="col-sm-10">
                                    <select className="browser-default custom-select" value={this.state.subcategoriesValue} onChange={this.handleChangeSubcategories} >
                                        <option key = {0} value={0} >Ninguna</option>
                                        {this.state.subcategories.map(ele =>(<option key = {ele.id} value={ele.id} >{ele.name}</option>))}
                                    </select>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label for="textinput">Nombre * </label>
                                    <div class="col-sm-10">
                                        <input type="text"  class="form-control" name="name" id="name" placeholder="Nombre" required value={this.state.name} onChange={this.handleChangeIn}/>
                                    </div><br/>
                                    <label for="textinput">Precio  *</label>
                                    <div class="col-sm-10">
                                        <input type="number" step="0.01"  class="form-control" name="price" id="price" placeholder="12.00"  value={this.state.price} required onChange={this.handleChangeIn}/>
                                    </div><br/>
                                        <label for="textinput">Descripción *</label>
                                        <div class="col-sm-10">
                                            <textarea  type="text"  class="form-control" name="description" id="description" placeholder="Descripción"  value={this.state.description} required onChange={this.handleChangeIn} rows="2"></textarea>
                                        </div>
                                </div>
                                <div class="form-group">
                                    <label for="textinput">Cantidad *</label>
                                    <div class="col-sm-10">
                                        <input type="number"  class="form-control" name="quantity" id="quantity" placeholder="2" value={this.state.quantity} required onChange={this.handleChangeIn}/>
                                    </div><br/>
                                    <label for="textinput">Fecha de expiración *</label>
                                    <div class="col-sm-10">
                                        <input type="text"  class="form-control" name="expiredAt" id="expiredAt" placeholder="12.00" value={this.state.expiredAt} required onChange={this.handleChangeIn}/>
                                    </div>  
                                </div>
                                <div class="form-group">
                                    <label for="textinput">Imagen *</label>
                                    <input type="text"  class="form-control" name="image" id="image" placeholder="url" value={this.state.image} required onChange={this.handleChangeIn}/>
                                </div>
                                <div class="form-group">
                                    <div class="pull-right">
                                        <button type="submit" className="btn btn-dark">Actualizar</button>
                                    </div>
                                </div>
                            </form>
                    </ModalBody>
                    <ModalFooter>
                        <button className="btn btn-secundary" onClick={()=>this.setState({modal: false})}>Cerrar</button>
                    </ModalFooter>
                    </Modal>:null}
                </div>
            </div>

        )}
}
export default gestionProductos;
