import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import jwt from 'jwt-decode';
import Navbar from '../../Navbar/navbar';
import { initAxiosInterceptor } from '../../services/auth-helpers';
import Titulo from '../../Navbar/titulo';
import axios from 'axios';
import Pdf from 'react-to-pdf'
import '../../css/estiloPdf.css'
const ISLOGGET = localStorage.getItem('token');
const ref = React.createRef();// brinda un nombre para reverenciar un elemendo en html
const url = 'https://fast-shelf-83696.herokuapp.com'
initAxiosInterceptor();// maneja los headers 
class reporteCaducado extends React.Component {
    constructor ( ){
        super();
        this.state={
            data:[]
        }
    }
    getProductsExpired(){// guardar en la variable data todos lo productos caducados 
        axios.get(url+'/admin/products/expired').then(response=>{
            this.setState({data:response.data});
            console.log(this.state.data);
            }).catch(error=>{console.log(error.message);})
    }
    componentDidMount(){// funcion que se carga antes que cualquier otra.
        if(!ISLOGGET){//validar autenticacion
            return window.location.assign('http://localhost:3000/login');
        }else{
            this.decodeToken(ISLOGGET)
        }
        this.getProductsExpired();//llamar a todos los productos expirados
    }
    decodeToken(token){//identifica el isusario
        let user = jwt(token);
        localStorage.setItem('token', token);
        if (user.CLAIM_TOKEN === 'ROLE_USER') {
            return window.location.assign('http://localhost:3000/');
        }
    }
    render(){
        return(
            <div >
                <Navbar/>
                {/*de acuerdo a ref se identifica desde donde se va a imprimir el pdf */}
                <div className="Post" ref={ref}>
                <Titulo/>
                <br/><br/>
                <h4 className="media-heading">Reporte de Productos Caducados</h4>
                    <div class="row">
                        <div class="col-12">
                           
                                    <div class='col-md-12'>
                                        <table class="table table-bordered table-condensed table-hover">
                                            <thead>
                                                <tr>
                                                    <th>Descripción</th>
                                                    <th>Precio</th>
                                                    <th>Stock</th>
                                                </tr>
                                            </thead>
                                            <tbody id="form-list-client-body">
                                                {/* presentar los productos guadados en data  */}
                                                {this.state.data.map((consulta, i) => {
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
                            {/* utiliza libreria  para convertir la vista en pdf , lo descarga con el nombre reporteCaducados.pdf */}
                            <Pdf targetRef={ref} filename="reporteCaducados.pdf">{({ toPdf }) => <button className="btn btn-dark"onClick={toPdf}>Descargar como PDF</button>}</Pdf>
                        </div>
                        <div className="col-2"></div>
                    </div>
                </div>

            </div>
        )}
}
export default reporteCaducado;