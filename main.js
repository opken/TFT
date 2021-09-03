const express = require('express')
const app = express();
const port = 80
const host = 'localhost'
const cors = require('cors')

app.use(cors())
app.get('/champions', (req,res) => {
    console.log('hi')
    data = require('./api/champions.json')
    res.send(data)
})

app.get('/', (req, res) => {
    res.send('hi')
    console.log('ie')
})

app.use(express.static('static'));
app.listen(port, host, () => {
    console.log(`Server is running at ${host}:${port}`)
})