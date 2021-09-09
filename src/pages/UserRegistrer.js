import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/UserRegistrer.css';
import axios from "axios";
import Navbar from '../Navbar/navbar';
const ISLOGGET = localStorage.getItem('token');
//const url = 'https://fast-shelf-83696.herokuapp.com/testing'
const url = 'https://fast-shelf-83696.herokuapp.com/register'
class UserRegister extends React.Component {
    constructor ( ){
        super();
        this.state={
            name:'',
            username:"",
            email:"",
            password:"",

        }
        this.handleChangeIn = this.handleChangeIn.bind(this);
    }
    handleChangeIn(event) {// actualiza el estado de las variable de cada input
        this.setState({[event.target.name]: event.target.value});
    }
    handleSubmit = e =>{//Permite enviar el formulario de categorias por medio de POST
        e.preventDefault();
        const user = {
            name: this.state.name,
            username:  this.state.username,
            email: this.state.email,
            password: this.state.password
        };
        console.log(user);
        axios.post(url, user).then(()=> {
            alert("Registrado correctamente");
            e.target.reset();
            this.reiniciar();
        }).catch(err => {console.error(err);alert("Tu E-mail o Nombre de usuario ya esta en uso");e.target.reset(); });
    }
    componentDidMount(){
        if(ISLOGGET){//identiifica si esta logueado 
            window.location.assign('http://localhost:3000/');
        }else{
            return;
        }
    }
    reiniciar =()=>{this.setState({name:'',username:"", email:'',password:"",})}
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
                            <h2 class="text-center">Registrarme</h2>
                            <form class="form" onSubmit = {this.handleSubmit}>
                                <div class="form-group">
                                    <label for="nombre" >Nombres y Apellidos *</label>
                                    <input type="text" class="form-control" placeholder="" name="name" id="name" onChange={this.handleChangeIn} required/>
                                </div>
                                <div class="form-group">
                                    <label for="nombre" >Nombre de usuario *</label>
                                    <input type="text" class="form-control" placeholder="" name="username" id="username" onChange={this.handleChangeIn} required/>
                                </div>
                                <div class="form-group">
                                    <label for="email" >E-mail *</label>
                                    <input type="email" class="form-control" placeholder="" name="email" id="email"  required onChange={this.handleChangeIn}/>
                                </div>
                                <div class="form-group">
                                    <label for="password">Contraseña *</label>
                                    <input type="password" class="form-control" placeholder=""  name="password" id="password" required minLength='6' onChange={this.handleChangeIn}/>
                                </div>
                                <div class="form-check">
                                    <a href="/login" class="btn btn-link">Iniciar Sesión</a>
                                    <button type="submit" class="btn btn-login float-right">Registrar</button>
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
                                                    <span> Restaurante "Las Papitas De La Esquina" </span>
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
export default UserRegister;