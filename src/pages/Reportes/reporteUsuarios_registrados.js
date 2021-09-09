import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import jwt from 'jwt-decode';
import Navbar from '../../Navbar/navbar';
import { initAxiosInterceptor } from '../../services/auth-helpers';
import axios from 'axios';
import Moment from 'moment';
import {faEnvelopeSquare,faUserCircle} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Pdf from 'react-to-pdf'
import '../../css/estiloPdf.css'
const ref = React.createRef();
const url = 'https://fast-shelf-83696.herokuapp.com'
const ISLOGGET = localStorage.getItem('token');// obtencion de tokens 
initAxiosInterceptor();//manejo de headers 
class reporteUsuarios extends React.Component {
    constructor ( ){
        super();
        this.state={
            usuarios:[]
        }
    }
    getUsers(){//obtener usuarios y los almacena en la variable usuarios
        axios.get(url+'/admin/users').then(response=>{
            this.setState({usuarios: response.data})
            console.log(this.state.usuarios);
            }).catch(error=>{alert('Error'); console.log(error.message);})
    }
    componentDidMount(){//
        if(!ISLOGGET){
            return window.location.assign('http://localhost:3000/login');
        }else{
            this.decodeToken(ISLOGGET)
        }
        this.getUsers();
    }
    decodeToken(token){
        let user = jwt(token);
        localStorage.setItem('token', token);
        if (user.CLAIM_TOKEN === 'ROLE_USER') {// identifica el rol de usuario
            return window.location.assign('http://localhost:3000/');
        }
    }
    render(){
        Moment.locale('en');// permite tomar el dato y presentarlo como dia /mes /año
        return(<div>
            <Navbar/>
            <br/><br/>
            <div className="Post" ref={ref}>
            <h4 className="media-heading">Usuarios Registrados</h4>
            <hr/>
                <div class="row">
                    <div class="col-12">
                        <div class='col-md-12'>
                            <table class="table table-bordered table-condensed table-hover">
                                <thead>
                                    <tr>
                                        <th>Número</th>
                                        <th>Nombres y Apellidos</th>
                                        <th>Nombre de usuario</th>
                                        <th>E-mail</th>
                                        <th>Fecha de registro</th>
                                    </tr>
                                </thead>
                                <tbody id="form-list-client-body">
                                    {this.state.usuarios.map((consulta, i) => {
                                        return(
                                            <tr>
                                                <td class="col-sm-1 col-md-1">{consulta.id}</td>
                                                <td class="col-sm-1 col-md-1 text-center">{consulta.name} </td>
                                                <td class="col-sm-1 col-md-1"><FontAwesomeIcon icon={faUserCircle}/>{"    "}{consulta.username} </td>
                                                <td class="col-sm-1 col-md-1"><FontAwesomeIcon icon={faEnvelopeSquare}/>{"    "}{consulta.email} </td>
                                                <td class="col-sm-1 col-md-1">{"    "}{Moment(consulta.created_at).format('L')}</td>{/*toma el dato y lo presenta con el formato dia/mes año*/}

                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            <div className="container">
                <div className="row">
                    <div className="col-6"></div>
                    <div className="col-4">
                        <Pdf targetRef={ref} filename="Reporte__Usuarios_registrados.pdf">{({ toPdf }) => <button className="btn btn-dark"onClick={toPdf}>Descargar como PDF</button>}</Pdf>
                    </div>
                    <div className="col-2"></div>
                </div>
            </div>
        </div>
        )}
}
export default reporteUsuarios;