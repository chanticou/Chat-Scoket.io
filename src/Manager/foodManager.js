// const fs = require('fs')
const database = require('../createTable')
// import database from '../createTable'

// const pathFood = __dirname + '/../files/pokemons'

class foodManager{

    createNewFood= async (food)=>{
        if(!food.name || !food.price) return {status:'Missing data'}
         try{
                
            database('foods').insert(food)
            .then(()=>console.log('Productos guardados'))
    
                 
        }catch(error){
            return {status:'error', message:error }
        }
    }



    searchById=async(id)=>{
            try{       
            //WHERE
            // FIND BY ID 
            database.from('foods').select('*').where('id', id)
            .then(data=>{
                let findById = JSON.parse(JSON.stringify(data))
                console.log(findById) 
            })         
             
            }catch(error){
                return {status:'error', message:error }
            }
    }

    updateUsers=async(id, updatefood)=>{
        try{
             database.from('foods').where('id', id).update({name:updatefood})
            .then(data=>{
                let update = JSON.parse(JSON.stringify(data))
                console.log(update) 
            })
        }catch(error){
            return {status:'error', message:error}
        }
    }

    getAllfoods=async()=>{
        if(fs.existsSync(pathFood)){
            try{
                let data = await fs.promises.readFile(pathFood, 'utf-8' ,null, 3)
                let foods = JSON.parse(data)
                
                return{status:'Succes, get all Pokmemons', payload:foods}

            }catch(error){
                return{status:error, message:error}
            }
        }else{
            return{status: 'Theres no foods', payload: [] }
        }
    }

  
}


module.exports=foodManager