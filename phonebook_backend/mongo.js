const mongoose = require('mongoose')
// const { default: Person } = require('../phonebook_frontend/src/components/PersonComponent')

if (process.argv.length < 3){
    console.log('give password as argument')
    process.exit(1)
}

const password =  process.argv[2]
const url = `mongodb+srv://nguyenknkn76:${password}@clusterfso2.zjsmwck.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=ClusterFso2`

mongoose.set('strictQuery',false)
mongoose.connect(url)

const personMgSchema = new mongoose.Schema({
    name: String,
    number: String
})

const PersonMg = mongoose.model('Person',personMgSchema)

const newName = process.argv[3]
const newNumber = process.argv[4]

const person = new PersonMg ({
    name: newName,
    number: newNumber
})

if (process.argv.length === 3) {
    PersonMg.find({name:"nguyen"}).then(result => {
        result.forEach(person => {
            console.log(person)
        })
        mongoose.connection.close()
    })
}
if (process.argv.length === 5){
    person.save().then(result => {
        console.log(`added ${newName} number ${newNumber} to phonebook`)
        mongoose.connection.close()
    })
}


