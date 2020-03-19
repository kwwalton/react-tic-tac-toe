import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button className={props.classList} onClick={props.onClick}>
      {props.value}
    </button>
  )
}

class Board extends React.Component {
  
  renderSquare(i) {
    return (
      <Square
        classList = {this.props.classList[i]}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  createTable = () => {
    let table = []
    let someNum = 0;
    // Outer loop to create parent
    for (let i = 0; i < 3; i++) {
      let children = []
      //Inner loop to create children
      for (let j = 0; j < 3; j++) {
        children.push(<td key={`${j+someNum}`}>{this.renderSquare(`${j+someNum}`)}</td>)
      }
      someNum += 3;
      //Create the parent and add the children
      table.push(<tr key={i}>{children}</tr>)
    }
    return table
  }

  render() {
    //const gameTitle = 'Tic Tac Toe';
    return (
      <div>
        <div className="game-title">{this.props.title}</div>
        <div className="game-subtitle">{this.props.subTitle}</div>
        {/* <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div> */}


      {/* {this.makeTheBoard()}  */}

      <table className="board-grid">
        <tbody>
        {this.createTable()}
        </tbody>
      </table>

      </div>
    );
  }
}
// TODO: Needs to keep track of the class list history and the status history
class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      historyPosition: [{
        player: Array(9).fill(null),
      }],
      classListHistory: [{
        classList: Array(9).fill("square"),
      }],
      classList: Array(9).fill("square"),
      listReversed: false,
      currentSquareValue: null,
      stepNumber: 0,
      whichSquare: 0,
      xIsNext: true,
      gameOver: false,
      status:'Next player: X',
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    const position = this.state.historyPosition;
    // Do we already have a winner or is the square already filled?
    //console.log('Gam Over is : '+this.state.gameOver);
    if (calculateWinner(squares, this) || squares[i]) {
      return;
    }
    // console.log('game over? '+this.state.gameOver)


    // Evaluate 
    // if the square is already full
    // if the game is over
    // then update...


    // if (this.state.gameOver || squares[i]) {
    //   console.log('condition met should return');
    //   return;
    // }
    // Who's turn is next?
    squares[i] = this.state.xIsNext ? 'X' : 'O';

    // What are the classes on all the squares?
    const classValues = this.state.classList;
    //console.log(classValues);

    // Set state
    this.setState({
      history: history.concat([{
        squares: squares,
      }]),
      position: position[history.length] = squares[i],
      currentSquareValue: i,
      whichSquare: i,
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });

  const winner = calculateWinner(squares, this);
  

  const gameOver = this.state.gameOver;
    let status;
    if (winner) {
      status = 'Winner: ' + winner + ', Game Over';
      console.log('Winner');
      
    }
    else if (gameOver && !winner) {
      status = 'Full Board, Game Over';
    }
    else {
      status = 'Next player: ' + (!this.state.xIsNext ? 'X' : 'O');

    }

// TODO: Set the state of the classlist for squares here
const classListHistory = this.state.classList.slice(0, this.state.stepNumber + 1);
const classList = this.state.classList;
console.log('class list : '+classList);
    this.setState({
      status: status,
      classListHistory: classListHistory.concat([{
        classList: classList,
      }]),    
    })

    // Is the board full?
    if (isBoardFull(squares)) {
      this.setState({
        gameOver: true,
      });
    } else {
      console.log('I just unset game over ');
      this.setState({
        gameOver: false,
      });
    }
  }

  // Sets boolean used in moves list, to reverse it or not
  sortIt(list) {
    if (this.state.listReversed) {
      this.setState({
        listReversed: false
      })
    }
    else {
      this.setState({
        listReversed: true
      })
    }
  }

  // Moves list button actions
  jumpTo(step) {
    // how many steps are there, is the step a winning move
    // TODO: track the winning move and status per history
    
    // But check if 
    if (step < 9) {
      this.setState({
        gameOver: false,
        classList: Array(9).fill("square"),
      });
    }

    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
    let hereWeBe = this.state.history[step].squares.slice();
    //console.log('here : '+this.state.history[this.state.history.length - 1].squares.slice());
    calculateWinner(hereWeBe, this);
  }

  render() {
    //this runs once initially and then on each click
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    //const winner = calculateWinner(current.squares);
    const whichSquare = this.state.whichSquare;
    const historyPosition = this.state.historyPosition;
    const title = 'Tic Tac Toe';
    const subTitle = 'Learning React';
    const gridLookUp = [
      'Row 1 Col 1', 'Row 1 Col 2', 'Row 1 Col 3',
      'Row 2 Col 1', 'Row 2 Col 2', 'Row 2 Col 3',
      'Row 3 Col 1', 'Row 3 Col 2', 'Row 3 Col 3'
    ];
    const classList = this.state.classList;
    let currentMove = this.state.stepNumber;
    let theClass = '';
    const moves = history.map((step, move) => {
      //console.log('currentMove : ' + currentMove + ' move : ' + move);
      const desc = move ?
        'Go to move #' + move + ' : ' + historyPosition[move] + ' ' + gridLookUp[whichSquare] :
        'Go to game start';
      move === currentMove ? (theClass = 'bold') : (theClass = '');
      return (
        <li key={move} className={theClass}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      )
    });



    

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
            classList={classList}
            title={title}
            subTitle={subTitle}
          />
          <span className="game-status">{this.state.status}</span>
        </div>
        <div className="game-info">
          <span>Move History</span>
          <button className="sort-button" onClick={() => this.sortIt(history)}>Reverse History Order</button>
          <ol>{this.state.listReversed ? moves.reverse() : moves}</ol>
        </div>
        </div>
    );
  }
}

function isBoardFull(squares) {
  let boardFull;
  for (let i = 0; i < squares.length; i++) {
    if (squares[i] === null) {
      boardFull = false;
      break;
    } else {
      boardFull = true;
    }
  }
  return boardFull;
}

// Possible winning position
function calculateWinner(squares, thisref) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    //console.log('squares[a]: '+squares[a]+' squares[b]: '+squares[b]+' squares[c]: '+squares[c]);
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      //console.log('i: ' + i + ' lines: ' + lines[i]);
      // TODO: call a highlight background tile function
      let cat = thisref.state.classList.slice();
      //console.log('cat :'+cat);
      cat[lines[i][0]] = "square win";
      cat[lines[i][1]] = "square win";
      cat[lines[i][2]] = "square win";
      //const gameOver = this.state.gameOver;
      thisref.setState({
        classList: cat,
        gameOver: true,
      });
    
      //console.log('win : '+this.state.classList);
      //
      return squares[a];
    }
  }
  return null;
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);