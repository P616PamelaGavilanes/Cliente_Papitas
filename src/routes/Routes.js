import React from 'react';
import {BrowserRouter, Switch, Route} from 'react-router-dom'
import Carrito from '../pages/carrito';
import Categorias from '../pages/GestionPC/Categorias';
import gestionProductos from '../pages/GestionPC/gestionProductos';
import Home from '../pages/inicio';
import Login from '../pages/Login';
import reporteInventario from '../pages/Reportes/reporteInventario';
import reporteVentas from '../pages/Reportes/reporteVentas';
import reporteCaducado from '../pages/Reportes/reporteCaducados_producto';
import reporteCompras from '../pages/Reportes/reporteCompras_usuario';
import reporteUsuarios from '../pages/Reportes/reporteUsuarios_registrados';
import UserRegister from '../pages/UserRegistrer';
import Pdf from '../pages/Pdf';
import OrdenesRealizadas from '../pages/Ordenes';
function Routes() {
  return (
    <BrowserRouter>
      <Switch>
        {/* Rutas de autentificacion */}
          <Route exact path="/" component={Home} /> 
          <Route exact path="/login" component={Login} /> {/* identifica cada componente mediante su rula a partir de http://localhost:3000/  */}
          <Route exact path="/register" component={UserRegister} />
        {/* Rutas que maneja el usuario autenticado */}
          <Route exact path="/carrito" component={Carrito} />
          <Route exact path="/Orden/:id" component={OrdenesRealizadas} />
        {/* Rutas de usuario administrador */}  
          <Route exact path="/categorias" component={Categorias} />
          <Route exact path="/Productos" component={gestionProductos} />

          <Route exact path="/rInventario" component={reporteInventario} />
          <Route exact path="/rVentas" component={reporteVentas} />
          <Route exact path="/rCaducados" component={reporteCaducado} />
          <Route exact path="/rComprasUsuario" component={reporteCompras} />
          <Route exact path="/rUsuarios" component={reporteUsuarios} />
        {/* Rutas de lectura de pdf */}  
          <Route exact path="/pdf" component={Pdf} />
      </Switch>
    </BrowserRouter>
    
  );
}

export default Routes;
