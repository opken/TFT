const express = require('express')
const app = express();
const port = 3000
const host = 'localhost'
const cors = require('cors')

var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// testing
let champcost1 = []
let champcost2 = []
let champcost3 = []
let champcost4 = []
let champcost5 = []
function fillChamps(data) {
    for (let champ of data) {
        switch(champ.cost) {
            case 1:
                for (let i = 0; i < 29; i++) {
                    champcost1.push(champ.name)
                }
                break;
            case 2:
                for (let i = 0; i < 22; i++) {
                    champcost2.push(champ.name)
                }
                break;
            case 3:
                for (let i = 0; i < 18; i++) {
                    champcost3.push(champ.name)
                }
                break;
            case 4:
                for (let i = 0; i < 12; i++) {
                    champcost4.push(champ.name)
                }
                break;
            case 5:
                for (let i = 0; i < 10; i++) {
                    champcost5.push(champ.name)
                }
        }
    }
    shuffleChamps()
}
function shuffleChamps() {
    champcost1 = shuffle(champcost1);
    champcost2 = shuffle(champcost2);
    champcost3 = shuffle(champcost3);
    champcost4 = shuffle(champcost4);
    champcost5 = shuffle(champcost5);
    // test
}
app.use(cors())
app.get('/champions', (req,res) => {
    console.log('hi')
    data = require('./api/champions.json')
    fillChamps(data)
    res.send(data)
})
app.get('/traits', (req,res) => {
    console.log('hi')
    data = require('./api/traits.json')
    res.send(data)
})
app.get('/shop', (req,res) => {
    let shop = []
    for (let i = 0; i < 5; i ++) {
        shop.push(getChamp())
    }
    console.log(shop)
    res.send(shop)
})
app.post('/buy', (req,res) => {
    console.log(req.body)
})
function getChamp(){
    let champLevel = getChampLevel()
    let champ;
    switch(champLevel) {
        case 1:
            champ = champcost1[0]
            break;
        case 2:
            champ = champcost2[0]
            break;
        case 3:
            champ = champcost3[0]
            break;
        case 4:
            champ = champcost4[0]
            break;
        case 5:
            champ = champcost5[0]
    }
    shuffleChamps()
    return champ
}

function shuffle(array) {
    let current = array.length, temporary, random;

    while(0 !== current) {
        random = Math.floor(Math.random()*current)
        current -= 1;

        temporary = array[current]
        array[current] = array[random]
        array[random] = temporary
    }
    return array
}
function getChampLevel() {
    let roll = getRandomInt(100);
    let levelProbability = getProbability(9);
    console.log(roll)
    console.log(levelProbability)
    for (let i = 0; i < 5; i++) {
        if (roll >= levelProbability[i][0] && roll <= levelProbability[i][1]) {
            switch(i) {
                case 0:
                    return 1
                case 1:
                    return 2
                case 2:
                    return 3
                case 3:
                    return 4
                case 4:
                    return 5    
            }
        }
    }
 }
function getProbability(level) {
    switch(level) {
        case 1:
            return [[0,99],0,0,0,0] 
        case 2:
            return [[0,99],0,0,0,0]
        case 3:
            return [[0,74],[75,99],0,0,0]
        case 4:
            return [[0,54],[55,84],[85,99],0,0]
        case 5:
            return [[0,44],[45,77],[78,97],[98,99],0]
        case 6:
            return [[0,24],[25,64],[65,94],[95,99],0]
        case 7:
            return [[0,18],[19,48],[49,83],[84,98],[99,99]]
        case 8:
            return [[0,14],[15,34],[35,69],[70,94],[95,99]]
        case 9:
            return [[0,9],[10,24],[25,54],[55,84],[85,99]]
    }
}
function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

app.get('/', (req, res) => {
    res.send('hi')
    console.log('test git')
})
app.use(express.static('static'));
app.listen(port, host, () => {
    console.log(`Server is running at ${host}:${port}`)
})