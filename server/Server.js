const express = require('express')
const connect = require('./DB/Connection')
const taskRouter = require('../server/Router/Route')
const cors = require('cors')
const app = express()
const port = 5000

app.use(express.json())
app.use(cors())
app.use('/api', taskRouter)

const start = async () => {
    try {
        await connect()
        app.listen(port, () => console.log(`Connect to server at port ${port}...`))
    } catch (err) {
        console.log(err)
    }

}

start()

app.get("/", (req, res)=>{
    res.send("sup")
})