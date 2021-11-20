import React, {useState} from 'react'

const Button = (props) => <button onClick={props.handleClick}>{props.text}</button> 

const Statistics = (props) => {
  if (props.allClicks === 0) {
    return (
      <div>No feedback given</div>
    )
  }
  return (
    <table>
    <>
      <StatisticsLine text="good:" value={props.good} />
      <StatisticsLine text="neutral:" value={props.neutral} />
      <StatisticsLine text="bad:" value={props.bad} />
      <StatisticsLine text="all:" value={props.allClicks} />
      <StatisticsLine text="average:" value={props.average} />
      <StatisticsLine text="positive:" value={props.positive} />
    </>
    </table>
  )
}

const StatisticsLine = (props) => {
  return (
    <tbody>
    <tr>
       <td>{props.text}</td> 
      <td>{props.value}</td>
    </tr>
    </tbody>
  )
}

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const [allClicks, setAll] = useState(0)

  const handleGoodClick = () => {
    setGood(good + 1)
    setAll(allClicks + 1)
  }  
  const handleNeutralClick = () => {
    setNeutral(neutral + 1)
    setAll(allClicks + 1)
  } 
  const handleBadClick = () => {
    setBad(bad + 1)
    setAll(allClicks + 1)
  } 
  return (
    <div>
      <h1>give feedback</h1>
      <Button handleClick={handleGoodClick} text='good' />
      <Button handleClick={handleNeutralClick} text='neutral' />
      <Button handleClick={handleBadClick} text='bad' />
      <h1>statistics</h1>
      <Statistics allClicks={allClicks} 
       good={good} 
       neutral={neutral} 
       bad={bad} 
       average={(good - bad)/allClicks} 
       positive={(good/allClicks)*100 + " %"}/>
    </div>
  )
}

export default App
