// Code below gets players' names for the purpose of the game of Connect Four.
// Blue is player 1, red is player 2 (but they can be named whatever the
// user inputs).
var p1 = prompt("Enter player one's name. You are Blue.");
var p2 = prompt("Enter player two's name. You are Red.");

var gameOver = false;
var gray = 'rgb(128, 128, 128)';
var turn = false; // bool, false = 1/blue, true = 2/red
var width = 7; // width aka number of columns (num cols)
var height = 6;
var cells = $('td');
console.log(cells);
var testCell = cells[13];
console.log(testCell);
var table = []; // master data array
for(var k = 0; k < width; k++){
  table.push([]);
}
//cols: [7 cols][6 rows]
console.log(table);
var j = -1;
for(var i = 0; i < cells.length; i++){
  k = i%width;
  if(k == 0){
    j++;
  }
  console.log("j: " + j);
  table[k][j] = cells[i];
}
console.log(table);
// We now have the td table, by [col][row], stored in a two-dimensional array named table.

// Check if indexing of table works:
//console.log(table[0]);
//console.log(table[0][0]);
//console.log(table[6][5]);

// Now we want a function that, when a particular td cell (A) is given,
// the lowest cell (B) in the selected cell's (A's) column with no chip is returned.
// We wrote a function for this purpose originally, but it turned out jenky.
// We'll use it as a starting point, however, and build upon it.
function findLowestEmptyCellInCol(iCol, iRow){
  console.log("Executing findLowestEmptyCellInCol()");
  console.log(iCol);
  var found = false;
  var lowestRow = 5; //row goes from 0 (top) to 5 (bottom)
  var k = 5; // index of while loop below
  while(!found && k >= 0){
    console.log(table);
    console.log(iCol);
    console.log(k);
    var checkCell = $(table[iCol][k]);
    console.log("checkCell: ");
    console.log(checkCell);
    var color = checkCell.css("background-color");
    console.log(color);
    if (color === gray){    // this was the best way to check if the cell is empty
                            // that I could think of
                            // obviously it would be better to have a dedicated
                            // property for whether a chip is in the cell or not
                            // i.e. a css/html class or id.
                            // this also doesn't allow for certain color
                            // changes/combinations in customized CSS appearance
                            // of the game board
      found = true;
      lowestRow = k;
      break; // exit the while loop
    }
    k--;
  }
  if(k < 0){
    console.log("k < 0 in findLowestEmptyCellInCol");
    return -1;  //this happens when the column is full
                  // make sure to enable handling of this scenario
                  // in outer code that calls this function.
                  // we only expect k to be as low as -1 but use a <
                  // to be safe
  }
  var lowestCell = table[iCol][lowestRow];
  console.log("lowestCell: ");
  console.log(lowestCell);
  return lowestCell;
}

// Test findLowestEmptyCellInCol!
/*
findLowestEmptyCellInCol(0,0);
findLowestEmptyCellInCol(3,3);
findLowestEmptyCellInCol(6,5);
*/ // The above calls work perfectly. Let's continue...
//findLowestEmptyCellInCol(7,0);
//findLowestEmptyCellInCol(0,7);
//findLowestEmptyCellInCol(100,100);
// These should all return the bottommost row in each respective column.
// However, I realize the funciton does not handle out-of-bounds (OOB)
// on input. These cases have been commented out.

// Checking code up to this point in browser...

// It works. Had to debug a little.
// Lesson: Remember to use $(data[x-index][y-index]), not data[x-index][y-index
// when calling .css() or whatever, .attr(), etc., for a reason I don't
// entirely understand yet. Will think on it. Perhaps get help from a mentor.

// Continuing on.

// Now we want to enable clicks. I.e., either create a function or write
// straight up code that enables an on-click listener for each td cell,
// where the listener then calls findLowestEmptyCellInCol.
// Then, we will use findLowestEmptyCellInCol as an input to another
// function that plops the chip into the correct column. Or rather, places.

$("td").each(function(){
  //console.log(this);
  console.log(this);
  $(this).on("click", function(){
    dropChip($(this));
  });
});

function dropChip(cell){
  console.log("Executing dropChip() (the 2nd version)");
  console.log(cell);
  // Technique below by https://stackoverflow.com/users/690854/thecodeparadox
  var cellCol = $(cell).parent().children().index($(cell));
  var cellRow = $(cell).parent().parent().children().index($(cell).parent());
  // Source: https://stackoverflow.com/questions/10434711/how-to-iterate-through-a-table-rows-and-get-the-cell-values-using-jquery
  console.log(cellCol);
  console.log(cellRow);
  var intoCell = findLowestEmptyCellInCol(cellCol, cellRow);
  console.log("Cell to put chip into: ");
  console.log(intoCell);
  if(intoCell < 0){ // if the col is full, just return nothing
    return;
  }else{
    var color = getColorFromTurn(turn);
    $(intoCell).css("background-color", color);
    checkWinAtAll(intoCell);
    if(!gameOver){
      nextTurn(window.turn);
    }
  }
}

// Now we need a function that keeps track of turns, or a variable at least,
// and something, a function, that converts the turn into the color red
// or Blue.
function getColorFromTurn(turn){ //turn is bool, false = 1/blue, true = 2/red
  if(turn){
    return "red";
  }else{
    return "blue";
  }
}

function nextTurn(turn){
  window.turn = !this.turn;
  if(!turn){
    $("h3#playerTurn").text($("h3#playerTurn").text().replace("Blue","Red"));
  }else{
    $("h3#playerTurn").text($("h3#playerTurn").text().replace("Red","Blue"));
  }
}
// Correct in one go!

/* Now we want to display the correct player name in the h3#playerTurn
as the turns progress.
We will also need a condition-checker for the completion of the game.
*/
// Player turn indicator at h3#pllayerTurn updated above in nextTurn()
// Now for the win condition; this might require some logic, math, and/or recursion.

function neighbor(cell, iDir, jDir, playerColor){
  console.log("Check neighbor");
  console.log(cell);
  var cellCol = $(cell).parent().children().index($(cell));
  var cellRow = $(cell).parent().parent().children().index($(cell).parent());
  //console.log(cell);
  //console.log(cellCol);
  //console.log(cellRow);
  //console.log(cellCol+iDir);
  //console.log(cellCol+jDir);
  var checkX = cellCol+iDir;
  var checkY = cellRow+jDir;
  //console.log(checkX);
  //console.log(checkY);
  if(checkX < 0 || checkX >= width){
    console.log("boundary cond x");
    return false;
  }
  if(checkY < 0 || checkY >= height){
    console.log("boundary cond y");
    return false;
  }
  var neighbor = table[cellCol+iDir][cellRow+jDir];
  console.log(neighbor);
  var neighborColor = $(neighbor).css("background-color");
  console.log("neighborColor: " + neighborColor);
  if(neighborColor === "rgb(0, 0, 255)"){ neighborColor = "blue"; }
  if(neighborColor === "rgb(255, 0, 0)"){ neighborColor = "red"; }
  if(neighborColor === playerColor){
    console.log("Same color neighbor at [" + checkX + ", " + checkY + "]");
    return true;
  }else{
    return false;
  }
}

function checkWinInDirection(cell, iDir, jDir, l){
  console.log("checkWinInDirection");
  console.log("l: " + l);
  if(l == 0){
    console.log("l = 0");
    return true;
  }else{
    console.log("cell in checkWinInDirection: ");
    console.log(cell);
    var playerColor = getColorFromTurn(turn);
    var isThere = neighbor(cell, iDir, jDir, playerColor);
    console.log(isThere);
    if(isThere){
      var cellCol = $(cell).parent().children().index($(cell));
      var cellRow = $(cell).parent().parent().children().index($(cell).parent());
      console.log(cellCol);
      console.log(cellRow);
      var nextCell = table[cellCol + iDir][cellRow + jDir];
      console.log(nextCell);
      return checkWinInDirection(nextCell, iDir, jDir, l-1);
    }else{
      return false;
    }
  }
}

function checkWinAtAll(cell){
  var win = false;
  console.log("checkWinAtAll");
  console.log(cell);
  for(i=-1; i<=1; i++){
    for(j=-1; j<=1; j++){
      if(i == 0 && j == 0){
        continue;
      }else{
        console.log("i in checkWinAtAll: " + i);
        console.log("j in checkWinAtAll: " + j);
        win = checkWinInDirection(cell, i, j, 3);
        console.log("win: " + win);
        if(win){
          console.log("checkWinAtAll detected a win");
          endGame();
          break;
        }
      }
    }
  }
}

function endGame(){
  console.log("Game over!");
  var color = getColorFromTurn(turn);
  winString = "Game over! " + color.charAt(0).toUpperCase() + color.slice(1) + " is the winner! ";
  console.log(winString);
  $("h3#playerTurn").text(winString);
  $("td").each(function(){
    //console.log(this);
    $(this).off("click");
  });
  gameOver = true;
}
