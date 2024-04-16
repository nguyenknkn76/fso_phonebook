const Person = ({person, deletePerson}) => {
    return(
        <li>
          {person.id} : {person.name} : {person.number} 
          <button onClick={deletePerson}>delete</button>
        </li>
    )
  }
  
export default Person