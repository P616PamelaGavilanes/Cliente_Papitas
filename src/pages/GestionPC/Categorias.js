import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from '../../Navbar/navbar';
import axios from "axios";
import { Modal, ModalBody, ModalFooter} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { initAxiosInterceptor } from '../../services/auth-helpers';
import { decodeToken } from '../../services/IdentificarUser';
const ISLOGGET = localStorage.getItem('token');

const url1 = 'http://localhost:8080';
initAxiosInterceptor();
class Categorias extends React.Component {
    constructor ( ){
         super();
         this.state={
             data: [],
             value: 1,
             subcategorias:[],
             idc:'',
             namec:'',
             urlc:"",
             modalEliminar:false,
             modalid:0,
             ids:'',
             names:'',
             urls:"",

         }
         this.handleChange = this.handleChange.bind(this);
         this.handleChangeIn = this.handleChangeIn.bind(this);
     }
     seleccionarCategoria=(ident,registro)=>{//identifica  si es categorio o subcategoria y cambia el valor de las variables 
         if(ident===1){
            this.setState({
                idc:registro.id,
                namec: registro.name,
                urlc: registro.image,
            })
         }
         else if(ident===2){
            this.setState({
                ids:registro.id,
                names: registro.name,
                urls: registro.image,
            })
         }
      }
      peticionDelete=(registro)=>{//identifica se se trata de una tecnologia o subcategoria y la elimina
          if(registro==='categoria'){
            axios.delete(url1+'/admin/categories/'.concat(+this.state.idc).concat('/delete')).then(response=>{
                this.setState({modalEliminar: false});// cambia el estado del modal
                this.componentDidMount();// realiza una llamada  la funcion inicial para que se muestren los cambios
              })
          }
          else if(registro==='subcategoria'){
            axios.delete(url1+'/admin/categories/'.concat(+this.state.value).concat('/subcategories/').concat(+this.state.ids)+'/delete').then(response=>{
                this.setState({modalEliminar: false});
                this.componentDidMount();
              })
          }
      }
      
    handleChangeIn(event) {// actualiza el estado de las variable de cada input
        this.setState({[event.target.name]: event.target.value});
    }
    handleChange(event) {// camvia el valor de la variable value por el que se eligion en el combobox
        this.setState({value: event.target.value});
        this.peticion(event.target.value);// al seleccionar un elemento del convo box
    }
    handleSubmit = e =>{//Permite enviar el formulario de categorias por medio de POST
        e.preventDefault();
        const categoria = {
            name: this.state.namec,
            image:  this.state.urlc,
            slug: "",
        };
        console.log(categoria);
        axios.post(url1+'/admin/categories', categoria).then(()=> {
            alert("Guardado correctamente");
            e.target.reset();
            this.reiniciar();
            this.componentDidMount()
        }).catch(err => {console.error(err);alert("Campos llenados incorrectamente o incompletos");e.target.reset(); });
    }
    handleSubmitSub = e =>{//Permite enviar el formulario de categorias por medio de POST
        e.preventDefault();
        const sscategoria = {
            name: this.state.names,
            image:  this.state.urls,
            slug: "",
            createdAt: "",
            updatedAt: ""
        };
        console.log(sscategoria);
        axios.post(url1+'/admin/categories/'.concat(this.state.value).concat('/subcategories'), sscategoria).then(()=> {
            alert("Guardado correctamente");
            e.target.reset();
            this.reiniciar();
            this.componentDidMount()
        }).catch(err => {console.error(err);alert("Campos llenados incorrectamente o incompletos");e.target.reset(); });
    }
    peticion(value){// lamado a las subcategosrias que pertenece a la categoria
        axios.get(url1+'/api/categories'.concat("/").concat(value).concat("/subcategories") ).then(response=>{
            this.setState({subcategorias:response.data})//cambia el valor de la variable por el cuerpo que devuelve la peticion 
        }).catch(error=>{console.log(error.message);})
    }
    reiniciar =()=>{
        this.setState({namec:'',urlc:"", names:'',urls:"",})// valores los cambia  a nulos 
    }
    componentDidMount() {//funcion que se carga primero al iniciar la clase
        if(!ISLOGGET){//identifica si hay token 
            return window.location.assign('http://localhost:3000/login');
        }else{
            decodeToken(ISLOGGET);
        }
       axios.get(url1+'/api/categories').then(response=>{
        this.setState({data:response.data})
        }).catch(error=>{console.log(error.message);})
        this.peticion(1);
    }
    render(){
        return(
            <div>
                <Navbar/>
                    <div class="container">
                        <div class="row"></div>
                                <div class="col-md-12">
                                <br></br>
                                <h3>Categorias y subcategorias</h3>
                                <div class="row">
                                    <div class="col-6">
                                    <div class="card">
                                        <article class="card-body">
                                            <form class="form"  onSubmit = {this.handleSubmit}>
                                                <legend>Categorias</legend>
                                                <div class="form-group">
                                                    <label for="textinput">Nombre</label>
                                                    <div class="col-sm-10">
                                                    <input type="text"  class="form-control" name="namec" id="namec" placeholder="nombre" title="nombre" required onChange={this.handleChangeIn}/>
                                                    </div>
                                                </div>
                                                <div class="form-group">
                                                    <label for="textinput">Imagen</label>
                                                    <div class="col-sm-10">
                                                    <input type="text" placeholder="URL" class="form-control" name="urlc" id="urlc" title="url" required onChange={this.handleChangeIn}/>
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
                                    <div class="col-6">
                                    <div class="card">
                                        <article class="card-body">
                                            <form class="form"  onSubmit = {this.handleSubmitSub}>
                                                <div class="form-group">
                                                <legend>Subcategorias</legend>
                                                <select className="browser-default custom-select" value={this.state.value} onChange={this.handleChange} >
                                                    {this.state.data.map(ele =>(
                                                        <option key = {ele.id} value={ele.id} >{ele.name}</option>
                                                    ))}
                                                </select>
                                                </div>
                                                <div class="form-group">
                                                    <label for="textinput">Nombre</label>
                                                    <div class="col-sm-10">
                                                    <input type="text" class="form-control" name="names" id="names" placeholder="nombre" title="nombre" required onChange={this.handleChangeIn}/>
                                                    </div>
                                                </div>
                                                <div class="form-group">
                                                    <label for="textinput">Imagen</label>
                                                    <div class="col-sm-10">
                                                    <input type="text" placeholder="URL" class="form-control" name="urls" id="urls" title="url" required onChange={this.handleChangeIn}/>
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
                                </div>
                                <hr/>
                                <div class='col-md-12'>
                                    <legend>Categorias</legend>
                                    <table class="table table-bordered table-condensed table-hover">
                                        <thead>
                                            <tr>
                                                <td>#</td>
                                                <td>Imágen</td>
                                                <th>Nombre</th>
                                                <th>Acción</th>
                                            </tr>
                                        </thead>
                                        <tbody id="form-list-client-body">
                                        {this.state.data.map((consulta, i) => {
                                            return(
                                                <tr>
                                                    <td>{consulta.id}</td>
                                                    <td class="col-sm-8 col-md-6">
                                                        <div class="media">
                                                            <a class="thumbnail pull-left" href="/"> <img class="media-object" src={consulta.image} alt="Card"width= '72px'  height= '72px'/> </a>
                                                        </div>
                                                    </td>
                                                    <td>{consulta.name}</td>
                                                    <td>
                                                        <button className="btn btn-danger" onClick={()=>{this.seleccionarCategoria(1,consulta); this.setState({modalEliminar: true, modalid:1})}}><FontAwesomeIcon icon={faTrashAlt}/></button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                        </tbody>
                                    </table>
                                </div>
                                <hr/>
                                <div class='col-md-12'>
                                            <legend>Subcategorias</legend>
                                        <select className="browser-default custom-select" value={this.state.value} onChange={this.handleChange} >
                                            {this.state.data.map(ele =>(
                                                <option key = {ele.id} value={ele.id} >{ele.name}</option>
                                            ))}
                                        </select>
                                        <br/>
                                        <table class="table table-bordered table-condensed table-hover">
                                            <thead>
                                                <tr>
                                                    <td>#</td>
                                                    <td>Imágen</td>
                                                    <th>Nombre</th>
                                                    <th>Acción</th>
                                                </tr>
                                            </thead>
                                            <tbody id="form-list-client-body">
                                            {this.state.subcategorias.map((consulta, i) => {
                                                return(
                                                    <tr>
                                                        <td>{consulta.id}</td>
                                                        <td class="col-sm-8 col-md-6">
                                                            <div class="media">
                                                                <a class="thumbnail pull-left" href="/"> <img class="media-object" src={consulta.image} alt="Card"width= '72px'  height= '72px'/> </a>
                                                            </div>
                                                        </td>
                                                        <td>{consulta.name}</td>
                                                        <td>
                                                            <div>
                                                                <button className="btn btn-danger" onClick={()=>{this.seleccionarCategoria(2,consulta); this.setState({modalEliminar: true, modalid:2})}}><FontAwesomeIcon icon={faTrashAlt}/></button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                            </tbody>
                                        </table>
                                </div>
                                <br/>
            {this.state.modalid===1?
                    <Modal isOpen={this.state.modalEliminar}>
                    <ModalBody>
                        Estás seguro que deseas eliminar esta categoria: {this.state.namec}
                    </ModalBody>
                    <ModalFooter>
                    <button className="btn btn-danger" onClick={()=>this.peticionDelete('categoria')}>Sí</button>
                    <button className="btn btn-secundary" onClick={()=>this.setState({modalEliminar: false})}>No</button>
                    </ModalFooter>
                </Modal>:
                    <Modal isOpen={this.state.modalEliminar}>
                    <ModalBody>
                        Estás seguro que deseas eliminar esta subcategoria: {this.state.names}
                    </ModalBody>
                    <ModalFooter>
                    <button className="btn btn-danger" onClick={()=>this.peticionDelete('subcategoria')}>Sí</button>
                    <button className="btn btn-secundary" onClick={()=>this.setState({modalEliminar: false})}>No</button>
                    </ModalFooter>
                    </Modal>
            }
            </div>
            
           </div>
        );
    }
}
export default Categorias;