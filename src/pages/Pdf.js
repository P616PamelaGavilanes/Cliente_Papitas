import React, { Component } from 'react';
import '../css/estiloPdf.css'
class Pdf extends Component {
    componentDidMount() {
        if(typeof window.orientation !== "undefined"){
            document.getElementById('enlaceDescargarPdf').click();
            window.close();
        }
    }
    render() {
        return (
            <div style={{position: 'absolute', width: '100%', height: '100%'}}>
                <object
                data={require('../pdfGenerados/Informe.pdf')}
                type="application/pdf"
                width="100%"
                height="100%"
                >
                    <br />
                    <a href={require('../pdfGenerados/Informe.pdf')} id="enlaceDescargarPdf"
                    download="ReactJS.pdf"
                    >Tu dispositivo no puede visualizar los PDF, da click aquí para descargarlo</a>
                </object>
            </div>
        );
    }
}

export default Pdf;