const fs = require("fs");
const inputFile = "./input/a_example.in";
const inputSmall = "./input/b_small.in";
const inputMed = "./input/c_medium.in";
const inputBig = "./input/d_big.in";

// Read data from file
var data = fs.readFileSync(inputSmall, "utf-8");

var dataByLine = data.split("\n");

// Establish parameters
var firstRow = dataByLine[0].split(" ");
const rows = Number(firstRow[0]);
const cols = Number(firstRow[1]);
const minIngredients = Number(firstRow[2]);
const maxCells = Number(firstRow[3]);
let score = 0
let total = 0;
let sliceNum = 0;

console.log('min', minIngredients);
console.log('mc', maxCells);

const slices = [];
let cellHistory = [];

class slice{
  constuctor() {
    this.r1; this.c1; this.r2; this.c2;
  }
}

// Initialise 2D array
const pizza = new Array(rows);

for (var x = 0; x < rows; x++) {
    pizza[x] = new Array(cols);
}

// Populate array with our pizza data
for (var x = 0; x < rows; x++) {
    for (var y = 0; y < cols; y++) {
        pizza[x][y] = dataByLine[x + 1].charAt(y);
        total++;
    }
}

let outSlices = [];

outSlices = findSliceVertical();
//outSlices = findSliceHorizontal();

console.log('score: 1 ', score);

//outSlices = findSliceHorizontal();
createOutput(outSlices);
console.log('final score:', score , 'out of :', total, 'pc: ', score/total);
printPizza();

function createOutput(slices) {
  //console.log(slices);
  var wstream = fs.createWriteStream('sml.output');
  wstream.write(slices.length + '\n');
  slices.forEach(s => wstream.write(`${s.r1} ${s.c1} ${s.r2} ${s.c2} \n`));
  wstream.end();
}

function findSliceVertical() {
  let numMushrooms = 0;
  let numTomatoes = 0;
  var startedSlice = false;
  let s = new slice();
  var validCellHistory =[];

  for (var col = 0; col < cols; col++) {
    for (var row = 0; row < rows; row++) {

      let ingred = pizza[row][col];

      if (ingred == 'M' || ingred == 'T') {
        if (cellHistory == undefined){cellHistory = [];}
        cellHistory.push({ x: row, y: col });

        if (startedSlice === false) {
          s = new slice();
          s.r1 = row; s.c1 = col;
          startedSlice = true;
        }
      }else{break;}

      if (ingred == 'M') {
        numMushrooms++;
      } else if (ingred == 'T') {
        numTomatoes++;
      }

      if (numMushrooms >= minIngredients && numTomatoes >= minIngredients) {
        // We potentially have a slice
        s.r2 = row;
        s.c2 = col;
        
        if (isSquare(cellHistory)) {
          if (cellHistory.length < maxCells){
            validCellHistory = cellHistory;
            console.log('1', cellHistory);
            continue;
          } 
          ({ startedSlice, numMushrooms, numTomatoes, cellHistory, sliceNum } = addSlice(s, cellHistory, startedSlice, numMushrooms, numTomatoes, sliceNum));
        }
        else if(validCellHistory != null && isSquare(validCellHistory)) {
          ({ startedSlice, numMushrooms, numTomatoes, validCellHistory, sliceNum } = addSlice(s, validCellHistory, startedSlice, numMushrooms, numTomatoes, sliceNum));
          if (validCellHistory == null) {cellHistory = []}
        }
        }
      }
    }
  return slices;
}

function findSliceHorizontal() {

  let numMushrooms = 0;
  let numTomatoes = 0;
  var startedSlice = false;
  let s = new slice();

  for (var row = 0; row < rows; row++) {
    for (var col = 0; col < cols; col++) {

      let ingred = pizza[row][col];

      if (ingred == 'M' || ingred == 'T') {
        if (cellHistory == undefined){cellHistory = [];}
        cellHistory.push({ x: row, y: col });

        if (startedSlice === false) {
          s = new slice();
          s.r1 = row; s.c1 = col;
          startedSlice = true;
        }
      } else{break;}

      if (ingred == 'M') {
        numMushrooms++;
      } else if (ingred == 'T') {
        numTomatoes++;
      }

      if (numMushrooms >= minIngredients && numTomatoes >= minIngredients) {
        // We potentially have a slice
        s.r2 = row;
        s.c2 = col;
        var validCellHistory = [];

        if (isSquare(cellHistory)) {
          if (cellHistory.length < maxCells){
            validCellHistory = cellHistory;
            continue;
          }
          console.log('ORIG PATH');
          ({ startedSlice, numMushrooms, numTomatoes, cellHistory, sliceNum } = addSlice(s, cellHistory, startedSlice, numMushrooms, numTomatoes));
        }
        else if(validCellHistory != null && cellHistory != undefined){
          console.log('OTHER PATH');
          ({ startedSlice, numMushrooms, numTomatoes, cellHistory, sliceNum } = addSlice(s, validCellHistory, startedSlice, numMushrooms, numTomatoes));
        }
      }
    }
  }
  cellHistory = [];
  return slices;
}

function addSlice(s, ch, startedSlice, numMushrooms, numTomatoes, sliceNum) {
  if (ch.length <= maxCells) {

    stillValid = fillPizza(ch, sliceNum);
    
    if (stillValid){
      slices.push(s);
      console.log(s);
      startedSlice = false;
      ch = [];
      numMushrooms = 0;
      numTomatoes = 0;
      printPizza();
      sliceNum++
    } else {
      startedSlice = false;
      ch = [];
      numMushrooms = 0;
      numTomatoes = 0;
      console.log('elseish', ch.length, maxCells);
    }
  }
  else{ console.log('else', ch.length, maxCells)}
  return { startedSlice, numMushrooms, numTomatoes, ch, sliceNum };
}

function isSquare(ch) {
  var minRow = Math.min(...ch.map(a => a.x));
  var maxRow = Math.max(...ch.map(a => a.x));
  var minCol = Math.min(...ch.map(a => a.y));
  var maxCol = Math.max(...ch.map(a => a.y));

  //console.log(`Vals: minx:${minRow}, maxx:${maxRow}, minC:${minCol}, maxC:${maxCol}`);
  var rs =  (maxRow - minRow) +1;
  var cs = (maxCol - minCol) +1;
  var cells = ch.length;

  //console.log(`THIS CHECK -> rows: ${rs} cols:${cs} cells:${cells}`);

  if (rs == 1 || cs == 1) {
    return true;
  }

  if (cells == (rs * cs)) {
    return true;
  }
  return false;
}

function fillPizza(ch, sliceNum) {
  let valid = undefined;
  
  console.log('Cut: ', sliceNum , ch);
  
  ch.forEach(pc => {
    if (pizza[pc.x][pc.y] == 'T' || pizza[pc.x][pc.y] == 'M') {
      pizza[pc.x][pc.y] = sliceNum;
      score++;
      valid = true;
    }
    else {valid = false; console.log('false piece: ', pizza[pc.x][pc.y] , sliceNum);}
  });
  return valid;
}

function printPizza() {
  pizza.forEach(p => console.log(p));
}