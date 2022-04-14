//Nuestro servidor
// import {normalize,schema,denormalize} from 'normalizr'
// import foodManager from './Manager/foodManager.js'
import express from 'express'
import {
    Server
} from 'socket.io'
import foodRoutes from '../src/routes/Food.js'
import apiTestRoutes from '../src/routes/productsTest.js'
import foodManager from './Manager/mognooseProducts.js'
import session from 'express-session'
import cookieParser from 'cookie-parser'
//Mongo para almacenamiento de sesiones
import MongoStore from 'connect-mongo'


import * as url from 'url';
const __filename = url.fileURLToPath(
    import.meta.url);
const __dirname = url.fileURLToPath(new URL('.',
    import.meta.url));

const foodService = new foodManager;

const app = express()

//Gltich=>process.env=> segun el entorno donde corra el proyecto, el entorno va a elegir el puerto dodne
//quiero que se corra=> VARIABLE DE ENTORNO ALGO QUE VA A CAMBIAR SEGUN DODNE LO ESTE CORRIENDO
const PORT = process.env.PORT || 8080
const server = app.listen(PORT, () => {
    console.log(`Listening on port chat ${PORT}`)
})


app.use(express.json())
app.use(cookieParser())
app.use('/foods', foodRoutes)
app.use('/api/productos-test', apiTestRoutes)

const io = new Server(server)


//MIdleware que voy a utilizar para conectar con public
app.use(express.static(__dirname + '/public'))
//¿Que midleware se usa para usar PARAMS en el app.get?
app.use(express.urlencoded({
    extended: true
}))
//La potencia de express de basa en sus midlewares
app.use(session({
    //En store es dodne vamos a poner nuestro campo de persistencia
    //crea un sistema de almacvenamiento de mongo
    store: MongoStore.create({
        mongoUrl: 'mongodb+srv://chantal:logaritmoC@cluster0.dpj6h.mongodb.net/formLogin?retryWrites=true&w=majority',
        ttl: 10
    }),
    secret: 'gdhyujmnjkadi', //mi clave secreta
    resave: false, //al momento en el que se haga un request , va a refrescar la session con el fin que la sesion de mantenga actvia
    saveUninitialized: false, //cuando generas una sesion, tiene una MINI bases INTERNA, lo cual implica que la sesion va a estar guardada en un lugar, 
    // cookie:{
    //     maxAge:100   //se va a estar actualizando cada treinta segundos 
    // }
}))




//************MI CHAT*********************//
let log = []
const chatData = []
let dataForm = {}
let logoutEvt = {}


//AHORA VAMOS A EMPALMAR WEBSOCKET Y EXPRESS
//io.on => es para quedarse esuchando (evento=>connection)
io.on('connection', async (socket) => {
    console.log('Scoket connected')
    //El usuario pueda avisar a los demas cuando se conecta
    //socket.broadcast=>se utiliza cuando quieres emitir algo a todos los
    //sockets conectados menos a ti
    //cuando el usuario quiera emitir un evento menos para ti
    //POR CADA EMIT HAY UN ON
    socket.broadcast.emit('newUserConnected')
    socket.emit('log', log)
    //cuando llegue el mensaje...

    //CHAT DATA
    socket.on('message', async data => {
        log.push(data)
        await foodService.create(data)
        chatData.push({
            texto: data
        })

        console.log(chatData)

        io.emit('log', log)
    })


    //FORM DATA CHAT
    socket.on('sendFood', async data => {
        await foodService.create({
            author: data
        })
        chatData.push(data)
        const foods = await foodService.read()
        io.emit('foodLog', foods)
    })


    //FORM LOGIN
    socket.on('sendLoginData', data => {
        // const {userName,password}=data

        dataForm = data
        // console.log(data)
        // console.log(dataForm)


    })

    socket.on('evt', dataEvt => {

        // console.log(dataEvt)
        logoutEvt = dataEvt

    })


})

app.get('/session', (req, res) => {

    if (dataForm.name === undefined) return res.send('There is no user logged in')
    if (req.session.username) return res.send('User already logged');
    req.session.username = dataForm;
    res.send(`Welcome ${dataForm.name}`);
})


//logout
//si yo quiero desloguearme vamos a destruir la sesion que me encuentro actualmente
app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        //el destroy tiene un callback de error, para verificar si hubno algun error cuando quiero desloguearme
        if (logoutEvt) {
            if (!err) return res.send(`you have logged out, see you ${dataForm.name}`)
        }
        res.send({
            status: 'Error',
            message: err
        })
    })
})