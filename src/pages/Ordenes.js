import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from '../Navbar/navbar';
import { initAxiosInterceptor } from '../services/auth-helpers';
import axios from 'axios';
import Moment from 'moment';
import Pdf from 'react-to-pdf'
import '../css/estiloPdf.css'
const ref = React.createRef();
const url = 'https://fast-shelf-83696.herokuapp.com'
const ISLOGGET = localStorage.getItem('token');
initAxiosInterceptor();
class OrdenesRealizadas extends React.Component {
    constructor (props){
        super(props);
        this.state={
            idOrden: this.props.match.params.id,
            Orden:[],
            cliente:[],
            detalles:[],
            user:{}
        }
    }
    componentDidMount(){
        if(!ISLOGGET){// identifica si esta authentificado
            return window.location.assign('http://localhost:3000/login');
        }else{
            this.decodeToken(ISLOGGET)
        }
    }
    decodeToken(token){
        localStorage.setItem('token', token);
        this.getOrder();
        
    }
    getOrder(){// obtiene la orden 
        axios.get(url+'/orders/'+this.state.idOrden).then(response=>{
            this.setState({Orden: response.data})
            this.setState({cliente: response.data.user})
            }).catch(error=>{alert('Error'); console.log(error.message);})
            this.getDetails();
    }//obtiene los detalles de la compra 
    getDetails(){
        axios.get(url+'/orders/'+this.state.idOrden+'/details').then(response=>{
            this.setState({detalles: response.data})
            console.log(this.state.detalles);
            }).catch(error=>{alert('Error'); console.log(error.message);})
    }
    render(){
        Moment.locale('en');
        return(<div>
            <Navbar/>
            <br/><br/>
            <div className="Post" ref={ref}>
                <div class="row">
                    <div class="col-12">
                        <div class="card">
                            <div class="card-body p-5">
                                <div class="row p-1">
                                    <div class="col-md-6">
                                    <Pdf targetRef={ref} filename="Factura.pdf">{({ toPdf }) => <button className="btn btn-dark"onClick={toPdf}>Descargar como PDF</button>}</Pdf>
                                    </div>
                                    <div class="col-md-6 text-right">
                                        <p class="font-weight-bold mb-1">Factura  N. {this.state.idOrden}</p>
                                        <p class="text-muted">Fecha: {Moment(this.state.Orden.created_at).format('L')}</p>
                                    </div>
                                </div>
                                <hr class="my-5"/>
                                <div class="row pb-1 p-1">
                                    <div class="col-md-6">
                                        <p class="font-weight-bold mb-4">Información de cliente</p>
                                        <p class="mb-1">{this.state.cliente.name}</p>
                                    </div>
                                    <div class="col-md-6 text-right">
                                        <p class="mb-1"><span class="text-muted">E-mail : </span></p>
                                        <p>{this.state.cliente.email}</p>
                                    </div>
                                </div>
                                <div class="row p-5">
                                    <div class="col-md-12">
                                        <table class="table">
                                            <thead>
                                                <tr>
                                                    <th class="border-0 text-uppercase small font-weight-bold">#</th>
                                                    <th class="border-0 text-uppercase small font-weight-bold">Producto</th>
                                                    <th class="border-0 text-uppercase small font-weight-bold">Cantidad</th>
                                                    <th class="border-0 text-uppercase small font-weight-bold">Costo Unitario</th>
                                                    <th class="border-0 text-uppercase small font-weight-bold">Total</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {this.state.detalles.map((consulta, i) => {
                                                    return(
                                                        <tr>
                                                        <td>{consulta.id}</td>
                                                        <td>{consulta.productName}</td>
                                                        <td>{consulta.quantity}</td>
                                                        <td>${consulta.unitPrice}</td>
                                                        <td>${consulta.total}</td>
                                                    </tr>
                                                    );
                                                })}
                                                
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                <div class="d-flex flex-row-reverse bg-dark text-white p-2">
                                    <div class="py-1 px-5 text-right">
                                        <div class="mb-2">Total</div>
                                        <div class="h2 font-weight-light">$ {this.state.Orden.total}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        )}
}
export default OrdenesRealizadas;