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
  originalBoard = ["X","O","O","","X","X","X","","O"];
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

/**
 * Generates a tree of possible plays of both players starting from given node
 * @param parentNode root node
 */
function generateTree(parentNode){

  // available actions are free spots to play on this node
  parentNode.getAvailableActions().map(action => {

    let childrenNode = nodeFactory(parentNode.getPlayer(), parentNode.getBoard(), action);
    childrenNode.setParentNode(parentNode);
    parentNode.addChildrenNode(childrenNode);

    if(parentNode.isMaximizing()){
      childrenNode.setMaximizing(false);
    } else {
      childrenNode.setMaximizing(true);
    }

    if(!boardFull(childrenNode.getBoard()) || !childrenNode.isTerminal()) {
      generateTree(childrenNode);
    }
  });
}

/**
 * Tells if board is full or have blank spaces
 * @param board the board to examine
 */
function boardFull(board){
  return board.includes("") ? false : true;
}


/**
 * Factory of nodes that represents each board of the game tree
 * @param currentPlayer the last player who played
 * @param currentState  the state of invoking node
 * @param action        place where the created node will play
 */
function nodeFactory(currentPlayer, currentState, action) {

  var 
    // this node player
    _player = '',

    // game board
    _board = [],

    // places where childrens of this node will be able to play
    _availableActions = [],

    // references needed to traverse the tree
    _parentNode = null,
    _childrenNodes = [],

    // whether this node will try to get the maximum score possible
    _maximizing = true,

    // 
    _utility = 0,

    // whether a player wins on this node's state
    _terminal = false;
  

  _board = currentState.slice(0);
  if (action !== null) {
    currentPlayer === 'X' ? _player = 'O' : _player = 'X';
    _board[action] = _player;
  } else {
    _player = currentPlayer;
  }

  for (var i = 0; i < _board.length; i++) {
    if(_board[i] === "")
      _availableActions.push(i);
  }

  if (playerWins(_board, _player)){
    if(_maximizing){
      _utility = 10;
    } else {
      _utility = -10;
    }
    _terminal = true;
  } else{
    _terminal = false;
  }
  

  var node = {
    
    getPlayer: function() {      
      return _player;
    },

    getBoard: function(){
      return _board;
    },

    isMaximizing: function(){
      return _maximizing;
    },

    setMaximizing: function(maximizing){
      _maximizing = maximizing;
    },

    getUtility: function(){
      return _utility;
    },

    setUtility: function(utility){
      _utility = utility;
    },

    getAvailableActions: function(){
      return _availableActions;
    },

    isTerminal: function(){
      return _terminal;
    },

    getParentNode: function(){
      return _parentNode;
    },

    setParentNode: function(node){
      _parentNode = node;
    },

    getChildrenNodes: function(){
      return _childrenNodes;
    },

    addChildrenNode: function(node){
      _childrenNodes.push(node);
    }
  };
  
  return node;
}


/**
 * Determines if a given player wins on the given board
 * @param board  where to look for a winner
 * @param player consulted player to win
 */
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
