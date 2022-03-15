const express= require('express')
const router = express.Router()
const foodManager = require('../Manager/foodManager')
const uploader = require('../services/upload')


const newFood = new foodManager()

router.post('/', (req,res)=>{
    let food = req.body
    newFood.createNewFood(food).then(result=>res.send(result))
})

router.get('/:id',(req,res)=>{
    let id = req.params.id
    newFood.searchById(id).then(result=>console.log(result))
})


router.put('/:id', (req,res)=>{
    let id = req.params.id
    let updatefood = req.body
    newFood.updateUsers(id, updatefood).then(result=>console.log(result))
})


module.exports=router;