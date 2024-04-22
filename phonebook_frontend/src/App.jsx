import { useEffect, useState } from "react"
import axios from 'axios'
import personService from "./services/PersonService"
import PersonForm from "./components/PersonForm"
import Filter from "./components/FilterComponent"
import PersonComponent from "./components/PersonComponent"
import Notification from "./components/NotificationComponent"

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [searchKey, setSearchKey] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [errorMessage, setErrorMessage] = useState({type: null, text: null})
  
  useEffect(() => {
    personService
      .getAll()
      .then(initPersons => {
        setPersons(initPersons)
      })
    // axios
    //   .get('http://localhost:3001/persons')
    //   .then(response => {
    //     setPersons(response.data)
    //     console.log(response.data)
    //   })
  },[])
  // console.log('render',persons.length)

  const deletePerson = (id) => {
    if(window.confirm(`do you want to delete person ${id} ?`)){
      console.log(`delete person have id ${id}`)
      personService
        .deleteById(id)
        .then(returnedPerson => {
          setErrorMessage({type:'notification',text:`delete person ${id} success`})
          setTimeout(() =>{
            setErrorMessage({type:null,text:null})
          },5000)
          //! BUG: display bug after delete (comps doesn't re-render)
          let updatedPersons = persons.filter(person => person.id !== returnedPerson.id)
          setPersons(updatedPersons)
          let updatedSearchResults = searchResults.filter(person => person.id !== returnedPerson.id)
          setSearchResults(updatedSearchResults)
        })
        .catch(err => {
          setErrorMessage({type:'error', text:`information of person ${id} has already been removed from server`})
          setPersons(persons.filter(person => person.id !== id))
          setSearchResults(searchResults.filter(person => person.id !== id))
          setTimeout(() => {
            setErrorMessage({type:null,text:null})
          }, 5000)
        })
      //todo use "window.open()" like redirect
      // window.open("http://localhost:3001/persons")
    }
  }

  const checkExistName = (checkedName) => {
    let check = persons.some(person => person.name === checkedName)
    return check
  }
  const checkExistNumber = (checkedNumber) => {
    let check = persons.some(person => person.number === checkedNumber)
    return check
  }
  const generateId = () =>{
    let maxId = Math.max(...persons.map(person => person.id))
    return maxId + 1 
  }
  const addNewPerson = (event) => {
    event.preventDefault()
    console.log('button clicked', event.target)
    console.log(checkExistName(newName))
    if (checkExistName(newName) || checkExistNumber(newNumber)){
      // alert(`${newName} is already added to phonebook`)
      //todo update person information
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one`)){
        const personObject = {
          id: generateId(),
          name: newName,
          number: newNumber
        }
        const foundPerson = persons.find(person => person.name === newName || person.number === newNumber)
        const personId = foundPerson.id
        personService
          .update(personId, personObject)
          .then(returnedPerson => {
            const updatedPersons = persons.map(person => person.id !== personId ? person : returnedPerson)
            setErrorMessage({type:'notification', text:`Updated ${returnedPerson.name} sucess`})
            setTimeout(()=>{
              setErrorMessage({type:null, text: null})
            },5000)
            setPersons(updatedPersons)
            setNewName('')
            setNewNumber('')
          })
      }
    }else{   
      const personObject = {
        name: newName,
        number: newNumber
      }
      personService
        .create(personObject)
        .then(returnedPerson => {
          setErrorMessage({type:'notification', text:`Added ${returnedPerson.name} sucess`})
          setTimeout(()=>{
            setErrorMessage({type:null, text: null})
          },5000)
          setPersons(persons.concat(returnedPerson))
          setNewName('')
          setNewNumber('')
        })
        .catch(err => {
          console.log(err.response.data.error)
        })
      // axios
      //   .post('http://localhost:3001/persons', personObject)
      //   .then(response => {
      //     setPersons(persons.concat(response.data))
      //     setNewName('')
      //     setNewNumber('')
      //   })
      // setPersons(persons.concat(personObject))
      // setNewName('')
      // setNewNumber('')
    }
    
  }

  const handleNewNameChange = (event) => {
    setNewName(event.target.value)
  }
  const handleNewNumberChange = (event) => {
    setNewNumber(event.target.value)
  }
  const handleSearchKeyChange = (event) => {
    const searchTerm = event.target.value
    setSearchKey(event.target.value)
    // console.log(searchTerm)
    const results = persons.filter(person => person.name.toLowerCase().includes(searchTerm.toLowerCase()))
    setSearchResults(results)
  }
  return(
    <div>
      <h2>phonebook</h2>
      <Notification message = {errorMessage}/>
      <h2>add a new</h2>
      <PersonForm
        onSubmit = {addNewPerson}
        nameValue = {newName} nameOnChange = {handleNewNameChange}
        numberValue = {newNumber} numberOnChange = {handleNewNumberChange}
      />

      <h2>numbers</h2>
      <ul>
        {persons.map(person => 
          <PersonComponent
            key = {person.id} 
            person = {person} 
            deletePerson = {() => deletePerson(person.id)}
          />
        )}
      </ul>
      
      
      <h2>search results</h2>
      <Filter value = {searchKey} onChange = {handleSearchKeyChange}/>

      <ul>
        {searchResults.map(person => 
          <PersonComponent
            key = {person.id} 
            person = {person} 
            deletePerson = {() => deletePerson(person.id)}
          />
        )}
      </ul>
      
      
      <div>debug: {newName} {newNumber}</div>
      <div>search term: {searchKey}</div>
    </div>
    
  )
}
export default App