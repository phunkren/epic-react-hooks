// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
import { ErrorBoundary } from 'react-error-boundary';

import {
  fetchPokemon,
  PokemonDataView,
  PokemonForm,
  PokemonInfoFallback,
} from '../pokemon'

const DEFAULT_DATA = {
  status: 'idle',
  pokemon: null,
  error: null,
};

function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div role="alert">
      There was an error:{' '}
      <pre style={{whiteSpace: 'normal'}}>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  )
}


function PokemonInfo({pokemonName}) {
  const [data, setData] = React.useState(DEFAULT_DATA);

  React.useEffect(() => {       
    if (pokemonName) {
      setData({
        status: 'pending',
        pokemon: null,
        error: null,
      });
      
      fetchPokemon(pokemonName)
      .then(response => {
        setData({
          status: 'resolved',
          pokemon: response,
          error: null,
        })

      })
      .catch(error => {
        setData({
          status: 'rejected',
          pokemon: null,
          error,
        })
      });
    }
  }, [pokemonName])
  
  // 🐨 return the following things based on the `pokemon` state and `pokemonName` prop:
  //   1. no pokemonName: 
  if (data.status === 'idle') {
    return 'Submit a pokemon';
  }
  
  //   2. pokemonName but no pokemon: <PokemonInfoFallback name={pokemonName} />
  if (data.status === 'pending') {
    return <PokemonInfoFallback pokemon={data.pokemon} />
  }
  
  if (data.status === 'rejected') {
    throw data.error; 
  }
  
  if (data.status === 'resolved') {
    return <PokemonDataView pokemon={data.pokemon} />
  }
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  function handleReset() {
    setPokemonName('');
  }

  return (
    <div className="pokemon-info-app">
        <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
        <hr />
        <div className="pokemon-info">
        <ErrorBoundary FallbackComponent={ErrorFallback} onReset={handleReset} resetKeys={[pokemonName]}>
          <PokemonInfo pokemonName={pokemonName} />
        </ErrorBoundary>
        </div>
      </div>
  )
}

export default App
