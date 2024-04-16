const Notification = ({message}) => { 
    if (message.type === null) return null
    else if (message.type === 'error') return (<div className="error">{message.text}</div>)
    return (
        <div className='notification'>{message.text}</div>
    )
}
export default Notification