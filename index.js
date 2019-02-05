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

findSlice();

function findSlice() {

  let numMushrooms = 0;
  let numTomatoes = 0;

  for (var y = 0; y < rows; y++) {
    for (var x = 0; x < cols; x++) {

      let ingred = pizza[x][y];

      if (ingred == 'M') {
        numMushrooms++;
      } else if (ingred == 'T') {
        numTomatoes++;
      }

      if (numMushrooms >= minIngredients && numTomatoes >= minIngredients) {
        // We have a slice
        if (x < cols - 1) {
          // Slice is not a rectangle
          continue;
        }
        console.log(x + ', ' + y + ', ' + numMushrooms + ', ' + numTomatoes)
      }

      if (numMushrooms + numTomatoes > maxCells) {
        // panic
      }

    }
  }
}