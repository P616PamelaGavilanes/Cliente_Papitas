import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/UserRegistrer.css';
import GeneralService from "../services/GeneralService";
import Navbar from '../Navbar/navbar';
const ISLOGGET = localStorage.getItem('token');

class Login extends React.Component {
    constructor ( ){
        super();
        this.state={
            username:"",
            password:"",
            Newuser:[],
        }
        this.handleChangeIn = this.handleChangeIn.bind(this);
        this.getToken = this.getToken.bind(this);
        this.getUsers = this.getUsers.bind(this);
    }
    componentDidMount(){// identifica si hay toquen 
        if(ISLOGGET){
            window.location.assign('http://localhost:3000/');
        }else{
            return;
        }
    }
    //asigana a las variables el valor del formulario 
    handleChangeIn(event) {this.setState({[event.target.name]: event.target.value});}
    getUsers = (e) => {// obtiene todos los usuarios
        e.preventDefault();
        GeneralService.getAllUsers();
    }
    getToken = (e) => {// al iniciar secion y asigna valor para obtener el toquen 
        e.preventDefault();
        let user = {
            username: this.state.username,
            password: this.state.password
        };
        console.log("usuario => " + JSON.stringify(user));
        GeneralService.getUserToken(user);
    }
    reiniciar =()=>{this.setState({username:"",password:"",})}
    
    render(){
        return(
            <div>
                
                <link href="//maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" rel="stylesheet" id="bootstrap-css"/>
                <script src="//maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js"></script>
                <script src="//code.jquery.com/jquery-1.11.1.min.js"></script>
                <Navbar/>
                <section class="login-block">
                <div class="container">
                    <div class="container-1">
                    <div class="row">
                        <div class="col-md-4 login-sec">
                            <h2 class="text-center">Iniciar sesión</h2>
                            <form class="form" onSubmit = {this.getToken}>
                                <div class="form-group">
                                    <label for="email" >Nombre de Usuario *</label>
                                    <input type="text" class="form-control" placeholder="" name="username" id="username" onChange={this.handleChangeIn} required/>
                                </div>
                                <div class="form-group">
                                    <label for="password">Contraseña *</label>
                                    <input type="password" class="form-control" placeholder="" name="password" id="password" onChange={this.handleChangeIn} required/>
                                </div>
                                <div class="form-check">
                                    <a href="/register" class="btn btn-link">Registrarme</a>
                                    <button type="submit" class="btn btn-login float-right">Entrar</button>
                                </div>
                            </form>
                        </div>
                        <div class="col-md-8 banner-sec">
                            <div id="carouselExampleIndicators" class="carousel slide" data-ride="carousel">
                                <div class="carousel-inner" >
                                    <div class="carousel-item active">
                                    <br/>
                                        <img class="d-block" src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Big_Mac_combo_meal.jpg/230px-Big_Mac_combo_meal.jpg" alt="First slide"/>
                                        <div class="carousel-caption ">
                                            <div class="header-text">
                                                <h3>
                                                    <span> Restaurante "Las Papitas De La Esquina"</span>
                                                </h3>
                                            </div>	
                                        </div>
                                    </div>
                                </div>	 
                            </div>
                        </div>
                    </div>
                    </div>
                </div>
                </section>
            </div>
        );
    }
}
export default Login;

