//inicializo socket.io del ladod el front
const socket = io()
let user;
let chatBox = document.getElementById('chatBox')
let form = document.getElementById('foodForm')
let foods;
//form login
const formLogin = document.getElementById('login-form')
let logout = document.getElementById('logout')


//FORM DATA
form.addEventListener('submit',(evt)=>{
    evt.preventDefault()
    let data = new FormData(form)
    let obj = {}
    data.forEach((val,key)=>obj[key]=val)
    socket.emit('sendFood',obj)
    form.reset()
})

logout.addEventListener('click',(evt)=>{
    evt.preventDefault()
    socket.emit('evt',evt)
})

//FORM LOGIN
formLogin.addEventListener('submit',(evt)=>{
    evt.preventDefault()
    let dataLogin = new FormData(formLogin)
    let objLogin = {}
    dataLogin.forEach((val,key)=>objLogin[key]=val)
    socket.emit('sendLoginData', objLogin)
    formLogin.reset()
}) 


// socket.on('loginData',(data)=>{
//     console.log(data)
// })

//ahora las tarigo a las comidas
// socket.on('foodLog', (data)=>{
//      foods = data.payload
//     let table = document.getElementById('table')
//     let foodsStryng=''
//     foods.forEach(food=>{
//         foodsStryng = foodsStryng+`
//       <tr>
//       <th scope="col">${food.id}</th>
//         <th scope="col">${food.firstName}</th>
//         <td scope="col">${food.lastName}</td>
//         <td scope="col">${food.alias}</td>
//         <td scope="col">${food.thumbnail}</td>
//       </tr>
//     `
//     })
    
//     table.innerHTML=foodsStryng
//     moment().format('MMMM Do YYYY, h:mm:ss a')
// })

//*****************************CHATBOOX***********************************//
// swal.fire({
//     title:'IDENTIFY YOURSELF',
//     input:'text',
   
//     text:"Please, enter you're user",
    
//     // inputValidator:(value)=>{
//     //     return !value && "Please login!"
//     // },
//     allowOutsideClick:false
// }).then(result=>{
//     user=result.value

// })




//POR CADA EMIT HAY UN ON
// socket.broadcast.emit('newUserConnected')

//pongo socket.on + nombre evento
//le digo que hay un nuevo usuario coenctado

socket.on('newUserConnected',(data)=>{
    //llamo al sweet alert
    Swal.fire({
        icon:'succes',
        text:`New user connected: ${user}`,
        toast:true,
        position:'top-right'
    })
})



socket.on('log', data=>{
    let history = document.getElementById('history')
    let messages=''
    data.forEach(message=>{
        messages= messages+ `</br>${message.user} Says: ${message.message}</br>`
    })
    history.innerHTML=messages
})


chatBox.addEventListener('keyup', (evt)=>{
    if(evt.key==='Enter'){
        if(chatBox.value.trim().length>0 || chatBox.value===''){
            socket.emit('message', {user:user,  message:chatBox.value})
            chatBox.value=''
        }
    }
})















