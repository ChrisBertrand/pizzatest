const fs = require("fs");
const inputFile = "./input/a_example.in";

// Read data from file
var data = fs.readFileSync(inputFile, "utf-8");
var dataByLine = data.split("\n");

// Establish parameters
var firstRow = dataByLine[0].split(" ");
const rows = Number(firstRow[0]);
const cols = Number(firstRow[1]);
const minIngredients = Number(firstRow[2]);
const maxCells = Number(firstRow[3]);

//console.log(rows);
// console.log(cols);
// console.log(minIngredients);
// console.log(maxCells);

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
    }
}

let outSlices = findSliceVertical();
//createOutput(outSlices);

function createOutput(slices) {
  console.log(slices);
  var wstream = fs.createWriteStream('small.output');
  wstream.write(slices.length + '\n');
  slices.forEach(s => wstream.write(`${s.r1} ${s.c1} ${s.r2} ${s.c2} \n`));
  wstream.end();
}

function findSliceVertical() {

  let numMushrooms = 0;
  let numTomatoes = 0;
  var startedSlice = false;
  let s = new slice();

  for (var col = 0; col < cols; col++) {
    for (var row = 0; row < rows; row++) {

      let ingred = pizza[row][col];

      if (ingred == 'M' || ingred == 'T') {
        cellHistory.push({ x: row, y: col });

        if (startedSlice === false) {
          s = new slice();
          s.r1 = row; s.c1 = col;
          startedSlice = true;
        }
      }

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
          if (cellHistory.length <= maxCells) {
            slices.push(s);
            fillPizza(cellHistory, slices.length);
            startedSlice = false;
            cellHistory = [];
            numMushrooms = 0; numTomatoes = 0;
          }
        }
      }
    }
  }
  return slices;
}

function isSquare(ch) {
  var cells = ch;
  var lastCell = cells.pop();
  var maxX = 0, maxY = 0, minX = lastCell.x, minY = lastCell.y;
  var r = 0,c = 0;

  ch.forEach(pc => {
    if (pc.x < minX) { minX = pc.x; }
    if (pc.y < minY) { minY = pc.y; }
    if (pc.x > maxX) { maxX = pc.x; }
    if (pc.y > maxY) { maxY = pc.y; }
  });

  //console.log('rc',r,c);
  //console.log('aaa', minX, maxX, minY, maxY);
  
  if (lastCell.x === maxX && lastCell.y === maxY)
  {
    console.log('true');
    return true;
  }
  return false;
}

function fillPizza(ch, i) {
  console.log('i', i);
  ch.forEach(pc => {
    pizza[pc.x][pc.y] = i;
  });
  printPizza();
}

function printPizza(){
  console.log(pizza);
}