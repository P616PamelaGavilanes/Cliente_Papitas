import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import jwt from 'jwt-decode';
import { initAxiosInterceptor } from '../../services/auth-helpers';
import axios from 'axios';
import Navbar from '../../Navbar/navbar';
import Moment from 'moment';
import {  faEnvelopeSquare, faUserCircle} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Pdf from 'react-to-pdf'
import '../../css/estiloPdf.css'
const ref = React.createRef();

const ISLOGGET = localStorage.getItem('token');
const url = 'http://localhost:8080';
initAxiosInterceptor();
class reporteCompras extends React.Component {
    constructor ( ){
        super();
        this.state={
            usuarios: [],
            userValue:0,
            ordenes:[],
            fecha:null
        }
        this.handleChangeUser = this.handleChangeUser.bind(this)
    }
    getUsuarios(){
        axios.get(url+'/admin/users').then(response=>{
            this.setState({usuarios: response.data})
            console.log(this.state.usuarios);
            }).catch(error=>{alert('Error'); console.log(error.message);})
        
    }
    handleChangeUser(event) {
        this.setState({userValue:event.target.value});
        this.getCompras(event.target.value);

    }
    getCompras(id){
        axios.get(url+'/admin/orders/user/'+id).then(response=>{
            this.setState({ordenes: response.data})
                console.log(this.state.ordenes);
            }).catch(error=>{alert('Error'); console.log(error.message);})
    }
    componentDidMount(){
        if(!ISLOGGET){
            return window.location.assign('http://localhost:3000/login');
        }else{
            this.decodeToken(ISLOGGET)
        }
        this.getUsuarios();
    }
    decodeToken(token){
        let user = jwt(token);
        localStorage.setItem('token', token);
        if (user.CLAIM_TOKEN === 'ROLE_USER') {
            return window.location.assign('http://localhost:3000/');
        }
    }
    render(){
        Moment.locale('en');
        return(
            <div>
            <Navbar/>
            <br/><br/>
            <div className="Post" ref={ref}>
                <h4 className="media-heading"> Compras por Usuario</h4>
                <div class="row">
                    <div class="col-4">
                                    <label for="textinput">Usuarios: </label>
                                    <div class="col-sm-10">
                                        <select className="browser-default custom-select" value={this.state.userValue} onChange={this.handleChangeUser} >
                                            <option key = {0} value={0} >Ninguno</option>
                                           {/* el user value tendra el valor del id del usuario seleccionado*/}
                                            {this.state.usuarios.map(ele =>(<option key = {ele.id} value={ele.id} >{ele.name}</option>))}
                                        </select>
                                    </div>
                    </div>
                    <div class="col-12">
                                {this.state.ordenes.map((consulta, i) => {
                                    return (
                                        <div class="col-xs-12 col-sm-8">
                                            <br/>
                                            <h6 class="to">Cliente:</h6>
                                            <ul class="list-group">
                                                <li class="list-group-item"><FontAwesomeIcon icon={faUserCircle}/>{"    "}{consulta.user.name} </li>
                                                
                                                <li class="list-group-item"><FontAwesomeIcon icon={faEnvelopeSquare}/>{"    "}{consulta.user.email}</li>
                                            </ul>
                                            </div>
                                       
                                        )
                                })}
                                <div class='col-md-12'>
                                    <table class="table table-bordered table-condensed table-hover">
                                        <thead>
                                            <tr>
                                                <th>Numero</th>
                                                <th>Total</th>
                                                <th>Estado</th>
                                                <th>Fecha</th>
                                            </tr>
                                        </thead>
                                        <tbody id="form-list-client-body">
                                            {this.state.ordenes.map((consulta, i) => {
                                                return(
                                                    <tr>
                                                        <td class="col-sm-1 col-md-1">
                                                            <div class="media">
                                                                <div class="media-body">
                                                                    <p class="media-heading">{consulta.id}</p>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td class="col-sm-1 col-md-1">{consulta.total} $</td>
                                                        <td class="col-sm-1 col-md-1 text-center">{consulta.orderStatus==='COMPLETE'?'Pagada':'No esta pagada'}</td>
                                                        <td class="col-sm-1 col-md-1 text-center">{Moment(consulta.created_at).format('L')}</td>

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
                        <Pdf targetRef={ref} filename="Reporte_Compras_Usuario.pdf">{({ toPdf }) => <button className="btn btn-dark"onClick={toPdf}>Descargar como PDF</button>}</Pdf>
                    </div>
                    <div className="col-2"></div>
                </div>
            </div>
        </div>
        )}
}
export default reporteCompras;