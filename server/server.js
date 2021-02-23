require('dotenv').config()
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const { generarToken } = require('../providers/auth');
const { validaClienteProvider } = require('../providers/claroProvider');

const app = express();


const publicPath = path.resolve(__dirname, '../public');
const port = process.env.PORT || 80;

app.use(bodyParser.json())
app.use(express.static(publicPath));

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type, Origin, X-Requested-With,  Accept");
    next();
});


app.post('/validar/cliente', async (req, res) => {
    const dni = req.body.entities.find( e => e.name === 'CARDINAL').value + '';
    if(!dni) {
        return res.status(400).send({ option: 'NO_ES_CLIENTE'});
    }


    let nombre = '';

    let option = 'ES_CLIENTE';

    const responseService = await validaClienteProvider('1', dni);
    console.log(responseService);
    if(responseService.codigoRespuesta === '0') {
        option = 'ES_CLIENTE';
        nombre = responseService.listDatosDocumentoClienteResponse[0].descripcion;
    } else {
        option = 'NO_ES_CLIENTE';
    }

    const respuesta = {
        serialVersionUID: 123123,
        hiddenContext: {  nombre },
        openContext:{ nombre},
        visibleContext: { nombre},
        option
      };
      console.log(respuesta);
      res.send(respuesta);
});

app.post('/validar/cliente/getname', (req,res) => {

    const {answer, hiddenContext } = req.body;


    let mensaje =  answer.content.content;
    let nombre = hiddenContext.nombre;

    mensaje = mensaje.replace('[nombre]', nombre);

    res.send( { 
        serialVersionUID: 1231231232,
        answer: {
          template: 'TEXT_OPTIONS',
          content: {
            buttons: [],
            type: 'TEXT_OPTIONS',
            description: '',
            content: mensaje
          }
        },
        
        
        text: 'Si eres un cliente'});


})


app.post('/validar/reclamo', (req,res) => {
    console.log(req.body);


    const respuesta = {
        serialVersionUID: 123123,
        hiddenContext: {  },
        openContext:{ },
        visibleContext: { },
        option: 'OK'
      };

      res.send(respuesta);
})

app.listen(port, (err) => {

    if (err) throw new Error(err);

    console.log(`Servidor corriendo en puerto ${ port }`);

});
