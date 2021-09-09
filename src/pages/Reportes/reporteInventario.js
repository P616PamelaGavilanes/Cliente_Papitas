import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import jwt from 'jwt-decode';
import { initAxiosInterceptor } from '../../services/auth-helpers';
import axios from 'axios';
import Navbar from '../../Navbar/navbar';
import Pdf from 'react-to-pdf'
import '../../css/estiloPdf.css'
const ref = React.createRef();
const ISLOGGET = localStorage.getItem('token');
const url = 'http://localhost:8080'
initAxiosInterceptor();
class reporteInventario extends React.Component {
    constructor ( ){
        super();
        this.state={
            productos: [],
            productosAgotados:[],
        }
    }
    getProductos(){
        axios.get(url+'/admin/products').then(response=>{
            this.setState({productos: response.data})
            }).catch(error=>{alert('Error'); console.log(error.message);})
        axios.get(url+'/admin/products/sold-out').then(response=>{
            this.setState({productosAgotados: response.data})
            }).catch(error=>{alert('Error'); console.log(error.message);})

    }
    componentDidMount(){
        if(!ISLOGGET){
            return window.location.assign('http://localhost:3000/login');
        }else{
            this.decodeToken(ISLOGGET)
        }
        this.getProductos();
    }
    decodeToken(token){
        let user = jwt(token);
        localStorage.setItem('token', token);
        if (user.CLAIM_TOKEN === 'ROLE_USER') {
            return window.location.assign('http://localhost:3000/');
        }
    }
    render(){
        return(
            <div>
            <Navbar/>
            <br/><br/>
            <div className="Post" ref={ref}>
            <h4 className="media-heading">Reporte de Inventario</h4>
                <div class="row">
                <h4>Productos Agotados</h4>
                    <div class="col-12">
                        <div class='col-md-12'>
                            <table class="table table-bordered table-condensed table-hover">
                                <thead>
                                    <tr>
                                        <th>Descripción</th>
                                        <th>Precio</th>
                                        <th>Stock</th>
                                        <th>Estado</th>
                                        <th>Expirado</th>

                                    </tr>
                                </thead>
                                <tbody id="form-list-client-body">
                                    {this.state.productosAgotados.map((consulta, i) => {
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
                                                {/* si el estado del producto en AVAILABLE  que presente en pantalla con 'disponible' caso contrario 'no disponible */}

                                                <td class="col-sm-1 col-md-1 text-center"><strong>{consulta.productStatus==='AVAILABLE'?'Disponible':'No disponible'} </strong></td>
                                                <td class="col-sm-1 col-md-1 text-center"><strong>{consulta.productExpired==='EXPIRED'?'Si':'No'} </strong></td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                        <h4>Productos existentes</h4>
                        <div class='col-md-12'>
                            <table class="table table-bordered table-condensed table-hover">
                                <thead>
                                    <tr>
                                        <th>Descripción</th>
                                        <th>Precio</th>
                                        <th>Stock</th>
                                        <th>Estado</th>
                                        <th>Expirado</th>
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
                                                            <p class="media-heading">Nombre:<br/> {consulta.name}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td class="col-sm-1 col-md-1"><strong>{consulta.price} $</strong></td>
                                                <td class="col-sm-1 col-md-1 text-center"><strong>{consulta.quantity} </strong></td>
                                                <td class="col-sm-1 col-md-1 text-center"><strong>{consulta.productStatus==='AVAILABLE'?'Disponible':'No disponible'} </strong></td>
                                                <td class="col-sm-1 col-md-1 text-center"><strong>{consulta.productExpired==='EXPIRED'?'Si':'No'} </strong></td>

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
                            <Pdf targetRef={ref} filename="Reporte_Inventario.pdf">{({ toPdf }) => <button className="btn btn-dark"onClick={toPdf}>Descargar como PDF</button>}</Pdf>
                        </div>
                        <div className="col-2"></div>
                    </div>
                </div>
        </div>
        )}
}
export default reporteInventario;