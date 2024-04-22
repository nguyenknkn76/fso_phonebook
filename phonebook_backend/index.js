const express = require('express')
const app = express()

app.use(express.static('dist'))
app.use(express.json())

require('dotenv').config()
const PersonMg = require('./models/personModel')

const cors = require('cors')
app.use(cors())

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
    // res.json(persons)
    PersonMg.find({}).then(persons => {
        res.json(persons)
    })
})

app.get(`/api/persons/:id`, (req, res, next)=> {
    PersonMg.findById(req.params.id)
        .then(person => {
            if(person){
                res.json(person)
            } else{
                res.status(404).end()
            }
        })
        .catch(err => next(err))
})

app.delete(`/api/persons/:id`,(req, res, next) =>{
    PersonMg.findByIdAndDelete(req.params.id)
        .then(result => {
            res.status(204).end()
            console.log('delete success')
        })
        .catch(err => next(err))
})

app.put(`/api/persons/:id`, (req,res,next) => {
const {name, number} = req.body
    PersonMg.findByIdAndUpdate(
        req.params.id, 
        {name, number}, 
        {new:true, runValidators: true, context:'query' }
    )
        .then(updatedPerson => {
            res.json(updatedPerson)
        })
        .catch(err => next(err))
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
        console.log('content missing err')
        return res.status(400).json({error: "content missing"})
    }
    if (!checkExist(reqName)){
        console.log('name exist err')
        return res.status(400).json({error:"name must be unique"})
    }
    const newPerson = new PersonMg ({
        name: reqName,
        number: reqNumber
    })
    newPerson.save()
        .then(savedPerson => {
            res.json(savedPerson)
        })
        .catch(err => next(err))
})

const unknownEndpoint = (req, res) => {
    res.status(404).send({error:"unknown endpoint"})
}
app.use(unknownEndpoint)

const errorHandler = (err, req, res, next) => {
    console.error(err.message)
    if(err.name === 'CastError'){
        return res.status(400).send({error:'malformatted id'})
    } else if (err.name === 'ValidationError'){
        return res.status(400).json({error: err.message})
    }
    next(err)
}
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
})
