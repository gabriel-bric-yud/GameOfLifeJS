const startBtn = document.querySelector("#startBtn");
const resetBtn = document.querySelector("#resetBtn");
let startBool = false;

const game = document.querySelector("#game");
let cellDimension = 40
let gridDimension = 600 / cellDimension;
//let boardSizeData = game.getBoundingClientRect();
//let gridDimension = boardSizeData.height / 40;

let gameTick;
let birthList = [];
let deathList = [];


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function createCell(col, row) {
  let cell = document.createElement("div")
  cell.classList.add("cell");
  cell.dataset.alive = "f";
  cell.dataset.row = row;
  cell.dataset.col = col;
  cell.id = col + "/" + row;
  cell.style.height = gridDimension + "px";
  cell.style.width = gridDimension + "px";
  cell.addEventListener("click", (e) => {
    //e.target.animate({ backgroundColor: ["black", "green", "black"]},1000);
    if (!startBool) {
      e.target.dataset.alive == "f"  ? e.target.style.backgroundColor = "green" : e.target.style.backgroundColor = "transparent";
      e.target.dataset.alive == "f" ? e.target.dataset.alive = "t" : e.target.dataset.alive = "f"; 
    }

  })
  return cell;
}

function createRow(rowNum) {
  for (let colNum = 1; colNum <= cellDimension; colNum++) {
    let cell = createCell(colNum, rowNum);
    game.appendChild(cell);
  }
}

function createGrid(numCells) {
  for (let i = 1; i <= cellDimension; i++) {
    createRow(i)
  }
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function checkNeighbor(col, row, colDirection, rowDirection) {
  let neighborCell = document.getElementById(`${Number(col) + colDirection}/${Number(row) + rowDirection}`)
  if (neighborCell != null) {
    //neighborCell.classList.add("flash");
    //neighborCell.animate({ backgroundColor: ["black", "yellow", "black"]},2000);
    return neighborCell;
  }
  else {
    return null;
  }
}

function getAllNeighbors(cell) {
  let col = Number(cell.dataset.col);
  let row = Number(cell.dataset.row);
  let rightCell = checkNeighbor(col, row, 1, 0); //right
  let leftCell = checkNeighbor(col, row,  -1, -0); //left
  let bottomCell = checkNeighbor(col, row,  0, 1); //down
  let topCell = checkNeighbor(col, row, 0, -1); //up
  let diagonalRightTopCell = checkNeighbor(col, row,  1, -1); //right-up diagonal
  let diagonalRightBottomCell = checkNeighbor(col, row,  1, 1); //right-down diagonal
  let diagonalLeftTopCell = checkNeighbor(col, row,  -1, -1); //left-up diagonal
  let diagonalLeftBottomCell = checkNeighbor(col, row,  -1, 1); //left-down diagonal
  
  let neighborList = [rightCell, leftCell, bottomCell, topCell, diagonalRightTopCell, diagonalRightBottomCell, diagonalLeftTopCell, diagonalLeftBottomCell];
  return neighborList
  
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function cellGameLogic(cell) {
  let neighborList = getAllNeighbors(cell);
  let counter = 0;
  
  for (const neighbor of neighborList) {
    if (neighbor != null) {
      if (neighbor.dataset.alive == "t") {
        counter++;
      }
    }
  }
  
  switch(counter) {
    case 0:
    case 1:
      //Any live cell with fewer than two live neighbours dies, as if by underpopulation.
      if (cell.dataset.alive == "t") {
        deathList.push(cell)
      }
      break; 
    case 3:
      //Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
      if (cell.dataset.alive == "f") {
        birthList.push(cell)
      }
      break;
    case 4:
    case 5:
    case 6:
    case 7:
    case 8:
      //Any live cell with more than three live neighbours dies, as if by overpopulation.
      if (cell.dataset.alive == "t") {
        deathList.push(cell)
      }
      break;
  }
  
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function clearAllCells() {
  document.querySelectorAll(".cell").forEach((elem) => {
    elem.dataset.alive = "f"
    elem.style.backgroundColor = "transparent"
    elem.style.borderColor = "white"
    /** 
    elem.animate({ backgroundColor: ["transparent"]},{
      duration: 10,
      iterations: 1,
      fill: "forwards"
    });
    */
    //elem.style.animation = ""
  })
}


function clearLists() {
  birthList = [];
  deathList = [];
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function checkAllCells() {
  document.querySelectorAll(".cell").forEach((elem) => {
    cellGameLogic(elem)
  })
}

function updateCells() {
  birthList.forEach((elem) => {
    elem.dataset.alive = "t";
    elem.style.backgroundColor = "green"
    /** 
    elem.animate({ backgroundColor: ["olive","yellow","green"]},{
      duration: 400,
      iterations: 1,
      fill: "forwards"
    });
    */
  })
  deathList.forEach((elem) => {
    elem.dataset.alive = "f";
    elem.style.backgroundColor = "transparent"
    /** 
    elem.animate({ backgroundColor: ["red", "black", "transparent"]},{
      duration: 400,
      iterations: 1,
      fill: "forwards"
    });
    */
  })
}


function gameOfLife() {
  clearLists()
  gameTick = setInterval((e) => {
    clearLists()
    checkAllCells()
    updateCells()
  }, 100)
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

createGrid(cellDimension)

startBtn.addEventListener("click", (e) => {
  if (!startBool) {
    document.querySelectorAll(".cell").forEach((elem) => {
    elem.style.borderColor = "transparent"
  })
    gameOfLife()
    startBool = true;
  }
})
                          
resetBtn.addEventListener("click", (e) => {
  if (gameTick != null) {
    clearInterval(gameTick);
    gameTick = null;
  }
  
  startBool = false;
  clearLists();
  clearAllCells();

})                 
    




//H---I-<>