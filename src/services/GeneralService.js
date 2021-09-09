import axios from 'axios';
import jwt from 'jwt-decode';
const API_URL = 'https://fast-shelf-83696.herokuapp.com';
const REACT_URL = 'http://localhost:3000/';
class GeneralService {
    getUserToken(user) {
        //peticion al iniciar secion y obtiene el token de seguridad
        return axios.post(API_URL + '/login', user).then(res => {
            // significa que llego un token de autenticacion
            let token = res.headers.authorization;
            token = token.replace('Bearer ',''); // quitando el prefijo del token
            console.log(token);
            let user = jwt(token);
            localStorage.setItem('token', token);
            console.log(user);
            // comparando si es rol de usuario o admin 
            if (user.CLAIM_TOKEN === 'ROLE_USER') {
                alert('En buena , Bienvenido ');
                console.log("tengo rol de usuario");
                window.location.assign(REACT_URL);// redireccionando a la pagina inicial
            } else {
                alert('En buena hora, Bienvenido');
                console.log("tengo rol de adminitrador");
                window.location.assign(REACT_URL);
            }
            return user;
        }).catch(err => alert('Credenciales incorrectas'));
    }
    
    // funcion para llamar a todos los usuarios registrados usando el token de un usuario ADMIN 
    getAllUsers() {
        axios.get(API_URL + "/admin/users", {
            headers: {"Authorization" : `Bearer ${localStorage.getItem('token')}`}
        }).then(res => {
            console.log(res);
        }).catch(err => console.log(err));
    }
}

export default new GeneralService();