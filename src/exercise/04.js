// useState: tic tac toe
// http://localhost:3000/isolated/exercise/04.js

import * as React from 'react'

const DEFAULT_STATE = Array(9).fill(null)
const DEFAULT_MOVES = [DEFAULT_STATE]

function Board({squares, onClick}) {
  function renderSquare(i) {
    return (
      <button className="square" onClick={() => onClick(i)}>
        {squares[i]}
      </button>
    )
  }

  return (
    <div>
      <div className="board-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="board-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="board-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
    </div>
  )
}

function Moves({moves, current, onClick}) {
  return (
    <ol style={{display: 'flex', flexFlow: 'column', margin: 0, padding: 0}}>
      {moves.map((move, index) => {
        const isCurrent = index === current
        const text = index === 0 ? 'Go to game start' : `Go to move #${index}`

        return (
          <button
            key={`move-${index}`}
            title={JSON.stringify(move)}
            disabled={index === current}
            onClick={() => onClick(index)}
          >
            {text} {isCurrent ? '(current)' : null}
          </button>
        )
      })}
    </ol>
  )
}

function Game() {
  // 🐨 squares is the state for this component. Add useState for squares
  const [squares, setSquares] = React.useState(() => {
    const localValue = window.localStorage.getItem('squares')
    return localValue ? JSON.parse(localValue) : DEFAULT_STATE
  })

  const [moves, setMoves] = React.useState(() => {
    const localMoves = window.localStorage.getItem('moves')
    return localMoves ? JSON.parse(localMoves) : DEFAULT_MOVES
  })

  const nextValue = calculateNextValue(squares)
  const winner = calculateWinner(squares)
  const status = calculateStatus(winner, squares, nextValue)
  const moveIndex = moves.findIndex(move =>
    move.every((element, index) => element === squares[index]),
  )

  function restart() {
    window.localStorage.removeItem('squares')
    window.localStorage.removeItem('moves')
    setSquares(DEFAULT_STATE)
    setMoves(DEFAULT_MOVES)
  }

  // This is the function your square click handler will call. `square` should
  // be an index. So if they click the center square, this will be `4`.
  function selectSquare(square) {
    if (winner) {
      return
    }

    const squaresCopy = [...squares]
    squaresCopy[square] = nextValue
    let newMoves

    if (moveIndex === moves.length - 1) {
      newMoves = [...moves, squaresCopy]
    } else {
      newMoves = [...moves.slice(0, moveIndex + 1), squaresCopy]
    }

    window.localStorage.setItem('squares', JSON.stringify(squaresCopy))
    window.localStorage.setItem('moves', JSON.stringify(newMoves))

    setSquares(squaresCopy)
    setMoves(newMoves)
  }

  function selectMoves(index) {
    const newMoves = moves[index]
    window.localStorage.setItem('squares', JSON.stringify(newMoves))
    setSquares(newMoves)
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board squares={squares} onClick={selectSquare} />
        <button className="restart" onClick={restart}>
          restart
        </button>
      </div>
      <div className="game-info">
        <div>{status}</div>
        <Moves moves={moves} current={moveIndex} onClick={selectMoves} />
      </div>
    </div>
  )
}

// eslint-disable-next-line no-unused-vars
function calculateStatus(winner, squares, nextValue) {
  return winner
    ? `Winner: ${winner}`
    : squares.every(Boolean)
    ? `Scratch: Cat's game`
    : `Next player: ${nextValue}`
}

// eslint-disable-next-line no-unused-vars
function calculateNextValue(squares) {
  const xSquaresCount = squares.filter(r => r === 'X').length
  const oSquaresCount = squares.filter(r => r === 'O').length
  return oSquaresCount === xSquaresCount ? 'X' : 'O'
}

// eslint-disable-next-line no-unused-vars
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]
    }
  }
  return null
}

function App() {
  return <Game />
}

export default App
