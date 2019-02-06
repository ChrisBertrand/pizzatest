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

console.log(rows);
console.log(cols);
console.log(minIngredients);
console.log(maxCells);

const slices = [];
let cellHistory = [];

class Point{
  constructor(x, y) {
    this.x = x; this.y = y;
  }
}

class slice{
  constuctor() {
    this.r1; this.c1; this.r2; this.c2;
  }
}

// Initialise 2D array
const pizza = new Array(cols);
for (var x = 0; x < cols; x++) {
    pizza[x] = new Array(rows);
}

// Populate array with our pizza data
for (var y = 0; y < rows; y++) {
    for (var x = 0; x < cols; x++) {
        pizza[x][y] = dataByLine[y + 1].charAt(x);
    }
}

console.log(pizza);

let outSlices = findSliceVertical();

createOutput(outSlices);

//findSliceHorizontal();

function createOutput(slices) {
  console.log(slices);
  var wstream = fs.createWriteStream('small.output');
  wstream.write(slices.length + '\n');
  slices.forEach(s => wstream.write(`${s.r1} ${s.c1} ${s.r2} ${s.c2} \n`));
  wstream.end();
}

function findSliceHorizontal() {
  let numMushrooms = 0;
  let numTomatoes = 0;

  let s = new slice();

  for (var row = 0; row < rows ; row++) {
    for (var col = 0; col < cols; col++) {

      let ingred = pizza[col][row];

      if (ingred == 'M' || ingred == 'T') {
        pizza[col][row] = slices.length > 0 ? slices.length : ingred;
        console.log(row, col, ingred);
        s.r1 = row; s.c1 = col;
      }

      if (ingred == 'M') {
        numMushrooms++;
      } else if (ingred == 'T') {
        numTomatoes++;
      }

      if (numMushrooms >= minIngredients && numTomatoes >= minIngredients) {
        // We have a slice
        console.log('slice?', row, col);
        s.r2 = row;
        s.c2 = col;
      //  console.log(s);

        if (isSquare(s)) {
          console.log('square');
          if (numMushrooms + numTomatoes <= maxCells) {
            slices.push(s);
            console.log(s);
          }
        }
        // console.log(pizza);
        console.log(col + ', ' + row + ', ' + numMushrooms + ', ' + numTomatoes)
      }
    }
  }
}

function findSliceVertical() {

  let numMushrooms = 0;
  let numTomatoes = 0;
  var startedSlice = false;
  let s = new slice();

  for (var col = 0; col < cols; col++) {
    for (var row = 0; row < rows; row++) {
     
      let ingred = pizza[col][row];

      if (ingred == 'M' || ingred == 'T') {
        cellHistory.push({ x: col, y: row });

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
          //console.log('SQUARE', cellHistory.length, maxCells);
          if (cellHistory.length <= maxCells) {
            slices.push(s);
            
            //console.log('slice pushed', s);
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
  var maxX = 0
  var maxY = 0
  
  ch.forEach(pc => {
    //console.log('pc', pc);
    if (pc.x > maxX) { maxX = pc.x; }
    if (pc.y > maxY) { maxY = pc.y; }
  });

  var lastCell = ch[ch.length - 1];

  if (lastCell.x === maxX && lastCell.y === maxY)
  {
    console.log('true');
    return true;
  }
  console.log('false');
  return false;  
}

function fillPizza(ch, i) {
  console.log('i', i);
  ch.forEach(pc => {
    pizza[pc.x][pc.y] = i;
  });
  console.log(pizza);
}