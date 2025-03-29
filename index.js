const express = require('express')
const app = express()
const userRoute = require('./routes/user.route')
const database = require('./lib/dbConnect')
const dotenv = require('dotenv')
const cors = require('cors')

dotenv.config()

const PORT = process.env.PORT || 4000
database.connect()
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

app.use('/api/v1/user',userRoute)

app.listen(PORT,() => {
    console.log(`App is running at ${PORT}`)
})

module.exports = app