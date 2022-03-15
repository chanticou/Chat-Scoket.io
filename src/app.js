//Nuestro servidor
const express = require('express')
const {Server} = require('socket.io')
const foodRoutes = require('../src/routes/Food')

const app = express()
app.use(express.json())
//Gltich=>process.env=> segun el entorno donde corra el proyecto, el entorno va a elegir el puerto dodne
 //quiero que se corra=> VARIABLE DE ENTORNO ALGO QUE VA A CAMBIAR SEGUN DODNE LO ESTE CORRIENDO
const PORT = process.env.PORT||8080
const server = app.listen(PORT, ()=>{console.log(`Listening on port ${PORT}`)})


app.use('/foods', foodRoutes)



const io = new Server(server)




//MIdleware que voy a utilizar para conectar con public
app.use(express.static(__dirname+'/public'))


//************MI CHAT*********************//
let log=[]
//crear una tabla en la misma base de datos

//AHORA VAMOS A EMPALMAR WEBSOCKET Y EXPRESS

//io.on => es para quedarse esuchando (evento=>connection)
io.on('connection', (socket)=>{
    console.log('Scoket connected')
    //El usuario pueda avisar a los demas cuando se conecta
    //socket.broadcast=>se utiliza cuando quieres emitir algo a todos los
    //sockets conectados menos a ti
    //cuando el usuario quiera emitir un evento menos para ti
    //POR CADA EMIT HAY UN ON
    socket.broadcast.emit('newUserConnected')
    socket.emit('log', log)
    //cuando llegue el mensaje...
    socket.on('message',data=>{
        log.push(data)
        
        io.emit('log',log)
        
    })


    //FORM//////////////////////////////////////
    socket.on('sendFood',async data=>{
        await newFood.createNewFood(data)
        let foods = await newFood.getAllfoods()
        io.emit('foodLog',foods)
    })
    //END FORM /////////////////////////////////
})
