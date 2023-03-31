const express = require('express')
const app = express()
const dotenv = require('dotenv')
const connectDB = require('./dbConnect')
const cors = require('cors')
dotenv.config()

const contacts = require('./routes/routes')
const authRoute = require('./routes/authRoute')
const authMiddleware = require("./middleware/auth")

port = process.env.port

app.use(express.static('./public'));
app.use(express.json());
app.use(cors());
app.use('/' , authRoute)
app.use('/' , authMiddleware,  contacts)


app.get('/' , authMiddleware, (req,res)=>{
    res.send('hello world')
})

app.use('*', (req, res) => {
    res.status(404).send('Error 404 - Page not found')
  })

  
const startServer = async () =>{
    await connectDB()
    console.log('dbconnected successfully');
    app.listen(port , ()=>{
        console.log('server started');
    })
}


startServer()