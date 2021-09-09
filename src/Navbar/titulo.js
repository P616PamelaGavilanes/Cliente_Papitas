
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/UserRegistrer.css';
class Titulo extends React.Component {
    //solo me retorna una vista del titulo general
    render(){
        return(
            <div>
                <section class="jumbotron text-center">
                    <div class="container">
                        <h1 class="jumbotron-heading">"Las Papitas De La Esquina"</h1>
                        <p class="lead text-muted mb-0">Solamente a través de la cocina se puede expresar belleza, poesía, humor, felicidad, belleza y armonía...</p>
                    </div>
                </section>
            </div>
        );
    }
}
export default Titulo;