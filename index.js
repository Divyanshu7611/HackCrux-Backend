const express = require('express')
const app = express()

const dotenv = require('dotenv')
const cors = require('cors')

dotenv.config()

const PORT = process.env.PORT || 4000

app.use(express.json())
app.use(
    cors({
        origin: '*',
        credentials:true
    })
)


// def routes

app.get('/',(req,res)=>{
    return res.json({
        success:true,
        message:"Yours Server is up & running...."
    })
})

app.listen(PORT,() => {
    console.log(`App is running at ${PORT}`)
})

