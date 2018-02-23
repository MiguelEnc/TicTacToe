var 
  // player's selected symbol
  humanPlayer = '',

  // computer symbol
  computer = '',

  // reference to who's playing at the moment
  playerOnTurn = '',

  // game tree root node
  rootNode,

  // state of the game board
  mainBoard = [],

  // array of winning combinations based on a matrix
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



/**
 * initializes the game tree
 * sets cells state and listener
 */
function initializeBoard(){
  // mainBoard = Array.from(Array(9).keys());
  // mainBoard.fill("");
  mainBoard = ["X","O","O",
                "","X","",
               "X","","O"];
  rootNode = nodeFactory('O', mainBoard, null);
  generateTree(rootNode);
  calculateNodesUtility(rootNode);

  var cells = document.querySelectorAll('.cell'),
      cellsLength = cells.length,
      i = 0;
  for(i; i < cellsLength; i++){
    cells[i].innerText = '';
    cells[i].addEventListener('click', playerClick);
  }
}



/**
 * Callback for each cell on board
 * @param {Object} cell clicked cell
 */
function playerClick(cell){
  playOnCell(cell.target.id, playerOnTurn);
}



/**
 * Renders the move made
 * @param {Number} cellId id of clicked cell
 * @param {String} player who played
 */
function playOnCell(cellId, player) {
  
  // When the position hasn't been played
  if(mainBoard[cellId] !== humanPlayer & 
     mainBoard[cellId] !== computer){
    
    mainBoard[cellId] = player;
    document.getElementById(cellId).innerText = player;

    changeTurn();
  }  
}



/**
 * Generates a tree of possible plays of both players starting from given node
 * @param {Object} rootNode
 */
function generateTree(rootNode){

  // available actions are this node's free spots to play
  rootNode.getAvailableActions().map(action => {

    // create a node representing each possible move on the board
    let childNode = nodeFactory(rootNode.getPlayer(), rootNode.getBoard(), action);
    childNode.setParentNode(rootNode);
    rootNode.addChildNode(childNode);

    if(rootNode.isMaximizing()){
      childNode.setMaximizing(false);
    } else {
      childNode.setMaximizing(true);
    }

    if(!boardFull(childNode.getBoard()) && !childNode.isTerminal()) {
      generateTree(childNode);
    }
  });
}



/**
 * Traverses the tree using DFS and calculates the utility
 * of the parent nodes based on its children node's utility
 * @param {Object} rootNode 
 */
function calculateNodesUtility(rootNode){

  if(rootNode.getChildNodes().length > 0){

    rootNode.getChildNodes().map(childNode => {

      calculateNodesUtility(childNode);

    });

  }

  if(rootNode.getParentNode() != null){
    let rootParent = rootNode.getParentNode();
    if(rootParent.isMaximizing()){

      if(rootNode.getUtility() > rootParent.getUtility())
        rootParent.setUtility(rootNode.getUtility());

    } else {

      if(rootNode.getUtility() < rootParent.getUtility())
        rootParent.setUtility(rootNode.getUtility());

    }
  }
  
}



/**
 * Factory of nodes that represents each board of the game tree
 * @param {String} lastPlayer the last player who made a move
 * @param {Array}  lastBoard  the board of invoking node
 * @param {Number} action     place where the created node will play
 */
function nodeFactory(lastPlayer, lastBoard, action) {

  var 
    // this node player
    _player = '',

    // game board
    _board = [],

    // places where childrens of this node will be able to play
    _availableActions = [],

    // references needed to traverse the tree
    _parentNode = null,
    _childNodes = [],

    // whether this node will try to get the maximum score possible
    _maximizing = true,

    // this node's move value
    _utility = 0,

    // whether a player wins on this node's state
    _terminal = false,
    
    // the action this node took
    _action = action;
  

  _board = lastBoard.slice(0);
  if (action !== null) {
    lastPlayer === 'X' ? _player = 'O' : _player = 'X';
    _board[action] = _player;
  } else {
    _player = lastPlayer;
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

    getAction: function(){
      return _action;
    },

    getParentNode: function(){
      return _parentNode;
    },

    setParentNode: function(node){
      _parentNode = node;
    },

    getChildNodes: function(){
      return _childNodes;
    },

    addChildNode: function(node){
      _childNodes.push(node);
    }
  };
  
  return node;
}



/**
 * Determines if a given player wins on the given board
 * @param {Array}  board  where to look for a winner
 * @param {String} player consulted player to win
 */
function playerWins(board, player) {
  let wins = false;
  winPositions.map(winCombo => {
    if(board[winCombo[0]] === board[winCombo[1]] &&
       board[winCombo[0]] === board[winCombo[2]]){
      wins = true;
    }
  });
  return wins;
}



/**
 * Determines if board is full or have blank spaces
 * @param {Array} board the board to examine
 */
function boardFull(board){
  return board.includes("") ? false : true;
}



/**
 * Changes the PlayerOnTurn reference and renders the turn on board
 */
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



document.getElementById('playAgain').onclick = function(){
  initializeBoard();
}



// Player X selection on modal event
document.getElementById('player-x').onclick = function(){
  document.getElementById('player1-label').innerText = 'Computer';
  document.getElementById('player2-label').innerText = 'Player';
  document.getElementById('player1-symbol').classList.add('currentTurn');
  document.getElementById('player2-symbol').classList.add('currentTurn');
  humanPlayer = 'X';
  computer = 'O';
  playerOnTurn = humanPlayer;
};



// Player O selection on modal event
document.getElementById('player-o').onclick = function(){
  document.getElementById('player1-label').innerText = 'Player';
  document.getElementById('player2-label').innerText = 'Computer';
  document.getElementById('player1-symbol').classList.add('currentTurn');
  document.getElementById('player2-symbol').classList.add('currentTurn');
  humanPlayer = 'O';
  computer = 'X';
  playerOnTurn = humanPlayer;
};
