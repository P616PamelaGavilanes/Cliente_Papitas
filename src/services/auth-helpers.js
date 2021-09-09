import axios from "axios";
const TOKEN_KEY = 'token';

export function setToken(token){//guarda token
 localStorage.setItem(TOKEN_KEY,token)
}
export function getToken(){
    return localStorage.getItem(TOKEN_KEY);//obtiene token
}
export function deleteToken(){//elimina el token
    localStorage.removeItem(TOKEN_KEY);
}
export function initAxiosInterceptor(){//Maneja los headers a la peticion de servicios
    axios.interceptors.request.use(function(config){
            const token = getToken();
            if(token){
                config.headers.Authorization = `Bearer ${token}`;//Integra el token al header con Bearer
            }
            return config;
        }
    )
}
