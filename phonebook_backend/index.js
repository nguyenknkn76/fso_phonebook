const express = require('express')
const app = express()
app.use(express.json())

const cors = require('cors')
app.use(cors())

app.use(express.static('dist'))

//!config morgan
const morgan = require('morgan')
morgan.token('body', function (req, res) { 
    return JSON.stringify(req.body)
})
const formatStr = ':method :url :status :res[content-length] - :response-time ms :body'
app.use(morgan(formatStr))

let persons = [
    { 
    "id": 1,
    "name": "Arto Hellas", 
    "number": "040-123456"
    },
    { 
    "id": 2,
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
    },
    { 
    "id": 3,
    "name": "Dan Abramov", 
    "number": "12-43-234345"
    },
    { 
    "id": 4,
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
    },
    {
    "id":5,
    "name":"test backend",
    "number":"4172895323"
    }
]
app.get(`/info`, (req, res) => {
    const currentDate = new Date
    console.log(currentDate)
    res.send(`<p>phonebook has info for ${persons.length} people</p><br/><p>${currentDate}</p>`)
})
app.get(`/api/persons`, (req, res) => {
    res.json(persons)
})
app.get(`/api/persons/:id`, (req, res)=> {
    const id = Number(req.params.id)
    const person = persons.find(person => person.id === id)
    if(person){
        res.json(person)
    }else{
        res.status(404).json({error:'sai vl'})
    }
})

app.delete(`/api/persons/:id`,(req, res) =>{
    const id = Number(req.params.id)
    persons = persons.filter(person => person.id !== id)
    res.status(204).end()
    console.log('delete success backend')
    // console.log(persons)
})

const generateId = () =>{
    const maxId = Math.max(...persons.map(person => person.id))
    return maxId + 1
}
const checkExist = (name) => {
    const check = persons.find(person => person.name === name)
    if (check) return false
    else return true
}
app.post(`/api/persons`, (req,res) => {
    const reqName = req.body.name
    const reqNumber = req.body.number
    if (!reqName || !reqNumber){
        return res.status(400).json({error: "content missing"})
    }
    if (!checkExist(reqName)){
        return res.status(400).json({error:"name must be unique"})
    }
    const person = {
        id: generateId(),
        name: reqName,
        number: reqNumber
    }
    persons = persons.concat(person)
    res.json(person)
    
})


const PORT = process.env.PORT || 3001
app.listen(PORT)
console.log(`server running on port ${PORT}`)