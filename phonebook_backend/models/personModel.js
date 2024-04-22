//! mongoose
const mongoose = require('mongoose')
// const password = process.argv[2]
// const url = `mongodb+srv://nguyenknkn76:${password}@clusterfso2.zjsmwck.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=ClusterFso2`
const url =  process.env.MONGO_URI
mongoose.set('strictQuery',false)
mongoose.connect(url)
    .then(rs => {
        console.log(`connecting to ${url}`)
    })
    .catch(err => {
        console.log(`error connecting to MongoDB: ${err.message}`)
    })

const personMgSchema = new mongoose.Schema({
    name: String,
    number: String
})
// const PersonMg = mongoose.model('Person', personMgSchema)

//! config person.id format
personMgSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})
module.exports = mongoose.model('Person',personMgSchema)