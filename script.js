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
      },
      complete: function() {
        initializeGameTree();
      }
    }
  );
  $('#playerSelectionModal').modal('open');
  initializeBoard();
});



/**
 * Initializes the board
 * Sets cells state and listener
 */
function initializeBoard(){
  mainBoard = ["","","",
               "","","",
               "","",""];

  var cells = document.querySelectorAll('.cell'),
      cellsLength = cells.length,
      i = 0;
  for(i; i < cellsLength; i++){
    cells[i].innerText = '';
    cells[i].addEventListener('click', playerClick);
  }
}



/**
 * Initializes the game tree using 
 * the clean board as starting point
 */
function initializeGameTree(){
  rootNode = nodeFactory(computer, mainBoard, null);
  generateTree(rootNode);
  calculateNodesUtility(rootNode);
  renderPostLoading();
}
  


/**
 * Callback for each cell on board
 * @param {Object} cell clicked cell
 */
function playerClick(cell){
  // human player move
  playOnCell(cell.target.id, humanPlayer);
  
  // computer move
  var bestMoveForComputer = getBestMove(mainBoard);
  setTimeout(function () {
    playOnCell(bestMoveForComputer, computer);
  }, 1000);
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
 * Generates a tree of all possible plays of both players starting from given node
 * The whole tree generation process lasts aproximatelly 2 seconds
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
 * Returns the best move to make from the given board
 * @param {Array} currentBoard 
 */
function getBestMove(currentBoard) {
  var move = 0, 
      newRoot = null;


  // Find currentBoard on the game tree
  newRoot = rootNode.getChildNodes().find(child => {
    return child.getBoard().equals(currentBoard);
  });

  
  // Filter wich nodes have same or different utility
  // from currentBoard (wich now is newRoot)
  var childsOfSameUtility = [],
      childsOfDiffUtility = [];
  newRoot.getChildNodes().map(child => {
    if(newRoot.getUtility() == child.getUtility())
      childsOfSameUtility.push(child);
    else
      childsOfDiffUtility.push(child);
  });


  var sameLength = childsOfSameUtility.length,
      diffLength = childsOfDiffUtility.length;

  // When children have same utility as father, select one 
  // randomly and update rootNode to this child, since future
  // moves will happend from this position.
  if(sameLength > 1){

    var rand = Math.floor(Math.random() * sameLength);
    rootNode = childsOfSameUtility[rand];
    move = rootNode.getAction();

  } else if(sameLength == 1) {
    rootNode = childsOfSameUtility[0];
    move = rootNode.getAction();

  } else if(diffLength > 1){

    var rand = Math.floor(Math.random() * diffLength);
    rootNode = childsOfDiffUtility[rand];
    move = rootNode.getAction();

  } else {
    rootNode = childsOfDiffUtility[0];
    move = rootNode.getAction();
  }

  return move;
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
      if (playerWins(this.getBoard(), this.getPlayer())){
        if(this.isMaximizing()){
          this.setUtility(-1);
        } else {
          this.setUtility(1);
        }
      }
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
       board[winCombo[0]] === board[winCombo[2]] &&
       board[winCombo[0]] === player){
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
 * Determines arrays equality by comparing their values
 * @param {Array} array 
 */
Array.prototype.equals = function (array) {
  var i = 0,
      len = this.length;

  for (i = 0; i < len; i++) {
      
    if (this[i] != array[i]) {
      return false;
    }
  }
  return true;
}



var player1Symbol = document.getElementById('player1-symbol'),
    player1Label  = document.getElementById('player1-label'),
    player2Symbol = document.getElementById('player2-symbol')
    player2Label  = document.getElementById('player2-label');

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
    player1Symbol.classList.remove('currentTurn');
    player1Label.classList.remove('currentTurn');
    player2Symbol.classList.add('currentTurn');
    player2Label.classList.add('currentTurn');
  } else {
    player2Symbol.classList.remove('currentTurn');
    player2Label.classList.remove('currentTurn');
    player1Symbol.classList.add('currentTurn');
    player1Label.classList.add('currentTurn');
  }
}



/** 
 * Renders the styles of players
 * Used for better apreciation of the Loading process
*/
function renderPostLoading(){
  switch(humanPlayer) {
    case 'X':
      player1Label.innerText = 'Computer';
      player2Label.innerText = 'Player';
      player2Label.classList.add('currentTurn');
      player2Symbol.classList.add('currentTurn');
    break;

    case 'O':
      player1Label.innerText = 'Player';
      player2Label.innerText = 'Computer';
      player1Label.classList.add('currentTurn');
      player1Symbol.classList.add('currentTurn');
    break;
  }
  showElement("loading", false);
}



/**
 * Changes the display property of the given id
 * @param {Number} id 
 * @param {Boolean} value 
 */
function showElement(id, value) {
  document.getElementById(id).style.display = value ? 'block' : 'none';
}



document.getElementById('playAgain').onclick = function(){
  initializeBoard();
}



/**
 * Player X selection on modal event
 */
document.getElementById('player-x').onclick = function(){
  showElement("loading", true);
  humanPlayer = 'X';
  computer = 'O';
  playerOnTurn = humanPlayer;
}



/**
 * Player O selection on modal event
 */
document.getElementById('player-o').onclick = function(){
  showElement("loading", true);
  humanPlayer = 'O';
  computer = 'X';
  playerOnTurn = humanPlayer;
}
