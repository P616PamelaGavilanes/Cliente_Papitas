import jwt from 'jwt-decode';
//Identifica el rol de usuario y si es cliente que lo redireccione al inicio
export async function decodeToken(token){
    let user = jwt(token);
    localStorage.setItem('token', token);
    if (user.CLAIM_TOKEN === 'ROLE_USER') {
        return window.location.assign('http://localhost:3000/');
    }
}