require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors')
const morgan = require('morgan')
//internal modules
const connectDB = require('./utils/db')
const fileRoutes = require('./resources/file/file.router')
const PORT = process.env.PORT || 3000

const app = express();
app.disable('x-powered-by')
//hooking middlewares
// configure app to use bodyParser(), this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
const corsOptions = {
    origin: process.env.ALLOWED_CLIENTS.split(',')
}
app.use(cors(corsOptions))
app.use(morgan('dev'))

//routes
app.get('/health', (req,res) => {
    res.send({message:"Ok. Working!"})
})
//API routes
app.use('/api/files',fileRoutes)

//connect to database
connectDB();

app.listen(PORT , ()=> {
    console.log("Server is started on the port: ",PORT)
})
