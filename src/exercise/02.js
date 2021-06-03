// useEffect: persistent state
// http://localhost:3000/isolated/exercise/02.js

import * as React from 'react'

const useLocalStorageState = (storageValue, initialValue = '') => {
  // 🐨 initialize the state to the value from localStorage
  const [value, setValue] = React.useState(
    () =>
      window.localStorage.getItem(storageValue) || serializeValue(initialValue),
  );

  function handleChange(event) {
    setValue(serializeValue(event.target.value));
  }

  function serializeValue(val) {
    return JSON.stringify(val);
  }

  function parseValue(val) {
    return JSON.parse(val);
  }

  // 🐨 Here's where you'll use `React.useEffect`.
  // The callback should set the `name` in localStorage.
  // 💰 window.localStorage.setItem('name', name)
  React.useEffect(() => {
    window.localStorage.setItem(storageValue, value)
  }, [storageValue, value])
  
  return [value !== undefined ? parseValue(value) : value, handleChange]
}

function Greeting({initialName = 'Steve'}) {
  const [name, setName] = useLocalStorageState('name', initialName);
  const [age, setAge] = useLocalStorageState('age', undefined);
  const [hobbies, setHobbies] = useLocalStorageState('hobbies', { hobby1: 'karate' });

  function handleButtonClick() {
    const hobbies = { hobby1: 'cycling', hobby2: 'swimming', hobby3: 'salsa dancing'};
    setHobbies({ target: { value: hobbies }});
  }

  return (
    <div>
      <form>
        <label htmlFor="name">Name: </label>
        <input value={name} onChange={setName} id="name" />
        <label htmlFor="age">Age: </label>
        <input value={age} onChange={setAge} type="number" id="age" />
        <button onClick={handleButtonClick}>Set hobbies</button>
      </form>

      <div>
        {name ? <div>Hello {name}</div> : 'Please type your name'}
        {age ? <div>You are {age} years old</div> : 'Please type your age'}
        <pre>{JSON.stringify(hobbies)}</pre>
      </div>
    </div>
  )
}

function App() {
  return <Greeting initialName="Gary" />
}

export default App
