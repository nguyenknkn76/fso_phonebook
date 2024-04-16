const PersonForm = ({onSubmit, nameValue, numberValue, nameOnChange, numberOnChange}) => {
    return(
      <div>
        <form onSubmit={onSubmit}>
          <div> name: <input value = {nameValue} onChange={nameOnChange}/></div>
          <div> number: <input value = {numberValue} onChange={numberOnChange}/></div>
          <div>
            <button type="submit">add</button>
          </div>
        </form>
      </div>
    )
  }

export default PersonForm