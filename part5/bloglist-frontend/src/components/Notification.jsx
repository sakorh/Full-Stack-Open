const Notification = ({ success, error }) => {
  if (success === null && error === null) {
    return null
  } else if (error === null) {
    return (
      <div className="success">
        {success}
      </div>
    )
  } else {
    return (
      <div className="error">
        {error}
      </div>
    )
  }
}

export default Notification