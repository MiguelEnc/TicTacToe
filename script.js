var humanPlayer = '',
    computer = '',
    playerOnTurn = '',
    originalBoard = [],
    winPositions = [
      // horizontally
      [0,1,2],
      [3,4,5],
      [6,7,8],
      // vertically
      [0,3,6],
      [1,4,7],
      [2,5,8],
      // diagonally
      [0,4,8],
      [2,4,6]
    ];


$(document).ready(function(){

  // Player selection modal configuration
  $('#playerSelectionModal').modal({
      dismissible: false,
      opacity: .5,
      inDuration: 200,
      outDuration: 400,
      startingTop: '4%',
      endingTop: '40%',
      ready: function(modal) {
        // Sets modal on the center of the screen vertically
        modal.css('transform', 'translateY(-40%)');        
      }
    }
  );
  initializeBoard();
  $('#playerSelectionModal').modal('open');
});

document.getElementById('playAgain').onclick = function(){
  initializeBoard();
  // TODO: if game over, add points to winner
  // TODO: reset player on turn
}


function initializeBoard(){
  originalBoard = Array.from(Array(9).keys());
  originalBoard.fill("");
  let cells = document.querySelectorAll('.cell');

  for(var i = 0; i < cells.length; i++){
    cells[i].innerText = '';
    cells[i].style.removeProperty('background-color') ;
    cells[i].addEventListener('click', playerClick);
  }
}

function playerClick(cell){
  playOnCell(cell.target.id, playerOnTurn);
}

function playOnCell(cellId, player) {
  
  // When position haven't been played
  if(originalBoard[cellId] !== humanPlayer & 
     originalBoard[cellId] !== computer){
    
    originalBoard[cellId] = player;
    document.getElementById(cellId).innerText = player;
    if(playerWins(originalBoard, playerOnTurn)){
      console.log('ganador');
    } else changeTurn();
  }  
}



// a Node represents the states on the game tree
function nodeFactory(currentPlayer, currentState, action) {
  return {
    state: [],
    utility: 0,
    maximizing: true,
    parentNode: null,
    childrenNodes: [],
    visitedNode: false,

    // this node's player
    getPlayer: function() {
      if(currentPlayer === 'X') return 'O';
      else return 'X';
    },

    // a node is terminal when a player wins on it's state
    isTerminal: function(){
      if(playerWins(this.getState(), this.getPlayer())){
        if(this.isMaximizing()){
          this.setUtility(10);
        } else {
          this.setUtility(-10);
        }
        return true;
      } 
      return false;
    },

    // board state
    getState: function(){
      this.state = currentState;
      this.state[action] = this.getPlayer();
      return this.state;
    },

    // Returns array of blank spaces of this node state
    // which are available actions of this node's childrens
    getAvailableActions: function(){
      let availableActions = [];
      this.getState().map(position => {
        if(position !== 'X' && position !== 'O')
        availableActions.push(this.state.indexOf(position));
      });
      return availableActions;
    },
    
    // the value of this state for this player
    getUtility: function(){
      return this.utility;
    },

    setUtility: function(utility){
      this.utility = utility;
    },
    
    isMaximizing: function(){
      //TODO: calcular utilidad en base a esto
      return this.maximizing;
    },
    setMaximizing: function(maximizing){
      //TODO: calcular utilidad en base a esto
      this.maximizing = maximizing;
    },
    
    // this node's parent
    getParentNode: function(){
      return this.parentNode;
    },
    setParentNode: function(node){
      this.parentNode = node;
    },

    getChildrenNodes(){
      return this.childrenNodes;
    },
    
    wasVisited(){
      return this.visitedNode;
    },
    setVisited(visited){
      this.visitedNode = visited;
    }
  };
}

function playerWins(board, player) {
  winPositions.map(winCombo => {
    if(board[winCombo[0]] === board[winCombo[1]] &&
       board[winCombo[0]] === board[winCombo[2]]){
      return true;
    }
  });
  return false;
}


function changeTurn() {
  if(playerOnTurn === humanPlayer){
    playerOnTurn = computer;
  } else {
    playerOnTurn = humanPlayer;
  }
  
  if(playerOnTurn === 'X'){
    document.getElementById('player1-symbol').classList.remove('currentTurn');
    document.getElementById('player1-label').classList.remove('currentTurn');
    document.getElementById('player2-symbol').classList.add('currentTurn');
    document.getElementById('player2-label').classList.add('currentTurn');
  } else {
    document.getElementById('player2-symbol').classList.remove('currentTurn');
    document.getElementById('player2-label').classList.remove('currentTurn');
    document.getElementById('player1-symbol').classList.add('currentTurn');
    document.getElementById('player1-label').classList.add('currentTurn');
  }
}


// Player X selection on modal event
document.getElementById('player-x').onclick = function(){
  document.getElementById('player1-label').innerText = 'Computer';
  document.getElementById('player2-label').innerText = 'Player';
  document.getElementById('player2-label').classList.add('currentTurn');
  document.getElementById('player2-symbol').classList.add('currentTurn');
  humanPlayer = 'X';
  computer = 'O';
  playerOnTurn = humanPlayer;
};

// Player O selection on modal event
document.getElementById('player-o').onclick = function(){
  document.getElementById('player1-label').innerText = 'Player';
  document.getElementById('player2-label').innerText = 'Computer';
  document.getElementById('player1-label').classList.add('currentTurn');
  document.getElementById('player1-symbol').classList.add('currentTurn');
  humanPlayer = 'O';
  computer = 'X';
  playerOnTurn = humanPlayer;
};
