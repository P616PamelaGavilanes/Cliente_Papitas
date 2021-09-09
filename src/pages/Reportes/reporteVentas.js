import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import jwt from 'jwt-decode';
import Navbar from '../../Navbar/navbar';
import { initAxiosInterceptor } from '../../services/auth-helpers';
import axios from 'axios';
import Pdf from 'react-to-pdf'
import '../../css/estiloPdf.css'
import Moment from 'moment';
const ref = React.createRef();
const ISLOGGET = localStorage.getItem('token');
const url='https://fast-shelf-83696.herokuapp.com';
initAxiosInterceptor();
class reporteVentas extends React.Component {
    constructor ( ){
        super();
        this.state={
            Tordenes:[],
            TDetalles:[]
        }
    }
    getOrders(){// obtiene todos los detalles vendidos independientemente del usuario 
        axios.get(url+'/admin/reports/details').then(response=>{
            this.setState({Tordenes: response.data})
            console.log(this.state.Tordenes);
            }).catch(error=>{alert('Error'); console.log(error.message);})
    }
    componentDidMount(){
        if(!ISLOGGET){
            return window.location.assign('http://localhost:3000/login');
        }else{
            this.decodeToken(ISLOGGET)
        }
        this.getOrders();
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
            <h4 className="media-heading">Reporte de Ventas </h4>
            <hr/>
                <div class="row">
                    <div class="col-12">
                        <div class='col-md-12'>
                            <table class="table table-bordered table-condensed table-hover">
                                <thead>
                                    <tr>
                                        <th>Numero</th>
                                        <th>Producto</th>
                                        <th>Precio Unitario</th>
                                        <th>Cantidad vendida</th>
                                        <th>Total</th>
                                    </tr>
                                </thead>
                                <tbody id="form-list-client-body">
                                    {this.state.Tordenes.map((consulta, i) => {
                                        return(
                                            <tr>
                                                <td class="col-sm-1 col-md-1">{consulta.id} </td>
                                                <td class="col-sm-8 col-md-6">
                                                    <div class="media">
                                                        <div class="media-body">
                                                            <p class="media-heading">{consulta.product_name}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td class="col-sm-1 col-md-1">{consulta.unit_price} $</td>
                                                <td class="col-sm-1 col-md-1">{consulta.quantity} </td>
                                                <td class="col-sm-1 col-md-1 text-center">{consulta.total} </td>
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
export default reporteVentas;