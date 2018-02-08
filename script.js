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
  $('#playerSelectionModal').modal('open');
  initializeBoard();
});

document.getElementById('playAgain').onclick = function(){
  initializeBoard();
  // TODO: if game over, add points to winner
  // TODO: reset player on turn
}


function initializeBoard(){
  // originalBoard = Array.from(Array(9).keys());
  // originalBoard.fill("");
  originalBoard = ["X","O","X","O","","X","X","",""];
  let parentNode = nodeFactory('X', originalBoard, null);
  generateTree(parentNode);

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


function generateTree(parentNode){
  parentNode.getAvailableActions().map(action => {
    let childrenNode = nodeFactory(parentNode.getPlayer(), parentNode.getState(), action);
    childrenNode.setParentNode(parentNode);
    parentNode.getChildrenNodes().push(childrenNode);

    if(parentNode.isMaximizing()){
      childrenNode.setMaximizing(false);
    } else {
      childrenNode.setMaximizing(true);
    }

    if(!boardFull(childrenNode.getState())){
      generateTree(childrenNode);
    }
  });
}

function boardFull(board){
  return board.includes("") ? false : true;
}


// a Node represents a state on the game tree
function nodeFactory(currentPlayer, currentState, action) {

  var node = {
    _player: '',
    _state: [],
    _maximizing: true,
    _utility: 0,
    _availableActions: [],
    _terminal: false,
    _parentNode: null,
    _childrenNodes: [],

    getPlayer: function() {      
      return this._player;
    },

    getState: function(){
      return this._state;
    },

    isMaximizing: function(){
      return this._maximizing;
    },

    setMaximizing: function(maximizing){
      this._maximizing = maximizing;
    },

    getUtility: function(){
      return this._utility;
    },

    setUtility: function(utility){
      this._utility = utility;
    },

    // available actions are free spots to play on this state 
    getAvailableActions: function(){
      return this._availableActions;
    },

    // a node is terminal when a player wins on its state
    isTerminal: function(){
      return this._terminal;
    },

    getParentNode: function(){
      return this._parentNode;
    },

    setParentNode: function(node){
      this._parentNode = node;
    },

    getChildrenNodes: function(){
      return this._childrenNodes;
    },

    addChildrenNode: function(node){
      this._childrenNodes.push(node);
    }
  };

  // initialize node properties
  (function init(){
    // player
    currentPlayer === 'X' ? node._player = 'O' : node._player = 'X';

    // state
    node._state = currentState;
    if(action !== null){
      node._state[action] = node._player;
    }

    // available actions
    for(var i = 0; i < node._state.length; i++){
      if(node._state[i] === "")
        node._availableActions.push(i);
    }

    // terminal
    if(playerWins(node._state, node._player)){
      if(node.isMaximizing()){
        node.setUtility(10);
      } else {
        node.setUtility(-10);
      }
      node._terminal = true;
    } else{
      node._terminal = false;
    }
  })();
  
  return node;
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
