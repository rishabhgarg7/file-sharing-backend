const mongoose = require('mongoose')

function connectDb(){

    //mongoDb connection
    mongoose.connect(process.env.MONGOOSE_DB_URL,{useNewUrlParser: true, useCreateIndex:true, useUnifiedTopology:true,useFindAndModify:true })

    const connection = mongoose.connection

    connection.once('open', ()=>{
        console.log("Database connected.")
    }).catch(()=> {
        console.log("Database couldn't connect.")
    })
}

module.exports = connectDb;