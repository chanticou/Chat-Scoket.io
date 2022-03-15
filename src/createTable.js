// import options from '../src/options/sqlConfig.js'
// import knex from 'knex'

const options = require('../src/options/sqlConfig.js')
const knex = require('knex')

const database = knex(options) 


// database.schema.createTable('foods', table=>{
//     table.increments('id');
//     table.varchar('name', 30);
//     table.varchar('description', 100);
//     table.integer('price');
// })
// .then(()=>console.log('Table created foods'))
// .catch((err)=>console.log(err))
// .finally(()=>database.destroy())




module.exports=database;
// export default database;